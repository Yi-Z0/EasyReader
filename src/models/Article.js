import {parseArticleContent} from 'novel-parser';
export default class Article {
  static schema = {
    name: 'Article',
    primaryKey: 'url',
    properties: {
      url: 'string',
      title: 'string',
      content: 'string',
      full: 'bool',
    }
  }
}