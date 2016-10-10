//@flow
import { combineReducers } from 'redux-immutablejs';

export let bookshelf = require('./bookshelf');
export let search = require('./search');
export let directory = require('./directory');


export let routes = require('./routes');


export const reducers = combineReducers({
  bookshelf:bookshelf.default,
  search:search.default,
  directory:directory.default,
  
  
  routes:routes.default,
});