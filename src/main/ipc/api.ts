import path from 'node:path'
import { ipcMain } from 'electron'
import { TranslateResponse } from '~shared/types'
import { ChildProcess, execFile, ExecFileOptions } from 'node:child_process'
import fetch, { Response, FetchError } from 'node-fetch'

export default class TranslateServer {
  isDevelopment: boolean
  host: string
  port: string

  constructor(isDevelopment: boolean, host: string = '127.0.0.1', port: string = '8080') {
    this.isDevelopment = isDevelopment
    this.host = host
    this.port = port

    // SETUP IPC EVENTS
    this.translateEvent()
  }

  public open = async (): Promise<void> => {
    // TO-DO: FIND SOLUTION TO SPEED UP SERVER START UP,
    // CURRENTLY TAKES AROUND 4-5 SECONDS

    const filePath = this.isDevelopment
      ? path.join(__dirname, './resources/translate_server.exe')
      : path.join(process.resourcesPath, 'translate_server.exe')

    const args: string[] = ['--host', this.host, '--port', this.port]
    const options: ExecFileOptions = { timeout: 15000 /* TIMEOUT AFTER 15 SECONDS */ }
    const serverProcess: ChildProcess = execFile(filePath, args, options)

    // WAIT FOR SERVER TO BE AVAILABLE
    const start = performance.now()
    await this.ping(serverProcess)
    console.log(`SERVER STARTUP TOOK: ${Math.round(performance.now() - start)} ms`)
  }

  public close = async (): Promise<void> => {
    await fetch(`http://${this.host}:${this.port}/api/pid`).then(async response => {
      const pid = (await response.json()) as number
      process.kill(pid)
    })
  }

  private ping = async (serverProcess: ChildProcess): Promise<boolean> => {
    // CHECK IF THE SERVER IS ONLINE EVERY 0.125 SECONDS, UNTIL TIME LIMIT REACHED
    return await new Promise(resolve => setTimeout(resolve, 125)).then(async () => {
      return await fetch(`http://${this.host}:${this.port}/api/pid`)
        .then(async response => {
          const pid = (await response.json()) as number
          console.log(`SERVER CHILD PROCESS ID: ${pid}`)
          if (!serverProcess.killed) serverProcess.kill()
          return response.ok
        })
        .catch(() => {
          return this.ping(serverProcess)
        })
    })
  }

  public setup = async (source: string = 'en', target: string = 'es'): Promise<void> => {
    // SETUP THE TRANSLATOR, SO THE FIRST TRANSLATE CALL IS NOT ABNORMALLY SLOW
    const start = performance.now()
    const params = new URLSearchParams([
      ['source', source],
      ['target', target],
    ])

    await fetch(`http://${this.host}:${this.port}/api/setup?${params}`).then(() => {
      console.log(`SETUP API CALL TOOK: ${Math.round(performance.now() - start)} ms`)
    })
  }

  private translateEvent = (): void => {
    ipcMain.handle(
      'flaskApi:translate',
      async (_, source: string, target: string, value: string): Promise<TranslateResponse | undefined> => {
        const start = performance.now()
        const params = new URLSearchParams([
          ['source', source],
          ['target', target],
          ['q', value],
        ])

        return await fetch(`http://${this.host}:${this.port}/api/translate?${params}`)
          .then(async (response: Response): Promise<TranslateResponse> => {
            console.log(`TRANSLATE API CALL TOOK: ${Math.round(performance.now() - start)} ms`)
            return (await response.json()) as Promise<TranslateResponse>
          })
          .catch((error: FetchError) => {
            console.log(error.message)
            return undefined
          })
      }
    )
  }
}
