//@flow
import {getArticlesFromUrl} from '../parser';

export default class Novel {
  static schema = {
    name: 'Novel',
    primaryKey: 'directoryUrl',
    properties: {
      directoryUrl:'string',
      title: 'string',
      isParseDirectory:{type: 'bool', default: false},
      logo: {type:'string',optional:true},
      directory: 'string',
      author: 'string',
      desc:'string', //描述内容
      star:{type: 'bool', default: false},
      created:'date',
    }
  }
}

export const parseDirectory = async (novel:Novel)=>{
  let articles =  await getArticlesFromUrl(novel.directoryUrl);
  return articles;
}