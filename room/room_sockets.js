//SOCKET
import io from 'Socket.IO-client';
import axios from 'axios';
import {cookies_setUserInfo, cookies_getUserInfo} from '../storage/storage.js';
export const hostUrl = 'http://192.168.16.109';// shahe
// export const serverUrl = '172.16.10.178';// h
// export const serverUrl = 'localhost';// ngrok
export const port=3001;
export const socketUrl=hostUrl+':'+port;
export const socket = io(socketUrl, {
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



