import { FunctionComponent, useEffect, useState } from 'react'
import { Field, Label, Description, Input } from '@headlessui/react'
import clsx from 'clsx'

export const InterThreadSetting: FunctionComponent = () => {
  const [showError, setShowError] = useState<boolean>(false)
  const [availableThreadNum, setAvailableThreadNum] = useState<number>(0)

  const [interThreadNum, setInterThreadNum] = useState<number>(0)
  useEffect(() => {
    const timer: NodeJS.Timeout = setTimeout(() => {
      if (interThreadNum && interThreadNum <= 16 && interThreadNum > 0) {
        window.main.store.set('translate.inter_threads', interThreadNum)
        setShowError(false)
        return
      }
      setShowError(true)
    }, 150)
    return () => clearTimeout(timer)
  }, [interThreadNum])

  useEffect(() => {
    async function getSystemInfo() {
      const currentThreads: number = (await window.main.store.get('translate.inter_threads')) as number
      const availableThreads: number = await window.main.computer.getAvailableThreads()

      setInterThreadNum(currentThreads)
      setAvailableThreadNum(availableThreads)
    }
    getSystemInfo()
  }, [])

  return (
    <div className="w-full flex px-4 self-start">
      <Field className={'grow flex flex-col gap-2'}>
        <Label className="text-xl font-bold transition-colors duration-700">Inter-threads</Label>
        <Description className="text-sm italic transition-colors duration-700 text-charcoal-700 dark:text-charcoal-200">
          Maximum number of threads for parallel translations.
        </Description>
        <div className="flex flex-col gap-4 justify-center items-center mt-1">
          <Input
            value={interThreadNum}
            maxLength={availableThreadNum.toString().length}
            onChange={event => setInterThreadNum(parseInt(event.target.value))}
            className={`${clsx(
              'self-start block rounded-md py-1.5 px-3 border-none focus:outline-none text-md',
              'transition-colors duration-500',
              'dark:bg-charcoal-400/70 bg-charcoal-50'
            )}`}
          />
          <div
            className={`${clsx(
              `${showError ? '' : 'hidden'}`,
              'flex flex-row gap-1 border-2 justify-center items-center self-start rounded px-2 py-1 text-sm',
              'bg-red-100 border-red-600/80'
            )}`}>
            <strong className="font-bold text-red-700">Error: </strong>
            <span className="block sm:inline text-red-800/90">
              the installed CPU only has a maximum of <span className="font-bold underline">{availableThreadNum}</span> threads available.
            </span>
          </div>
        </div>
      </Field>
    </div>
  )
}
