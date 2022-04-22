import { useState, useEffect, useCallback } from 'react'

import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

import LazyLoad from 'react-lazyload'

import '../global.ts'

export default function STChannel() {
  const [stData, setStData] = useState<any>([])
  const [stStatus, setStStatus] = useState<boolean>(false)
  const [stLoading, setStLoading] = useState(true)
  const [updateTime, setUpdateTime] = useState<string>("2000-00-00 00:00:00")

  const STLoading = () => {
    return (
      <Box>
        <Skeleton animation="pulse" variant="rectangular" height={200} />
        <Skeleton animation="pulse" />
        <Skeleton animation="pulse" width="60%" />
      </Box>
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
        <Box key={"st" + i} sx={{ wordBreak: "break-all", padding: 1 }}>
          <LazyLoad
            height={200}
            offset={[-200, 0]}
            debounce={500}
            once
            overflow
            placeholder={<STLoading />}
          >
            <Card>
              <CardMedia
                component="img"
                image={purl}
                alt={title}
              />
              <CardContent>
                <Typography variant="subtitle2">
                  {date}
                </Typography>
                <Typography variant="subtitle1" sx={{ textAlign: "left" }}>
                  {title}
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <Button
                  size="small"
                  color="primary"
                  href={path}
                  target="_blank"
                  rel="noreferrer"
                  download
                >
                  view
                </Button>
              </CardActions>
            </Card>
          </LazyLoad>
        </Box>

      )
    }
  }
  return (
    <Container maxWidth="sm" sx={{ textAlign: "center" }}>
      <Box sx={{ position: "relative", top: 30 }}>
        <Chip
          color="primary"
          label={updateTime}
          icon={<AccessTimeIcon />}
        />
      </Box>

      <Box sx={{ paddingTop: 6, maxWidth: 600 }}>
        {stLoading ? <STLoading /> : <Box>{stShow}</Box>}
      </Box>
    </Container>
  )
}
