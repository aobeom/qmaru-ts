import { useState, useEffect, useCallback } from 'react'
import './Drama.less'
import '../global.ts'

import { Space, Button, Statistic, Collapse } from 'antd'

const { Countdown } = Statistic
const { Panel } = Collapse

export default function Drama() {
  const buttonGroup: any = [
    { name: "TVBT", value: "tvbt" },
  ]

  const [dramaStatus, setDramaStatus] = useState<boolean>(false)
  const [dramaData, setDramaData] = useState<any>([])
  const [dramaLoading, setDramaLoading] = useState<string>("")
  const [updateTime, setUpdateTime] = useState<string>("2000-00-00 00:00:00")
  const [updateCounts, setUpdateCounts] = useState<number>(0)

  const DramaFetch = (value: string) => {
    setDramaLoading(value)
    setDramaData([])
    const requesURL: string = `${window.api}/api/v1/drama/${value}`
    fetch(requesURL, {
      method: 'GET',
    }).then(res => res.json())
      .then(data => {
        const status: number = data.status
        setDramaLoading("")
        if (status === 0) {
          const rawData: any = data.data
          setDramaStatus(true)
          setDramaData(rawData)
        } else {
          setDramaStatus(false)
          window.Message("No Data")
        }
      })
      .catch(
        () => {
          setDramaStatus(false)
          setDramaLoading("")
          window.Message("Server Error")
        }
      )
  }

  const DramaTime = useCallback(() => {
    const requesURL: string = `${window.api}/api/v1/drama/time`
    fetch(requesURL, {
      method: 'GET',
    }).then(res => res.json())
      .then(data => {
        let status: number = data.status
        if (status === 0) {
          let rawData: any = data.data
          let uTime: string = rawData.time
          let uCounts: number = rawData.second
          setUpdateTime(uTime)
          setUpdateCounts(Date.now() + uCounts * 1000)
        } else {
          setUpdateTime("2000-00-00 00:00:00")
          setUpdateCounts(0)
        }
      })
      .catch(
        () => {
          setUpdateTime("2000-00-00 00:00:00")
          setUpdateCounts(0)
        }
      )
    return () => { }
  }, [])

  const Eps = (props: any) => {
    const site: string = props.site
    const urls: any = props.eps
    if (site === "tvbt") {
      return (
        <div>
          {urls === null ? <Button>No Data</Button> : urls.map((ep: any) => {
            return <Button
              key={site + ep.ep}
              type="primary"
              href={ep.url}
              target="_blank"
              rel="noreferrer"
              download
              className="drama-eps"
            >
              {'EP' + ep.ep}
            </Button>
          })}
        </div>
      )
    } else {
      return <div></div>
    }
  }

  useEffect(() => {
    DramaTime()
  }, [DramaTime])

  let dramaShow: any = []
  if (dramaStatus) {
    const dSite: string = dramaData.name
    const dEntities: any = dramaData.entities
    for (let i in dEntities) {
      const dData: any = dEntities[i]
      const dUrls: any = dData.dlurls
      dramaShow.push(
        <Panel header={dData.title} key={dSite + i}>
          <Eps site={dSite} eps={dUrls} />
        </Panel>

      )
    }
  }

  return (
    <div>

      <div className='drama-countdown'>
        <Countdown
          title={updateTime}
          value={updateCounts}
        />
      </div>

      <div className='drama-button-group'>
        <Space size={0}>
          {buttonGroup.map((button: any, index: number) => {
            return <div key={"drama" + index}>
              <Button loading={dramaLoading === button.value} onClick={() => DramaFetch(button.value)}>{button.name}</Button>
            </div>
          })}
        </Space>
      </div>

      <div className='drama-content'>
        <Collapse accordion>
          {dramaShow}
        </Collapse>
      </div>
    </div >
  )
}
