export default class Article {
  static schema = {
    name: 'Article',
    primaryKey: 'url',
    properties: {
      directoryUrl:'string',
      url: 'string',
      title: 'string',
      content: 'string',
    }
  }
}