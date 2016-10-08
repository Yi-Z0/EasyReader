//@flow
import {applyMiddleware, createStore,compose} from 'redux';
import thunk from 'redux-thunk';
import devTools from 'remote-redux-devtools';
import { Platform } from 'react-native';
import Immutable from 'immutable';
import {reducers} from './ducks';


const store = createStore(reducers,
  Immutable.fromJS({}),
  compose(
    applyMiddleware(
      thunk
    ),
    devTools({
      name: Platform.OS,
      hostname: 'localhost',
      port: 5678
    })
  )
);

// 
if (module.hot) {
  // Enable hot module replacement for reducers
  module.hot.accept(() => {
    const nextRootReducer = require('./ducks').reducers;
    store.replaceReducer(nextRootReducer);
  });
}

export default store;