// @ts-ignore
import OpenSSL from './openssl.js'
// @ts-ignore
import * as wasmFileBuffer from './openssl.wasm'

let instance: Command | null = null
class Command{

  opensslModule?: WebAssembly.Module

  constructor() {
    if(!instance){
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      instance = this
    }
    this.initWasmModule()
    return instance
  }

  async initWasmModule(){
    try {
      this.opensslModule = await WebAssembly.compile(wasmFileBuffer)
      console.log('Compile webassembly success! ')
    } catch (error) {
      console.error('Failed to initialize WebAssembly module.', error)
      throw error
    }
  }

  async getWasmInstance(customProps = {}) {
    const output = {
      stdout: '',
      stderr: '',
      file: null,
    }

    const instantiateWasm = (imports: any, successCallback: any) => {
      WebAssembly.instantiate(this.opensslModule!, imports).then(successCallback)
      return {}
    }
    const print = (line: string) => {
      output.stdout += line + '\n'
    }
    const printErr = (line: string) => {
      output.stderr += line + '\n'
    }

    const wasmInstance = await OpenSSL({
      thisProgamm: 'openssl',
      instantiateWasm: instantiateWasm,
      print: print,
      printErr: printErr,
      customOutput: output,
      ...customProps,
    })

    return wasmInstance
  }

  convertArgsToArray(args: string) {
    return args.split(/[\s]{1,}/g).filter(Boolean)
  }

  async run(commandStr: string): Promise<string> {
    const argsArray = this.convertArgsToArray(commandStr)

    const wasmInstance = await this.getWasmInstance({})
    let result = ''
    try {
      wasmInstance?.callMain(argsArray)
    } catch (error) {
      console.log('error....', error)
    }finally {
      result  = wasmInstance?.customOutput.stdout
    }
    return result
  }

}

export default Command
