//@flow
import { combineReducers } from 'redux';

export let bookshelf = require('./bookshelf');
export let search = require('./search');
export let routes = require('./routes');


export const reducers = combineReducers({
  bookshelf:bookshelf.default,
  search:search.default,
  routes:routes.default,
});