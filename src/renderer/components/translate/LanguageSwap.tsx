import { FunctionComponent } from 'react'
import { Button } from '@headlessui/react'
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded'
import clsx from 'clsx'

interface Props {
  callback: () => void
}

export const LanguageSwapButton: FunctionComponent<Props> = ({ callback }) => {
  return (
    <>
      <Button
        className={`${clsx(
          'flex justify-center items-center size-[36px] p-2 rounded-full',
          'hover:bg-primary-500 dark:hover:bg-primary-400 hover:text-neutral-50 dark:hover:text-neutral-950'
        )}`}
        onClick={callback}
      >
        <SwapHorizRoundedIcon sx={{ fontSize: 32 }} />
      </Button>
    </>
  )
}
