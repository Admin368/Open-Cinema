// core
import React from "react";
import axios from "axios";
import {styles} from 'react';
import { useEffect, useState, useRef } from "react";
import ReactPlayer from 'react-player/youtube';
import {useRouter} from 'next/router';

import { 
  message,
  Space,
} from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

// antd
import { Typography, Divider, Button, Card } from "antd";
import { Input } from 'antd';
const { Search } = Input;

const { Title, Text } = Typography;
// components
import AppLayout from "../components/AppLayout";
import Player from "../components/Player";
import { T } from "antd/lib/upload/utils";

const url1 = 'http://bbx-video.gtimg.com/daodm_0b53aqabaaaa34anaeylxjrn2bgdcacaaeca.f0.mp4?dis_k=b8bb5e864066b469fc2af0aed9ac81fa&dis_t=1644942290.mp4';
const url2 = 'https://www.youtube.com/watch?v=ysz5S6PUM-U';
const url3 = 'https://vod.pipi.cn/8f6897d9vodgzp1251246104/f4faff52387702293644152239/f0.mp4';
const url = url2;

import './style.less';
//SOCKET
import io from 'Socket.IO-client';
const socket = io('http://localhost:3000');
// setInterval(() => {
//   socket.emit('client', 'Halla from Client');
// }, 3000);
// const socket_client = require("socket.io/client-dist/socket.io");
// import socket_client from "socket.io";
// const socket = socket_client.io('http://192.168.1.168:3000');

const userData_Default={

}

function App(){
  const player = useRef();
  const search = useRef();
  const [playerStatus, setPlayerStatus] = useState();
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [title, setTitle] = useState('ZX LINK');
  const [mediaUrl, setMediaLink] = useState('');
  const [roomId, setRoomId] = useState(0);
  const [isDebugging, setIsDebugging] = useState(true);
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  async function linkProcess(){
    if(searchValue!=''){
    setIsSearching(true);
    //console.log('setting up Link'+searchValue);
    message.info('Checking Link');
      const result = await axios
        .get('./api/getLink?link='+searchValue)
        .then(async(res)=> {
            //console.log(`statusCode: ${res.status}`)
            //console.log(res.data)
            if(res.data.videoUrl!=null){
                message.success('Successfully Got Link');
                await setMediaLink(res.data.videoUrl);
                player_play();
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

  function player_play(){
    player.current.play();
  }
  function player_pause(){
    player.current.pause();
  }
  function player_seek(target){
    
  }
  const DebuggerDiv=()=>{
    return (
        <div style={{
          position:'fixed',
          zIndex:1000,
          border: '1px solid grey',
          padding:'10px',
        }}>
            {/* <span>roomId: {roomId}</span><br/>
            <span>Path:- {router.path}</span><br/>
            <span>asPath:- {router.asPath}</span><br/> */}
        </div>
    )
  }
  const socket_sendRoomData=({
    // room=roomId,
    topic=null,
    action=null,
    msg=null,
    time=null,
    test='test',
    mediaUrl:mediaUrl,
  })=>{
    var parcel = {
      ...arguments[0],
      isAdmin:isAdmin,
      roomId:roomId,   
      socketId:socket.id,
    }
    
    //console.log(parcel);
    socket.emit('room_'+roomId, parcel);
  }
  useEffect(()=>{
    //GET ROOOM
    const {room} = router.query;
    setMediaLink(url1);
    //console.log('room:'+room);
    router.push({
      pathname: '/',
      search: '?room=0'
    });

    // //ON TIME UPDATE
    // player.current.addEventListener('timeupdate', (event) => {
    //     // console.log(player);
    // });

    // //ON READY
    // player.current.addEventListener('loadedmetadata', (event) => {
    //   const msg = 'Video Found';
    //   const parcel = {
    //     topic:'event_player',
    //     action:'ready',
    //     msg: msg,
    //   }
    //   message.success(msg);
    //   socket_sendRoomData(parcel);
    // });
    //ON PLAY
    // player.current.addEventListener('play', (event) => {
    //   event.preventDefault();
    //   player_seek(event.target);
    //   const currentTime =  event.target.currentTime;
    //   //console.log('playing from '+currentTime);

    //   const msg = 'Player Playing';
    //   const time = currentTime;
    //   const parcel = {
    //     topic:'event_player',
    //     action:'play',
    //     msg,
    //     time,
    //   }
    //   message.success(msg);
    //   socket_sendRoomData(parcel);
    // }, false);
    //ON PAUSE
    // player.current.addEventListener('pause', (event) => {
    //   event.preventDefault();
    //   player_seek(event.target);
    //   const currentTime =  event.target.currentTime;
    //   console.log('paused at '+currentTime);

    //   const msg = 'Player Paused';
    //   const parcel = {
    //     topic:'event_player',
    //     action:'pause',
    //     msg: msg,
    //   }
    //   message.success(msg);
    //   socket_sendRoomData(parcel);
    // }, false);
    
    // //ON SEEKED
    // player.current.addEventListener('seeked', (event) => {
    //   const currentTime =  event.target.currentTime;
    //   //console.log('seeked to '+currentTime);
    // });

    // //ON SEEKING
    // player.current.addEventListener('seeking', (event) => {
    //   // const currentTime =  event.target.currentTime;
    //   // console.log('seeking to '+currentTime);
    // });

    // //ON SEEKED
    // player.current.addEventListener('seeked', (event) => {
    //   const currentTime =  event.target.currentTime;
    //   //console.log('seeked to '+currentTime);
    // });

    // //ON BUFFER
    // player.current.addEventListener('seeking', (event) => {
    //   const currentTime =  event.target.currentTime;
    //   //console.log('seeked to '+currentTime);
    // });

    // //ON ERROR
    // player.current.addEventListener('error', (event) => {
    //   message.error('Error Bad/No Link');

    // });
    
  },[])
  socket.on('room_'+roomId,(msg)=>{
    //console.log(`ROOM[${room}]`);
    // console.log(msg);
  });
  return(
    <AppLayout>
      {isDebugging==true?<DebuggerDiv></DebuggerDiv>:null}
      {/* <DebuggerDiv></DebuggerDiv> */}
      <div>Welcome</div>
      <Title>Watch ZX Together</Title>
      <Button 
        type="primary"
        icon={<DownloadOutlined />}
        size='large' 
        onClick={()=>{
          //console.log('clicked');
          player_play();
          player.current.webkitEnterFullScreen();
        }}
      />
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
      {/* <div className="tx">test</div> */}
      <video
        ref={player}
        src={mediaUrl}
        height='400px'
        width='640'
        id="player"
        // controls
      />  
      <Divider />
    </AppLayout>
  );
}


export default App;
