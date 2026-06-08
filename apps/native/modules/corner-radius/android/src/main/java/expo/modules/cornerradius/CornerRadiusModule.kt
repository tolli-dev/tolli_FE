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
      val res = activity.resources
      val density = res.displayMetrics.density

      // API 31 미만: 시스템 dimen 리소스 우선, 없으면 휴리스틱
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) {
        val dimenPx = getSystemDimenPx(activity)
        if (dimenPx > 0) return@AsyncFunction (dimenPx / density).toDouble()
        val minDimPx = minOf(res.displayMetrics.widthPixels, res.displayMetrics.heightPixels)
        return@AsyncFunction (minDimPx * 0.05f / density).toDouble()
      }

      // 1순위: 시스템 dimen 리소스 (AOSP가 실제로 사용하는 값 — Samsung 포함 OEM에서 가장 정확)
      val dimenPx = getSystemDimenPx(activity)
      if (dimenPx > 0) return@AsyncFunction (dimenPx / density).toDouble()

      // 2순위: decorView.rootWindowInsets (window에 실제 dispatch된 insets)
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

      // 3순위: currentWindowMetrics
      try {
        val wm = activity.getSystemService(Context.WINDOW_SERVICE) as WindowManager
        val insets = wm.currentWindowMetrics.windowInsets
        val radiusPx = insets.getRoundedCorner(RoundedCorner.POSITION_TOP_LEFT)?.radius ?: 0
        if (radiusPx > 0) return@AsyncFunction (radiusPx / density).toDouble()
      } catch (e: Exception) {
        android.util.Log.e("CornerRadius", "currentWindowMetrics exception: ${e.message}")
      }

      0.0
    }
  }

  private fun getSystemDimenPx(context: Context): Int {
    val res = context.resources
    for (name in listOf("rounded_corner_radius_top", "rounded_corner_radius")) {
      val id = res.getIdentifier(name, "dimen", "android")
      if (id != 0) {
        val px = res.getDimensionPixelSize(id)
        if (px > 0) return px
      }
    }
    return 0
  }
}
