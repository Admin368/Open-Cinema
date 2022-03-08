//SOCKET
import io from 'Socket.IO-client';
export const socket = io('http://localhost:3000');


// socket.on('room_0_room',(command)=>{
//     const roomId = command.id||'';
//     console.log(command);
// });

export function socket_request_send(request){
    // console.log('socket_request_send');
    // console.log(request);
    socket.emit('request',request);
}