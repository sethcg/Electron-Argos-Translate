import path from 'node:path'
import { ipcMain } from 'electron'
import { TranslateResponse } from '~shared/types'
import fetch, { Response, FetchError } from 'node-fetch'
import { ChildProcess, execFile, ExecFileException } from 'node:child_process'

export class TranslateServer {
  isDevelopment: boolean
  host: string
  port: string
  serverProcess: ChildProcess

  constructor(isDevelopment: boolean, host: string = '127.0.0.1', port: string = '8080') {
    this.isDevelopment = isDevelopment
    this.host = host
    this.port = port

    this.serverProcess = this.open()
  }

  open = (): ChildProcess => {
    const filePath = this.isDevelopment
      ? path.join(__dirname, './resources/translate_server.exe')
      : path.join(process.resourcesPath, 'translate_server.exe')

    return execFile(filePath, ['--host', this.host, '--port', this.port], (error: ExecFileException | null) => {
      console.log(`ERROR: ${error?.message}`)
    })
  }

  close = async (): Promise<void> => {
    await fetch(`http://${this.host}:${this.port}/api/pid`).then(async response => {
      const pid = (await response.json()) as number
      process.kill(pid)
    })
    this.serverProcess.kill()
  }

  ping = async (currentTime: number, timeLimit: number): Promise<boolean> => {
    // CHECK IF THE SERVER IS ONLINE EVERY SECOND, UNTIL TIME LIMIT REACHED
    return await new Promise(resolve => setTimeout(resolve, 125)).then(async () => {
      return await fetch(`http://${this.host}:${this.port}/api/pid`)
        .then(async response => {
          const pid = (await response.json()) as number
          console.log(`SERVER CHILD PROCESS ID: ${pid}`)
          return response.ok
        })
        .catch(() => {
          if (currentTime > timeLimit) return false
          return this.ping(currentTime++, timeLimit)
        })
    })
  }

  translateEvents = (): void => {
    ipcMain.handle(
      'flaskApi:translate',
      async (_, source: string, target: string, value: string): Promise<TranslateResponse | FetchError> => {
        const params = new URLSearchParams([
          ['source', source],
          ['target', target],
          ['q', value],
        ])

        return await fetch(`http://${this.host}:${this.port}/api/translate?${params}`)
          .then(async (response: Response): Promise<TranslateResponse> => {
            return (await response.json()) as Promise<TranslateResponse>
          })
          .catch((error: FetchError) => {
            return error
          })
      }
    )
  }
}
