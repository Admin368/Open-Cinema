import React, { useState, useEffect, useRef, Alert } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { render } from "less";
// import cookie from 'react-cookies';
const url1 = 'http://bbx-video.gtimg.com/daodm_0b53aqabaaaa34anaeylxjrn2bgdcacaaeca.f0.mp4?dis_k=b8bb5e864066b469fc2af0aed9ac81fa&dis_t=1644942290.mp4';
const url2 = 'https://vod.pipi.cn/8f6897d9vodgzp1251246104/f4faff52387702293644152239/f0.mp4';

import './Player.less';
import { 
    message,
    Slider,
    Spin,
    Progress,
} from "antd";

//STORE
import {useStoreState, useStoreActions, useStoreRehydrated, useStore} from 'easy-peasy';
import { StoreProvider, Provider } from 'easy-peasy';

import {cookies_setUserInfo, cookies_getUserInfo} from '../storage/storage.js';
import {socket_request_send, room_request} from '../room/room_sockets.js';
import {io, socket} from '../room/room_sockets.js';

// import { useState } from "react/cjs/react.production.min";
// import fullscreen from "video-react/lib/utils/fullscreen";
//DEBUGGER
function debug(msg){
    // console.log(`${debug.caller.name}()=>${msg}`);
    // console.log(`()=>${msg}`);
    if(msg.search("FAILURE"||'ERROR')==12){
        message.error(msg);
    } else if(msg.search("SUCCESS")==12){
        message.success(msg);
    }
}
function util_convertHMS(value) {
    const sec = parseInt(value, 10); // convert value to number if it's string
    let hours   = Math.floor(sec / 3600); // get hours
    let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
    let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
    // add 0 if value < 10; Example: 2 => 02
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds; // Return is HH : MM : SS
}


// function cookies_setUserInfo(key, value){
//     const template ={
//         userIsAdmin:'',
//         userToken:'',
//     }
//     try{
//         cookie.save(key, value, { path: '/' });
//     } catch {
//         debug('ERROR: failed to cookies_setUserInfo key:'+key+' value:'+value);
//     }
// }
// function cookies_getUserInfo(key){
//     // console.log('key:'+key);
//     try{
//         const value = cookie.load(key);
//         // console.log('value:'+value);
//         switch(value){
//             case 'true':
//                 return true;
//                 break;
//             case 'false':
//                 return false;
//             default:
//                 return value;
//         }
//         // return value;
//     } catch {
//         debug('ERROR: failed to cookies_getUserIsAdmin:'+key);
//     }
// }

// function room_request_external(request, isAdmin){
//     console.log(request);
//     console.log('External_isAdmin'+isAdmin);
// }
const Player=(props)=> {
    const router = useRouter();
    const [goldernDelay, setGoldenDelay] = useState(2000); //milliseconds for sync waiting
    // const [videoUrl, setVideoUrl] = useState(); 
    const videoUrl = useStoreState((state) => state.videoUrl);
    const videoUrlNew = useStoreState((state) => state.videoUrlNew);
    const videoUrlNewType = useStoreState((state) => state.videoUrlType);

    const [videoPoster, setVideoPoster] = useState('');
    const [videoVolume, setVideoVolume] = useState(0.5);
    const [videoCurrentTime, setVideoCurrentTime] = useState(0);
    const [videoDuration, setVideoDuration] = useState(0);

//ALL IS STATES DONT CONTROL, UPDATED FROM EVENT
    const [videoVolumeIsMuted, setVideoVolumeIsMuted] = useState(false);
    const [videoIsFullScreen, setVideoIsFullScreen] = useState(false);
    const [videoIsAbort, setVideoIsAbort] = useState(false);
    // const [videoIsReady, setVideoIsReady] = useState(false);
    const [videoIsCanPlay, setVideoIsCanPlay] = useState(false);
    const [videoIsCanPlayThrough, setVideoIsCanPlayThrough] = useState(false);
    const [videoIsEmptied, setVideoIsEmptied] = useState(false);
    const [videoIsEnded, setVideoIsEnded] = useState(false);
    const [videoIsError, setVideoIsError] = useState(false);
    const [videoIsLoadedData, setVideoIsLoadedData] = useState(false);
    const [videoIsLoadedMetaData, setVideoIsLoadedMetaData] = useState(false);
    const [videoIsLoadStart, setVideoIsLoadStart] = useState(false);
    const [videoIsPlaying, setVideoIsPlaying] = useState(false);
    const [videoIsMediaLoading, setVideoIsMediaLoading] = useState(false);
    const [videoIsSeeking, setVideoIsSeeking] = useState(false);
    const [videoIsStalled, setVideoIsStalled] = useState(false);
    const [videoIsBuffering, setVideoIsBuffering] = useState(true);

    const [controlsSeekValue, setControlsSeekValue] = useState(0);
    const [controlsSeekisVisible, setControlsSeekisVisible] = useState(false);
    // const [controlsSeekisChanging, setControlsSeekIsChanging] = useState(false);
    const [controlsSeekIsChanging, setControlsSeekIsChanging] = useState(false);

    // const [userIsAdmin, setUserIsAdmin] = useState(true);
    const userIsAdmin = useStoreState((state) => state.userIsAdmin);
    // const [userIsAdmin, setUserIsAdmin] = useState(false);
    const [userIsAdminLocal, setUserIsAdminLocal] = useState(false);
    const [userToken, setUserToken] = useState('userToken0');
    const [userName, setUserName] = useState('username0');
    // const [userSocketId, setUserSocketId] = useState('');
    const userSocketId = useStoreState((state) => state.userSocketId);

    // const [roomId, setRoomId] = useState(0);
    const roomId = useStoreState((state) => state.roomId);
    const [roomIsJoined, setRoomIsJoined] = useState(false);

    const [isOnlySync, setIsOnlineSync] = useState(false);
    const roomIsConnected = useStoreState((state) => state.roomIsConnected);

    const lastCommandTarget = useStoreState((state) => state.lastCommandTarget );
    const lastCommandType = useStoreState((state) => state.lastCommandType);
    const lastCommandValue = useStoreState((state) => state.lastCommandValue);
    const lastCommandTimeStamp = useStoreState((state) => state.lastCommandTimeStamp);

    // const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);
//GLOBAL STORE 
    const store_setState = useStoreActions((actions) => actions.store_setState);
    const [roomFn, setRoomFn] = useState(()=>x=>'data:'+x);
    const video = useRef();
    const video_container = useRef();
    const controls_prev = useRef();
    const controls_play = useRef();
    const controls_next = useRef();
    const controls_mute = useRef();
    const controls_volume = useRef();
    const controls_time = useRef();
    const controls_seek = useRef();
    // const controls_seeker = useRef();
    const controls_chat = useRef();
    const controls_fullScreen = useRef();

//CONTROLS_PREV - FUNCTIONS
    //CONTROLS_PREV - ACTION REQUEST
    function controls_prev_action_request(){

    }

//CONTROLS_FULLSCREEN - FUNCTIONS
    function controls_fullScreen_event_handle(){
        console.log('changed');
    }
//PLAYER_EVENT_HANDLE ////////////////////////////////////////////////////////////
//PLAYER_EVENT_HANDLE_abort///////////////////////////////////////////////////////////
//Fires when the loading of an audio/video is aborted
function player_event_handle_abort(){
    const message =`player-event-handle-abort`;
    debug(message);
    try{
        setVideoIsAbort(true);
        debug('FAILURE: VIDEO ABORTED');
    }catch{
        debug(`FAILURE:${message}`);
    }
}
//PLAYER_EVENT_HANDLE_canplay///////////////////////////////////////////////////////////
//Fires when the browser can start playing the audio/video
function player_event_handle_canplay(){
    const message =`player-event-handle-canplay`;
    debug(message);
    try{
        setVideoIsCanPlay(true);
        setVideoIsBuffering(false);
    }catch{
        debug(`FAILURE:${message}`);
    }
}
//PLAYER_EVENT_HANDLE_canplaythrough//////////////////////////////////////////////////////////
//Fires when the browser can play through the audio/video without stopping for buffering
function player_event_handle_canplaythrough(){
    const message =`player-event-handle-canplaythrough`;
    debug(message);
    try{
        setVideoIsCanPlayThrough(true);
        setVideoIsBuffering(false);
    }catch{
        debug(`FAILURE:${message}`);
    }
}
//PLAYER_EVENT_HANDLE_durationchange///////////////////////////////////////////////////////////
//Fires when the duration of the audio/video is changed
function player_event_handle_durationchange(){
    const message =`player-event-handle-durationchange`;
    debug(message);
    try{
        const duration = video.current.duration
        setVideoDuration(duration);
    }catch{
        debug(`FAILURE:${message}`);
    }
}
//PLAYER_EVENT_HANDLE_emptied///////////////////////////////////////////////////////////
//Fires when the current playlist is empty
function player_event_handle_emptied(){
    const message =`player_event_handle_emptied`;
    debug(message);
    try{
        setVideoIsEmptied(true);
        debug('FAILURE: VIDEO EMPTIED');
    }catch{
        debug(`FAILURE:${message}`);
    }
}
//PLAYER_EVENT_HANDLE_ended///////////////////////////////////////////////////////////
//Fires when the current playlist is ended
function player_event_handle_ended(){
    const message =`player-event-handle-ended`;
    debug(message);
    try{
        setVideoIsEnded(true);
        message.info('VIDEO IS ENDED');
    }catch{
        debug(`FAILURE:${message}`);
    }
}    
//PLAYER_EVENT_HANDLE_error///////////////////////////////////////////////////////////
//	Fires when an error occurred during the loading of an audio/video
function player_event_handle_error(){
    const message = 'player_event_handle_error';
    debug(message);
    try{
        setVideoIsError(true);
        setVideoIsBuffering(false);
        debug(`FAILURE:${message}`);
        message.error('VIDEO ERROR!');
    }catch{
        debug(`FAILURE:${message}`);
    }
}
//PLAYER_EVENT_HANDLE_loadeddata///////////////////////////////////////////////////////////
//Fires when the browser has loaded the current frame of the audio/video
function player_event_handle_loadeddata(){
    const message =`player_event_handle_loadeddata`;
    debug(message);
    try{
        setVideoIsLoadedData(true);
    }catch{
        debug(`FAILURE:${message}`);
    }
}
//PLAYER_EVENT_HANDLE_loadedmetadata///////////////////////////////////////////////////////////
//Fires when the browser has loaded meta data for the audio/video
function player_event_handle_loadedmetadata(){
    const message =`player_event_handle_loadedmetadata`;
    debug(message);
    try{
        setVideoIsLoadedMetaData(true);
    }catch{
        debug(`FAILURE:${message}`);
    }
}
//PLAYER_EVENT_HANDLE_loadstart///////////////////////////////////////////////////////////
//Fires when the browser starts looking for the audio/video
function player_event_handle_loadstart(){
    const message =`player_event_handle_loadstart`;
    debug(message);
    try{
        setVideoIsLoadStart(true);
        message.info(message);
    }catch{
        debug(`FAILURE:${message}`);
    }
}
//PLAYER_EVENT_HANDLE_pause///////////////////////////////////////////////////////////
//Fires when the audio/video has been paused
function player_event_handle_pause(){
    const message =`player_event_handle_pause`;
    debug(message);
    try{
        setVideoIsPlaying(false);
    }catch{
        debug(`FAILURE:${message}`);
    }
}
//PLAYER_EVENT_HANDLE_play///////////////////////////////////////////////////////////
//Fires when the audio/video has been started or is no longer paused
function player_event_handle_play(){
    const message =`player-event-handle-play`;
    debug(message);
    try{
        setVideoIsPlaying(true);
    }catch{
        debug(`FAILURE:${message}`);
    }
}
//PLAYER_EVENT_HANDLE_playing///////////////////////////////////////////////////////////
//Fires when the audio/video is playing after having been paused or stopped for buffering
function player_event_handle_playing(){
    const message =`player-event-handle-playing`;
    debug(message);
    try{
        setVideoIsBuffering(false);
        bebug('RESUME FROM BUFFERING');
    }catch{
        debug(`FAILURE:${message}`);
    }
}
//PLAYER_EVENT_HANDLE_progress///////////////////////////////////////////////////////////
//Fires when the browser is downloading the audio/video
function player_event_handle_progress(){
    const message =`player-event-handle-progress`;
    // debug(message);
    try{
        if(!videoIsMediaLoading){
            setVideoIsMediaLoading(true);
            debug(message);
        }
    }catch{
        debug(`FAILURE:${message}`);
    }
}
//PLAYER_EVENT_HANDLE_ratechange///////////////////////////////////////////////////////////
//Fires when the playing speed of the audio/video is changed
function player_event_handle_ratechange(){
    const message =`player-event-handle-ratechange`;
    debug(message);
    try{
        
    }catch{
        debug(`FAILURE:${message}`);
    }
}
//PLAYER_EVENT_HANDLE_seeked///////////////////////////////////////////////////////////
//Fires when the user is finished moving/skipping to a new position in the audio/video
function player_event_handle_seeked(){
    const message =`player-event-handle-seeked`;
    debug(message);
    try{
        setVideoIsSeeking(false);
    }catch{
        debug(`FAILURE:${message}`);
    }
}
//PLAYER_EVENT_HANDLE_seeking///////////////////////////////////////////////////////////
//Fires when the user starts moving/skipping to a new position in the audio/video
function player_event_handle_seeking(){
    const message =`player-event-handle-seeking`;
    debug(message);
    try{
        setVideoIsSeeking(true);
    }catch{
        debug(`FAILURE:${message}`);
    }
}
//PLAYER_EVENT_HANDLE_stalled///////////////////////////////////////////////////////////
//Fires when the browser is trying to get media data, but data is not available
function player_event_handle_stalled(){
    const message =`player-event-handle-stalled`;
    debug(message);
    try{
        setVideoIsStalled(true);
        setVideoIsBuffering(false);
        debug(`FAILURE:${message}`);
    }catch{
        debug(`FAILURE:${message}`);
    }
}
//PLAYER_EVENT_HANDLE_suspend///////////////////////////////////////////////////////////
//Fires when the browser is intentionally not getting media data
function player_event_handle_suspend(){
    const message =`player-event-handle-suspend`;
    // debug(message);
    try{
        setVideoIsMediaLoading(false);
        debug('VIDEO MEDIA STOPPED LOADING');
    }catch{
        debug(`FAILURE:${message}`);
    }
}
//PLAYER_EVENT_HANDLE_timeupdate///////////////////////////////////////////////////////////
//Fires when the current playback position has changed
const player_event_handle_timeupdate=()=>{
    const message =`player-event-handle-timeupdate`;
    // debug(message);
    try{
        const currentTime = video.current.currentTime
        setVideoCurrentTime(currentTime);
        // console.log(userIsAdmin);
        const request={
            type:'media_time_update',
            value:currentTime,
        }
        room_request(request);   
        // if(!isSeeking){
        //     debug('seek Allowed'+isSeeking);
        //     setControlsSeekValue(currentTime);
        // }  
    }catch{
        debug(`FAILURE:${message}`);
    }
}
//PLAYER_EVENT_HANDLE_volumechange///////////////////////////////////////////////////////////
//Fires when the volume has been changed
function player_event_handle_volumechange(){
    const message =`player-event-handle-volumechange`;
    debug(message);
    try{
        
    }catch{
        debug(`FAILURE:${message}`);
    }
}
//PLAYER_EVENT_HANDLE_waiting///////////////////////////////////////////////////////////
//	Fires when the video stops because it needs to buffer the next frame
function player_event_handle_waiting(){
    const message =`player_event_handle_waiting`;
    debug(message);
    // debug(`player-event-handle-waiting`);
    try{
        setVideoIsBuffering(true);
    }catch{
        debug(`FAILURE:${message}`);
    }
}



    //PLAYER_EVENT_HANDLE_FULLSCREEN
    function player_event_handle_fullscreen(fullscreenState){
        switch(fullscreenState){
            case true:
                setVideoIsFullScreen(true);
                debug(`FullScreenState: ${fullscreenState}`);
                break;
            case false:
                setVideoIsFullScreen(false);
                debug(`FullScreenState: ${fullscreenState}`);
                break;
            default:
                debug('No fullScreen Event');
                break
        }
    }

//VIDEO - ACTIONS
    //VIDEO-ACTION-PLAY
    function video_action_play_enable(){
        try{
            video.current.play();
            debug('video-action-play');
        }catch{
            debug('FAILED: video-action-play');
        }
    }
    //VIDEO-ACTION-PAUSE
    function video_action_play_disable(){
        try{
            video.current.pause();
            debug('video-action-pause');
        }catch{
            debug('FAILED: video-action-pause');
        }
    }
    function video_action_play_toggle(){
        debug('video-action-play_toggle');
        try{
            if(video.current.paused){
                debug('video is pause, playing');
                // video_action_play_enable();
                room_request({
                    type:'video_action_play_enable',
                });
            }else{
                debug('video is playing, pausing');
                // video_action_play_disable();
                room_request({
                    type:'video_action_play_disable',
                });
            }
        }catch{
            debug('FAILED: video-action-play');
        }
    }
    //VIDEO-ACTION-SEEK
    function video_action_seek(value){
        if(value<0){return}
        try{
            video.current.currentTime=value;
            debug('video-action-seek:'+value);
        }catch{
            debug('FAILED: video-action-seek:'+value);
        }
    }
    //VIDEO-ACTION-VOLUME-MUTE-ENABLE
    function video_action_volume_mute_enable(){
        try{
            video.current.muted=true;
            debug('video-action-mute-enable');
        }catch{
            debug('FAILED: video-action-mute-enable');
        }
    }
    //VIDEO-ACTION-VOLUME-MUTE-DISABLE
    function video_action_volume_mute_disable(){
        try{
            video.current.muted=false;
            debug('video-action-mute-disable');
        }catch{
            debug('FAILED: video-action-mute-disable');        
        }
    }
    //VIDEO-ACTION-VOLUME-MUTE-TOGGLE
    function video_action_volume_mute_toggle(){
        try{
            if (video.current.muted) {
                video_action_volume_mute_disable();
            } else {
                video_action_volume_mute_enable();
            }
        }catch{
            debug('FAILED TO FULLSCREEN TOGGLE');
        } 
    }
    //VIDEO-ACTION-VOLUME-CHANGE
    function video_action_volume_change(value){
        if(value<0 || value>1){return}
        try{
            video.current.muted=true;
            debug('video-action-volume-change:'+value);
        }catch{
            debug('FAILED: video-action-volume-change:'+value);
        }
    }
    //VIDEO-ACTION-FULLSCREEN-REQUEST
    function video_action_fullscreen_enable(){
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
    //VIDEO-ACTION-FULLSCREEN-EXIT
    function video_action_fullscreen_disable(){
        try{
            document.exitFullscreen();
        }catch{
            debug('FAILED TO FULLSCREEN EXIT');
        }
    }
    //VIDEO-ACTION-FULLSCREEN-TOGGLE
    function video_action_fullscreen_toggle(){
        try{
            if (document.fullscreenElement) {
                video_action_fullscreen_disable();
            } else {
                video_action_fullscreen_enable();
            }
        }catch{
            debug('FAILED TO FULLSCREEN TOGGLE');
        } 
    }

//ROOM_REQUESTS ////////////////////////////////////////////////////////////


const room_request_=async(request)=>{
    setUserIsAdminLocal((state)=>state);
    room_request_external(request, userIsAdminLocal);
}
const room_request=async(request)=>{
    const isAdmin = cookies_getUserInfo('userIsAdmin');
    // LOCAL ACTIONS
        if(
            request.type==='video_action_fullscreen_enable'||
            request.type==='video_action_fullscreen_enable'||
            request.type==='video_action_fullscreen_toggle'||
            request.type==='video_action_volume_mute_enable'||
            request.type==='video_action_volume_mute_disable'||
            request.type==='video_action_volume_mute_toggle'||
            request.type==='video_action_volume_change'||
            request.type==='video_action_volume_fullscreen_enable'||
            request.type==='video_action_volume_fullscreen_disable'||
            request.type==='video_action_volume_fullscreen_toggle'||
            request.type==='video_action_play_toggle'
        ){
            room_command_video_action(request);
            return;
        }
        // DONT DO TIME UUPDATE IF PAUSED
        // if(request.type==='media_time_update'&&video.current.paused){
        //     debug('dont update paused');
        //     return;
        // }
    // if(isAdmin){
    if(isAdmin){
    // ONLY PLACE VIDEO ACTIONS ARE REQUESTED
        request.type = request.type||'';
        request.value = request.value||0;
        request.password = request.username||'';
        request.message = request.message||'';

        request.userToken = userToken||'';
        request.userIsAdmin = userIsAdmin||'';//validate with socketId
        request.userName = userName||'';
        request.userSocketId = userSocketId||'';
        request.roomId = roomId||0;

        request.mediaCurrentTime = video.current.currentTime||0;

        socket_request_send(request);
    } else {
        // ALLOWED REQUESTS
        if(
            request.type==='room_joined'||
            request.type==='media_request'
        ){
            console.log('allowed request');
            console.log(request);

            request.type = request.type||'';
            request.value = request.value||0;
            request.password = request.username||'';
            request.message = request.message||'';
    
            // request.userToken = userToken||'';
            // request.userIsAdmin = userIsAdmin||'';//validate with socketId
            // request.userName = userName||'';
            // // request.userSocketId = userSocketId||'';
            // request.roomId = roomId||0;
            socket_request_send(request);
        }else{
            if(!request.type==='media_time_update'){
                console.log('ERROR: REQUEST DENIED - NOT ADMIN');
                debug('ERROR: REQUEST DENIED - NOT ADMIN');
                console.log(request);
            }  
        }
    }
}

//ROOM_EVENTS /////////////////////////////////////////////////////////////
// ONLY PLACE VIDEO ACTIONS ARE CALLED
useEffect(()=>{
socket.off(`room_${roomId}_player`);
socket.on(`all`,async(command)=>{room_command_video_action(command);});
socket.on(`room_${roomId}_player`,async(command)=>{room_command_video_action(command);});
// socket.on(`socket_${socket.id}`,async(command)=>{room_command_video_action(command);});
// socket.off('connect');
// socket.on(`socket_${userSocketId}`,async(command)=>{room_command_video_action(command);});

socket.io.on('reconnect',()=>{
    console.log('reconnect1 socketId:'+socket.id);
});
socket.on('reconnect',()=>{
    console.log('reconnect2 socketId:'+socket.id);
});
socket.off('connect');
socket.on('connect',()=>{
    const socketId = socket.id;
    const currentSocketId = cookies_getUserInfo('socketId');
    const isSocketConnected  = socket.connected;
    // setUserSocketId(state=>state);
    if(isSocketConnected){
        // SOCKET CONNECTED
        // console.log('socketId:'+socket.id+' currentSocketId:'+currentSocketId);
        if(currentSocketId!==socketId){
            // console.log('mySocket:'+socketId);
            console.log('CONNECTED! -> mySocket:'+socketId);
            const topic= `socket_${socketId}`;
            socket.off(topic);
            socket.on(topic,async(command)=>{room_command_video_action(command);});

            cookies_setUserInfo('socketId',socketId);
            store_setState({
                state:'userSocketId',
                value:socketId,
            });
            room_request({
                type:'room_joined',
            });
            room_request({
                type:'media_request',
            });
            // setUserSocketId(socketId);
        }
    }else if(!isSocketConnected){
        // SOCKET DISCONNECTED
    }
    
});

},[]);
function room_command_video_action(request){
    try{
        switch(request.type){
            case 'room_joined':
                // const {roomId, roomMediaUrl} = request;
                if(!roomIsJoined){
                    setRoomIsJoined(true);
                    console.log('room_joined:');
                    console.log(request);
                }
                break;  
            case 'media_request':
                // const {roomId, roomMediaUrl} = request;
                console.log('media_request:');
                console.log(request);
                store_setState({
                    state:'videoUrl',
                    value: request.value.roomMediaUrl,
                });
                video_action_seek(request.value.roomMediaCurrentTime);
                if(request.value.roomMediaIsPlaying){
                    video_action_play_enable();
                    // const sync_play = setTimeout(() => {
                    //     video_action_play_enable();
                    // }, goldernDelay);
                }
                break;
            case 'media_source_update':
                message.success('Admin Changed The Video Link');
                console.log('media_source_change:');
                console.log(request);
                store_setState({
                    state:'videoUrl',
                    value: request.value.roomMediaUrl,
                });
                video_action_seek(request.value.roomMediaCurrentTime);
                video_action_play_disable();
                break;      
            case 'video_action_play_enable':
                video_action_play_enable();
                break;
            case 'video_action_play_enable_sync':
                message.info('sync_playing');
                console.log('seekValue:'+request.value);
                if(sync_play){clearInterval(sync_pause);}
                video_action_seek(request.value);
                const sync_play = setTimeout(() => {
                    video_action_play_enable();
                }, goldernDelay);
                break;
            case 'video_action_play_disable':
                video_action_play_disable()
                break;
            case 'video_action_play_disable_sync':
                // console.log('seekValue:'+request.value);
                // video_action_seek(request.value);
                const roomMediaTime=request.value;
                const currentMediaTime = video.current.currentTime; 
                const difference = roomMediaTime-currentMediaTime;
                console.log('pauseDifference:'+difference);
                // message.info(difference.substring(0,3));
                if(difference>0&&difference<10){
                    const sync_pause = setTimeout(() => {
                        //if behind wait till catch up to stop
                        video_action_play_disable();   
                    }, difference*1000);
                }else if(difference>10){
                        //too far away to wait for you
                    video_action_seek(value);
                    video_action_play_disable();
                }else{

                    video_action_play_disable();
                }
                
                break;
            case 'video_action_play_toggle':
                video_action_play_toggle();
                break;
            case 'video_action_seek':
                if(request.value>0){
                    if(!video.current.paused){
                        video_action_play_disable();
                        video_action_seek(request.value);
                        setTimeout(() => {
                            video_action_play_enable();
                        }, goldernDelay);
                    }else{
                        video_action_seek(request.value);
                    }
                }
                break;
            case 'video_action_volume_mute_enable':
                video_action_volume_mute_enable();
                break;
            case 'video_action_volume_mute_disable':
                video_action_volume_mute_disable();
                break;           
            case 'video_action_volume_mute_toggle':
                video_action_volume_mute_toggle();
                break;
            case 'video_action_volume_change':
                if(request.value>0){
                    video_action_volume_change(request.value);
                }
            case 'video_action_fullscreen_enable':
                video_action_fullscreen_enable();
                break;
            case 'video_action_fullscreen_disable':
                video_action_fullscreen_disable();
                break;
            case 'video_action_fullscreen_toggle':
                video_action_fullscreen_toggle();
                break;
            default:
                debug('ERROR: UNKOWN COMMAND:'+request.type);
                return;
        }
    }catch{
        debug('ERROR: ROOM ACTION FAILED');
    }
    //if type found
    // socket_request_send(request);
}
    //USE_EFFECT - ON videoUrlNew CHANGE
    // useEffect(()=>{
    //     console.log('effect on videoUrlNew')
    //     const videoUrlNew_ = videoUrlNew.link;
    //     const videoUrlNewType_ =  videoUrlNew.type;
    //     //check it
    //     //cleanIt
    //     room_request({
    //         type:'media_source_update',
    //         value:{
    //             videoUrlNew:videoUrlNew_,
    //             videoUrlNewType:videoUrlNewType_,
    //         }
    //     });
    // },[videoUrlNew]);

    //USE_EFFECT - ON ADMIN CHANGE
    useEffect(()=>{
        cookies_setUserInfo('userIsAdmin', userIsAdmin);
    },[userIsAdmin]);

    //USE_EFFECT - ON MEDIA CHANGE
    useEffect(()=>{
        const mediaUrl = props.mediaUrl;
        console.log('New mediaUrl:'+mediaUrl);
        if(mediaUrl){
            // setVideoUrl(mediaUrl);
        }
    },[props.mediaUrl]);

    useEffect(()=>{
        setRoomIsJoined(false);
//CONTROLS_PREV ////////////////////////////////////////////////////////////
controls_prev.current.addEventListener('click',()=>{
    debug('CONTROLS_PREV - EVENT - CLICK');
});

//CONTROLS_PLAY ////////////////////////////////////////////////////////////
controls_play.current.addEventListener('click',()=>{
    debug('CONTROLS_PLAY - EVENT - CLICK');
    // video_action_play_toggle();
    room_request({
        type:'video_action_play_toggle',
    });
});

//CONTROLS_NEXT ////////////////////////////////////////////////////////////
controls_next.current.addEventListener('click',()=>{
    debug('CONTROLS_NEXT - EVENT - CLICK');
});

//CONTROLS_MUTE ////////////////////////////////////////////////////////////
controls_mute.current.removeEventListener('click',()=>{});
controls_mute.current.addEventListener('click',()=>{
    debug('CONTROLS_MUTE - EVENT - CLICK');
    // video_action_volume_mute_toggle();
    room_request({
        type:'video_action_volume_mute_toggle',
    });
});

//CONTROLS_VOLUME ////////////////////////////////////////////////////////////
controls_volume.current.addEventListener('click',()=>{
    debug('CONTROLS_VOLUME - EVENT - CLICK');
    // video_action_volume_mute_toggle();
});

//CONTROLS_TIME ////////////////////////////////////////////////////////////
controls_time.current.addEventListener('click',()=>{
    debug('CONTROLS_TIME - EVENT - CLICK');
});

//CONTROLS_SEEK ////////////////////////////////////////////////////////////
// controls_seek.current.addEventListener('click',()=>{
//     debug('CONTROLS_SEEK - EVENT - CLICK');
// });
//CONTROLS_SEEKER ////////////////////////////////////////////////////////////
// controls_seeker.current.addEventListener('hover',()=>{
//     debug('CONTROLS_SEEKER - EVENT - CLICK');
// });

//CONTROLS_CHAT ////////////////////////////////////////////////////////////
controls_chat.current.addEventListener('click',()=>{
    debug('CONTROLS_CHAT - EVENT - CLICK');
});

//CONTROLS_FULLSCREEN ////////////////////////////////////////////////////////////
controls_fullScreen.current.addEventListener('click',()=>{
    debug('CONTROLS_FULLSCREEN - EVENT - CLICK');
    // video_action_fullscreen_toggle();
    room_request({
        type:'video_action_fullscreen_toggle',
    });
});
//VIDEO_CONTAINER ////////////////////////////////////////////////////////////
video.current.addEventListener('click',()=>{
    debug('VIDEO - EVENT - CLICK');
    // video_action_play_toggle();
    room_request({
        type:'video_action_play_toggle',
    });
});


//PLAYER_EVENT ////////////////////////////////////////////////////////////
    //VIDEO-EVENT-PLAY
    try{
        video.current.addEventListener('abort',()=>{player_event_handle_abort();});
        video.current.addEventListener('canplay',()=>{player_event_handle_canplay();});
        video.current.addEventListener('canplaythrough',()=>{player_event_handle_canplaythrough();});
        video.current.addEventListener('durationchange',()=>{player_event_handle_durationchange();});
        video.current.addEventListener('emptied',()=>{player_event_handle_emptied();});
        video.current.addEventListener('ended',()=>{player_event_handle_ended();});
        video.current.addEventListener('loadeddata',()=>{player_event_handle_loadeddata();});
        video.current.addEventListener('loadedmetadata',()=>{player_event_handle_loadedmetadata();});
        video.current.addEventListener('loadstart',()=>{player_event_handle_loadstart();});
        video.current.addEventListener('pause',()=>{player_event_handle_pause();});    
        video.current.addEventListener('play',()=>{player_event_handle_play();});    
        video.current.addEventListener('playing',()=>{player_event_handle_playing();});    
        video.current.addEventListener('progress',()=>{player_event_handle_progress();});
        video.current.addEventListener('ratechange',()=>{player_event_handle_ratechange();}); 
        video.current.addEventListener('seeked',()=>{player_event_handle_seeked();}); 
        video.current.addEventListener('seeking',()=>{player_event_handle_seeking();});
        video.current.addEventListener('stalled',()=>{player_event_handle_stalled();});
        video.current.addEventListener('suspend',()=>{player_event_handle_suspend();});
        video.current.addEventListener('timeupdate',()=>{player_event_handle_timeupdate(controlsSeekIsChanging);});
        video.current.addEventListener('volumechange',()=>{player_event_handle_volumechange();});
        video.current.addEventListener('waiting',()=>{player_event_handle_waiting();});
    }catch{
        debug('FAILURE: VIDEO EVENT FAILURE');
    }
    //PLAYER-EVENT-FULLSCREEN
    document.addEventListener("fullscreenchange", function () {
        // player_event_handle_fullscreen(document.fullscreen);
        player_event_handle_fullscreen(document.fullscreenEnabled);
    }, false);
    document.addEventListener("mozfullscreenchange", function () {
        player_event_handle_fullscreen(document.mozFullScreen);
    }, false);
    document.addEventListener("webkitfullscreenchange", function () {
        player_event_handle_fullscreen(document.webkitIsFullScreen);
    }, false);


},[]);
    const style_controls_admin={
        visibility:userIsAdmin===true?'visible':'hidden',
    }
    //MEDIAURL-EVENT-CHANGE

    return(
        <div
            ref={video_container}
            className="video_container"
        >
            <div
                className="video_controls"
            >
                {userIsAdmin===true?<span> Admin {userIsAdmin} </span>:null}
                <button ref={controls_prev} style={style_controls_admin}>prev</button>
                <button ref={controls_play} style={style_controls_admin}>{!videoIsPlaying?'play':'pause'}</button>
                <button ref={controls_next} style={style_controls_admin}>next</button>
                <button ref={controls_mute} >mute</button>
                <button ref={controls_volume} >volume</button>
                <button ref={controls_time} >{util_convertHMS(videoCurrentTime)}/{util_convertHMS(videoDuration)}</button>
                <button ref={controls_seek} >seek</button>
                
                {/* <Progress 
                    type="line"
                    percent={videoCurrentTime/videoDuration*100}
                    showInfo={false}
                    // defaultValue={0}
                    // disabled
                    // tooltipVisible={false}
                    // ref={controls_seek}
                    // value={videoCurrentTime}
                    // min={0}
                    // max={videoDuration}
                    className='controls_seek'
                /> */}
                <Slider
                    defaultValue={0}
                    value={videoCurrentTime}
                    min={0}
                    max={videoDuration}
                    className='controls_seek_time'
                    onChange={(value)=>{
                        
                    }}
                    trackStyle={{
                        // backgroundColor:'transparent',
                    }}
                    handleStyle={{
                        display:'none'
                    }}
                    // style={style_controls_admin}
                />
                <div 
                    className='controls_seek_change'
                    onMouseEnter={()=>{
                        // debug('mouse Hover');
                        if(userIsAdmin){
                            setControlsSeekValue(videoCurrentTime);
                            setControlsSeekisVisible(true);
                        }
                    }}
                    onMouseLeave={()=>{
                        // debug('mouse Hover');
                        setControlsSeekisVisible(false);
                    }}

                >
                    <Slider
                        defaultValue={0}
                        value={controlsSeekValue}
                        min={0}
                        max={videoDuration}
                        onChange={(value)=>{
                            setControlsSeekIsChanging(true);
                            setControlsSeekValue(value);
                        }}
                        onAfterChange={(value)=>{
                            debug('seeking - done');
                            const newTime=value;
                            // video_action_seek(newTime);
                            room_request({type:'video_action_seek',value:newTime})
                            setControlsSeekValue(newTime);
                            // setControlsSeekIsChanging(false);
                        }}
                        trackStyle={{
                            // backgroundColor:'transparent',
                        }}
                        style={{
                            width:'100%',
                            visibility:controlsSeekisVisible===true?'visible':'hidden',
                        }}
                        tipFormatter={(value)=>{
                            return util_convertHMS(value);
                        }}
                        
                    />
                </div>
                <button ref={controls_chat} style={style_controls_admin}>chat</button>
                <button ref={controls_fullScreen}>fullsceen</button>
            </div>
            <Spin className='video_spinner' spinning={videoIsBuffering} tip='Loading...'>
                <video
                    ref={video}
                    id='video'
                    className='video'
                    style={{
                        width:'100%',
                        background:'grey',
                    }}
                    width={640}
                    // height={video.current.offsetHeight}
                    src={videoUrl}
                    controls={false}
                    // autoPlay
                    // preload="auto"
                    muted
                    // muted={videoVolumeIsMuted}
                >
                    {/* <source src={url1}></source> */}
                    {/* <source src={url2}></source> */}
                </video>
            </Spin>
        </div>
    )
}
export default Player;