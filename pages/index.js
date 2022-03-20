import { re } from "mathjs";
import React from "react";

import AppLayout from "../layouts/layout2/AppLayout";

import { Layout, Menu, Breadcrumb, PageHeader } from 'antd';
const { Header, Content, Footer } = Layout;
import { Checkbox, Radio, Typography, Tooltip, Divider, Button, Row, Col, Tag, Dropdown, Avatar } from 'antd';

import Link from "next/link";

import { MoreOutlined } from '@ant-design/icons';
import { UserOutlined } from '@ant-design/icons';


import './style.less';
// import video from '../video/frontPage.mp4';
// const video = '../assets/video.mp4';

const MenuList = [
  {
      key:0,
      title:'Home',
      href:'/',
  },
  {
      key:1,
      title:'Cinema',
      href:'/room/0',
  },
  {
    key:1,
    title:'About',
    href:'/about',
},
]
const Menus=()=>{
  return(
      <Menu 
          className='menu'
          theme="dark" 
          mode="horizontal" 
          // selectedKeys={pageKeys}
      >
          {MenuList.map((item)=>(
              <Menu.Item
                  key={item.key}
                  className='menu_item'
              >
                  {/* <a href={item.href}>
                      {item.title}
                  </a> */}
                  <Link href={item.href}>
                      {item.title}
                  </Link>
              </Menu.Item>
          ))}
      </Menu>
  )
}

const DropdownMenu = () => (
  <Dropdown key="more" overlay={Menus} placement="bottomRight">
    <Button type="text" icon={<MoreOutlined style={{ fontSize: 20 , color:'white'}} />} />
  </Dropdown>
);
const index = props => {
  return (
    <AppLayout 
      showLogo={false}
      showCrumbs={false}
      showMenus={false}
      showFooter={false}
      showVideoBackground={true}
      videoBackgroundUrl='bgVideo_Home.mp4'
    >
      <PageHeader
        title="MovieKnight"
        className="site-page-header"
        extra={[
          <Tooltip placement="topLeft" title="Open Room, In Beta Version">
            <Button 
              key="1"
              type="ghost"
              style={{
                color:'white',
                border: '0px',
                opacity:0.5,
              }}
            >
              Open Room
            </Button>,

          </Tooltip>,
          <Avatar icon={<UserOutlined />}/>,
          <DropdownMenu key="more" />,
        ]}
      ></PageHeader>
      <div className='page_index'>
          <Typography.Title
            level={1}
            className='title'
            italic
            // style={{ margin: 0 }}
          >
            MovieKnight.Online
          </Typography.Title>
          <Typography.Paragraph
            level={2}
            className='title'
            italic
            // style={{ margin: 0 }}
          >
            Watch Media Together From Anywhere
          </Typography.Paragraph>
          <Button 
            className="cinemaButton"
            ghost 
            type="ghost" 
            shape="round" 
            size='large'
            href="/room/0"
          >
            Join The Open Cinema
          </Button>
      </div>
    <Footer  className='footer home_footer' style={{ textAlign: 'center', textJustify: 'center' }}>U-byte Devs and Admin368 ©2022</Footer>
    </AppLayout>
  );
};

export default index;
