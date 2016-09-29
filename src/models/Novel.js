import parse from 'url-parse';

import {getArticlesFromUrl} from 'novel-parser';

import rules from '../rules';

export default class Novel {
  static schema = {
    name: 'Novel',
    primaryKey: 'directoryUrl',
    properties: {
      directoryUrl:'string',
      title: 'string',
      isParseDirectory:{type: 'bool', default: false},
      logo: {type:'string',optional:true},
      directory: {type: 'list', objectType: 'Article'},
      author: 'string',
      desc:'string', //描述内容
      star:{type: 'bool', default: false},
      created:'date',
    }
  }
}

function getRule(url:string):Rule|null{
  let urlObject = parse(url);
  let domain = urlObject.hostname;
  for(var rule of rules){
    if (rule.domain == domain) {
      return rule;
    }
  }
  return null;
}

export const parseDirectory = async (novel:Novel)=>{
  let articles =  await getArticlesFromUrl(novel.directoryUrl,getRule(novel.directoryUrl));
  return articles;
}