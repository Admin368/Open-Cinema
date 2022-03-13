const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server, Manager } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");
const { create, all } = require('mathjs');
const config = { }
const math = create(all, config);
const axios = require('axios');

const bcrypt = require('bcrypt');
const { is } = require('express/lib/request');
const { contentType } = require('express/lib/response');
// const { io } = require('socket.io-client');
// const { socket } = require('../room/room_sockets');
// const { socket } = require('../room/room_sockets');
const bcrypt_saltRounds = 10;

const videoUrl1 = 'http://bbx-video.gtimg.com/daodm_0b53aqabaaaa34anaeylxjrn2bgdcacaaeca.f0.mp4?dis_k=b8bb5e864066b469fc2af0aed9ac81fa&dis_t=1644942290.mp4';
const videoUrl2 = 'https://vod.pipi.cn/8f6897d9vodgzp1251246104/f4faff52387702293644152239/f0.mp4';
const videoUrl3 = 'https://bbx-video.gtimg.com/daodm_0b53oiaaoaaagaajjtzli5rn24wda5zaab2a.f0.mp4?dis_k=1255a762a350acb3b3e92319b7036ad3&dis_t=1647193575&daodm.com';
var test = 0;
var test_hash = 0;
var test_password ='1234';

//CONSOLE COLORS & PRESETS
const clr_Reset = "\x1b[0m";
const clr_Bright = "\x1b[1m";
const clr_Dim = "\x1b[2m";
const clr_Underscore = "\x1b[4m";
const clr_Blink = "\x1b[5m";
const clr_Reverse = "\x1b[7m";
const clr_Hidden = "\x1b[8m";
const clr_FgBlack = "\x1b[30m";
const clr_FgRed = "\x1b[31m";
const clr_FgGreen = "\x1b[32m";
const clr_FgYellow = "\x1b[33m";
const clr_FgBlue = "\x1b[34m";
const clr_FgMagenta = "\x1b[35m";
const clr_FgCyan = "\x1b[36m";
const clr_FgWhite = "\x1b[37m";
const clr_BgBlack = "\x1b[40m";
const clr_BgRed = "\x1b[41m";
const clr_BgGreen = "\x1b[42m";
const clr_BgYellow = "\x1b[43m";
const clr_BgBlue = "\x1b[44m";
const clr_BgMagenta = "\x1b[45m";
const clr_BgCyan = "\x1b[46m";
const clr_BgWhite = "\x1b[47m";

// IS DEBUGING
const isDebuging = true;
function debug(msg){
    var text_color=clr_FgCyan;
    var text_type=clr_Reset;
    if(msg.search('ERROR:')==0){text_color=clr_FgRed;text_type=clr_Bright}
    if(msg.search('SERVER:')==0){text_color=clr_FgMagenta;text_type=clr_Underscore}
    if(msg.search('SUCCESS:')==0){text_color=clr_FgGreen;text_type=clr_Bright}
    if(msg.search('WAITING:')==0){text_color=clr_FgYellow;text_type=clr_Reset}
    if(msg.search('CONNECTED:')==0){text_color=clr_FgBlue;text_type=clr_Bright}
    if(msg.search('DISCONNECTED:')==0){text_color=clr_FgYellow;text_type=clr_Bright}
    if(msg.search('CLEAR:')==0){text_color=clr_FgWhite;text_type=clr_Reset}
    var caller = 'App';
    if(caller!=null){
        caller = debug.caller.name;
        // console.log(text_type+text_color+text);
    }
    const text = caller+'()->'+msg;
    console.log(text_type+text_color+text);
}

//@SOCKET SETUP
// try{
    const io = require("socket.io")(server, {
        timeout:50000,
        reconnection:true,
        reconnectionDelay: 30000,
        reconnectionDelayMax: 10000,
        reconnectionAttempts: 10,
        autoConnect: false,
        cors: {
            origin: '*',
        }
    });
    instrument(io, {
        auth: false
    });
    io.bin
// }catch{
    // debug('FAILED TO START SOCKET SERVER');
    // server_shutdown();
// }

///CLI_SETUP

//KEY PRESSING
const readline = require('readline');
// const { socket } = require('../room/room_sockets');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    process.exit();
  } else {
    debug(`You pressed the "${str}" key`);
    // debug(key);
    if(key.name==='q'){
      debug('============QUIT===============');
    //   process.exit();
    server_shutdown();
    }
    if(key.name==='o'){
      debug('============USERS_ONLINE===============');
      var usersOnline = server_user_get_users_online()
    //   debug(JSON.stringify(usersOnline));
      if(isDebuging==true){console.log(usersOnline)}
      debug('USERS ONLINE:'+users_count_online);
    }
    if(key.name==='u'){
      debug('============USERS_LOG===============');
    //   debug(JSON.stringify(users_array));
      if(isDebuging==true){console.log(users_array)}
    }
    if(key.name=='r'){
      debug('============ROOM===============');
    //   debug(JSON.stringify(rooms_array));
      if(isDebuging==true){console.log(rooms_array)}
    }
    if(key.name=='p'){
        debug('============REFRESH EVERONE===============');
        // io.emit('all', {
        //     type:'page_action_refresh'
        // });
        server_all_room_reload();
      }
    // if(Number.isInteger(key.name)){
    //PRINT USERS IN ROOM
    if(math.hasNumericValue(key.name)){
        const roomIndex = key.name;
        debug('============ROOM_USERS===============');
    //   server_room_get_
        try{

        const room = server_room_get_room({roomIndex});
        // console.log(room);
        const roomId = room.roomId;
        const count = server_room_get_roomUsers_online_count({roomId});
        // console.log('number:'+r);
        debug('ROOM USERS ONLINE:'+count);
            // const roomUsers  = rooms_array[roomIndex].roomUsers;
            // if(isDebuging==true){console.log(roomUsers)}
            const roomUsersOnline = server_room_get_roomUsers_online({roomId});
            if(isDebuging==true){console.log(roomUsersOnline)}
        }catch{
            debug(`ERROR: ROOM WITH INDEX [${roomIndex}] DOESNT EXIST`);
        }
    //   debug( JSON.stringify(userSockets));
    }
    if(key.name=='c'){
        debug('============CREATE USER===============');
        const socketId = users_array.length;
        const userName = 'user_'+socketId; 
        server_user_create({socketId,userName});
        const roomUsers  = rooms_array[0].roomUsers;
        if(isDebuging==true){console.log(roomUsers)}
      // debug(rooms)
    //   io.emit('server', { message: 'some value'});
    }
    if(key.name=='y'){
        debug('============ROOM_CREATE===============');
        const roomId = 1;
        const socketId = 1;
        // server_room_user_remove({roomId,socketId});
        // server_room_user_add({roomId,socketId});
        // debug("test_hash:");
        // if(isDebuging==true){console.log(test_hash)}
        const fn =async()=>{
            // // const match = await utility_password_hash_isTrue({password:test_password,hash:test_hash});
            // const match = await utility_password_hash_isTrue({password:'asas',hash:test_hash});
            // console.log('match:');
            // console.log(match);
            // if(match==true){
            //     debug('PASSWORD CORRECT');
            // }else{
            //     debug('PASSWORD INCORRECT');
            // }
            // databaseUser = await database_user_get_databaseUser({email:'paulkachule@yahoo.com'});
            // console.log(databaseUser);
            const userName='admin';
            const password='1234';
            const email='admin@mv2.live';
            const socketId=0;
            // database_user_register({userName,password,email});
            // database_user_login({socketId,email,password});
        }
        // fn();
        // server_room_generate_uniqueId();
        server_room_create({socketId})
        
        // const r = utility_password_check({password:test_password,hash:test_hash});
        // console.log(r);

        
        // server_user_checkExist({socketId})
        // server_room_user_checkExist({roomId,socketId});
      // debug(rooms)
    //   io.emit('server', { message: 'some value'});
    }
    if(key.name=='l'){
        debug('============USER_LOGIN===============');
        const roomId = 1;
        const socketId = 1;
        const fn =async()=>{
            const userName='admin';
            const password='1234';
            const email='admin@mv2.live';
            const socketId=0;
            database_user_login({socketId,email,password});
        }
        fn();
        // server_room_create({socketId})

    }
    if(key.name=='k'){
        debug('============USER_REGISTER===============');
        const roomId = 1;
        const socketId = 1;
        const fn =async()=>{
            const userName='admin';
            const password='1234';
            const email='admin@mv2.live';
            const socketId=0;
            database_user_register({userName,password,email});

        }
        // server_room_create({socketId})
        // database_user_login({socketId,email,password});
        fn();

    }
    if(key.name=='z'){
        debug('============ROOM_GET_USER===============');
        const roomId = 0;
        const socketId = 1;
        // server_room_user_remove({roomId,socketId});
        var roomUser = server_room_get_roomUser({roomId,socketId});
        if(roomUser!=null){
            console.log(roomUser)
        }else{
            debug('ROOM USER NOT GOTTEN');
        }
        // server_user_checkExist({socketId})
        // server_room_user_checkExist({roomId,socketId});
      // debug(rooms)
    //   io.emit('server', { message: 'some value'});
    }
    if(key.name=='m'){
        debug('============CACH[media]_UPDATE===============');
        try{
            const cache_type ='media';
            server_cache_update({cache_type});
        }catch(error){
                debug('ERROR: CACHE[media]_UPDATE');
        }
    }
    if(key.name=='t'){
        debug('============TEST_CACHE_UPDATE===============');
        var media = [];
        try{
            
            media = CACHE['media'];
            console.log(media.length);
        }catch(error){
                debug('ERROR: TEST FAILED');
                if(isDebuging==true){console.log(error)}
                if(isDebuging==true){console.log(media)}
        }
    }
  }
});

//@SERVER SETUP
///SERVER
class server_object{
    constructor(){
        this.serverTime = new Date(); 
        this.serverDatabaseIsConnected = false;
    }
}
const SERVER = new server_object();

///MSQL
const database_init=()=>{
    try{
        const mysql = require('mysql');
        var database = mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : 'mysql',
            database : 'mk_sources'
        });
    }catch{
        debug('ERROR: DATABASE INIT FAILURE')
    }
}

const server_shutdown=()=>{
    debug('SERVER: SHUT DOWN REQUESTED');
    if(SERVER.serverDatabaseIsConnected==true){
        debug('SERVER: CLOSING DATABASE CONNECTION');
        database.end();
    }
    debug('SERVER: SHUTTING DOWN PROPERLY, BYE BYE!!');
    debug('CLEAR: ------------------------------------  ')
    process.exit();
}

const database_connect=()=>{
    debug('ATTEMPTING DATABASE CONNECTION');
    try{

        database.connect(async function(err) {
            if (err) {
            debug('ERROR: DATABASE_CONNECTION:FAILED');
            //   console.log(err.stack)
            debug('ERROR: DATABASE_CONNECTION_ERROR_CODE'+err.code);
            debug('ERROR: DATABASE_CONNECTION_ERROR_MESSAGE'+err.sqlMessage);
            //   process.exit();
            server_shutdown();
            return;
            }else{
                // IF DATABASE CONNECTION SUCCESSFUL
                // console.log(connection.threadId);
                debug('SUCCESS: DATABASE_CONNECTION SUCCESSFUL');
                SERVER.serverDatabaseIsConnected = true;
                // const query = 'SELECT * FROM `users` WHERE 1';
                // database_query({query});
                // test_hash = await utility_password_hash({password:test_password});
                // debug('HASH DONE0');
                // debug('HASH RETURNED:'+test_hash);
                
                // database_query()
                // main();
            }       
          })
        //   const query = `SELECT 1 + 1 AS solution`;
        //     database_query({});
    }catch{
        debug('ERROR:MSQL CONNECTION FAILED');
    }
}
const database_query=async({query=null})=>{
    if(query==null){debug('ERROR:INVALID PARAM-query:'+query);return null;}
    await database.query(query, function (error, results, fields) {
        // if (error) throw error;
        if(error){
            debug('QUERY_ERROR: QUERY FAILED');
            if(isDebuging==true){console.log(error)}
            return null;
        }else{
            // debug('QUERY_RESULT: ');
            // if(isDebuging==true){console.log(results[0].solution)}
            // if(isDebuging==true){console.log(results[0].email)}
            return results;
        }
    });
}
//CRYPTO



const utility_password_hash=async({password=null})=>{
    try{
        if(password==null){debug('ERROR:INVALID PARAM-password:'+password);return null;}
        const promise = bcrypt.hash(password, bcrypt_saltRounds);
        // using .then, create a new promise which extracts the data
        // const dataPromise = promise.then((response) => response.data)
        const dataPromise = promise
        .then((response) => 
            response
        )
        .catch((error)=>{
            //error
            debug('ERROR:HASH FAILED');
            if(isDebuging==true){console.log(error)}
        });
        // debug('HASH DONE');
        // console.log(dataPromise);
        return dataPromise;

    }catch{
        debug('ERROR: FAILED TO HASH');
    }
}

const utility_password_hash_isTrue=async({password=null,hash=null})=>{
    try{
        if(password==null){debug('ERROR:INVALID PARAM-password:'+password);return null;}
        if(hash==null){debug('ERROR:INVALID PARAM-hash:'+hash);return null;}
        // debug(`CHECKING password[${password}] OF HASH[${hash}]`);
        const promise = bcrypt.compare(password, hash);
        // using .then, create a new promise which extracts the data
        // const dataPromise = promise.then((response) => response.data)
        const dataPromise = promise
        .then((response) => 
            response
        )
        .catch((error)=>{
            //error
            debug('ERROR:HASH CHECK FAILED');
            if(isDebuging==true){console.log(error)}
        });
        return dataPromise;

    }catch{
        debug('ERROR: FAILED TO HASH');
    }
}

const utility_password_hash_isTrue2=async({password=null,hash=null})=>{
    try{
        if(password==null){debug('ERROR:INVALID PARAM-password:'+password);return null;}
        if(hash==null){debug('ERROR:INVALID PARAM-hash:'+hash);return null;}
        // const promise = bcrypt.compare(password, hash);
        await bcrypt.compare(password, hash, function(err, result) {
            if(err!=null){
                debug('ERROR:HASH COMPARE FAILED')
            }else{
                // if(isDebuging==true){console.log('result:'+result)}
                if(result==true){
                    debug(`!!CORRECT: password[${password}] OF HASH[${hash}]`);
                }else{
                    debug(`!!FALSE: password[${password}] OF HASH[${hash}]`);
                }
                return result;
            }
        });

    }catch{
        debug('ERROR: FAILED TO HASH');
    }
}

const database_user_get_databaseUser=async({email=null})=>{
    if(email==null){debug('ERROR:INVALID PARAM-email:'+email);return null;}
    const query = "SELECT * FROM `users` WHERE `email`='"+email+"'"
    // const databaseUser = await database_query({query});
    // if(isDebuging==true){console.log(databaseUser)}
    // if(databaseUser!=null){
    //     return databaseUser[0];
    // }else{
    //     debug('ERROR USER NOT FOUND');
    //     return null;
    // }
    await database.query(query, function (error, results, fields) {
        // if (error) throw error;
        if(error){
            debug('QUERY_ERROR: QUERY FAILED');
            if(isDebuging==true){console.log(error)}
            return null;
        }else{
            console.log('DATABASE USER:');
            console.log(results);
            // return results;
            databaseUser= results[0];
        }
    });
    // const promise = await database.query(query,function(results){return results})
    // // const dbUser = promise.then((response)=>response);
    // console.log('DATABASE USER:');
    // console.log(promise);
    // function (error, results, fields) {
    //     // if (error) throw error;
    //     if(error){
    //         debug('QUERY_ERROR: QUERY FAILED');
    //         if(isDebuging==true){console.log(error)}
    //         return null;
    //     }else{
    //         // console.log('DATABASE USER:');
    //         // console.log(results);
    //         return results;
    //     }
    // });
    // console.log(databaseUser.results);
    // return databaseUser;
    
}

const database_user_register=async({socketId=null,userName=null,password=null,email=null})=>{
    if(userName==null){debug('ERROR:INVALID PARAM-userName:'+userName);return null;}
    if(password==null){debug('ERROR:INVALID PARAM-password:'+password);return null;}
    if(email==null){debug('ERROR:INVALID PARAM-email:'+email);return null;}
    //CHECK IF USER EXISTS
    var query = "SELECT * FROM `users` WHERE `email`='"+email+"'";
    await database.query(query, async function (error, results, fields) {
        if(error){
            debug('QUERY_ERROR: QUERY FAILED');
            if(isDebuging==true){console.log(error)}
            return null;
        }else{
            databaseUser= results[0];
            // debug('DB USER');
            // console.log(databaseUser);
            if(databaseUser!=null){
                debug('USER ALREADY EXISTS');
                debug(`EMAIL[${email}] ALREADY EXISTS WITH USER[${databaseUser.userName}]`);
            }else{
                debug('USER NOT FOUND');
                const passwordHash = await utility_password_hash({password});
                debug('PASSWORD HASHED:'+passwordHash);
                query = "INSERT INTO `users`(`username`, `passwordHash`, `email`) VALUES ('"+userName+"','"+passwordHash+"','"+email+"')"
                // REGISTERING USER
                debug(`REGISTERING USER[${userName}] , EMAIL[${email}]`);
                await database.query(query, async function (error, results, fields) {
                    if(error){
                        debug('REGISTER_ERROR: QUERY FAILED');
                        if(isDebuging==true){console.log(error)}
                        return null;
                    }else{
                        // REGISTERING SUCCESSFUL
                        debug('SUCCESS: REGISTER SUCCESSFUL RESULT');
                        if(isDebuging==true){console.log(results)}
                    }
                });
            }
        }
    });
}

const database_user_login=async({socketId=null,email=null,password=null})=>{
    if(socketId==null){debug('ERROR:INVALID PARAM-socketId:'+socketId);return null;}
    if(password==null){debug('ERROR:INVALID PARAM-password:'+password);return null;}
    if(email==null){debug('ERROR:INVALID PARAM-email:'+email);return null;}
    var user = server_user_get_user(socketId);
    if(user.userIsLoggedIn==true){debug(`ERROR: SOCKET[${socketId}] ALREADY LOGGED IN AS USERNAME[${user.userName}]`);return null;}
    //CHECK IF USER EXISTS
    var query = "SELECT * FROM `users` WHERE `email`='"+email+"'";
    await database.query(query, async function (error, results, fields) {
        if(error){
            debug('QUERY_ERROR: QUERY FAILED');
            if(isDebuging==true){console.log(error)}
            return null;
        }else{
            databaseUser= results[0];
            if(databaseUser!=null){
                // USER EXISTS
                const userName =databaseUser.username;
                const hash = databaseUser.passwordHash;
                debug(`ACCOUNT EXISTS OF EMAIL[${email}],USERNAME[${userName}]`);
                //CHECKING PASSWORD
                const passwordIsTrue = await utility_password_hash_isTrue({password,hash});
                if(passwordIsTrue==true){
                    //PASSWORD TRUE
                    debug('PASSWORD TRUE');
                    //LOGED IN
                    debug('SUCCESS: LOGGIN SUCCESSFUL');
                    user.userIsLoggedIn = true;
                    user.userName = userName;
                    console.log(user); 
                }else{
                    //PASSWORD FALSE
                    debug('PASSWORD FALSE');
                }
            }else{
                debug(`ERROR: ACCOUNT OF EMAIL[${email}] NOT FOUND`);
                return null;
            }
        }
    });

}



// main();

  




//   connection.end();

//data_arrays
var data_chats = [];
var data_rooms=[];
var data_room_ids=[];

//#users
var users_array = [];
var users_index = 0;
var users_count_online = 0;
var users_ = 0;
//users_class
class user{
    constructor({userName=null, userSocketId=null, userRoomId=null,userIpAddress=null}) {
        this.userIndex = users_array.length;
        this.userIsActive = true;
        this.userTimeCreated = Date.now();
        this.userIsLoggedIn = false;
        this.userIsConnected = true;
        this.userName = userName;
        this.userSocketId = userSocketId;
        this.userIsInRoom = false;
        this.userRoomId = null;
        this.userRoomUserIndex = null; // index of this user in roomUsers Array
        this.userIpAddress= userIpAddress;
    }
}

const server_user_checkExist=({socketId=null})=>{
    if(socketId==null){debug('ERROR:INVALID PARAM-socketId:'+socketId);return null;}
    var user=users_array.find(user=>user.userSocketId==socketId);
    if(user!=null){
        debug(`TRUE:USER[${user.userName}] OF SOCKET[${socketId}] ALREADY EXISTS`);
        return true;
    }else{
      debug(`FALSE:USER OF SOCKET[${socketId}] DOES NOT EXIST OR NOT CREATED`);
      return false;
    }   
}

const server_user_create=({socketId=null,userName=null,ipAddress=null,})=>{
    if(!server_user_checkExist({socketId})){
        if(socketId==null){debug('ERROR:INVALID PARAM-socketId:'+socketId);return null;}
        users_array.push(
            new user({
                userSocketId:socketId,
                userName:userName,
                userIpAddress:ipAddress,
            })
        );
        // const user = server_user_get_user(socketId);
        server_room_user_add({roomId:0,socketId:socketId});
        debug(`SUCCESS: USER[${userName}] CREATED OF SOCKET:${socketId}`);
    }else{
        const user = server_user_get_user(socketId);
        debug(`ERROR: USER[${user.userName}] of SOCKET[${socketId}] ALREADY CREATED, CREATE CANCLED`);

    }
   
    // var user = server_user_get_user({socketId});
    // return user;
}

const server_user_get_user=(socketId)=>{
    var user=users_array.find(user=>user.userSocketId==socketId);
    if(user!=null){
      return  user;
    }else{
      debug('ERROR:SOCKETID NOT FOUND');
      return null;
    }
}
const server_user_get_users_online=()=>{
    var onlineUsers = [];
    var onlineUsers =users_array.filter(user=>user.userIsConnected==true);
    return onlineUsers;
}

const server_user_room_join=({roomId=null,socketId=null})=>{
    if(roomId!=null & socketId!=null){
        var user = server_user_get_user(socketId);
        var room = server_room_get_room(roomId);
        room.room_user_add(socketId);
    }else{
        debug('NOT ENOUGH PARAMETERS')
    }
}
const server_user_login=({socketId=null,userName=null,password=null})=>{
    if(socketId==null){debug('ERROR:INVALID PARAM-socketId:'+socketId);return null;}
    if(userName==null){debug('ERROR:INVALID PARAM-userName:'+userName);return null;}
    if(password==null){debug('ERROR:INVALID PARAM-password:'+password);return null;}

}


const server_user_state_connected=({socketId=null})=>{
    if(socketId==null){debug('ERROR:INVALID PARAM-socketId:'+socketId);return null;}
    debug('CONNECTED: STATE: USER_SOCKET:'+socketId);
    var user = server_user_get_user(socketId);
    user.userIsConnected=true;
    user.userIsActive=true;
}
const server_user_state_disconnected=({socketId=null})=>{
    if(socketId==null){debug('ERROR:INVALID PARAM-socketId:'+socketId);return null;}
    debug(`DISCONNECTED: STATE USER_SOCKET:${socketId}`);
    const user = server_user_get_user(socketId);
    // console.log(user);
    user.userIsConnected=false;
    user.userIsActive=false;
    const roomId = user.userRoomId;
    const roomUser = server_room_get_roomUser({roomId,socketId});
    // console.log(roomUser)
    roomUser.isActive=false;
    roomUser.timeLeft=Date.now();
}

//#rooms
//rooms_data
var rooms_array = [];
var rooms_index = 0;
var rooms_count_active = 0;
var rooms_id_array = [];// keeps ids to make sure they are unique

//room_class
class room{
    constructor({roomId=null,roomMediaId=null,roomMediaPosterUrl=null,roomStartTime=null,roomEndTime=null,roomIsPrivate=false,roomCreatorSocketId=null,roomMediaUrl=null,roomMediaSource=null,roomMediaCurrentTime=null, roomPassword=null}) {
      this.roomIndex = rooms_array.length;
      this.roomId= roomId;
      this.roomPassword= roomPassword||1234;
      this.roomIsActive = true;
      this.roomTimeCreated = Date.now();
      this.roomMediaIsPlaying = false;
      this.roomMediaId = roomMediaId;
      this.roomMediaUrl= roomMediaUrl;
      this.roomMediaPosterUrl= roomMediaPosterUrl;
      this.roomMediaSource= roomMediaSource;
      this.roomMediaCurrentTime= roomMediaCurrentTime||0;
      this.roomStartTime = roomStartTime;
      this.roomEndTime = roomEndTime;
      this.roomIsStarted = false;
    //   this.roomIsActive = false;
      this.roomIsPrivate = roomIsPrivate;
      this.roomUserCount = 0;
      this.roomUsersOnlineCount= 0;
    //   this.roomUserCountLog = 0;
      this.roomUsers = []; // 
    //   this.roomUsersLog = []; //all users everJoined
      this.roomCreatorSocketId = roomCreatorSocketId;
      this.roomCreatorUserName = null;
    }
}

//room_actions
const server_room_generate_uniqueId=()=>{
    const min = 1;
    const max = 9999;
    var roomId_temp = 0;
    var roomId_exist = 0;
    for(let x=1;x<max;x++){
        debug('LOOKING..');
        roomId_temp = math.randomInt(min, max); 
        roomId_exist = data_room_ids.find(roomId=>roomId==roomId_temp);
        if(roomId_exist!=roomId_temp){
            data_room_ids.push(roomId_temp);
            return roomId_temp;
            break;
        }else{
        }
    }
    debug(`ROOM CAPACITY FULL ${data_room_ids.length}`);
}
const server_room_create=({socketId=null,roomId=server_room_generate_uniqueId()})=>{
    if(socketId==null){debug('ERROR:INVALID PARAM-socketId:'+socketId);return null;}
    debug(`CREATING NEW ROOM[${roomId}] BY USER[${socketId}]`);
    // const roomId = server_room_generate_uniqueId()
    rooms_array.push(
        new room({
            roomId:roomId,
            roomCreatorSocketId:socketId,
            roomMediaUrl:videoUrl3,
        })
    );
    // server_room_user_add({roomId,socketId});
    var r = server_room_get_room({roomId});
    return r;
}

const server_room_get_room=({roomId=null,roomIndex=null})=>{
    if(roomId==null){
        // debug('ERROR:INVALID PARAM-roomId:'+roomId);
        if(roomIndex==null){
        //IF WE HAVE ROOM INDEX
            debug(`ERROR:INVALID PARAM-roomId:+${roomId}`);
            debug(`ERROR:INVALID PARAM-roomIndex:+${roomIndex}`);
        }else{
            const room = rooms_array.find(room=>room.roomIndex==roomIndex);
            if(room!=null){
                debug('FOUND ROOM BY PARAM-roomIndex:'+roomIndex);
                return room;
            }else{
                debug('ERROR:ROOM NOT FOUND');
                return null;
            }
        }
        return null;
    }

    //IF WE HAVE ROOM
    const room = rooms_array.find(room=>room.roomId==roomId);
    if(room!=null){
        return room;
    }else{
        debug('ERROR:ROOM NOT FOUND');
        return null;
    }
}
// const server_room_get_roomIndex=({roomId=null})=>{
//     if(roomId==null){debug('ERROR:INVALID PARAM-roomId:'+roomId);return null;}

// }
// const server_room_get_RoomUser=({roomId=null,socketId=null})=>{
//     if(socketId==null){debug('ERROR:INVALID PARAM-socketId:'+socketId);return null;}
//     if(roomId==null){debug('ERROR:INVALID PARAM-roomId:'+roomId);return null;}
// }

const server_room_user_add=({roomId=null,socketId=null})=>{
    var room = server_room_get_room({roomId});
    if(room==null){debug(`ERROR ROOM[${roomId}] DOES NOT EXISTS`);return null;}
    if(socketId==null){debug('ERROR:INVALID PARAM-socketId:'+socketId);return null;}
    if(roomId==null){debug('ERROR:INVALID PARAM-roomId:'+roomId);return null;}
    if(!server_user_checkExist({socketId})){debug(`ERROR:USER[${socketId}] DOES NOT EXIST TO ADD TO ROOM[${roomId}]`);return null;}
    if(!server_room_user_checkExist({roomId,socketId})){
        debug(`NEW USER[${socketId}] JOINING ROOM[${roomId}]`);
        // var room = server_room_get_room({roomId});
        if(room!=null){
            const index = room.roomUsers.length;
            const user = server_user_get_user(socketId);
            const roomUserIndex = room.roomUsers.length;
            room.roomUsers.push({
                index:roomUserIndex,
                isActive:true,
                userSocketId:socketId,
                userName:user.userName,
                userIndex:user.userIndex,
                timeJoined: Date.now(),
                timeLeft:null,
                ipAddress:user.userIpAddress,            
            });
            // room.roomUsersLog.push(room.roomUsers[roomUserIndex]);
            user.userIsInRoom = true;
            user.userRoomId = room.roomId;
            user.userRoomUserIndex = roomUserIndex;
            room.roomUserCount = room.roomUserCount+1;
            room.roomUserCountLog = room.roomUserCountLog+1;
            // server_socket_command({
            //     target:'socket',
            //     type:'room_joined',
            //     socketId:socketId,
            // });
            // setTimeout(() => {
            //     server_socket_command({
            //         target:'socket',
            //         type:'room_joined',
            //         socketId:socketId,
            //     });
            // }, 3000);
        }else{
            debug('ERROR:ROOM NOT FOUND');
        }
    }else{
        debug(`USER[${socketId}] JOINED ROOM[${roomId}], SETTING ACTIVE`);
        const user = server_user_get_user(socketId);
        var room = server_room_get_room({roomId});
        var roomUser = server_room_get_roomUser({roomId,socketId})
        roomUser.isActive= true;
    }

}
const server_room_get_roomUser=({roomId=null,socketId=null})=>{
    if(socketId==null){debug('ERROR:INVALID PARAM-socketId:'+socketId);return null;}
    if(roomId==null){debug('ERROR:INVALID PARAM-roomId:'+roomId);return null;}
    if(!server_user_checkExist({socketId})){debug(`ERROR: USER[${socketId}] NOT FOUND`);return null;}
    if(!server_room_user_checkExist({roomId,socketId})){debug(`ERROR: USER[${socketId}] NOT FOUND IN ROOM`);return null;}
    var room = server_room_get_room({roomId});
    if(room!=null){
        var roomUser =room.roomUsers.find(roomUser=>roomUser.userSocketId==socketId);
        return roomUser;
    }else{
        debug(`ERROR:USER[${socketId}] NOT FOUND IN ROOM[${roomId}]`);
    }
}

const server_room_get_roomUsers=({roomId=null})=>{
    if(roomId==null){debug('ERROR:INVALID PARAM-roomId:'+roomId);return null;}
    var room = server_room_get_room({roomId});
    if(room!=null){
        return room.roomUsers;
    }else{
        debug('ERROR:ROOM NOT FOUND');
    }
}

const server_room_get_roomUsers_online=({roomId=null})=>{
    if(roomId==null){debug('ERROR:INVALID PARAM-roomId:'+roomId);return null;}
    var room = server_room_get_room({roomId});
    if(room!=null){
        var roomUsersOnline = [];
        roomUsersOnline =room.roomUsers.filter(roomUser=>roomUser.isActive==true);
        return roomUsersOnline;
    }else{
        debug('ERROR:ROOM NOT FOUND');
    }

}

const server_room_get_roomUsers_online_count=({roomId=null})=>{
    if(roomId==null){debug('ERROR:INVALID PARAM-roomId:'+roomId);return null;}
    // var room = server_room_get_room({roomId});
    var roomUsersOnline = [];
    var roomUsersOnline = server_room_get_roomUsers_online({roomId});
    if(roomUsersOnline!=null){
        debug('FOUND ONLINE USERS');
        // console.log(roomUsersOnline);
        // console.log('number:'+roomUsersOnline.length);
        return roomUsersOnline.length;
    }else{
        debug(`ERROR:ROOM[${roomId}] USERS ONLINE NOT FOUND`);
    }
}

const server_room_user_checkExist=({roomId=null,socketId=null})=>{
    if(socketId==null){debug('ERROR:INVALID PARAM-socketId:'+socketId);return null;}
    if(roomId==null){debug('ERROR:INVALID PARAM-roomId:'+roomId);return null;}
    var room = server_room_get_room({roomId});
    var user = server_user_get_user(socketId);
    var roomUser=room.roomUsers.find(roomUser=>roomUser.userSocketId==socketId);
    if(user!=null){
        if(roomUser!=null){
            debug(`TRUE:USER[${user.userName}] OF SOCKET[${socketId}] FOUND IN ROOM[${roomId}]`);
            return true;
          }else{
            debug(`FALSE:USER[${user.userName}] OF SOCKET[${socketId}] DOES NOT EXIST IN ROOM[${roomId}]`);
            return false;
          }
    }else{
      debug(`ERROR:USER DOES NOT EXIST OR NOT CREATED`);
    }   
}

const server_room_user_reJoin=()=>{}
const server_room_user_remove=({roomId=null,socketId=null})=>{
    if(socketId==null){debug('ERROR:INVALID PARAM-socketId:'+socketId);return null;}
    if(roomId==null){debug('ERROR:INVALID PARAM-roomId:'+roomId);return null;}
    if(!server_user_checkExist({socketId})){return null;}
    var room = server_room_get_room({roomId});
    
    var user = server_user_get_user(socketId);
    var roomUser = room.roomUsers[user.userRoomUserIndex];
    if(roomUser!=null){
        debug(`USER[${user.userName}] REMOVED FROM ROOM[${room.roomId}]`);
        roomUser.isActive = false;
        user.userIsActive =false;
        user.userRoomId=null;
        // server_room_user_add({roomId:0,socketId})
    }else{
        debug('ERROR: ROOM USER NOT FOUND');
    }
} //remove by force
const server_room_user_leave=()=>{} // remove by self
const server_room_user_disconnect=()=>{} //remove disconnection

const server_room_close=(roomId)=>{}

const server_all_room_reload=()=>{
    server_socket_command({
        target:'all',
        type:'page_action_refresh'
    })
}


//chats
var chats_array = [];
var chats_index = 0;
var chats_count_active = 0;


//@CACHE
var CACHE=[]
var CACHE_LAST=[];
var CACHE_TIMEOUT=[];
//@CACHE_FUNCTIONS
const server_cache_delete=({cache_type})=>{
    debug(`DELETING CACHE_TYPE[]`);
    CACHE_MEDIA[cache_type] = [];
}

const server_cache_update=async({cache_type})=>{
    if(cache_type==null){debug('ERROR: INVALID PARAM-cache_type');return null;}
    debug(`SERVER: CACHE_UPDATE OF CACHE_TYPE[${cache_type}] REQUESTED`);
    try{
        // debug(`DELETING CACHE_TYPE[]`);
        var request_url = '';
        switch(cache_type){
            case 'media':
                const serverUrl = 'localhost';
                const offset = 0;
                const count = 0;
                request_url = `http://${serverUrl}/mv2_api/getNewMediaData2.php?offset=${offset}&count=${count}`;
                break;
            case 'users':
                break;
            default:
                debug(`ERROR: NO SUCH CACHE_TYPE[${cache_type}]`);
                return null;
        }
        //PROCESS REQUEST
        const promise = axios.get(request_url)
        const dataPromise = promise
          .then((response) => {
                // console.log()
                debug(`SUCCESS: !!!UPDATED CACHE_TYPE[${cache_type}]`); 
                if(CACHE[cache_type]!=null){ //IF FIRST TIME;
                    CACHE_LAST[cache_type]=response.data;
                }else{ // ALREADY HAS DATA UPDATING
                    CACHE_LAST[cache_type]=CACHE[cache_type];
                }
                CACHE[cache_type] = response.data;
                return response.data;
            }
            // response.data[0]
            // response.data;
          )
          .catch((error)=>{
              debug(`ERROR: FETCHING REQUEST TO UPDATE CACHE_TYPE[${cache_type}]`);
              if(isDebuging==true){console.log(error)}
          });
        // return dataPromise
        // if(isDebuging==true){console.log(dataPromise)}
    }catch{
        debug(`ERROR: IN CACHE_UPDATE`);
    }
}



//@MEDIA_FUNCTIONS
const server_media_get_media=async({offset=0,count=200})=>{
    //NOT ENCOURAGED USE CACHE SYSTEM
    debug('WARNING: USE CACHE SYSTEM NOT DIRECT GET');
    try{    
        const serverUrl = 'mv2.live';
        
        const url = `https://${serverUrl}/mv2_api/getNewMediaData.php?offset=${offset}&count=${count}`;
        const promise = axios.get(url)
        const dataPromise = promise
        .then((response) => 
            // response.data[0]
            response.data
        )
        .catch((error)=>{
            console.log('APP getMediaArray()->error'+error);
        });
        // window.ww = dataPromise;
        debug('DATA GOT!');
        return dataPromise
    }catch(error){
        debug('ERROR: FAILED TO GET MEDIA');
        console.log(error);
        if(isDebuging==true){console.log(error)}
    }
}



// main();



//@API SETUP
server.listen(3000, () => {
    console.log('listening on *:3000');
});

//@API_REQUESTS
app.get('/', (req, res) => {
    res.send('<p>MV2</p>');
});
app.get('/users_online_count', (req, res) => {
    const count = server_user_get_users_online().length;
    res.send(`<p>users_online_count:${count}</p>`);
});
app.get('/users_count', (req, res) => {
    const count = users_array.length;
    res.send(`<p>users_count:${count}</p>`);
});
app.get('/socket_ui', (req, res) => {
    res.sendFile(__dirname +'/socket_ui/index.html');
});
app.get('/media_get',async (req, res) => {
    try{
        // const results = [];
        const results = await server_media_get_media({});
        res.send(results);
    }catch(error){
        res.send(`<p>INTERNAL ERROR</p>`);
        console.log(error);
        if(isDebuging==true){console.log(error)}
    }
    
    // res.sendFile(__dirname +'/socket_ui/index.html');
});
app.get('/request', (req, res) => {
    console.log(req);
    // res.send('<p>MV2</p>');
});
//@API_FUNCTIONS

const server_socket_command=(
    request,
    command = {
        // ...request
        roomId : request.roomId,
        target : request.target, //player / chat 
        type: '',
        value : '',
        timeStamp: date = new Date().getTime(),
    }
    )=>{
    if(!request.type==='media_time_update'){
        console.log(request);
    }
    // const command = {
    //     roomId : request.roomId,
    //     target : '', //player / chat 
    //     type: '',
    //     value : '',
    //     timeStamp: date = new Date().getTime(),
    // }
    // command=request;
    function roomDefault(){
        command.target='room';
        command.type=request.type;
        command.value=request.value;
    }
    function playerDefault(){
        command.target='player';
        command.type=request.type;
        command.value=request.value;
    }
    function chatDefault(){
        command.target='player';
        command.type=request.type;
        command.value=request.value;
    }
    const roomId = request.roomId?request.roomId:0;
    const room = server_room_get_room({roomId});
    // const currentTime = request.mediaCurrentTime||0;
    switch(request.type){
        case 'room_joined':
            command.target='socket';
            command.type='room_joined';
            // playerDefault();
            break;
        case 'media_request':
            command.target='socket';
            command.type='media_request';
            command.value={
                socketId:request.userSocketId||null,
                roomMediaUrl:room.roomMediaUrl,
                roomMediaIsPlaying:room.roomMediaIsPlaying,
                roomMediaCurrentTime:room.roomMediaCurrentTime,
            };
            break;
        case 'video_action_play_enable':
            command.target='player';
            command.type='video_action_play_enable_sync';
            // command.value=currentTime;
            command.value=room.roomMediaCurrentTime;
            room.roomMediaIsPlaying=true;
            // playerDefault();
            break;
        case 'video_action_play_disable':
            command.target='player';
            command.type='video_action_play_disable_sync';
            // command.value=currentTime;
            command.value=room.roomMediaCurrentTime;
            room.roomMediaIsPlaying=false;
            // playerDefault();
            break;
        case 'video_action_play_toggle':
            playerDefault();
            break;
        case 'video_action_seek':
            if(request.value>0){
                playerDefault();
            }
            break;
        case 'video_action_volume_mute_enable':
            playerDefault();
            break;
        case 'video_action_volume_mute_disable':
            playerDefault();
            break;           
        case 'video_action_volume_mute_toggle':
            playerDefault();
            break;
        case 'video_action_volume_change':
            if(request.value>0){
                playerDefault();
            }
        case 'video_action_fullscreen_enable':
            playerDefault();
            break;
        case 'video_action_fullscreen_disable':
            playerDefault();
            break;
        case 'video_action_fullscreen_toggle':
            playerDefault();
            break;
        case 'media_time_update':
            // const currentTime = request.value;
            console.log(request.value);
            room.roomMediaCurrentTime = request.value;
            // playerDefault();
            break;
        case 'page_action_refresh':
            command.type='page_action_refresh'
            // playerDefault();
            break;
        case 'media_action_checkDelay':
            command.value={
                roomMediaUrl:room.roomMediaIsPlaying,
                roomMediaIsPlaying:room.roomMediaIsPlaying,
                roomMediaCurrentTime:room.roomMediaCurrentTime,
            };
            break;
        default:
            debug('ERROR: UNKOWN REQUEST TYPE:'+request.type);
            return;
    }
    //if type found
    // socket_request_send(request);
    switch(command.target){
        case 'room':
            io.emit('room_'+request.roomId+'_room', command);
            break;
        case 'player':
            // socket.emit('room_'+request.roomId+'_player', command);
            // console.log(socket.handshake.issued);
            io.emit('room_'+request.roomId+'_player', command);
            break;
        case 'chat':
            io.emit('room_'+request.roomId+'_chat', command);
            break;
        case 'all':
            io.emit('all', command);
            break;
        case 'socket':
            console.log('SOCKET REQUEST for socket_'+request.socketId);
            // console.log(request.socket);
            io.emit('socket_'+request.userSocketId, command);
            break;
        default:
            // socket.emit('room_'+request.roomId+'_room', command);
    }
}

const server_socket_init=()=>{
    debug('INITIALIZING SOCKETS');
    // //@SOCKET SETUP
    // const io = require("socket.io")(server, {
    //     timeout:50000,
    //     reconnection:true,
    //     reconnectionDelay: 30000,
    //     reconnectionDelayMax: 10000,
    //     reconnectionAttempts: 10,
    //     autoConnect: false,
    //     cors: {
    //         origin: '*',
    //     }
    // });
    // instrument(io, {
    //     auth: false
    // });
    //@SOCKET_EVENT_HANDLER
    // ON CONNECT
    try{
        io.on('connection', (socket) => {
            // console.log(socket.handshake.address);
            const ip_raw = socket.handshake.address;
            const ipAddress = ip_raw.split('::ffff:')[1];
            const socketId = socket.id;
            var new_id=users_array.find(id=>id==socket.id);
            if(new_id==null){
            //    num++;
            users_count_online++;
            // console.log();
            // if(isDebuging==true){console.log('NEW USER CONNECTED->id'+socket.id)}
            debug('CONNECTED: NEW USER->id'+socket.id)
            // users_array.push(new user({index:num,userSocketId:socket.id}));
            // server_user_create({socketId,ipAddress,socket});
            console.log('oldSocket:'+socketId);
            if(!server_user_checkExist({socketId})){
                console.log('newSocket:'+socketId);
                server_user_create({socketId,ipAddress,socket});
            }
            //    users[num].userJoinRoom(0);
            // users_history.push
            //    users_getCount();
            }else{
            console.log('USER RE-CONNECTED :'+new_id);
            server_user_state_connected({socketId});
                socket.open();
            }
        // ON   RECONNECT
            socket.on("reconnect", () => {
                console.log('!!!RECONNECTED');
            });
            socket.on("reconnect_attempt", (attempt) => {
                console.log('!!!RECONNECTED ATTEMPT');
            });
        // ON DISCONNECTED
            socket.on("disconnect", (attempt) => {
            // num--;
            // var user = server_user_get_user(socket.id);
            users_count_online--;
            server_user_state_disconnected({socketId});
            //    user_disconnect(socket.id);
            //    users_getCount();
            });
        //ON MESSAGE
            socket.on('msg', (msg) => {
            console.log('msg');
            console.log(msg);
            io.emit(msg.roomId, msg);
            // console.log(`user:${msg.user},message:${msg}`);
            });
            socket.on('test',(msg)=>{
                console.log(msg);
            });
            socket.on('room_0',(msg)=>{
                console.log('MESSAGE FROM ROOM:0');
                console.log(msg);
            });
//REQUEST////////////////////////////////////////////////////////////////////////////////////////////
            socket.on('request', (request)=>{

                request.type = request.type||'';
                request.value = request.value||0;
                request.password = request.username||'';
                request.message = request.message||'';

                request.userToken = request.userToken||'';
                request.userIsAdmin = request.userIsAdmin||'';//validate with socketId
                request.userName = request.userName||'';
                request.userSocketId = request.userSocketId||socket.id;
                request.roomId = request.roomId||0;
                
                // console.log(request);
                if(
                    request.type==='media_time_update'
                ){

                } else {
                    console.log(request);
                }
                server_socket_command(request);
            }
        );


//REQUEST////////////////////////////////////////////////////////////////////////////////////////////

        //TEST EMIT
        var testVar = 0;
            setInterval(() => {
                testVar++
                io.emit('test', 'testing'+testVar);
                // console.log('sent');
            }, 2000);
        });
    }catch(error){
        debug('ERROR ON SOCKET EVENT');
    }
}





const main=()=>{
    try{}catch{}
    debug('SERVER: MAIN ---------- STARTED');
    server_socket_init();
    var default_room = server_room_create({socketId:0,roomId:0});
    var default_user = server_user_create({socketId:0,userName:'default'});
    // server_room_user_add({roomId:0,socketId:0});
}
var main_init_wait_sec = 0;
const main_init=()=>{
    // debug('CHECKING IF MAIN READY');
    //WAIT FOR CACHE[media]
    if(CACHE['media']==null) {// WAIT FOR MEDIA CACHE INIT LOAD
        const wait_milliSec = 5000;
        setTimeout(()=>{main_init()}, wait_milliSec);//RECHECK IN 50 SEC
        main_init_wait_sec += wait_milliSec;
        debug(`WAITING: CHECKED CACHE[media] - NOT READY ${main_init_wait_sec/1000}s`);
        return;
    }

    //WAIT FOR CACHE[user]

    debug('SUCCESS: !!ALL CACHE READY, APP INITIALIZING');
    main();
}
database_init();
database_connect();
server_cache_update({cache_type:'media'});
main_init();


