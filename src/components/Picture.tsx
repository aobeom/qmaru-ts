import { useState, useCallback, useEffect } from 'react'
import './Picture.less'
import '../global.ts'

import { Row, Col, Badge, Input, Skeleton, Button } from 'antd'
import LazyLoad from 'react-lazyload'

const { Search } = Input

export default function Picture() {
  const [mediaAlive, setMediaAlive] = useState<any>([{ "name": "ServerError", "status": "0" }])
  const [mediaURL, setMediaURL] = useState<string>("")
  const [mediaData, setMediaData] = useState<any>([])
  const [mediaStatus, setMediaStatus] = useState<boolean>(false)
  const [searchLoading, setSearchLoading] = useState<boolean>(false)
  const [isIG, setIsIG] = useState<boolean>(false)

  const MediaURLChange = (e: any) => {
    setMediaURL(e.target.value)
  }

  const PicStatus = useCallback(() => {
    const requesURL: string = `${window.api}/api/v1/media/status`
    fetch(requesURL, {
      method: 'GET',
    }).then(res => res.json())
      .then(data => {
        let status: number = data.status
        if (status === 0) {
          let rawData: any = data.data
          setMediaAlive(rawData)
        }
      })
      .catch(
        () => { }
      )
    return () => { }
  }, [])

  useEffect(() => {
    PicStatus()
  }, [PicStatus])

  const MeidaFetch = (shareURL: string) => {
    setMediaData([])
    let fetchURL: string = mediaURL
    if (shareURL !== "") {
      fetchURL = shareURL
    }

    let mediaType: string = ""
    if (fetchURL === "") {
      window.Message("URL ERROR / NO RESULT FOUND")
      return false
    }

    var regex: any = /http(s)?:\/\/([\w-]+.)+[\w-]+(\/[\w- ./?%&=]*)?/
    if (!regex.test(fetchURL)) {
      window.Message("URL ERROR / NO RESULT FOUND")
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
    setSearchLoading(true)

    fetch(
      requestURL, {
      method: 'GET',
    }).then(res => res.json())
      .then(data => {
        let status: number = data.status
        setSearchLoading(false)
        if (status === 0) {
          const resData: any = data.data
          setMediaData(resData)
          setMediaStatus(true)
        } else {
          const msg: string = data.message
          window.Message(msg)
          setMediaStatus(false)
        }
      })
      .catch(
        () => {
          setSearchLoading(false)
          setMediaStatus(false)
          window.Message("Server Error")
        }
      )
  }

  const ShareDataFilter = (text: string) => {
    return text.replace(/\r\n/g, "").replace(/\n/g, "")
  }

  window.addEventListener('DOMContentLoaded', () => {
    const url: any = new URL(window.location.toString());
    const sharedTitle: string = url.searchParams.get('title');
    const sharedText: string = url.searchParams.get('text');
    const sharedUrl: string = url.searchParams.get('url');

    var regex: any = /http(s)?:\/\/([\w-]+.)+[\w-]+(\/[\w- ./?%&=]*)?/
    if (regex.test(sharedTitle)) {
      MeidaFetch(ShareDataFilter(sharedTitle))
    } else if (regex.test(sharedText)) {
      MeidaFetch(ShareDataFilter(sharedText))
    } else if (regex.test(sharedUrl)) {
      MeidaFetch(ShareDataFilter(sharedUrl))
    }
  })

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
              {isIG ? <div className='picture-result-ig'>
                <Button
                  type="primary"
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  download
                >
                  IG Can Not Preview {Number(i) + 1}
                </Button>
              </div>
                :
                <video src={url} controls />}
            </div>
          )
        } else {
          mediaShow.push(
            <div key={"img" + i}>
              {isIG ? <div className='picture-result-ig'>
                <Button
                  type="primary"
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  download
                >
                  IG Can Not Preview {Number(i) + 1}
                </Button>
              </div>
                :
                <LazyLoad
                  height={200}
                  offset={[-200, 0]}
                  once
                  scrollContainer=".app-content"
                  placeholder={
                    <Skeleton.Button
                      active
                      style={{ width: "60vw", height: "40vw", margin: "5px auto" }}
                    />
                  }
                >
                  <img src={url} alt="" className='picture-result-img' />
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
          <video className="picture-result-video" src={urls} controls></video>
        </div>

      )
    }
  }

  return (
    <div>

      <div className='picture-top'>
        <Row justify="start">
          {mediaAlive.map((media: any, index: number) => {
            return <Col key={"media" + index} className="picture-status">
              <Badge status={media.status === "1" ? 'success' : 'error'} text={media.name} />
            </Col>
          })}
        </Row>
      </div>

      <div className='picture-search'>
        <Search
          placeholder="URL"
          style={{ maxWidth: 230 }}
          loading={searchLoading}
          onChange={(e) => MediaURLChange(e)}
          onSearch={() => MeidaFetch("")}
        />
      </div>

      <div className='picture-result'>
        {mediaShow}
      </div>

    </div >

  )
}
