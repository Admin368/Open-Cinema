// core
import React from "react";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import ReactPlayer from 'react-player/youtube';

import { message, Space } from 'antd';

// antd
import { Typography, Divider, Button, Card } from "antd";
import { Input } from 'antd';
const { Search } = Input;

const { Title, Text } = Typography;
// components
import AppLayout from "../components/AppLayout";
import { T } from "antd/lib/upload/utils";

const url1 = 'http://bbx-video.gtimg.com/daodm_0b53aqabaaaa34anaeylxjrn2bgdcacaaeca.f0.mp4?dis_k=b8bb5e864066b469fc2af0aed9ac81fa&dis_t=1644942290.mp4';
const url2 = 'https://www.youtube.com/watch?v=ysz5S6PUM-U';
const url3 = 'https://vod.pipi.cn/8f6897d9vodgzp1251246104/f4faff52387702293644152239/f0.mp4';
const url = url2;

function App(){
  const player = useRef();
  const search = useRef();
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [title, setTitle] = useState('ZX LINK');
  const [link, setLink] = useState('');

  async function linkProcess(){
    if(searchValue!=''){
    setIsSearching(true);
    console.log('setting up Link'+searchValue);
    message.info('Checking Link');
      const result = await axios
        .get('./api/getLink?link='+searchValue)
        .then(async(res)=> {
            console.log(`statusCode: ${res.status}`)
            console.log(res.data)
            if(res.data.videoUrl!=null){
                message.success('Successfully Got Link');
                await setLink(res.data.videoUrl);
                play();
            }else{
              message.error('Failed to get Link, check Link Correctly');

            }
        })
        .catch(error => {
            console.error(error)
        })
      // console.log(result);
      // 
    setIsSearching(false);
    }else{
      message.error('Please Enter Link')
    }
  }

  function play(){
    player.current.play();
  }
  function pause(){
    player.current.pause();
  }
  function seek(target){
    
  }

  useEffect(()=>{
    //ON READY
    player.current.addEventListener('loadedmetadata', (event) => {
      message.success('Video Found');
    });

    //ON PAUSE
    player.current.addEventListener('pause', (event) => {
      seek(event.target);
      const currentTime =  event.target.currentTime;
      console.log('seeked to '+currentTime);
    });
    
    //ON SEEKED
    player.current.addEventListener('seeked', (event) => {
      const currentTime =  event.target.currentTime;
      console.log('seeked to '+currentTime);
    });

    //ON SEEKING
    player.current.addEventListener('seeking', (event) => {
      // const currentTime =  event.target.currentTime;
      // console.log('seeking to '+currentTime);
    });

    //ON SEEKED
    player.current.addEventListener('seeked', (event) => {
      const currentTime =  event.target.currentTime;
      console.log('seeked to '+currentTime);
    });

    //ON BUFFER
    player.current.addEventListener('seeking', (event) => {
      const currentTime =  event.target.currentTime;
      console.log('seeked to '+currentTime);
    });

    //ON ERROR
    player.current.addEventListener('error', (event) => {
      message.error('Error Bad/No Link');

    });
    
  },[])
  return(
    <AppLayout>
      <div>Welcome</div>
      <Title>Watch ZX Together</Title>
      <Search 
        ref={search}
        placeholder="Enter A zxzj Link here Below"
        // value={searchValue}
        onChange={()=>{
          // console.log(search);
          setSearchValue(search.current.input.input.value);
        }}
        enterButton="Search" 
        size="large" 
        loading={isSearching} 
        onPressEnter={linkProcess}
        onSearch={linkProcess}
      />
      <video
        ref={player}
        src={link}
        height='400px'
        width='640'
        controls
      />  
      <Divider />
    </AppLayout>
  );
}

export default App;
