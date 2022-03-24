import { useState, useEffect } from 'react'
import { BrowserRouter, Navigate, Routes, Route, Link } from 'react-router-dom'
import './App.less'

import { Layout, Menu } from 'antd'

import Picture from './components/Picture'
import Drama from './components/Drama'
import Stchannel from './components/Stchannel'

import PicIcon from '@ant-design/icons/PictureFilled'
import DramaIcon from '@ant-design/icons/VideoCameraFilled'
import STIcon from '@ant-design/icons/YoutubeFilled'

const { Header, Footer, Content } = Layout
const version: string = "20220324"

export default function App() {
  const [title, setTitle] = useState<string>("Picture")
  const [tabSelect, setTabSlect] = useState<string[]>(["/picture"])

  const menus: any = [
    { link: "/picture", icon: <PicIcon style={{ fontSize: "150%" }} /> },
    { link: "/stchannel", icon: <STIcon style={{ fontSize: "150%" }} /> },
    { link: "/drama", icon: <DramaIcon style={{ fontSize: "150%" }} /> },
  ]
  type Router = { path: string; Component: () => JSX.Element }
  const routers: Router[] = [
    { path: "/", Component: () => <Navigate to="/picture" /> },
    { path: "/picture", Component: Picture },
    { path: "/stchannel", Component: Stchannel },
    { path: "/drama", Component: Drama },
  ]

  const menuClick = (e: any) => {
    const key: string = e.key
    const title: string = key.replace("/", "").toUpperCase()
    setTabSlect([key])
    setTitle(title)
  }

  useEffect(() => {
    const pathname: string = window.location.pathname
    const title: string = pathname.replace("/", "").toUpperCase()
    setTabSlect([pathname])
    setTitle(title)
  }, [])

  return (
    <BrowserRouter>
      <Layout className='app-wrapper'>
        <Header className='app-header'>
          <div className='app-header-details'>
            <p>Qmaru - {version} / {title}</p>
          </div>

        </Header>

        <Content className='app-content'>
          <Routes>
            {routers.map(({ path, Component }) => (
              <Route
                key={path}
                path={path}
                element={<Component />}
              >
              </Route>
            ))}
          </Routes>
        </Content>

        <Footer className='app-footer'>
          <Menu
            theme="light"
            className='app-footer-menu'
            mode="horizontal"
            selectedKeys={tabSelect}
            onSelect={(e) => menuClick(e)}
          >
            {menus.map((menu: any) => {
              return <Menu.Item key={menu.link}>
                <Link to={menu.link} className='app-footer-menu-item'>
                  {menu.icon}
                </Link>
              </Menu.Item>
            })}
          </Menu>
        </Footer>
      </Layout>
    </BrowserRouter>
  )
}
