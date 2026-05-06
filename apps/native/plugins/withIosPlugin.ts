import { ConfigPlugin, withInfoPlist } from "expo/config-plugins";

const withIosPlugin: ConfigPlugin = (config) => {
  return withInfoPlist(config, (config) => {
    const infoPlist = config.modResults;

    if (!infoPlist.LSApplicationQueriesSchemes) {
      infoPlist.LSApplicationQueriesSchemes = [];
    }

    if (!infoPlist.LSApplicationQueriesSchemes.includes("kakaokompassauth")) {
      infoPlist.LSApplicationQueriesSchemes.push("kakaokompassauth");
    }

    return config;
  });
};

export default withIosPlugin;
