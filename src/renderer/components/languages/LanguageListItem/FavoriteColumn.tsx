import { FunctionComponent } from 'react'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded'
import clsx from 'clsx'

interface Props {
  disabled: boolean
  favorited: boolean
  callback: () => void
}

export const FavoriteColumn: FunctionComponent<Props> = ({ favorited, disabled, callback }) => {
  return (
    <>
      <div className={`${clsx('flex flex-row justify-center items-center gap-[3px] rounded-lg bg-transparent')}`}>
        <button
          onClick={callback}
          disabled={disabled}
          className={`${clsx('cursor-pointer', `${favorited && !disabled ? 'dark:text-amber-400/90 dark:hover:text-amber-400/60' : 'dark:text-charcoal-500 dark:hover:text-charcoal-400'}`)}`}>
          {favorited && !disabled ? <StarRoundedIcon sx={{ fontSize: 32 }} /> : <StarBorderRoundedIcon sx={{ fontSize: 32 }} />}
        </button>
      </div>
    </>
  )
}
