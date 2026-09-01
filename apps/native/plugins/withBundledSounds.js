const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const {
  withDangerousMod,
  withXcodeProject,
  IOSConfig,
} = require('@expo/config-plugins');

const SOURCE_DIR = 'assets/sounds';

/**
 * Metro 개발 서버는 에셋을 `/assets/?unstable_path=...` 쿼리 URL로 서빙하는데,
 * 이 경로가 한글/공백이 섞인 mp3에서 제대로 해석되지 않아 재생이 실패한다.
 * 사운드를 네이티브 번들 리소스로 직접 복사해 Metro 경로를 아예 우회한다.
 */

// 파일명(NFC 정규화) -> 안정적인 네이티브 리소스 이름.
// 한글/공백/괄호는 안드로이드 res/raw 규칙(소문자 영숫자·언더스코어)에 쓸 수 없어
// 내용이 아닌 "이름" 기준 해시를 써서 파일이 바뀌어도 키가 유지되도록 한다.
function resourceName(fileName) {
  const normalized = fileName.normalize('NFC');
  const hash = crypto.createHash('sha1').update(normalized, 'utf8').digest('hex');
  return `snd_${hash.slice(0, 12)}`;
}

function listSounds(projectRoot) {
  const dir = path.join(projectRoot, SOURCE_DIR);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith('.mp3'))
    .sort();
}

// iOS: 앱 번들에 <resourceName>.mp3 로 복사하고 Resources 그룹/빌드 페이즈에 등록한다.
function withIosSounds(config) {
  const copied = withDangerousMod(config, [
    'ios',
    (cfg) => {
      const projectRoot = cfg.modRequest.projectRoot;
      const destDir = path.join(cfg.modRequest.platformProjectRoot, 'sounds');

      fs.rmSync(destDir, { recursive: true, force: true });
      fs.mkdirSync(destDir, { recursive: true });

      for (const file of listSounds(projectRoot)) {
        fs.copyFileSync(
          path.join(projectRoot, SOURCE_DIR, file),
          path.join(destDir, `${resourceName(file)}.mp3`)
        );
      }
      return cfg;
    },
  ]);

  return withXcodeProject(copied, (cfg) => {
    const project = cfg.modResults;
    const platformRoot = cfg.modRequest.platformProjectRoot;

    IOSConfig.XcodeUtils.ensureGroupRecursively(project, 'Resources');

    for (const file of listSounds(cfg.modRequest.projectRoot)) {
      const filepath = path.relative(
        platformRoot,
        path.join(platformRoot, 'sounds', `${resourceName(file)}.mp3`)
      );
      // 같은 파일이 이미 등록돼 있으면 건너뛴다 (prebuild 반복 시 중복 방지).
      if (project.hasFile(filepath)) continue;
      IOSConfig.XcodeUtils.addResourceFileToGroup({
        filepath,
        groupName: 'Resources',
        project,
        isBuildFile: true,
        verbose: false,
      });
    }
    return cfg;
  });
}

// Android: res/raw 는 확장자 없이 이름으로 참조되므로 <resourceName>.mp3 로 복사한다.
function withAndroidSounds(config) {
  return withDangerousMod(config, [
    'android',
    (cfg) => {
      const projectRoot = cfg.modRequest.projectRoot;
      const destDir = path.join(
        cfg.modRequest.platformProjectRoot,
        'app/src/main/res/raw'
      );

      fs.mkdirSync(destDir, { recursive: true });
      // 이전 실행에서 남은 사운드만 지운다 (다른 raw 리소스는 보존).
      for (const f of fs.readdirSync(destDir)) {
        if (f.startsWith('snd_')) fs.rmSync(path.join(destDir, f));
      }

      for (const file of listSounds(projectRoot)) {
        fs.copyFileSync(
          path.join(projectRoot, SOURCE_DIR, file),
          path.join(destDir, `${resourceName(file)}.mp3`)
        );
      }
      return cfg;
    },
  ]);
}

module.exports = function withBundledSounds(config) {
  return withAndroidSounds(withIosSounds(config));
};

module.exports.resourceName = resourceName;
