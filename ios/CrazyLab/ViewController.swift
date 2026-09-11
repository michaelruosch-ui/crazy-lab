import UIKit
import WebKit

final class ViewController: UIViewController, WKNavigationDelegate {
    private var webView: WKWebView!
    private var bridge: NativeBridge!

    override func loadView() {
        let configuration = WKWebViewConfiguration()
        configuration.websiteDataStore = .default()
        let controller = WKUserContentController()
        controller.addUserScript(WKUserScript(
            source: """
            window.addEventListener('error', function(event) {
              var details = event.error && (event.error.stack || event.error.message);
              var message = details || event.message || 'Unbekannter JavaScript-Fehler';
              document.body.innerText = 'Crazy Lab Startfehler: ' + message;
              window.webkit.messageHandlers.crazyLab.postMessage({
                id: 'web-error', type: 'web-error',
                payload: { message: message }
              });
            });
            window.addEventListener('unhandledrejection', function(event) {
              var details = event.reason && (event.reason.stack || event.reason.message);
              var message = details || String(event.reason || 'Unbehandelte Promise-Ablehnung');
              document.body.innerText = 'Crazy Lab Startfehler: ' + message;
              window.webkit.messageHandlers.crazyLab.postMessage({
                id: 'web-rejection', type: 'web-error',
                payload: { message: message }
              });
            });
            """,
            injectionTime: .atDocumentStart,
            forMainFrameOnly: true
        ))
        configuration.userContentController = controller

        webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = self
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        webView.backgroundColor = UIColor(red: 9 / 255, green: 24 / 255, blue: 32 / 255, alpha: 1)
        webView.isOpaque = false

        bridge = NativeBridge(webView: webView)
        controller.add(bridge, name: NativeBridge.handlerName)
        view = webView
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        guard
            let indexURL = Bundle.main.url(
                forResource: "index",
                withExtension: "html",
                subdirectory: "www"
            ),
            let webRoot = Bundle.main.resourceURL?.appendingPathComponent("www", isDirectory: true)
        else {
            showMissingBundleMessage()
            return
        }
        webView.loadFileURL(indexURL, allowingReadAccessTo: webRoot)
    }

    deinit {
        webView?.configuration.userContentController.removeScriptMessageHandler(
            forName: NativeBridge.handlerName
        )
    }

    func webView(
        _ webView: WKWebView,
        decidePolicyFor navigationAction: WKNavigationAction,
        decisionHandler: @escaping (WKNavigationActionPolicy) -> Void
    ) {
        guard let url = navigationAction.request.url else {
            decisionHandler(.cancel)
            return
        }
        if url.isFileURL || url.scheme == "about" {
            decisionHandler(.allow)
        } else {
            decisionHandler(.cancel)
        }
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        webView.evaluateJavaScript("document.getElementById('root')?.innerHTML.length || 0") { value, error in
            NSLog("Crazy Lab Web-Start: root=%@ error=%@", String(describing: value), String(describing: error))
        }
    }

    private func showMissingBundleMessage() {
        let label = UILabel()
        label.numberOfLines = 0
        label.textAlignment = .center
        label.textColor = .white
        label.text = "Crazy Lab konnte seine Labor-Inhalte nicht laden. Bitte die App neu installieren."
        label.frame = view.bounds.insetBy(dx: 28, dy: 28)
        view.addSubview(label)
    }
}
