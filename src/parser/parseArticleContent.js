import crawler from './crawler';
import {getRuleByUrl} from '../rules';

export default async function parseArticleContent(url:string,retry:number = 3):Promise<string> {
 //get data from db
 //save data to db after 
   let rule = getRuleByUrl(url);
   let content = '';
   try{
     let $:cheerio = await crawler(url);
     
     content = rule.articleContentRule($);
   }catch(e){
     if (retry == 0) {
       return e;
     }
   }
   
   if (content.length<5 && retry>0) {
     return parseArticleContent(url,retry-1);
   }
   
   return content;
}