//@flow
import { createAction,handleActions } from 'redux-actions';
import {getArticlesFromUrl} from '../parser';
const FETCH = 'novel/bookshelf/FETCH';

export const fetch = createAction(FETCH, () => {
  let realm = realmFactory();
  let novels = realm.objects('Novel');
  realm.write(()=>{
    let inactiveNovels = novels.filtered(`active=false`);
    realm.delete(inactiveNovels); // Deletes all articles
  });
  return {
    starNovels:novels.filtered('star=true and active=true').sorted('starAt',true),
    unstarNovels:novels.filtered('star=false and active=true').sorted('created',true),
  };
});


export const refreshAllNovel = (callback)=>{
  // return (dispatch:func) => {
    let store = require('../store').default;
    let state = store.getState();
    let novels = state.get('bookshelf').starNovels;
    let jobs = [];
    for(let novel of novels){
      jobs.push(getArticlesFromUrl(novel.directoryUrl).then((directory:Array<Article>)=>{
            let realm = realmFactory();
            realm.write(()=>{
              novel.directory = JSON.stringify(directory);
              novel.isParseDirectory = true;
              novel.lastArticleTitle = directory[directory.length-1].title;
            });
          }));
    }

    Promise.all(jobs).then(callback).then(()=>{
      store.dispatch(fetch());
    });
};

const initialState = {
  starNovels: [],
  unstarNovels: [],
}

export default handleActions({
  [FETCH](state,action) {
    return action.payload;
  }
}, initialState);
