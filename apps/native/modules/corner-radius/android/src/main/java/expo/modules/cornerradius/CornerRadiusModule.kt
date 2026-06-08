package expo.modules.cornerradius

import android.os.Build
import android.view.RoundedCorner
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

      val result = AtomicInteger(0)
      val latch = CountDownLatch(1)
      activity.runOnUiThread {
        try {
          val rootView = activity.window?.decorView?.rootView
          val radius = rootView?.rootWindowInsets
            ?.getRoundedCorner(RoundedCorner.POSITION_TOP_LEFT)
            ?.radius ?: 0
          result.set(radius)
        } catch (e: Exception) {
          android.util.Log.e("CornerRadius", "exception: ${e.message}")
        } finally {
          latch.countDown()
        }
      }
      latch.await()

      val px = result.get()
      if (px > 0) (px / density).toDouble() else 0.0
    }
  }
}
