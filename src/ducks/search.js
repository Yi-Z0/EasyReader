//@flow
import { createAction,handleActions } from 'redux-actions';
import {Master} from '../parser';
import { createReducer } from 'redux-immutablejs'
import Immutable from 'immutable'

const SEARCH = 'novel/search/SEARCH';
const FOUND_NOVEL = 'novel/search/FOUND_NOVEL';
const FAILED = 'novel/search/FAILED';


export const search = (keywords:string)=>{
  return (dispatch:func) => {
    let master = new Master();
    
    master.search(keywords,(novel)=>{
      dispatch(foundNovel({
        keywords,
        novel
      }));
    }).then(()=>{
      dispatch(failed());
    }).catch((error)=>{
      dispatch(failed(error));
    });
    
    dispatch(_search(keywords));
  };
}
const _search = createAction(SEARCH);
const foundNovel = createAction(FOUND_NOVEL);
const failed = createAction(FAILED);

const initialState = Immutable.fromJS({
  novels: [],
  searching:false,
  error:null,
  keywords:''
});

export default createReducer(initialState,{
  [SEARCH](state,action) {
    return state.merge({
      novels: [],
      searching: true,
      keywords:action.payload
    });
  },
  [FOUND_NOVEL](state,action){
    if (state.get('keywords') == action.payload.keywords) {
      let novels = state.get('novels').push(action.payload.novel);
      return state.merge({
        searching: false,
        novels
      });
    }else{
      return state;
    }
  },
  [FAILED](state,action){
    return state.merge({
      searching: false,
    });
  }
});
