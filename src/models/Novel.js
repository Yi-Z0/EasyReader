//@flow

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
      active:{type: 'bool', default: true},
      created:'date',
      starAt:{type: 'date', default: new Date()},
      lastReadIndex:{type: 'int', default: 0},
      lastReadTitle:{type: 'string', default: ''},
      lastArticleTitle:{type: 'string', default: ''},
      downloadCount:{type: 'int', default: 0},
      needDownloadCount:{type: 'int', default: -1},
    }
  }
}