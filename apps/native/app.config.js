import "dotenv/config";

export default {
  expo: {
    name: "tolli",
    slug: "tolli",
    version: "1.0.5",
    orientation: "portrait",
    icon: "./assets/apple-icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    ios: {
      buildNumber: "1",
      supportsTablet: true,
      bundleIdentifier: "com.company.tolli",
      usesAppleSignIn: true,
      infoPlist: {
        NSMicrophoneUsageDescription: "녹음을 위해 마이크를 사용합니다.",
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: "com.company.tolli",
      versionCode: 8,
      allowBackup: false,
      // FCM(Expo Push) 초기화용. 이 파일이 있어야 FirebaseApp이 자동 초기화된다.
      googleServicesFile: "./google-services.json",
      adaptiveIcon: {
        foregroundImage: "./assets/android-icon.png",
        backgroundColor: "#1B1B1B",
      },
      permissions: ["RECORD_AUDIO", "MODIFY_AUDIO_SETTINGS", "SCHEDULE_EXACT_ALARM"],
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    scheme: "tolli",
    plugins: [
      [
        "expo-splash-screen",
        {
          image: "./assets/splash.png",
          imageWidth: 300,
          resizeMode: "contain",
          backgroundColor: "#1B1B1B",
        },
      ],
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme:
            "com.googleusercontent.apps.453019507405-qq1d999d55r3onrsdoednvtmjggfq6vf",
          googleServicesFile: "./google-services.json",
        },
      ],
      [
        "@react-native-seoul/kakao-login",
        {
          kakaoAppKey: process.env.KAKAO_APP_KEY,
          kotlinVersion: "2.1.0",
        },
      ],
      [
        "expo-build-properties",
        {
          android: {
            kotlinVersion: "2.1.0",
            targetSdkVersion: 35,
            extraMavenRepos: [
              "https://devrepo.kakao.com/nexus/content/groups/public/",
            ],
          },
        },
      ],
      [
        "expo-notifications",
        {
          iosPermissions: ["Alert", "Sound", "Badge"],
          android: {
            defaultChannel: {
              name: "default",
              importance: "HIGH",
              sound: true,
            },
          },
        },
      ],
      "./plugins/withIosProjectTweaks",
    ],
    extra: {
      googleWebClientId: process.env.GOOGLE_WEB_CLIENT_ID,
      googleIosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
      appleClientId: process.env.APPLE_CLIENT_ID,
      eas: {
        projectId: "c25cfa1e-4df0-417d-9890-242c9e10c2e2",
      },
    },
  },
};
