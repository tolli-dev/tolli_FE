import { ConfigPlugin } from "expo/config-plugins";
import withAndroidPlugin from "./wthAndroidPlugin";
import withIosPlugin from "./withIosPlugin";

const withPlugin: ConfigPlugin = (config) => {
  config = withAndroidPlugin(config);
  return withIosPlugin(config);
};

export default withPlugin;
