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
      val activity = appContext.currentActivity ?: return@AsyncFunction 0.0
      val density = activity.resources.displayMetrics.density

      // API 31 미만: 화면 단변의 5% 휴리스틱
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) {
        val dm = activity.resources.displayMetrics
        val minDimPx = minOf(dm.widthPixels, dm.heightPixels)
        return@AsyncFunction (minDimPx * 0.05f / density).toDouble()
      }

      // 1순위: WindowMetrics 4방향 모두 시도 (API 31+)
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        try {
          val wm = activity.getSystemService(Context.WINDOW_SERVICE) as WindowManager
          val insets = wm.currentWindowMetrics.windowInsets
          val radiusPx = listOf(
            RoundedCorner.POSITION_TOP_LEFT,
            RoundedCorner.POSITION_TOP_RIGHT,
            RoundedCorner.POSITION_BOTTOM_LEFT,
            RoundedCorner.POSITION_BOTTOM_RIGHT,
          ).mapNotNull { pos ->
            insets.getRoundedCorner(pos)?.radius?.takeIf { it > 0 }
          }.maxOrNull()

          if (radiusPx != null && radiusPx > 0) {
            return@AsyncFunction (radiusPx / density).toDouble()
          }
        } catch (e: Exception) {
          android.util.Log.e("CornerRadius", "WindowMetrics exception: ${e.message}")
        }
      }

      // 2순위: 시스템 프로퍼티 (OEM 독립적)
      try {
        val clazz = Class.forName("android.os.SystemProperties")
        val get = clazz.getDeclaredMethod("get", String::class.java, String::class.java)
        val radiusPx = listOf(
          "ro.com.google.cornerradius",
          "ro.config.rounded_mask_size",
          "persist.sys.rounded.radius",
        ).mapNotNull { key ->
          (get.invoke(null, key, "0") as String).toIntOrNull()?.takeIf { it > 0 }
        }.firstOrNull()

        if (radiusPx != null && radiusPx > 0) {
          return@AsyncFunction (radiusPx / density).toDouble()
        }
      } catch (e: Exception) {
        android.util.Log.e("CornerRadius", "SystemProperties exception: ${e.message}")
      }

      0.0
    }
  }
}
