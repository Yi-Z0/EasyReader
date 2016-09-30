import crawler from './crawler';
export default async function parseArticleContent(article:Article,rule:domTextRule,retry:number = 3):Promise<string> {
 if (article.full) {
   return article.content;
 }
 
 let $:cheerio = await crawler(article.url);
 
 article.content = rule($);

 if (article.content.length<5 && retry>0) {
   return parseArticleContent(article,rule,retry-1);
 }
 
 article.full = true;
 return article.content;
}