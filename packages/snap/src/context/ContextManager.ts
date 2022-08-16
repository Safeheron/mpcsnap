import KeyGenContext from './KeyGenContext'
import SignContext from './SignContext'

export type ContextType = 'create' | 'sign'

class ContextManager{

  private context?: KeyGenContext | SignContext

  createContext(type: ContextType){
    if(type === 'create'){
      this.context = new KeyGenContext()
    }else{
      this.context = new SignContext()
    }
    return this.context
  }

  getContext() {
    return this.context
  }

  destroy(){
    this.context = undefined
  }

}

export default new ContextManager()
