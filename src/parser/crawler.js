//@flow
import {InteractionManager} from 'react-native';

import fetch from 'fbjs/lib/fetch';
import cheerio from 'cheerio';
import parse from 'url-parse';
import events from 'events';
import {getRuleByUrl} from '../rules';
import RNFetchBlob from 'react-native-fetch-blob';
global.Buffer = require('buffer').Buffer;
// var detectCharacterEncoding = require('detect-character-encoding');
var iconv = require('iconv-lite');


//所有任务按照域名分组,至少间隔0.2秒才执行下一个,百度间隔0.05秒
let domainsTasks = {};
let domainsTaskRuning = {};
let event = new events.EventEmitter();
event.on('NEW_TASK',(task,domain)=>{
  if (!domainsTasks[domain]) {
    domainsTasks[domain] = [];
  }
  domainsTasks[domain].push(task);
  // console.log(`${domain}新增任务`,domainsTasks[domain].length);
  if (!domainsTaskRuning[domain]) {
    doTask(domain);
  }

});

function doTask(domain){
  let  task = domainsTasks[domain].pop();
  if (task) {
    domainsTaskRuning[domain] = true;

    InteractionManager.runAfterInteractions(() => {
      task().then(($)=>{
        // console.log(`${domain}任务完成`,domainsTasks[domain].length);
        setTimeout(doTask.bind(null,domain),180);
      }).catch((e)=>{
        // console.log(`${domain}任务失败`,domainsTasks[domain].length,e);
        setTimeout(doTask.bind(null,domain),180);
      });
    });
  }else{
    // console.log(`${domain}任务全部完成`);
    domainsTaskRuning[domain] = false;
  }
}

//获得一个页面有可能失败,增加尝试次数, 最多3次
module.exports = (url: string): Promise < string > => {
 let func: () => Promise < string > = fetchUrl.bind(null, url);
 return retry(func, 3);
};

function retry(func: () => Promise < string > , retryResidue: number) {
 return func().catch((e) => {
   if (retryResidue > 0) {
     return retry(func, retryResidue - 1);
   } else {
     throw e;
   }
 });
}

function fetchUrl(url: string): Promise < cheerio > {
 return new Promise(function(resolve, reject) {
    let urlObject = parse(url);
    let domain = urlObject.hostname;

    let task = ()=>{
      // url = url.replace(/^http:\/\//,'https://');
      return RNFetchBlob.config({
        timeout: 10000,
      }).fetch(
        'GET',
        url,
        {
          referrer: url,
          userAgent: getRandomAgent(),
          'RNFB-Response' : 'base64'
        }
     ).then(res => {
      //  alert(res._bodyBlob);
      //  return res.arrayBuffer();
       return res.base64();
     }).then(str => {
       let rule = getRuleByUrl(url);
       let encode = 'utf8';
       if (rule&&rule.encode) {
         encode = rule.encode;
       }
       let buf = Buffer.from(str,'base64');
       let html = iconv.decode(buf, encode);
       return cheerio.load(html);
     }).then($ => {
       resolve($);
       return Promise.resolve($);
     }).catch(e => {
      //  alert(e);
       reject(e);
       return Promise.reject(e);
     });
   };
   event.emit('NEW_TASK',task,domain);
 });
}

let agents = [
   'Mozilla/5.0 (Windows NT 10.0; rv:46.0) Gecko/20100101 Firefox/46.0',
   'Mozilla/5.0 (Windows NT 10.0; rv:46.0) Gecko/20100101 Firefox/41.0',
   'Mozilla/5.0 (Windows NT 10.0; rv:46.0) Gecko/20100101 Firefox/45.0',
   'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.75 Safari/537.36',
   'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2134 Safari/537.36',
   "Mozilla/5.0 (Linux; Android 6.0.1; SM-G920P Build/MMB29K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/50.0.2661.86 Mobile Safari/537.36",
   "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36"
 ];
function getRandomAgent() {
 let max = agents.length - 1;
 return agents[Math.round(Math.random() * max)];
}
