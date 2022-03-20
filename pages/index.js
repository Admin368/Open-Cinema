import React, { useState, useEffect, useRef, Alert } from "react";
import axios from "axios";


import AppLayout from "../layouts/AppLayout";
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
  Image,
  Col,
  Steps,
  Statistic,
} from 'antd';
import { UserOutlined, SolutionOutlined, LoadingOutlined, SmileOutlined } from '@ant-design/icons';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import {socket_request_send, hostUrl} from '../room/room_sockets.js';

const { Step } = Steps;
const { Paragraph } = Typography;
import Link from "next/link";  

import './style.less';
function debug(msg){
  // console.log(`${debug.caller.name}()=>${msg}`);
  // console.log(`()=>${msg}`);
  if(msg.search("FAILURE"||'ERROR')==12){
      message.error(msg);
  } else if(msg.search("SUCCESS")==12){
      message.success(msg);
  }
}

const backup = props => {
  const [usersOnlineCount, setUsersOnlineCount] = useState('');
  const [usersOnlineCount_, setUsersOnlineCount_] = useState('');
  const [usersVisitCount, setUsersVisitCount] = useState('');
  const [usersVisitCount_, setUsersVisitCount_] = useState('');
  

  const get=async(url)=>{
    const promise = axios.get(url);
    const dataPromise = promise
      .then((response) => {
        return response;
      }).catch((error)=>{
          debug(`ERROR: GET FAILED URL:`+url);
          console.log(error);
          return null;
      });
    return dataPromise;
  }
  const getUsersOnlineCount=async()=>{
    const request_url = hostUrl+'/get_users_online_count';
    const res = await get(request_url);
    if(res){
      // console.log(res);
      const count= res.data.result;
      let count_=0;
      setUsersOnlineCount_(0);
      const t = setInterval(() => {
        count_++;
        setUsersOnlineCount(count_);
        if(count_>=count){clearInterval(t)}
      }, 10);
      // setUsersOnlineCount(count);
    }
  }
  const getUsersVisitCount=async()=>{
    const request_url = hostUrl+'/get_users_visit_count';
    const res = await get(request_url);
    if(res){
      // console.log(res);
      const count= res.data.result;
      let count_=0;
      setUsersVisitCount_(0);
      const t = setInterval(() => {
        count_++;
        setUsersVisitCount(count_);
        if(count_>=count){clearInterval(t)}
      }, 10);
      // setUsersVisitCount(count);
    }
  }

  useEffect(()=>{
    getUsersOnlineCount();
    getUsersVisitCount();
  },[]);
  return (
    <AppLayout>
          <div className="text"><h1>Welcome to MovieKnight.Online</h1></div>
          <p>Watch Movies and other media together with your friend and family in real Time with chat and other features</p> 
          <Col span={12}>
          </Col>
        <Row>
          <Divider orientation="center" orientationMargin={0}>
              Open-Cinema Platform
          </Divider>
          <Paragraph>
            <p>This Platform is in Active Development by <a href="https://github.com/Admin368">Admin368</a> and  the <a href="https://u-byte.cn">U-byte.cn</a> community.</p>
            <p>Feel free to join the <a href="https://github.com/Admin368/Open-Cinema">open-Cinema</a> project on github.</p>
          </Paragraph>
        </Row>
        <Row>
          <Divider orientation="center" orientationMargin={0}>
              <p>General "ROOM 0" Screening:</p>
          </Divider>
          <Paragraph>
              <p>This is a general room used to screen selected movies to all who want to join</p>
              <Row>
                <Col span={12}>
                  <Statistic
                    title="Users Online:"
                    value={usersOnlineCount}
                    prefix={<ArrowUpOutlined />}
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Users Visits Count:"
                    value={usersVisitCount}
                    prefix={<ArrowUpOutlined />}
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Col>
              </Row>
              <Link href="/room/0">
                <Button>JOIN ROOM 0</Button>
              </Link>
              <p>The Witcher Season 2</p>
              {/* <p>The Witcher Season 2 2022.03.17 19:00</p> */}
              <Image
                width={200}
                src="https://m.media-amazon.com/images/M/MV5BN2FiOWU4YzYtMzZiOS00MzcyLTlkOGEtOTgwZmEwMzAxMzA3XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_FMjpg_UY720_.jpg"
              />
              {/* <p>Peaky Blinders Season 6 2022.03.17 21:00</p> */}
              <p>Peaky Blinders Season 6</p>
              <Image
                  width={200}
                  src="https://m.media-amazon.com/images/M/MV5BMTkzNjEzMDEzMF5BMl5BanBnXkFtZTgwMDI0MjE4MjE@._V1_FMjpg_UY720_.jpg"
              />
          </Paragraph>
        </Row>
        <Row>
          <Divider orientation="center" orientationMargin={0}>
              Open Private Room
          </Divider>
          <Paragraph>
            <p>When ready, private rooms will be as simple as:</p>
            <Steps>
              <Step status="wait" title="Login" icon={<UserOutlined />} />
              <Step status="wait" title="Open Room" icon={<SolutionOutlined />} />
              <Step status="process" title="Copy and Paste Media Link" icon={<LoadingOutlined />} />
              <Step status="finish" title="Share Link / Join Room" icon={<SmileOutlined />} />
          </Steps>
          <p>Green Features : complete || Grey: In development / Testing</p>
          <p>Meanwhile join the general <a href="https://movieknight.online/room/0">ROOM 0</a> screenings and testing</p>
          </Paragraph>
        </Row>
        <Row>
          <Divider orientation="center" orientationMargin={0}>
              Goal behind This Plaform
          </Divider>
          <Paragraph>
            In this time of isolation and little human connection, this platform is made with a big heart to allow all those who are apart a chance to enjoy media together.
          </Paragraph>
        </Row>
        <Row>
          <Divider orientation="center" orientationMargin={0}>
              Disclaimer
          </Divider>
          <Paragraph>
            This platform does not host any of the media materials of any kind , rather has methods of sharing streaming of other sources of content.
            Any Copyright or Legal issue should be addressed to the original source server holders of the content.
            For any communcation, contribution or collaboration with the developer contact the Admin368. 
          </Paragraph>
        </Row>
        <Row>
          <Divider orientation="center" orientationMargin={0}>
              Many Thanks and Inspiration
          </Divider>
          <Paragraph>
            The Rickinator, the Chopinator, the Jerinator, the Ogrinator
          </Paragraph>
        </Row>
    </AppLayout>
  );
};

export default backup;
