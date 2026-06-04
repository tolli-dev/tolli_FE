package expo.modules.cornerradius

import android.content.Context
import android.os.Build
import android.view.RoundedCorner
import android.view.WindowManager
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class CornerRadiusModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("CornerRadius")

    AsyncFunction("getCornerRadius") {
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) return@AsyncFunction 0.0

      val context = appContext.reactContext ?: return@AsyncFunction 0.0
      try {
        val windowManager =
          context.getSystemService(Context.WINDOW_SERVICE) as WindowManager
        val insets = windowManager.currentWindowMetrics.windowInsets
        val corner = insets.getRoundedCorner(RoundedCorner.POSITION_TOP_LEFT)
        (corner?.radius ?: 0).toDouble()
      } catch (e: Exception) {
        0.0
      }
    }
  }
}
