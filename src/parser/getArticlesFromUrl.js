import {getRuleByUrl} from '../rules';
import crawler from './crawler';
import parse from 'url-parse';

export default async function getArticlesFromUrl(directoryUrl:string ,retry:number = 3):Promise<Array<Article>>{

  let rule = getRuleByUrl(directoryUrl);
  let $:cheerio = await crawler(directoryUrl);
  let urlObject = parse(directoryUrl);
  let domainUrl = `${urlObject.protocol}//${urlObject.hostname}`;
  // novel.author = rule.authorRule($);

  let links:cheerio = rule.articleLinkRule($);
  if (links.length == 0) {
    //认为数据错误,尝试再次获取,直到达到上限
    if (retry>0) {
      // console.error('注意了,返回的数量为0',$('html').html());
      return getArticlesFromUrl(directoryUrl,retry-1);
    }else{
      throw new Error('章节数量为0,或者是解析失败.');
    }
  }

  let articles = [];
  links.each((i, link) => {
    let articleUrl = $(link).attr('href');
    if (!articleUrl.match(/^https?:/)) {
      //articleUrl 是一个相对路径
      if (articleUrl.match(/^\//)) {
        //是一个以/开头的相对路径
        articleUrl = domainUrl + articleUrl;
      } else{
        //不是以/开头的相对路径
        //取得directoryUrl所在的目录
        let urlPath = directoryUrl.replace(/\/[^\/]*$/, '');
        articleUrl = urlPath +'/'+ articleUrl;
      }
    }
    articles.push({
      title:$(link).text(),
      url:articleUrl,
      // rule:novel.rule.articleContentRule,
      // content:'',
      // full:false
    });
  });
  return articles;
}