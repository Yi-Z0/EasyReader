//@flow
import { createAction,handleActions } from 'redux-actions';
import {getArticlesFromUrl,parseArticleContent} from '../parser';
const FETCH = 'novel/bookshelf/FETCH';

export const fetch = createAction(FETCH, () => {
  let realm = realmFactory();
  let novels = realm.objects('Novel');
  novels = novels.filtered('star=true and active=true').sorted('starAt',true);
  let starNovels = [];
  for(var i in novels){
      starNovels.push(novels[i]);
  }
  return {
    starNovels:starNovels
  };
});


export const downloadAllArticle = (novel:Novel)=>{
  return (dispatch:func) => {
    let directory = JSON.parse(novel.directory);
    let realm = realmFactory();
    realm.write(()=>{
      novel.downloadCount = 0;
      novel.needDownloadCount = directory.length - novel.lastReadIndex;
    })
    for (var i = novel.lastReadIndex; i < directory.length; i++) {
      let article = directory[i];
      parseArticleContent(novel.directoryUrl, article.url).then((d)=>{
          console.log(`${article.title} 下载完毕`);
          realm.write(()=>{
            novel.downloadCount ++;
            dispatch(fetch());
          });
      }).catch(e => {
          console.log(`${article.title} 下载失败`,e);
      });
    }
  };
};

export const refreshAllNovel = (callback)=>{
  let realm = realmFactory();
  let novels = realm.objects('Novel').filtered('star=true and active=true').sorted('starAt',true);

  let jobs = [];
  for(let index in novels){
    let novel = novels[index];
    jobs.push(
      getArticlesFromUrl(novel.directoryUrl).then(
        (directory:Array<Article>)=>{
            let realm = realmFactory();
            realm.write(()=>{
              novel.directory = JSON.stringify(directory);
              novel.isParseDirectory = true;
              novel.lastArticleTitle = directory[directory.length-1].title;
            });
          }
      ).catch(e=>{
        console.log(e,1);
      })
    );
  }

  Promise.all(jobs).then(callback).then(()=>{
    let store = require('../store').default
    if (store) {
      store.dispatch(fetch());
    }
  }).catch(e=>{
    console.log(e,2);
  });
};

const initialState = {
  starNovels: [],
}

export default handleActions({
  [FETCH](state,action) {
    return action.payload;
  }
}, initialState);
