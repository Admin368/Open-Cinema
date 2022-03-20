import { re } from "mathjs";
import React from "react";

import AppLayout from "../layouts/layout2/AppLayout";

import { Layout, Menu, Breadcrumb } from 'antd';
const { Header, Content, Footer } = Layout;

import './style.less';
// import video from '../video/frontPage.mp4';
// const video = '../assets/video.mp4';

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
    <div className='page_index'>Sample Page</div>
    <Footer  className='footer home_footer' style={{ textAlign: 'center', textJustify: 'center' }}>U-byte Devs and Admin368 ©2022</Footer>
    </AppLayout>
  );
};

export default index;
