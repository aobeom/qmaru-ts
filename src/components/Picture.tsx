import { useState, useCallback, useEffect } from 'react'

import { makeStyles } from '@mui/styles'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import Skeleton from '@mui/material/Skeleton'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import TextField from '@mui/material/TextField'
import Badge from '@mui/material/Badge'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

import { useSnackbar } from 'notistack'
import LazyLoad from 'react-lazyload'
import { useLocation, useNavigate } from "react-router-dom"

import '../global.ts'

const useStyles = makeStyles({
  pictureResultImg: {
    width: "90%",
    padding: 5,
    maxWidth: 600
  },
  pictureResultVideo: {
    width: "90%",
    maxWidth: 600
  },
  pictureResultIG: {
    padding: 5
  }
})

export default function Picture() {
  // 路由
  const location = useLocation()
  const navigate = useNavigate()
  const cleanSearch = useCallback(() => {
    if (location.search !== "") {
      navigate("/picture")
    }
  }, [location.search, navigate])

  const classes = useStyles()
  const [mediaLoading, setMediaLoading] = useState<boolean>(false)
  const [mediaAlive, setMediaAlive] = useState<any>([{ "name": "Check Server", "status": "info" }])
  const [mediaURL, setMediaURL] = useState<string>("")
  const [mediaData, setMediaData] = useState<any>([])
  const [mediaStatus, setMediaStatus] = useState<boolean>(false)
  const [isIG, setIsIG] = useState<boolean>(false)
  // 设置通知
  const { enqueueSnackbar } = useSnackbar()
  // 监听回车键
  const onKeyUp = (e: any) => {
    e.keyCode === 13 && MeidaFetch("")
  }
  // 进度条
  const loadingClose = () => {
    setMediaLoading(false)
  }

  const MediaURLChange = (e: any) => {
    setMediaURL(e.target.value)
  }

  const MeidaFetch = useCallback((shareURL: string) => {
    setMediaData([])
    // 识别输入类型：直接输入 / 分享输入
    let fetchURL: string = mediaURL
    if (shareURL !== "") {
      fetchURL = shareURL
    }

    if (fetchURL === "") {
      const msg: string = "URL ERROR / NO RESULT FOUND"
      window.messageDefault.variant = "error"
      enqueueSnackbar(
        msg,
        window.messageDefault
      )
      return false
    }
    // 识别输入类型和内容
    let mediaType: string = ""
    var regex: any = /http(s)?:\/\/([\w-]+.)+[\w-]+(\/[\w- ./?%&=]*)?/
    if (!regex.test(fetchURL)) {
      const msg: string = "URL ERROR / NO RESULT FOUND"
      window.messageDefault.variant = "error"
      enqueueSnackbar(
        msg,
        window.messageDefault
      )
      return false
    } else {
      if (fetchURL.indexOf("youtube.com") !== -1 || fetchURL.indexOf("youtu.be") !== -1) {
        mediaType = "/y2b"
      } else if (fetchURL.indexOf("twitter") !== -1) {
        mediaType = "/twitter"
      } else {
        mediaType = "/news"
      }
    }

    if (fetchURL.indexOf("instagram") !== -1) {
      setIsIG(true)
    } else {
      setIsIG(false)
    }

    let fetchURLClear: string[] = fetchURL.split(" ")
    let fetchURLNew: string = fetchURLClear[fetchURLClear.length - 1]
    let requestURL: string = `${window.api}/api/v1/media${mediaType}?url=${encodeURIComponent(fetchURLNew)}`

    setMediaLoading(true)
    cleanSearch()

    fetch(
      requestURL, {
      method: 'GET',
    }).then(res => res.json())
      .then(data => {
        let status: number = data.status
        if (status === 0) {
          const resData: any = data.data
          setMediaData(resData)
          setMediaStatus(true)
          setMediaLoading(false)
        } else {
          const msg: string = data.message
          window.messageDefault.variant = "error"
          enqueueSnackbar(
            msg,
            window.messageDefault
          )
          setMediaStatus(false)
          setMediaLoading(false)
        }
      })
      .catch(
        () => {
          setMediaStatus(false)
          const msg: string = "Server Error"
          window.messageDefault.variant = "error"
          enqueueSnackbar(
            msg,
            window.messageDefault
          )
          setMediaLoading(false)
        }
      )
  }, [enqueueSnackbar, mediaURL, cleanSearch])

  const PicStatus = useCallback(() => {
    const requesURL: string = `${window.api}/api/v1/media/status`
    fetch(requesURL, {
      method: 'GET',
    }).then(res => res.json())
      .then(data => {
        let status: number = data.status
        if (status === 0) {
          let rawData: any = data.data
          let aliveData: any = []
          for (let i = 0; i < rawData.length; i++) {
            let data: any = rawData[i]
            let status: string = "success"
            if (data["status"] === "0") {
              status = "error"
            }
            aliveData.push({
              "name": data["name"],
              "status": status
            })
          }
          setMediaAlive(aliveData)
        }
      })
      .catch(
        () => { }
      )
    return () => { }
  }, [])

  // 识别分享的内容
  const PicFromShare = useCallback(() => {
    const ShareDataFilter = (text: string) => {
      return text.replace(/\r\n/g, "").replace(/\n/g, "")
    }
    const url: any = new URL(window.location.toString())
    const sharedTitle: string = url.searchParams.get('title')
    const sharedText: string = url.searchParams.get('text')
    const sharedUrl: string = url.searchParams.get('url')
    var regex: any = /http(s)?:\/\/([\w-]+.)+[\w-]+(\/[\w- ./?%&=]*)?/
    if (regex.test(sharedTitle)) {
      MeidaFetch(ShareDataFilter(sharedTitle))
    } else if (regex.test(sharedText)) {
      MeidaFetch(ShareDataFilter(sharedText))
    } else if (regex.test(sharedUrl)) {
      MeidaFetch(ShareDataFilter(sharedUrl))
    }
  }, [MeidaFetch])

  useEffect(() => {
    PicStatus()
    PicFromShare()
  }, [PicStatus, PicFromShare])

  let mediaShow: any = []
  if (mediaStatus) {
    const mediaType: string = mediaData.type
    const urls: any = mediaData.entities
    if (mediaType === "news") {
      for (let i in urls) {
        const url: string = urls[i]
        if (url.indexOf(".mp4") > 0) {
          mediaShow.push(
            <div key={"img" + i}>
              {isIG ? <div className={classes.pictureResultIG}>
                <Button
                  type="primary"
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  variant="contained"
                  download
                >
                  IG Can Not Preview {Number(i) + 1}
                </Button>
              </div>
                :
                <video className={classes.pictureResultVideo} src={url} controls />}
            </div>
          )
        } else {
          mediaShow.push(
            <div key={"img" + i}>
              {isIG ? <div className={classes.pictureResultIG}>
                <Button
                  type="primary"
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  variant="contained"
                  download
                >
                  IG Can Not Preview {Number(i) + 1}
                </Button>
              </div>
                :
                <LazyLoad
                  height={200}
                  offset={[200, 0]}
                  debounce={500}
                  once
                  overflow
                  placeholder={
                    <Skeleton
                      animation="wave"
                      variant="rectangular"
                      height={200}
                      sx={{
                        margin: "5px auto",
                        width: "90%"
                      }}
                    />
                  }
                >
                  <img src={url} alt="" className={classes.pictureResultImg} />
                </LazyLoad>}
            </div>
          )
        }
      }
    }
    if (mediaType === "y2b") {
      let dlURL: string = "/media/y2b/" + urls
      mediaShow.push(
        <Button
          type="primary"
          href={dlURL}
          target="_blank"
          rel="noreferrer"
          download
        >
          Download
        </Button>
      )
    }
    if (mediaType === "twitter") {
      mediaShow.push(
        <div key="twitter">
          <video className={classes.pictureResultVideo} src={urls} controls></video>
        </div>

      )
    }
  }
  return (
    <Container maxWidth="sm" sx={{ textAlign: "center" }}>
      <Box sx={{ position: "relative", top: 30 }}>
        <Box sx={{ maxWidth: 280, margin: "0 auto", position: "relative", left: 30 }}>
          <Grid container rowSpacing={1}>
            <Grid item xs={6}>
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={1}
              >
                <Badge variant="dot" color="success" />
                <Typography sx={{ fontSize: 10 }}>Available</Typography>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={1}
              >
                <Badge variant="dot" color="error" />
                <Typography sx={{ fontSize: 10 }}>Outage</Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>
        <Divider sx={{ padding: 2, fontSize: 10 }}>
          <Typography variant="subtitle2" color="primary">System Status</Typography>
        </Divider>
        <Box sx={{ maxWidth: 280, margin: "0 auto", position: "relative", left: 30 }}>
          <Grid container rowSpacing={1}>
            {mediaAlive.map((media: any, index: number) => {
              return <Grid item xs={6} key={"mediaStatus" + index}>
                <Stack
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                  spacing={1}
                >
                  <Badge variant="dot" color={media.status} />
                  <Typography sx={{ fontSize: 10 }}>{media.name.toUpperCase()}</Typography>
                </Stack>
              </Grid>
            })}
          </Grid>
        </Box>
      </Box>

      <Box sx={{ paddingTop: 6, paddingBottom: 2, textAlign: "center" }}>
        <TextField
          label="URL"
          type="search"
          variant="standard"
          placeholder="URL[?update]"
          onChange={(e) => MediaURLChange(e)}
          onKeyUp={onKeyUp}
          InputProps={{ endAdornment: <IconButton onClick={() => MeidaFetch("")}><SearchIcon /></IconButton> }}
        />
      </Box>

      <Box>
        {mediaShow}
      </Box>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={mediaLoading}
        onClick={loadingClose}
      >
        <CircularProgress color="primary" />
      </Backdrop>

    </Container >
  )
}
