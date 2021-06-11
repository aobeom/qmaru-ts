import { message } from 'antd'

const ErrorMsg = (msg: string) => {
  message.error(msg)
}

declare global {
  interface Window {
    api: string,
    Message: Function
  }
}

window.api = "yourapiaddress"
window.Message = ErrorMsg

export { }
