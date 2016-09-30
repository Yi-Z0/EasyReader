//@flow
import Parser from './Parser';
import rules from '../rules';

export default class Master{
  parsers: Array < Parser > ;

  search(keywords: string,callback:(novel:Novel,rule:Rule)=>void):Promise<any>{
    this.parsers = [];
    let jobs:Array<Promise<any>> = [];
    for (let rule of rules) {
      let parser = new Parser(rule);
      this.parsers.push(parser);
      jobs.push(parser.search(keywords,callback));
    }

    return Promise.all(jobs);
  }
  
  cancel(){
    for (let parser of this.parsers) {
      parser.cancel();
    }
  }
}
