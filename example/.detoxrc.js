/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      '$0': 'jest',
      config: 'e2e/jest.config.js'
    },
    jest: {
      setupTimeout: 360000
    }
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/exmpl.app',
      build: 'xcodebuild -workspace ios/exmpl.xcworkspace -scheme exmpl -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build'
    },
    'ios.release': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/exmpl.app',
      build: 'xcodebuild -workspace ios/exmpl.xcworkspace -scheme exmpl -configuration Release -sdk iphonesimulator -derivedDataPath ios/build'
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build: 'cd android ; ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug ; cd -',
      reversePorts: [
        8081,   // Metro bundler
        8080,   // LND REST
        9735,   // LND P2P
        10009,  // LND RPC
        18081,  // Core Lightning REST
        9736,   // Core Lightning P2P
        11001,  // Core Lightning RPC
        28081,  // Eclair REST
        9737,   // Eclair P2P
        60001,  // Electrum
        18443,  // Bitcoin RPC
        3003    // Backup server
      ]
    },
    'android.release': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
      build: 'cd android ; ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release ; cd -',
      reversePorts: [
        8081,   // Metro bundler
        8080,   // LND REST
        9735,   // LND P2P
        10009,  // LND RPC
        18081,  // Core Lightning REST
        9736,   // Core Lightning P2P
        11001,  // Core Lightning RPC
        28081,  // Eclair REST
        9737,   // Eclair P2P
        60001,  // Electrum
        18443,  // Bitcoin RPC
        3003    // Backup server
      ]
    }
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 15'
      }
    },
    attached: {
      type: 'android.attached',
      device: {
        adbName: '.*'
      }
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_API_31_AOSP'
      }
    }
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug'
    },
    'ios.sim.release': {
      device: 'simulator',
      app: 'ios.release'
    },
    'android.att.debug': {
      device: 'attached',
      app: 'android.debug'
    },
    'android.att.release': {
      device: 'attached',
      app: 'android.release'
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug'
    },
    'android.emu.release': {
      device: 'emulator',
      app: 'android.release'
    }
  }
};
