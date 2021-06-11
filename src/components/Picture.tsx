import { useState } from 'react'
import './Picture.less'
import '../global.ts'

import { Input, Skeleton, Button } from 'antd'
import LazyLoad from 'react-lazyload'

import MDPR from '../static/img/mdpr.png'
import DESSART from '../static/img/dessart.png'
import AMEBLO from '../static/img/ameblo.png'
import LINEBLOG from '../static/img/lineblog.png'
import THETV from '../static/img/thetv.png'

const { Search } = Input

export default function Picture() {
  const logos: any = [
    { source: MDPR, alt: "mdpr" },
    { source: DESSART, alt: "dessart" },
    { source: AMEBLO, alt: "ameblo" },
    { source: LINEBLOG, alt: "lineblog" },
    { source: THETV, alt: "thetv" },
  ]
  let msgCode: any = new Map()
  msgCode["url"] = "URL ERROR / NO RESULT FOUND"

  const [mediaURL, setMediaURL] = useState<string>("")
  const [mediaData, setMediaData] = useState<any>([])
  const [mediaStatus, setMediaStatus] = useState<boolean>(false)
  const [searchLoading, setSearchLoading] = useState<boolean>(false)

  const MediaURLChange = (e: any) => {
    setMediaURL(e.target.value)
  }

  const MeidaFetch = () => {
    let mediaType: string = ""
    if (mediaURL === "") {
      window.Message(msgCode["url"])
      return false
    }

    var regex: any = /http(s)?:\/\/([\w-]+.)+[\w-]+(\/[\w- ./?%&=]*)?/
    if (!regex.test(mediaURL)) {
      window.Message(msgCode["url"])
      return false
    } else {
      if (mediaURL.indexOf("youtube.com") !== -1 || mediaURL.indexOf("youtu.be") !== -1) {
        mediaType = "/y2b"
      } else if (mediaURL.indexOf("twitter") !== -1) {
        mediaType = "/twitter"
      } else {
        mediaType = "/news"
      }
    }

    let mediaURLClear: string[] = mediaURL.split(" ")
    let mediaURLNew: string = mediaURLClear[mediaURLClear.length - 1]
    let requestURL: string = `${window.api}/api/v1/media${mediaType}?url=${encodeURIComponent(mediaURLNew)}`
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
              <video src={url} controls />
            </div>
          )
        } else {
          mediaShow.push(
            <div key={"img" + i}>
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
              </LazyLoad>
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

      <div className='picture-logos'>
        {logos.map((logo: any, index: number) => {
          return <div key={logo + index} >
            <img className="picture-logo" src={logo.source} alt={logo.alt}></img>
          </div>
        })}
      </div>

      <div className='picture-search'>
        <Search
          placeholder="URL"
          style={{ maxWidth: 230 }}
          loading={searchLoading}
          onChange={(e) => MediaURLChange(e)}
          onSearch={() => MeidaFetch()}
        />
      </div>

      <div className='picture-result'>
        {mediaShow}
      </div>

    </div >

  )
}
