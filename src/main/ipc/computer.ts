import { ipcMain } from 'electron'
import os from 'node:os'

export default class ComputerInfo {
  public static getAvailableThreadsEvent = (): void => {
    ipcMain.handle('availableThreads:get', async (): Promise<number> => {
      return os.availableParallelism()
    })
  }
}
