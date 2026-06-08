package expo.modules.cornerradius

import android.content.Context
import android.os.Build
import android.view.RoundedCorner
import android.view.WindowManager
import java.util.concurrent.CountDownLatch
import java.util.concurrent.atomic.AtomicInteger
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class CornerRadiusModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("CornerRadius")

    AsyncFunction("getCornerRadius") {
      val activity = appContext.currentActivity ?: return@AsyncFunction 0.0
      val density = activity.resources.displayMetrics.density

      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) {
        val dm = activity.resources.displayMetrics
        val minDimPx = minOf(dm.widthPixels, dm.heightPixels)
        return@AsyncFunction (minDimPx * 0.05f / density).toDouble()
      }

      // 1순위: decorView.rootWindowInsets — window에 실제 dispatch된 insets (TOP_LEFT 기준)
      val decorResult = AtomicInteger(0)
      val latch = CountDownLatch(1)
      activity.runOnUiThread {
        try {
          val insets = activity.window?.decorView?.rootWindowInsets
          val radius = insets?.getRoundedCorner(RoundedCorner.POSITION_TOP_LEFT)?.radius ?: 0
          decorResult.set(radius)
        } catch (e: Exception) {
          android.util.Log.e("CornerRadius", "decorView exception: ${e.message}")
        } finally {
          latch.countDown()
        }
      }
      latch.await()

      val decorPx = decorResult.get()
      if (decorPx > 0) return@AsyncFunction (decorPx / density).toDouble()

      // 2순위: currentWindowMetrics (TOP_LEFT 기준)
      try {
        val wm = activity.getSystemService(Context.WINDOW_SERVICE) as WindowManager
        val insets = wm.currentWindowMetrics.windowInsets
        val radiusPx = insets.getRoundedCorner(RoundedCorner.POSITION_TOP_LEFT)?.radius ?: 0
        if (radiusPx > 0) return@AsyncFunction (radiusPx / density).toDouble()
      } catch (e: Exception) {
        android.util.Log.e("CornerRadius", "currentWindowMetrics exception: ${e.message}")
      }

      // 3순위: 시스템 프로퍼티
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

        if (radiusPx != null) return@AsyncFunction (radiusPx / density).toDouble()
      } catch (e: Exception) {
        android.util.Log.e("CornerRadius", "SystemProperties exception: ${e.message}")
      }

      0.0
    }
  }
}