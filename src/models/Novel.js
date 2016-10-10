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
      starAt:{type: 'date', default: new Date()},
      lastReadIndex:{type: 'int', default: 0},
      lastReadTitle:{type: 'string', default: ''},
      lastArticleTitle:{type: 'string', default: ''},
    }
  }
}