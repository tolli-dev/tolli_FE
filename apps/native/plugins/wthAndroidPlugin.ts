import { ConfigPlugin, withAndroidManifest } from "expo/config-plugins";

const withAndroidPlugin: ConfigPlugin = (config) => {
  return withAndroidManifest(config, (config) => {
    const mainApplication = config?.modResults;

    if (mainApplication) {
      if (!mainApplication.manifest.queries) {
        mainApplication.manifest.queries = [];
      }

      mainApplication.manifest.queries.push({
        package: [
          {
            $: { "android:name": "com.kakao.talk" },
          },
        ],
      });
    }

    return config;
  });
};

export default withAndroidPlugin;
