const { withProjectBuildGradle } = require('@expo/config-plugins');

// @react-native-seoul/kakao-login이 기본으로 받아오는 Kakao Android SDK 버전이
// 카카오 측 보안 공지(2.24.0 이하 지원 종료, 2.25.0 이상 권장) 기준에 못 미쳐서
// 로그인이 거부된다(KOE101). rootProject.ext에 kakaoSdkVersion을 명시해 오버라이드한다.
const KAKAO_SDK_VERSION = '2.25.0';

module.exports = function withKakaoSdkVersion(config) {
  return withProjectBuildGradle(config, (cfg) => {
    if (cfg.modResults.language !== 'groovy') {
      throw new Error('withKakaoSdkVersion: android/build.gradle가 groovy 형식이 아닙니다.');
    }

    if (cfg.modResults.contents.includes('ext.kakaoSdkVersion')) {
      return cfg;
    }

    cfg.modResults.contents = `ext.kakaoSdkVersion = "${KAKAO_SDK_VERSION}"\n\n${cfg.modResults.contents}`;

    return cfg;
  });
};
