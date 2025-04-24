import { FunctionComponent } from 'react'
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded'
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded'
import BlockRoundedIcon from '@mui/icons-material/BlockRounded'
import clsx from 'clsx'

interface Props {
  installed: boolean
  favorited: boolean
  downloading: boolean
  callback: () => void
}

export const DownloadColumn: FunctionComponent<Props> = ({ installed, favorited, downloading, callback }) => {
  return (
    <>
      <div
        className={`${clsx(
          'flex flex-row justify-center items-center gap-[3px] px-[10px] py-[5px] rounded-lg',
          'transition-colors duration-700',
          `${downloading ? '' : 'hidden'}`,
          'bg-amber-500/60 dark:bg-amber-500/30'
        )}`}>
        <span className="text-sm font-roboto">Downloading</span>
        <div className="pt-3 flex flex-row gap-[3px]">
          <div className="size-1 rounded-full bg-charcoal-700 dark:bg-charcoal-50 animate-bounce [animation-delay:-1.6s] transition-colors duration-700"></div>
          <div className="size-1 rounded-full bg-charcoal-700 dark:bg-charcoal-50 animate-bounce [animation-delay:-2.4s] transition-colors duration-700"></div>
          <div className="size-1 rounded-full bg-charcoal-700 dark:bg-charcoal-50 animate-bounce [animation-delay:-3.2s] transition-colors duration-700"></div>
        </div>
      </div>
      <div className="group relative size-[40px]">
        <button
          disabled={favorited || downloading}
          onClick={callback}
          className={`${clsx(
            'flex flex-row justify-center items-center cursor-pointer rounded-md p-1 gap-[1px] focus:outline-none',
            'transition-colors duration-700',
            `${
              favorited
                ? 'bg-amber-500/60 hover:bg-amber-500/70 dark:bg-amber-500/30 dark:hover:bg-amber-500/40'
                : installed
                  ? 'bg-red-500/60 hover:bg-red-500/70 dark:bg-red-500/30 dark:hover:bg-red-500/40'
                  : downloading
                    ? 'bg-amber-500/60 dark:bg-amber-500/30'
                    : 'bg-emerald-500/60 hover:bg-emerald-500/70 dark:bg-emerald-500/30 dark:hover:bg-emerald-500/40'
            }`
          )}`}>
          {favorited ? (
            <BlockRoundedIcon sx={{ fontSize: 32 }} />
          ) : installed ? (
            <DeleteForeverRoundedIcon sx={{ fontSize: 32 }} />
          ) : downloading ? (
            <AccessTimeRoundedIcon sx={{ fontSize: 32 }} />
          ) : (
            <FileDownloadRoundedIcon sx={{ fontSize: 32 }} />
          )}
        </button>
        <span
          className={`${clsx(
            'absolute right-12 top-1.5 scale-0 rounded px-2 py-1 text-sm group-hover:scale-100 transition-opacity',
            'transition-colors duration-700',
            `${downloading ? 'hidden' : ''}`,
            `${favorited ? 'bg-amber-500/50 dark:bg-amber-500/20' : installed ? 'bg-red-500/50 dark:bg-red-500/20' : 'bg-emerald-500/60 dark:bg-emerald-500/20'}`
          )}`}>
          <span>{favorited ? 'Favorite' : installed ? 'Delete' : 'Download'}</span>
        </span>
      </div>
    </>
  )
}
