import React, { useState, useEffect } from "react";
import { Layout, Menu, Breadcrumb } from 'antd';
import { render } from 'less';

import Link from "next/link";
import { useRouter } from "next/router";
import { Scrollbars } from 'react-custom-scrollbars';

const { Header, Content, Footer } = Layout;
import './style.less';
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
    // {
    //     key:2,
    //     title:'Sample',
    //     href:'/sample',
    // },
    // {
    //     key:3,
    //     title:'Sample2',
    //     href:'/sample/sample2',
    // },
]
const crumbsDefault =[
    {
        key:0,
        title:'Home',
        href:'/',
    }
]
const AppLayout = props => {
    const router = useRouter();
    const [crumbs, setCrumbs] = useState(crumbsDefault);
    const [pageKeys, setPageKeys] = useState([]);
    useEffect(()=>{
        const urlPath = router.pathname;
        const crumbs = [
            {
                key:0,
                title:'Home',
                href:'/',
            }
        ];
        const splitUrls = urlPath.split('/');
        delete splitUrls[0];
        splitUrls.map((item,index)=>{
            const newItem = {
                key:index,
                title:item,
                href:``,
            }
            crumbs.push(newItem);
        })
        crumbs.map((item,index)=>{
            var href ='/';
            for(var i=1;i<index+1;i++){
                href = '/'+crumbs[i].title;
            }
            crumbs[index].href=href;
        });

        // if()
        const pageKeys_ = MenuList.filter((item) => item.href===urlPath);
        var pageKeys_new = [];
        pageKeys_.map((item)=>{
           pageKeys_new.push(`${item.key}`);
        });
        // console.log(pageKeys_new);
        setPageKeys(pageKeys_new);
        setCrumbs(crumbs);


    },[]);
    const Logo=()=>{
        return(
            <Link href={'/'}>
                <div
                    className="logo"
                    style={{
                        // height: 64,
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        // color: "white"
                        // whiteSpace: "nowrap",
                        // overflow:'hidden'
                    }}
                >
                        MovieKnight.Online
                </div>
            </Link>

        )
    }
    return(
        <Layout className="layout">
            <Header
                className='header'
            >
                <Logo/>
                <Menu 
                    className='menu'
                    theme="dark" 
                    mode="horizontal" 
                    selectedKeys={pageKeys}
                >
                    {MenuList.map((item)=>(
                        <Menu.Item key={item.key}>
                            {/* <a href={item.href}>
                                {item.title}
                            </a> */}
                            <Link href={item.href}>
                                {item.title}
                            </Link>
                        </Menu.Item>
                    ))}
                </Menu>
            </Header>
            <Content 
                className='content'
                style={{ padding: '0 50px' }}
            >
            <Breadcrumb className='breadcrumb' style={{ margin: '16px 0' }}>
                {crumbs.map((item)=>
                    <Breadcrumb.Item key={item.key} href={item.href} className='breadcrumb_item'>{item.title}</Breadcrumb.Item>
                )}
            </Breadcrumb>
            <Scrollbars 
                 universal={true}
      
            >
            {props.children}

            </Scrollbars>
            </Content>
            <Footer   className='footer' style={{ textAlign: 'center', textJustify: 'center' }}>U-byte Devs and Admin368 ©2022</Footer>
        </Layout>
    )
}
export default AppLayout;