declare global {
  interface Window {
    api: string,
    dateVer: string
    commitVer: string
    messageDefault: any
  }
}

// notistack 默认属性
window.messageDefault = {
  variant: "success",
  autoHideDuration: 2000,
  preventDuplicate: true,
  anchorOrigin: {
    vertical: 'top',
    horizontal: 'center',
  }
}

// API 地址
window.api = "yourapiaddress"
// 版本号
window.dateVer = "YOURDATEVER"
window.commitVer = "YOURCOMMITVER"

export { }
