import { FunctionComponent } from 'react'
import CropSquareRoundedIcon from '@mui/icons-material/CropSquareRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import HorizontalRuleRoundedIcon from '@mui/icons-material/HorizontalRuleRounded'

export const WindowBar: FunctionComponent = () => {
  return (
    <div className="flex h-[32px] bg-neutral-900 border-b-2 border-neutral-950 shadow-sm">
      <div className="grow window-drag" /> {/* Draggable Bar */}
      <div className="grid grid-cols-3 h-full w-[96px]">
        <button className="flex justify-center items-center outline-none hover:bg-neutral-700" onClick={window.main.minimizeWindow}>
          <HorizontalRuleRoundedIcon sx={{ fontSize: 24 }} />
        </button>

        <button className="flex justify-center items-center outline-none hover:bg-neutral-700" onClick={window.main.maximizeWindow}>
          <CropSquareRoundedIcon sx={{ fontSize: 24 }} />
        </button>

        <button className="flex justify-center items-center outline-none hover:bg-red-500" onClick={window.main.closeWindow}>
          <CloseRoundedIcon sx={{ fontSize: 24 }} />
        </button>
      </div>
    </div>
  )
}
