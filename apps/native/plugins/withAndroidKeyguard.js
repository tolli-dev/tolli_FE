const { withMainActivity } = require('@expo/config-plugins');

/**
 * 잠금 화면에서 위젯을 눌렀을 때 앱이 열리도록 MainActivity를 패치하는 config plugin.
 *
 * 잠긴 기기에서는 시스템이 액티비티를 keyguard 뒤에 배치하므로 사용자 눈에는
 * 아무 일도 일어나지 않는 것처럼 보인다. 잠금 상태로 실행됐을 때만
 * showWhenLocked를 켜고 시스템 잠금 해제 프롬프트를 띄운다.
 *
 * 잠금을 우회하는 것이 아니라 해제를 "요청"하는 방식이므로,
 * 사용자가 해제하기 전에는 앱 내용이 노출되지 않는다.
 *
 * MainActivity.kt는 prebuild 산출물이라 매번 초기화되므로 plugin으로 다시 적용한다.
 */

const MARKER = '// @tolli-keyguard';

const IMPORT_ANCHOR = 'import android.os.Build';
const ONCREATE_ANCHOR = '    super.onCreate(null)\n  }';

const DISMISS_METHOD = `
  /**
   * 잠금 상태로 실행된 경우에만 잠금 해제를 요청한다. ${MARKER}
   * setShowWhenLocked를 켜야 액티비티가 keyguard 위에 표시될 수 있고,
   * requestDismissKeyguard가 시스템 잠금 해제 화면을 띄운다.
   */
  private fun dismissKeyguardIfLocked() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O_MR1) return

    val keyguardManager = getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager
    if (!keyguardManager.isKeyguardLocked) return

    setShowWhenLocked(true)
    keyguardManager.requestDismissKeyguard(this, null)
  }
`;

module.exports = function withAndroidKeyguard(config) {
  return withMainActivity(config, (cfg) => {
    const { language } = cfg.modResults;
    if (language !== 'kt') {
      throw new Error(
        `withAndroidKeyguard: MainActivity가 Kotlin이 아닙니다 (${language}). plugin을 갱신하세요.`,
      );
    }

    let contents = cfg.modResults.contents;

    // prebuild를 --clean 없이 반복 실행해도 중복 삽입되지 않도록 한다.
    if (contents.includes(MARKER)) return cfg;

    if (!contents.includes(IMPORT_ANCHOR)) {
      throw new Error(
        `withAndroidKeyguard: import 기준점("${IMPORT_ANCHOR}")을 찾지 못했습니다.`,
      );
    }
    contents = contents.replace(
      IMPORT_ANCHOR,
      ['import android.app.KeyguardManager', 'import android.content.Context', IMPORT_ANCHOR].join(
        '\n',
      ),
    );

    if (!contents.includes(ONCREATE_ANCHOR)) {
      throw new Error(
        'withAndroidKeyguard: onCreate 기준점을 찾지 못했습니다.',
      );
    }
    contents = contents.replace(
      ONCREATE_ANCHOR,
      '    super.onCreate(null)\n    dismissKeyguardIfLocked()\n  }',
    );

    // 클래스를 닫는 마지막 중괄호 앞에 메서드를 넣는다.
    const lastBrace = contents.lastIndexOf('}');
    if (lastBrace === -1) {
      throw new Error('withAndroidKeyguard: 클래스 닫는 괄호를 찾지 못했습니다.');
    }
    contents = contents.slice(0, lastBrace) + DISMISS_METHOD + contents.slice(lastBrace);

    cfg.modResults.contents = contents;
    return cfg;
  });
};
