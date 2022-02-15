import React from "react";
import { useState, useEffect, useRef } from "react";
import ReactPlayer from 'react-player/youtube';
import { Player } from 'video-react';
// import VideoPlayer from 'react-video-js-player';
import AppLayout from "../components/AppLayout";
// import "node_modules/video-react/dist/video-react.css";

const url1 = 'http://bbx-video.gtimg.com/daodm_0b53aqabaaaa34anaeylxjrn2bgdcacaaeca.f0.mp4?dis_k=b8bb5e864066b469fc2af0aed9ac81fa&dis_t=1644942290.mp4';
const url2 = 'https://www.youtube.com/watch?v=ysz5S6PUM-U';
const url3 = 'https://vod.pipi.cn/8f6897d9vodgzp1251246104/f4faff52387702293644152239/f0.mp4';
const url = url2;
const watch = props => {
  const player = useRef();
  const [title, setTitle] = useState('ZX LINK');
  const [link, setLink] = useState(url3);
  const handleVideoUpload = (event) => {
    const [file] = event.target.files;
    setVideoFilePath(URL.createObjectURL(file));
  };

  function play(){
    player.current.play();
  }
  function pause(){
    player.current.pause();
  }
  function seek(){
    player.current.play();
  }
  useEffect(()=>{

  },[])
  return (
    <AppLayout>
      <ReactPlayer
        // url={[url1,url3]}
        ref={player}
        url={[
          {src: url3 , type: 'video/mp4'},
          // {src: 'foo.ogg', type: 'video/ogg'}
        ]}
        height='400px'
        width='630px'
        controls
        light={true}
        onPlay={()=>{
          console.log('playing')
        }}
        onSeek={()=>{
          console.log('seked')
        }}
        config={{
          youtube: {
            playerVars: { showinfo: 1 }
          },
          file: {
            // forceVideo: true,
            attributes:{
              'controls':true
            }
          }
        }}
      />
    </AppLayout>
  );
};

export default watch;
