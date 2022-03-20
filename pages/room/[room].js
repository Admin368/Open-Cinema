// core
import React from "react";
import axios from "axios";
import {styles} from 'react';
import { useEffect, useState, useRef } from "react";
import ReactPlayer from 'react-player/youtube';
import {useRouter} from 'next/router';
import { DownloadOutlined } from '@ant-design/icons';
import { 
  Typography,
  Card,
  Button,
  Divider,
  Input,
  Select,
  Switch,
  Space,
  message,
  InputNumber,
  Row,
  Col,
  Modal,
} from 'antd';
const { Search } = Input;

const { Title, Text } = Typography;
// components
import AppLayout from "../../layouts/layout1/AppLayout";
import Player from "../../components/Player";
import { T } from "antd/lib/upload/utils";

const url1 = 'http://bbx-video.gtimg.com/daodm_0b53aqabaaaa34anaeylxjrn2bgdcacaaeca.f0.mp4?dis_k=b8bb5e864066b469fc2af0aed9ac81fa&dis_t=1644942290.mp4';
const url2 = 'https://www.youtube.com/watch?v=ysz5S6PUM-U';
const url3 = 'https://vod.pipi.cn/8f6897d9vodgzp1251246104/f4faff52387702293644152239/f0.mp4';
const url = url2;

import './style.less';

import {io, socket, hostUrl, socket_request_send} from '../../room/room_sockets.js';

const userData_Default={

}
function isNumeric(num){
  return !isNaN(num)
}
//STORE
import {useStoreState, useStoreActions, useStoreRehydrated, useStore, debug} from 'easy-peasy';
import { StoreProvider, Provider } from 'easy-peasy';
import store_main from '../../stores/store_main.js';

function App() {
  return (
      <StoreProvider store={store_main}>
        <AppComponent/>
      </StoreProvider>
    )
}

const linkTypes = [
  {
    value:'zxzj',
    key:0
  },
  {
    value:'url',
    key:1
  },

]
function AppComponent(){
  const router = useRouter();
  const {query} = useRouter();

  const player = useRef();
  const search = useRef();
  const [playerStatus, setPlayerStatus] = useState();
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [title, setTitle] = useState('ZX LINK');
  // const [mediaUrl, setMediaUrl] = useState('');
  // const [roomId, setRoomId] = useState(0);
  const [isDebugging, setIsDebugging] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const userIsAdmin = useStoreState((state) => state.userIsAdmin);
  const roomId = useStoreState((state) => state.roomId);
  const roomIsConnected = useStoreState((state) => state.roomIsConnected);
  const store_setState = useStoreActions((actions) => actions.store_setState);
  const userSocketId = useStoreState((state) => state.userSocketId);

  const videoUrl = useStoreState((state) => state.videoUrl);
  const videoUrlNew = useStoreState((state) => state.videoUrlNew);
  const videoUrlNewType = useStoreState((state) => state.videoUrlNewType);
  
  const [testId, setTestId] = useState(0);

  async function linkProcess(){
    if(searchValue!=''){
      const request = {
        type:'',
        value:'',
      }
      switch(videoUrlNewType){
        case 'zxzj':
          await linkGet();
          return;
          break;
        case 'url':
          request.type='media_source_update';
          request.value=searchValue;
          break;
        default:
          console.log('UNKNOWN LINK TYPE:'+videoUrlNewType);
          return;
          break;
      }
      if(request.type!=null){
        socket_request_send(request);
      }else{
        console.log('ERROR: No link type');
      }
    }else{
      message.error('Please Enter Link')
    }
  }
  async function linkGet(){
    setIsSearching(true);
    message.info('Checking Link');
    const result = await axios
      // .get('../../api/getLink?link='+searchValue)
      // .get(hostUrl+':3005/api/general?type=zxzj&link='+searchValue)
      .get('../../api/getLink2?type=zxzj&link='+searchValue)
      .then(async(res)=> {
          //console.log(`statusCode: ${res.status}`)
          // console.log(res.data);
          if(res.data.videoUrl!=null){
              // await setMediaUrl(res.data.videoUrl);
              const link=res.data.videoUrl;
              if(link.search('http')==0){
                message.success('Successfully Got Link');
                const request={
                  type:'media_source_update',
                  value:link,
                }
                socket_request_send(request);
              }else{
                // message.error('BAD LINK - MAYBE NEW ZXZJ LINKS:');
                
                //NEW PATTANE
                // message.info('TRYING NEW ZXZJ PATTERN');
                // const newLink = 'https://bbx-video.gtimg.com/'+link+'.f0.mp4?dis_k=&dis_t=1647285485&daodm.com';
                // const request={
                //   type:'media_source_update',
                //   value:newLink,
                // }
                // socket_request_send(request);
                //NEW ALGO
                message.error('TRYING NEW ZXZJ ALGO');
                console.log('badLink:'+link);
                const ckPlayer= 'https://www.zxzjtv.com/ckplayer.php?url=';
                const newLink=ckPlayer+link;
                setTimeout(async() => {
                  await linkGet_zxzj_new(newLink);
                }, 2000);
                return;
              }
              //check if new zxzjlink
              //check if link playeable
          }else{
            message.error('Failed to get Link, check Link Correctly');

          }
      })
      .catch(error => {
          console.log(error);
      });
    setIsSearching(false);
  }
  async function linkGet_zxzj_new(url){
    setIsSearching(true);
    message.info('TRYING NEW ZXZJ ALGO');
    console.log('NEW ZXZJ ALGO TRYING: '+url);
    const result = await axios
      // .get('../../api/getLink_zxzj_new?link='+url)
      .get('../../api/getLink2?type=zxzj2&link='+url)
      .then(async(res)=> {
          //console.log(`statusCode: ${res.status}`)
          // console.log(res.data);
          if(res.data.videoUrl!=null){
              // await setMediaUrl(res.data.videoUrl);
              const link=res.data.videoUrl;
              if(link.search('http')==0){
              message.success('Successfully Got Link');
                const request={
                  type:'media_source_update',
                  value:link,
                }
                socket_request_send(request);
              }else{
                message.error('BAD LINK2 NEW ZXZJ ALSO FAILED:');
              }
          }else{
            message.error('Failed to get Link2, check Link Correctly');
          }
      })
      .catch(error => {
          console.log(error);
      });
    setIsSearching(false);
  }
  const DebuggerDiv=()=>{
    const [posX , setPosX] = useState(0);
    const [posY , setPosY] = useState(0);
    return (
        <div
          className="debuggerDiv" 
          style={{
            position:'fixed',
            bottom:posY,
            left:posX,
            zIndex:1000,
            backgroundColor:'grey',
            border: '1px solid grey',
            padding:'10px',
            cursor:'grab',
            display:'flex',
            flexDirection:'column',
          }}
          draggable="true"
          onDragEnd={(e)=>{
            console.log(e);
            e.preventDefault();
            var x = e.pageX;
            var y = e.pageY;
            setPosX(x);
            setPosY(y);
            console.log('x'+e.clientX);
            console.log('y'+e.clientY);
          }}
        >
            <span>roomId: {roomId}</span><br/>
            <span>Path:- {router.path}</span><br/>
            <span>asPath:- {router.asPath}</span><br/>
            <span>userUserId:- {userSocketId}</span><br/>
            <span>videoUrlNew:- {videoUrlNew.link}</span><br/>
            <Switch 
                checkedChildren="isAdmin"
                unCheckedChildren="notAdmin"
                checked={userIsAdmin}
                style={{
                  marginBottom:10,
                }}
                onClick={()=>{
                  store_setState({
                    state:'userIsAdmin',
                    value:!userIsAdmin,
                  });
                }}
              />
            <Switch 
              checkedChildren="roomIsConnected"
              unCheckedChildren="roomNOTConnected"
              checked={roomIsConnected}
              disabled
              onClick={()=>{
                store_setState({
                  state:'roomIsConnected',
                  value:!roomIsConnected,
                });
              }}
            />
            <InputNumber
              label='id'
              value={testId}
              onChange={(value)=>{
                setTestId(value);
              }}
              min={0}
            />
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
  const MediaSearch=()=>{
    return(
      <Search 
        ref={search}
        // addonBefore={<MediaTypeSelector/>}
        disabled={!userIsAdmin}
        placeholder="Enter A zxzj Link here Below"
        value={searchValue}
        onChange={()=>{
          // console.log(search);
          setSearchValue(search.current.input.value);
        }}
        enterButton="Search" 
        size="large" 
        loading={isSearching} 
        onPressEnter={linkProcess}
        onSearch={linkProcess}
        stye={{
          // position:'fixed',
          // bottom:0,
        }}
      />
    );
  }
  const MediaTypeSelector=()=>{
    return(
      <Row style={{
        // width:'400px'
      }}>
        <Col span={12} style={{textJustify:'center'}}>Type:</Col>
        <Col span={12}>
          <Select 
            // addonBefore='asas'
            size="large" 
            disabled={!userIsAdmin}

            // defaultValue=""
            value={videoUrlNewType}
            style={{
              width:100,
              // textJustify:'center',
              // display:'flex'
            }}
          >
            {linkTypes.map((type)=>(
              <Select.Option key={type.key} value={type.value} >{type.value}</Select.Option>
            ))}
          </Select>
        </Col>
      </Row>
        
    );
  }
  useEffect(()=>{
    //GET ROOOM
    const {room} = query;
    if(room){
      console.log('roomId:'+room);
      console.log('isNum:'+isNumeric(room));
      if(isNumeric(room)&&room>=0){
        // console.log('ok');
        store_setState({
          state:'roomId',
          value:room,
        })
      }else{
        console.log('redirect');
          router.push({
            pathname: '/room/0',
            // search: `{room}`,
          });  
      }
    }
  },[query]);


  useEffect(()=>{
    socket.off(`all`);
    socket.on(`all`,async(command)=>{room_command_page_action(command);});
    socket.off(`socket_${socket.id}`);
    socket.on(`socket_${socket.id}`,async(command)=>{room_command_page_action(command);});
    socket.off(`page`);
    socket.on(`page`,async(command)=>{room_command_page_action(command);});
    socket.io.on('reconnect',()=>{
      message.info('Server Restarted')
      console.log('reconnect1 socketId:'+socket.id);
      router.reload();
  });
    function room_command_page_action(request){
      switch(request.type){
        case 'page_action_refresh':
          router.reload();
          break;
        case 'socket_action_admin_disable':
          break;
        case 'socket_action_admin_disable':
          break;
        case 'error':
          const msg = 'ROOM ERROR';
          console.log(msg);
          message.log(msg);
          break;
        default:
      }
    }
    // setMediaUrl(url3);
    // router.push({
    //   pathname: '/',
    //   search: `?room=${room}`,
    // });  
  },[])
  // socket.on('room_'+roomId,(msg)=>{
  //   //console.log(`ROOM[${room}]`);
  //   // console.log(msg);
  // });
  return(
    <AppLayout>
      {/* {userIsAdmin?<DebuggerDiv/>:null} */}
      <MediaSearch/>
      <Player
        // mediaUrl={mediaUrl}
        userIsAdmin={userIsAdmin}
      />
      <Divider />
    </AppLayout>
  );
}


export default App;
