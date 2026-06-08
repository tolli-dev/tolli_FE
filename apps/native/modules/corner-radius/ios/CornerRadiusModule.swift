import ExpoModulesCore
import UIKit

public class CornerRadiusModule: Module {
  public func definition() -> ModuleDefinition {
    Name("CornerRadius")

    AsyncFunction("getCornerRadius") { () -> Double in
      var radius: CGFloat = 0
      if let screen = UIApplication.shared.connectedScenes
        .compactMap({ $0 as? UIWindowScene })
        .first?.windows.first?.screen {
        radius = (screen.value(forKey: "_displayCornerRadius") as? CGFloat) ?? 0
      }
      return Double(radius)
    }
    .runOnQueue(.main)
  }
}
