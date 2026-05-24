import Foundation
import UIKit

@objc(CornerRadiusModule)
class CornerRadiusModule: NSObject {

  @objc
  func getCornerRadius(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      var radius: CGFloat = 0
      if let screen = UIApplication.shared.connectedScenes
        .compactMap({ $0 as? UIWindowScene })
        .first?.windows.first?.screen {
        radius = (screen.value(forKey: "_displayCornerRadius") as? CGFloat) ?? 0
      }
      resolve(radius)
    }
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
