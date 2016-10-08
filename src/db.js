let Realm = require('realm');
import Article from './models/Article';
import Novel from './models/Novel';
let schema = [Article.schema,Novel.schema];

console.log('db path',Realm.defaultPath);

global.realmFactory = ()=>{
  return new Realm({
    schema: schema,
    schemaVersion: 1
  });
}

global.makeCancelable = (promise) => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then((val) =>
      hasCanceled_ ? reject({isCanceled: true}) : resolve(val)
    );
    promise.catch((error) =>
      hasCanceled_ ? reject({isCanceled: true}) : reject(error)
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    },
  };
};