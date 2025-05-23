import path from 'node:path'
import type { ForgeConfig } from '@electron-forge/shared-types'
import { MakerSquirrel } from '@electron-forge/maker-squirrel'
import { MakerDMG } from '@electron-forge/maker-dmg'
import { MakerDeb } from '@electron-forge/maker-deb'
import { MakerRpm } from '@electron-forge/maker-rpm'
import { MakerZIP } from '@electron-forge/maker-zip'
import { VitePlugin } from '@electron-forge/plugin-vite'
import { FusesPlugin } from '@electron-forge/plugin-fuses'
import { FuseV1Options, FuseVersion } from '@electron/fuses'

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon: '.src/assets/icons/icon',
    executableName: 'simple-offline-translation',
    extraResource: [
      './src/assets/icons/icon.png',
      './src/assets/package-index.json',
      './src/assets/xx_sent_ud_sm',
      './src/assets/models',
      'dist/translate_server.exe',
    ],
  },
  rebuildConfig: {},
  makers: [
    // prettier-ignore
    new MakerSquirrel({ setupIcon: path.resolve(__dirname, 'src/assets/icons/icon.ico'), }, ['win32']),
    new MakerDMG({ icon: path.resolve(__dirname, 'src/assets/icons/icon.png') }, ['darwin']),
    new MakerRpm({ options: { icon: path.resolve(__dirname, 'src/assets/icons/icon.ico') } }, ['linux']),
    new MakerDeb({ options: { icon: path.resolve(__dirname, 'src/assets/icons/icon.ico') } }, ['linux']),
    new MakerZIP({}),
  ],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          entry: './src/main/main.ts',
          config: './viteconfig/vite.main.config.ts',
        },
        {
          entry: './src/renderer/windows/main/preload.ts',
          config: './viteconfig/main/vite.preload.config.ts',
        },
        {
          entry: './src/renderer/windows/splash/preload.ts',
          config: './viteconfig/splash/vite.preload.config.ts',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: './viteconfig/vite.renderer.config.mts',
        },
      ],
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'sethcg',
          name: 'Electron-Argos-Translate',
        },
      },
    },
  ],
}

export default config
