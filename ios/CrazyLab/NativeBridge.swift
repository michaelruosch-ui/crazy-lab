import LocalAuthentication
import UIKit
import WebKit

final class NativeBridge: NSObject, WKScriptMessageHandler {
    static let handlerName = "crazyLab"
    private weak var webView: WKWebView?

    init(webView: WKWebView) {
        self.webView = webView
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard
            message.name == Self.handlerName,
            let request = message.body as? [String: Any],
            let id = request["id"] as? String,
            let type = request["type"] as? String
        else { return }

        switch type {
        case "parent-authorization":
            authorizeParent(id: id, payload: request["payload"] as? [String: Any])
        case "entitlement-status":
            PurchaseManager.shared.loadProductIfNeeded { [weak self] in
                self?.respond(id: id, value: PurchaseManager.shared.statusDictionary)
            }
        case "purchase-full-version":
            PurchaseManager.shared.purchase { [weak self] result in
                self?.respond(id: id, result: result)
            }
        case "restore-full-version":
            PurchaseManager.shared.restore { [weak self] result in
                self?.respond(id: id, result: result)
            }
        case "haptic":
            playHaptic(payload: request["payload"] as? [String: Any])
            respond(id: id, value: true)
        case "web-error":
            let text = (request["payload"] as? [String: Any])?["message"] as? String ?? "Unbekannt"
            NSLog("Crazy Lab JavaScript: %@", text)
        default:
            respond(id: id, error: "Unbekannte native Anfrage.")
        }
    }

    private func authorizeParent(id: String, payload: [String: Any]?) {
        let context = LAContext()
        context.localizedCancelTitle = "Abbrechen"
        var error: NSError?
        guard context.canEvaluatePolicy(.deviceOwnerAuthentication, error: &error) else {
            respond(id: id, error: "Auf diesem Gerät ist keine Geräteentsperrung eingerichtet.")
            return
        }
        let reason = payload?["reason"] as? String ?? "Eine erwachsene Person bestätigt diese Aktion."
        context.evaluatePolicy(.deviceOwnerAuthentication, localizedReason: reason) { [weak self] success, evaluationError in
            DispatchQueue.main.async {
                if let evaluationError = evaluationError as? LAError, evaluationError.code == .userCancel {
                    self?.respond(id: id, value: false)
                } else if success {
                    self?.respond(id: id, value: true)
                } else {
                    self?.respond(id: id, error: "Die Erwachsenenprüfung wurde nicht bestätigt.")
                }
            }
        }
    }

    private func playHaptic(payload: [String: Any]?) {
        let kind = payload?["kind"] as? String
        if kind == "success" {
            UINotificationFeedbackGenerator().notificationOccurred(.success)
        } else if kind == "warning" {
            UINotificationFeedbackGenerator().notificationOccurred(.warning)
        } else {
            UISelectionFeedbackGenerator().selectionChanged()
        }
    }

    private func respond(id: String, result: Result<[String: Any], Error>) {
        switch result {
        case .success(let value): respond(id: id, value: value)
        case .failure(let error): respond(id: id, error: error.localizedDescription)
        }
    }

    private func respond(id: String, value: Any? = nil, error: String? = nil) {
        var response: [String: Any] = ["id": id, "ok": error == nil]
        if let value = value { response["value"] = value }
        if let error = error { response["error"] = error }
        guard
            JSONSerialization.isValidJSONObject(response),
            let data = try? JSONSerialization.data(withJSONObject: response),
            let json = String(data: data, encoding: .utf8)
        else { return }
        DispatchQueue.main.async { [weak self] in
            self?.webView?.evaluateJavaScript("window.crazyLabNativeResponse(\(json));")
        }
    }
}
