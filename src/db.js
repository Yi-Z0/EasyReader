let Realm = require('realm');
import Article from './models/Article';
import Novel from './models/Novel';
let schema = [Article.schema,Novel.schema];

console.log('db path',Realm.defaultPath);

global.realmFactory = ()=>{
  return new Realm({schema: schema});
}