import moment from 'moment'
import './Radiko.less'

import { Input, DatePicker, Select, Button, Image, Badge, Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

import radikoLogo from '../static/img/radiko.png'
import { useState } from 'react'

const { Option } = Select
const { RangePicker } = DatePicker

export default function Radiko() {
  const [radikoStart, setRadikoStart] = useState<string>("")
  const [radikoEnd, setRadikoEnd] = useState<string>("")
  const [radikoStation, setRadikoStation] = useState<string>("")
  const [radikoData, setRadikoData] = useState<any>([])
  const [radikoStatus, setRadikoStatus] = useState<boolean>(false)
  const [radikoLoading, setRadikoLoading] = useState<boolean>(false)

  const stationList: any = [
    { 'id': 'TBS', 'name': 'TBSラジオ', 'area_id': 'JP13' },
    { 'id': 'QRR', 'name': '文化放送', 'area_id': 'JP13' },
    { 'id': 'LFR', 'name': 'ニッポン放送', 'area_id': 'JP13' },
    { 'id': 'INT', 'name': 'InterFM897', 'area_id': 'JP13' },
    { 'id': 'FMT', 'name': 'TOKYO FM', 'area_id': 'JP13' },
    { 'id': 'FMJ', 'name': 'J-WAVE', 'area_id': 'JP13' },
    { 'id': 'JORF', 'name': 'ラジオ日本', 'area_id': 'JP13' },
    { 'id': 'JOAK', 'name': 'NHKラジオ第1（東京）', 'area_id': 'JP13' },
    { 'id': 'RN1', 'name': 'ラジオNIKKEI第1 ', 'area_id': 'JP13' },
    { 'id': 'RN2', 'name': 'ラジオNIKKEI第2', 'area_id': 'JP13' },
    { 'id': 'JOAB', 'name': 'NHKラジオ第2', 'area_id': 'JP13' },
    { 'id': 'JOAK-FM', 'name': 'NHK-FM（東京）', 'area_id': 'JP13' }
  ]

  const RadikoDateChange = (e: any) => {
    const startDate: moment.Moment = e[0]
    const endDate: moment.Moment = e[1]
    setRadikoStart(startDate.format("YYYYMMDDhhmm00"))
    setRadikoEnd(endDate.format("YYYYMMDDhhmm00"))
  }

  const RadikoStationChange = (e: any) => {
    setRadikoStation(e)
  }

  const RadioFetch = () => {
    if (radikoStart === "" || radikoEnd === "") {
      window.Message("No Date")
      return false
    }
    if (radikoStation === "") {
      window.Message("No Station")
      return false
    }

    const radioBody: any = {
      "station": radikoStation,
      "start_at": radikoStart,
      "end_at": radikoEnd
    }
    const requestURL: string = `${window.api}/api/v1/radiko`
    setRadikoLoading(true)
    fetch(requestURL, {
      method: 'POST',
      body: JSON.stringify(radioBody),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    }).then(res => res.json())
      .then(data => {
        setRadikoLoading(false)
        const status: number = data.status
        if (status === 0) {
          const rawData: any = data.data
          const rEntities: any = rawData.entities
          setRadikoData(rEntities)
          setRadikoStatus(true)
        } else {
          const msg: string = data.message
          setRadikoStatus(false)
          setRadikoData([])
          window.Message(msg)
        }
      })
      .catch(
        () => {
          setRadikoLoading(false)
          setRadikoStatus(false)
          setRadikoData([])
          window.Message("No Data")
        }
      )
  }

  let radikoShow: any = []
  if (radikoStatus) {
    radikoShow.push(
      <Button
        type="primary"
        href={radikoData.url}
        target="_blank"
        rel="noreferrer"
        download
      >
        Download
      </Button>
    )
  }

  return (
    <div>
      <div className='radiko-logo'>
        <Button type="link" target="_blank" href="https://radiko.jp">
          <Badge count="Tokyo" style={{ background: "none", boxShadow: "none", color: "#00a7e9" }}>
            <Image src={radikoLogo} preview={false} />
          </Badge>
        </Button>
      </div>

      <div className='radiko-content'>
        <Space direction="vertical" size={12}>
          <RangePicker
            className="radiko-date"
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            onChange={(e) => RadikoDateChange(e)}
          />

          <Input.Group compact>
            <Select className="radiko-station" onChange={(e) => RadikoStationChange(e)}>
              {stationList.map((station: any) => {
                return <Option key={station.id} value={station.id}>{station.name}</Option>
              })}
            </Select>
            <Button loading={radikoLoading} onClick={() => RadioFetch()} icon={<SearchOutlined />} />
          </Input.Group>
        </Space>
        <div className="radiko-result">
          {radikoShow}
        </div>
      </div>

    </div >
  )
}
