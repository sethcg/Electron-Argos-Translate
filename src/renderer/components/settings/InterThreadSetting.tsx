import { FunctionComponent, useEffect, useState } from 'react'
import { Field, Label, Description, Input } from '@headlessui/react'
import clsx from 'clsx'

export const InterThreadSetting: FunctionComponent = () => {
  const settingKey = 'translate.inter_threads'
  const [showError, setShowError] = useState(false)
  const [availableThreadNum, setAvailableThreadNum] = useState<number>(0)

  const [interThreadNum, setInterThreadNum] = useState<number>(0)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (interThreadNum && interThreadNum <= 16 && interThreadNum > 0) {
        window.main.store.set(settingKey, interThreadNum)
        setShowError(false)
        return
      }
      setShowError(true)
    }, 150)
    return () => clearTimeout(timer)
  }, [interThreadNum])

  useEffect(() => {
    async function getSystemInfo() {
      const currentThreads: number = (await window.main.store.get(settingKey)) as number
      const availableThreads: number = await window.main.computer.getAvailableThreads()

      setInterThreadNum(currentThreads)
      setAvailableThreadNum(availableThreads)
    }
    getSystemInfo()
  }, [])

  return (
    <div className="w-full flex px-4 self-start">
      <Field className={'grow'}>
        <Label className="text-sm/6 font-medium text-white">Inter-threads</Label>
        <Description className="text-sm/6 text-white/50">Maximum number of threads for parallel translations.</Description>
        <div className="flex flex-col gap-4 justify-center items-center text-white text-base mt-1">
          <Input
            value={interThreadNum}
            onChange={event => setInterThreadNum(parseInt(event.target.value))}
            className={`${clsx(
              'w-96 self-start block rounded-lg border-none bg-white/5 py-1.5 px-3',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
            )}`}
          />
          <div
            className={`flex flex-row gap-1 justify-center items-center self-start rounded-full bg-red-100 border border-red-400 text-red-700 text-sm px-2 py-1 ${showError ? '' : 'hidden'}`}
          >
            <strong className="font-extrabold">Error: </strong>
            <span className="block sm:inline">
              The installed CPU only has <span className="font-bold underline">{availableThreadNum}</span> threads available.
            </span>
          </div>
        </div>
      </Field>
    </div>
  )
}
