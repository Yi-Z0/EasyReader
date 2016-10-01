import crawler from './crawler';
import {getRuleByUrl} from '../rules';

export default async function parseArticleContent(url:string,retry:number = 3):Promise<string> {
 
 let rule = getRuleByUrl(url);
 let $:cheerio = await crawler(url);
 
 let content = rule.articleContentRule($);

 if (content.length<5 && retry>0) {
   return parseArticleContent(url,retry-1);
 }
 
 return content;
}