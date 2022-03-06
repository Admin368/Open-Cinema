import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { render } from "less";
const url1 = 'http://bbx-video.gtimg.com/daodm_0b53aqabaaaa34anaeylxjrn2bgdcacaaeca.f0.mp4?dis_k=b8bb5e864066b469fc2af0aed9ac81fa&dis_t=1644942290.mp4';

import './Player.less';
// import fullscreen from "video-react/lib/utils/fullscreen";
//DEBUGGER
function debug(msg){
    // console.log(`${debug.caller.name}()=>${msg}`);
    console.log(`()=>${msg}`);
}
const Player=(props)=> {
    const [videoUrl, setVideoUrl] = useState(); 
    const [videoIsFullScreen, setVideoIsFullScreen] = useState(false);
    const video = useRef();
    const video_container = useRef();
    const controls_play = useRef();
    const controls_fullScreen = useRef();

    function controls_fullScreen_event_handle(){
        console.log('changed');
    }
    //FULLSCREEN-EVENT-HANDLE
    function fullscreen_event_handle(fullscreenState){
        debug(`FullScreenState: ${fullscreenState}`);
        switch(fullscreenState){
            case true:
                setVideoIsFullScreen(true);
                break;
            case false:
                setVideoIsFullScreen(false);
                break;
            default:
                debug('No fullScreen Event');
                break
        }
    }
    //FULLSCREEN-ACTION-REQUEST
    function fullScreen_action_request(){
        try{
            // document.requestFullscreen()
            if (video_container.current.webkitRequestFullscreen) {
                // Need this to support Safari
                video_container.current.webkitRequestFullscreen();
            } else {
                video_container.current.requestFullscreen();
            }
        }catch{
            debug('FAILED TO FULLSCREEN REQUEST');
        }
    }
    //FULLSCREEN-ACTION-EXIT
    function fullScreen_action_exit(){
        try{
            document.exitFullscreen();
        }catch{
            debug('FAILED TO FULLSCREEN EXIT');
        }
    }
    //FULLSCREEN-ACTION-TOGGLE
    function fullScreen_action_toggle(){
        try{
            if (document.fullscreenElement) {
                fullScreen_action_exit();
            } else {
                fullScreen_action_request();
            }
        }catch{
            debug('FAILED TO FULLSCREEN TOGGLE');
        } 
    }

    useEffect(()=>{
//FULLSCREEN-START////////////////////////////////////////////////////////////
    //FULLSCREEN-BUTTON
        controls_fullScreen.current.addEventListener('click',()=>{
            fullScreen_action_toggle();
        });
        //FULLSCRREEN-EVENT
        document.addEventListener("fullscreenchange", function () {
            // fullscreen_event_handle(document.fullscreen);
            fullscreen_event_handle(document.fullscreenEnabled);
        }, false);
        document.addEventListener("mozfullscreenchange", function () {
            fullscreen_event_handle(document.mozFullScreen);
        }, false);
        document.addEventListener("webkitfullscreenchange", function () {
            fullscreen_event_handle(document.webkitIsFullScreen);
        }, false);
//FULLSCREEN-START////////////////////////////////////////////////////////////
    },[]);

    //MEDIAURL-EVENT-CHANGE
    useEffect(()=>{
        const mediaUrl = props.mediaUrl;
        console.log('New mediaUrl:'+mediaUrl);
        if(mediaUrl){
            setVideoUrl(mediaUrl);
        }
    },[props.mediaUrl]);
    return(
        <div
            ref={video_container}
            className="video_container"
        >
            <div
                className="video_controls"
            >
                <button ref={controls_play}>play</button>
                <button 
                    ref={controls_fullScreen}
                    onChange={controls_fullScreen_event_handle}
                >fullsceen</button>
            </div>
            <video
                ref={video}
                className='video'
                style={{
                    width:'100%',
                    background:'grey',
                }}
                width={640}
                // height={video.current.offsetHeight}
                src={videoUrl}
                controls={false}
                autoPlay
                muted
            >
            </video>
        </div>
    )
}
export default Player;