export const RECORDS_KEY = 'x-records'
export const CONNECT_KEY = 'x-connected'
export const ADDRESS_KEY = 'x-address'

const StorgeUtil = {
  get(key: string, jsonfy = false) {
    const res = localStorage.getItem(key)
    if (res && jsonfy) {
      return JSON.parse(res)
    }
    return res
  },

  set(key: string, value: any, stringfy = false) {
    let newValue = ''
    if (stringfy) {
      newValue = JSON.stringify(value)
    }
    localStorage.setItem(key, value)
  },
}

export default StorgeUtil
