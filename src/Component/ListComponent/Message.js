import React, { Component } from 'react';
import {sendByReport } from '../../util/APIUtils';
const Slack = require('slack-node');

let key = 'xoxp-589802289765-590909935926-643901740581-fcabb98479fd40135eef063b62ea9ae3'
let roomTitle
//xoxp-589802289765-587062052432-637522247233-ecdfb5f0a09821fa899e7556d06c2a0d
export function keyChange(value){
  key = value;
  console.log(key)
}
export function roomTitleChange(value){
  roomTitle = value;
  console.log(key)
}

export function send(message,slackKey,slackChannel){
  let slack = new Slack(slackKey);        
    slack.api('chat.postMessage', {
     username: 'dev-test',  // 슬랙에 표시될 봇이름
     text:message,
     channel:'#'+slackChannel  // 전송될 채널 및 유저
   }, function(err, response){
     console.log(response);
   });
}
export function sendUser(message,reportId){
 
  sendByReport(reportId).then(response=>{
    let slack = new Slack(response.slackKey);        
    slack.api('chat.postMessage', {
     username: 'dev-test',  // 슬랙에 표시될 봇이름
     text:message,
     channel:'#'+response.slackChannel  // 전송될 채널 및 유저
   }, function(err, response){
     console.log(response);
     console.log(err)
   });
  }).catch(error =>{
    console.log(error)
  })

  
  console.log(reportId)
}


