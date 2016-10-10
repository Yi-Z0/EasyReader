import { ActionConst } from 'react-native-router-flux';
import { createReducer } from 'redux-immutablejs'
import Immutable from 'immutable'
const initialState = Immutable.fromJS({
  scene: {},
});

export default createReducer(initialState,{
  [ActionConst.FOCUS](state,{scene}) {
    return state.merge({
      scene,
    });
  },
  
});
