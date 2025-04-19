import { FunctionComponent } from 'react'
import { InterThreadSetting } from '~components/settings/InterThreadSetting'

export const SettingsPage: FunctionComponent = () => {
  return (
    <div className="grow flex flex-col size-full px-2 py-4">
      <div className="flex flex-col grow max-[960px]:flex-col gap-8 items-center px-4 font-medium">
        <div className="font-extrabold text-3xl">SETTINGS</div>
        <InterThreadSetting />
      </div>
    </div>
  )
}
