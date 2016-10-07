import crawler from './crawler';
import {getRuleByUrl} from '../rules';

let maxRetry = 3;
export default async function parseArticleContent(directoryUrl:string,url:string,refresh:bool=false,retry:number = maxRetry):Promise<string> {
  let realm = realmFactory();
 if (maxRetry == retry && !refresh) {
   let articles = realm.objects('Article').filtered(`url="${url}"`);
   if (articles.length>0) {
     return articles[0].content;
   }
 }

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
   return parseArticleContent(directoryUrl,url,true,retry-1);
 }
   
   //save data to db after 
   realm.write(()=>{
       realm.create('Article', {
         directoryUrl,
         url,
         title:'',
         content,
       },true);
   });
   return content;
}