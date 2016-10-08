//@flow
import { createAction,handleActions } from 'redux-actions';
import {ListView} from 'react-native';
import {getArticlesFromUrl} from '../parser';
import { createReducer } from 'redux-immutablejs'
import Immutable from 'immutable'

let ds = new ListView.DataSource({rowHasChanged: (r1, r2)=>r1.url != r2.url});

const FETCH_LIST = 'novel/directory/FETCH_LIST';
const FETCH_LIST_SUCCESS = 'novel/directory/FETCH_LIST_SUCCESS';
const FETCH_LIST_FAILED = 'novel/directory/FETCH_LIST_FAILED';
const UPDATE_LIST_ORDER = 'novel/directory/UPDATE_LIST_ORDER';
const UPDATE_LAST_READ = 'novel/directory/UPDATE_LAST_READ';

export const fetchListFromDB = (novel:Novel)=>{
  return (dispatch:func) => {
    dispatch(_fetchList(novel.directoryUrl));
    
    if (novel.isParseDirectory) {
      let directory = JSON.parse(novel.directory);
      if(novel.lastReadIndex>directory.length/2.0){
        dispatch(updateListOrder('desc'));
      }
      dispatch(fetchListSuccess(directory));
      dispatch(updateLastRead(novel.lastReadIndex));
    }
  };
};

export const fetchListFromNetwork = (novel:Novel,callback:func)=>{
  return (dispatch:func) => {
    getArticlesFromUrl(novel.directoryUrl).then((directory:Array<Article>)=>{
      let realm = realmFactory();
      realm.write(()=>{
        novel.directory = JSON.stringify(directory);
        novel.isParseDirectory = true;
        novel.lastArticleTitle = directory[directory.length-1].title;
        if (
          require('../store').default.getState().directory.directoryUrl
          == novel.directoryUrl
        ) {
          dispatch(fetchListSuccess(directory));
          dispatch(updateLastRead(novel.lastReadIndex));
        }
      });
    }).catch(e=>alert(e));
  };
};

const _fetchList = createAction(FETCH_LIST);
const fetchListSuccess = createAction(FETCH_LIST_SUCCESS);
const fetchListFailed = createAction(FETCH_LIST_FAILED);
export const updateListOrder = createAction(UPDATE_LIST_ORDER);
export const updateLastRead = createAction(UPDATE_LAST_READ);
// export const updateNovelStar = createAction(UPDATE_NOVEL_STAR);

const initialState:{
  fetching: bool,
  error:string,
  directory:Array<Article>,
  directoryUrl:string,
  order:'desc'|'asc',
  lastReadIndex:number,
} = Immutable.fromJS({
  fetching:true,
  error:'',
  directory:[],
  order:'asc',
  lastReadIndex:0,
  directoryUrl:'',
});

export default createReducer(initialState,{
  [FETCH_LIST](state,action) {
    return state.merge({
      fetching:true,
      error:'',
      directory:[],
      order:'asc',
      lastReadIndex:0,
      directoryUrl:action.payload,
    });
  },
  [FETCH_LIST_SUCCESS](state,action) {
    return state.merge({
      fetching:false,
      directory:action.payload,
    });
  },
  [UPDATE_LIST_ORDER](state,action) {
    let order;
    if(action.payload  == 'asc'||action.payload  == 'desc'){
      order = action.payload;
    }else{
      order = state.order=='desc'?'asc':'desc';
    }
    
    // if(order=='desc'){
    //   //change to desc
    //   dataSource = ds.cloneWithRows([...state.directory].reverse());
    // }else{
    //   dataSource = ds.cloneWithRows(state.directory);
    // }
    
    return state.merge({
      order
    });
  },
  [UPDATE_LAST_READ](state,action) {
    return state.merge({
      lastReadIndex:action.payload
    });
  },
  
});
