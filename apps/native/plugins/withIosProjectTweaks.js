const { withXcodeProject } = require('@expo/config-plugins');

/**
 * prebuild 후 매번 초기화되는 ios/tolli.xcodeproj/project.pbxproj 설정을
 * 자동으로 다시 적용하는 Expo config plugin.
 */
module.exports = function withIosProjectTweaks(config) {
  return withXcodeProject(config, (cfg) => {
    const project = cfg.modResults;

    const root = project.getFirstProject().firstProject;
    if (root.developmentRegion === 'en') {
      root.developmentRegion = 'ko';
    }
    if (Array.isArray(root.knownRegions)) {
      root.knownRegions = root.knownRegions.map((r) => (r === 'en' ? 'ko' : r));
    }

    const configurations = project.pbxXCBuildConfigurationSection();
    for (const key of Object.keys(configurations)) {
      const buildSettings = configurations[key]?.buildSettings;
      if (buildSettings && typeof buildSettings === 'object') {
        buildSettings.ENABLE_USER_SCRIPT_SANDBOXING = 'NO';
      }
    }

    return cfg;
  });
};
