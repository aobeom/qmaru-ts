import { useState, useMemo, useEffect } from 'react'

import { createTheme, ThemeProvider } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto'
import YouTubeIcon from '@mui/icons-material/YouTube'
import red from '@mui/material/colors/red'
import blue from '@mui/material/colors/blue'
import purple from '@mui/material/colors/purple'
import green from '@mui/material/colors/green'

import Picture from './components/Picture'
import Stchannel from './components/Stchannel'
import NotFound from './components/NotFound'

import { BrowserRouter, Navigate, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom"
import { SnackbarProvider } from 'notistack'

import './global.ts'

function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  // 设置导航下标
  const [selectNav, setSelectNav] = useState('picture')
  const navChange = (event: React.SyntheticEvent, newNav: string) => {
    if (selectNav !== newNav) {
      event.preventDefault()
      navigate(`/${newNav}`, { replace: true })
      setSelectNav(newNav)
    }
  }

  useEffect(() => {
    const currentNav: string = location.pathname.substring(1)
    if (currentNav !== selectNav) {
      setSelectNav(currentNav)
    }
  }, [location.pathname, selectNav])

  return (
    <BottomNavigation value={selectNav} onChange={navChange}>
      <BottomNavigationAction
        component={Link}
        to="/picture"
        value="picture"
        icon={<InsertPhotoIcon />}
      />
      <BottomNavigationAction
        component={Link}
        to="/stchannel"
        value="stchannel"
        icon={<YouTubeIcon />}
      />
    </BottomNavigation>
  )
}

function App() {
  // 配置主题
  const prefersDarkMode: boolean = useMediaQuery('(prefers-color-scheme: dark)')
  var GlobalTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          primary: {
            main: prefersDarkMode ? purple[800] : purple[600],
            contrastText: "#fff"
          },
          secondary: {
            main: prefersDarkMode ? purple[600] : purple[400],
            contrastText: "#fff"
          },
          success: {
            main: prefersDarkMode ? green[800] : green[500],
          },
          info: {
            main: prefersDarkMode ? blue[800] : blue[500],
          },
          error: {
            main: prefersDarkMode ? red[800] : red[500],
          },
          contrastThreshold: 3,
          tonalOffset: 0.2,
        }
      }),
    [prefersDarkMode],
  )

  return (
    <ThemeProvider theme={GlobalTheme}>
      <SnackbarProvider maxSnack={3} dense>
        <BrowserRouter>
          <Container
            key={"App-Wrapper"}
            maxWidth={false}
            disableGutters
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "100vh"
            }}>

            <Container
              key={"App-Header"}
              maxWidth={false}
              disableGutters
              sx={{ width: "100%" }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                  <Container maxWidth="xl">
                    <Toolbar disableGutters>
                      <Typography variant="button" sx={{ paddingRight: 1 }}>qmeta</Typography>
                      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>v{window.dateVer}</Typography>
                      <Typography variant="subtitle2">{window.commitVer}</Typography>
                    </Toolbar>
                  </Container>
                </AppBar>
              </Box>
            </Container>

            <Container
              key={"App-Main"}
              maxWidth={false}
              disableGutters
              sx={{
                flex: 1,
                width: "100%",
                overflow: "auto",
              }}>
              <Routes>
                <Route path="/" element={<Navigate to="/picture" replace />} />
                <Route path="/picture" element={<Picture />} />
                <Route path="/stchannel" element={<Stchannel />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Container>

            <Container
              key={"App-Footer"}
              maxWidth={false}
              disableGutters
              sx={{
                width: "100%",
                textAlign: "center",
                paddingBottom: "env(safe-area-inset-bottom)"
              }}
            >
              <Navigation />
            </Container>
          </Container>
        </BrowserRouter >
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default App
