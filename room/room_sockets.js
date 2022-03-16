//SOCKET
// import io from 'Socket.IO-client';
import io from 'socket.io-client';
import axios from 'axios';
import {cookies_setUserInfo, cookies_getUserInfo} from '../storage/storage.js';
export const hostUrl = 'http://192.168.16.109';// shahe
// export const hostUrl = 'http://172.16.10.178';// h
// export const serverUrl = 'localhost';// ngrok
export const port=5001;
export const socketUrl=hostUrl+':'+port;
// export const socket = io('https://2ae5-152-101-158-174.ngrok.io', {
// export const socket = io(socketUrl, {
export const socket = io('https://pacific-badlands-27887.herokuapp.com/', {
    reconnectionDelayMax: 10000,
});
// socket.on('room_0_room',(command)=>{
//     const roomId = command.id||'';
//     console.log(command);
// });
export function socket_request_send(request){
    // console.log('socket_request_send');
    // console.log(request);
    const newRequest = {
        ...request,
        roomId:parseInt(cookies_getUserInfo('roomId'))||'',
        userSocketId:cookies_getUserInfo('socketId')||'',
    }
    socket.emit('request',newRequest);
}



