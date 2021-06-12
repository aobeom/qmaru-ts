import { useState, useEffect, useCallback } from 'react'
import './STchannel.less'
import '../global.ts'

import { Statistic, Skeleton, Card, Space, Button } from 'antd'
import LazyLoad from 'react-lazyload'

const { Meta } = Card

export default function Stchannel() {
  const [stData, setStData] = useState<any>([])
  const [stStatus, setStStatus] = useState<boolean>(false)
  const [stLoading, setStLoading] = useState(true)
  const [updateTime, setUpdateTime] = useState<string>("2000-00-00 00:00:00")

  const STLoading = () => {
    return (
      <Card
        style={{ width: 200, maxWidth: 600, marginTop: 16, margin: "0 auto" }}
      >
        <Skeleton active>
          <Meta
            title="Card title"
            description="This is the description"
          />
        </Skeleton>
      </Card>
    )
  }

  const STFetch = useCallback(() => {
    const requestURL: string = `${window.api}/api/v1/stchannel`
    fetch(requestURL, {
      method: 'GET',
    }).then(res => res.json())
      .then(data => {
        setStLoading(false)
        const status: number = data.status
        if (status === 0) {
          const rawData: any = data.data
          const uTime: string = rawData.time
          const resData: any = rawData.entities
          setStData(resData)
          setStStatus(true)
          setUpdateTime(uTime)
        } else {
          setStStatus(true)
          setUpdateTime("No Data")
        }
      })
      .catch(
        () => {
          setStStatus(true)
          setUpdateTime("No Data")
        }
      )
  }, [])

  useEffect(() => {
    STFetch()
  }, [STFetch])

  let stShow: any = []
  if (stStatus) {
    for (let i in stData) {
      const data: any = stData[i]
      const date: string = data.date
      const title: string = data.title
      const purl: string = data.purl
      const path: string = data.path
      stShow.push(
        <div key={"st" + i} className='st-content-card'>
          <LazyLoad
            height={200}
            offset={[-200, 0]}
            once
            scrollContainer=".app-content"
            placeholder={<STLoading />}
          >
            <Card
              cover={<img src={purl} alt={i} />}
              actions={[
                <Button
                  type="primary"
                  href={path}
                  target="_blank"
                  rel="noreferrer"
                  download
                >
                  OPEN
                </Button>
              ]}
            >
              <Meta title={date} description={title} />
            </Card>
          </LazyLoad>
        </div>

      )
    }
  }
  return (
    <div>
      <div className='st-countdown'>
        <Statistic
          title="UPDATE"
          value={updateTime}
          valueStyle={{ fontSize: 18 }}
        />
      </div>

      <div className='st-content'>
        {stLoading ?
          <STLoading /> :
          <Space direction="vertical" size={15}>{stShow}</Space>
        }
      </div>
    </div>
  )
}
