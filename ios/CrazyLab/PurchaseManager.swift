import Foundation
import StoreKit

final class PurchaseManager: NSObject, SKProductsRequestDelegate, SKPaymentTransactionObserver {
    static let shared = PurchaseManager()
    static let productIdentifier = "ch.crazylab.fullversion"

    private let unlockKey = "crazy-lab-full-version-unlocked"
    private var product: SKProduct?
    private var productRequest: SKProductsRequest?
    private var productCallbacks: [() -> Void] = []
    private var purchaseCompletion: ((Result<[String: Any], Error>) -> Void)?
    private var restoreCompletion: ((Result<[String: Any], Error>) -> Void)?

    var isUnlocked: Bool { UserDefaults.standard.bool(forKey: unlockKey) }

    var statusDictionary: [String: Any] {
        [
            "unlocked": isUnlocked,
            "productAvailable": product != nil,
            "price": formattedPrice,
        ]
    }

    private var formattedPrice: String {
        guard let product = product else { return "CHF 1.00" }
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.locale = product.priceLocale
        return formatter.string(from: product.price) ?? "CHF 1.00"
    }

    func start() {
        SKPaymentQueue.default().add(self)
        loadProductIfNeeded()
    }

    func loadProductIfNeeded(completion: (() -> Void)? = nil) {
        if let completion = completion { productCallbacks.append(completion) }
        guard product == nil, productRequest == nil else {
            if product != nil { flushProductCallbacks() }
            return
        }
        let request = SKProductsRequest(productIdentifiers: [Self.productIdentifier])
        request.delegate = self
        productRequest = request
        request.start()
    }

    func purchase(completion: @escaping (Result<[String: Any], Error>) -> Void) {
        if isUnlocked {
            completion(.success(statusDictionary))
            return
        }
        guard SKPaymentQueue.canMakePayments() else {
            completion(.failure(PurchaseError.paymentsDisabled))
            return
        }
        loadProductIfNeeded { [weak self] in
            guard let self = self, let product = self.product else {
                completion(.failure(PurchaseError.productUnavailable))
                return
            }
            self.purchaseCompletion = completion
            SKPaymentQueue.default().add(SKPayment(product: product))
        }
    }

    func restore(completion: @escaping (Result<[String: Any], Error>) -> Void) {
        restoreCompletion = completion
        SKPaymentQueue.default().restoreCompletedTransactions()
    }

    func productsRequest(_ request: SKProductsRequest, didReceive response: SKProductsResponse) {
        product = response.products.first
        productRequest = nil
        flushProductCallbacks()
    }

    func request(_ request: SKRequest, didFailWithError error: Error) {
        productRequest = nil
        flushProductCallbacks()
    }

    func paymentQueue(_ queue: SKPaymentQueue, updatedTransactions transactions: [SKPaymentTransaction]) {
        for transaction in transactions {
            switch transaction.transactionState {
            case .purchased, .restored:
                unlock()
                queue.finishTransaction(transaction)
                purchaseCompletion?(.success(statusDictionary))
                purchaseCompletion = nil
            case .failed:
                queue.finishTransaction(transaction)
                let error = transaction.error ?? PurchaseError.purchaseFailed
                purchaseCompletion?(.failure(error))
                purchaseCompletion = nil
            case .purchasing, .deferred:
                break
            @unknown default:
                break
            }
        }
    }

    func paymentQueueRestoreCompletedTransactionsFinished(_ queue: SKPaymentQueue) {
        restoreCompletion?(.success(statusDictionary))
        restoreCompletion = nil
    }

    func paymentQueue(_ queue: SKPaymentQueue, restoreCompletedTransactionsFailedWithError error: Error) {
        restoreCompletion?(.failure(error))
        restoreCompletion = nil
    }

    private func unlock() {
        UserDefaults.standard.set(true, forKey: unlockKey)
    }

    private func flushProductCallbacks() {
        let callbacks = productCallbacks
        productCallbacks.removeAll()
        callbacks.forEach { $0() }
    }
}

private enum PurchaseError: LocalizedError {
    case paymentsDisabled
    case productUnavailable
    case purchaseFailed

    var errorDescription: String? {
        switch self {
        case .paymentsDisabled: return "Käufe sind auf diesem Gerät deaktiviert."
        case .productUnavailable: return "Die Vollversion ist im App Store gerade nicht verfügbar."
        case .purchaseFailed: return "Der Kauf wurde nicht abgeschlossen."
        }
    }
}
