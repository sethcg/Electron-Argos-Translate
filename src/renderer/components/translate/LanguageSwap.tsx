import { FunctionComponent } from 'react'
import { Button } from '@headlessui/react'
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded'
import clsx from 'clsx'

interface Props {
  callback: () => void
}

export const LanguageSwapButton: FunctionComponent<Props> = ({ callback }) => {
  return (
    <div className="size-[36px] transition-[color] duration-700">
      <Button
        className={`${clsx(
          'flex p-[2px] rounded-full',
          'hover:bg-primary-500 dark:hover:bg-primary-400 hover:text-neutral-50 dark:hover:text-neutral-950'
        )}`}
        onClick={callback}>
        <SwapHorizRoundedIcon sx={{ fontSize: 32 }} />
      </Button>
    </div>
  )
}
