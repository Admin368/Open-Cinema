//SOCKET
import io from 'Socket.IO-client';
import axios from 'axios';
import {cookies_setUserInfo, cookies_getUserInfo} from '../storage/storage.js';
export const serverUrl = 'http://192.168.1.107:3000';
export const socket = io(serverUrl, {
    reconnectionDelayMax: 10000,
});



// socket.on('room_0_room',(command)=>{
//     const roomId = command.id||'';
//     console.log(command);
// });
export function socket_request_send(request){
    // console.log('socket_request_send');
    // console.log(request);
    socket.emit('request',request);
}

socket.io.on('reconnect',()=>{
    console.log('reconnect');
});