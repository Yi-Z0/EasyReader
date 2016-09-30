//@flow
/*
http://zhannei.baidu.com/cse/site?q=%E4%B8%80%E4%B8%96&cc=www.23wx.com
*/
import crawler from './crawler';
import type cheerio from 'cheerio';

/*
event type newNovelFound
 */
export default class Parser{
  rule: Rule;
  novelsUrl:Array<string> = [];
  constructor(rule: Rule) {
    this.rule = rule;
  }

  /**
   * 取消任务
   */
  cancel(){
    
  }
  /**
   * 根据关键词搜索书
   * @param  {string} keywords 用户输入的关键词,可能是书名,作者,或者其他
   * @return Promise ,标识是否成功结束
   */
  search(keywords: string,callback:(novel:Novel,rule:Rule)=>void):Promise<any>{
    let url = `http://zhannei.baidu.com/cse/site?q=${encodeURIComponent(keywords)}&cc=${this.rule.domain}`;

    //最多多少页
    let max = 3;
    let jobs:Array<Promise<any>> = [];
    for (let i = 0; i < max; i++) {
      jobs.push(crawler(url+'&p='+i).then(($) => {
        this.getNovelsUrl($,(max-i)*100,callback);
        return Promise.resolve();
      }));
    }

    return Promise.all(jobs);
  }

  getNovelsUrl($: cheerio,score:number,callback:(novel:Novel,rule:Rule)=>void){
    let links = $('#results .c-title a');
    let perRankScore = Math.floor(99.0/links.length);
    let rule = this.rule;
    links.each((i, link) => {

      //取href 的domain后的url
      let cleanUrlRule = new RegExp(`^https?://${this.rule.domain.replace('.', '\\.')}`);
      let directoryUrl = $(link).attr('href');

      if (this.novelsUrl.indexOf(directoryUrl) == -1) {

        let ruleWantMath = directoryUrl.replace(cleanUrlRule, '');

        if (this.rule.directoryUrlRegexp.test(ruleWantMath)) {
          this.novelsUrl.push(directoryUrl);

          let title = $(link).text();
          let match = title.match(this.rule.titleRule);
          if (match) {
            title = match[0];
          }

          let desc = $(link).parents('.result').find('.c-abstract').text().replace(/\n/g,'').trim();

          let novel:Novel = {
            title,
            directoryUrl,
            desc,
            isParseDirectory:false,
            logo:'',
            author:'',
            directory:[],
            score: score + (links.length-i)*perRankScore

          };
          callback(novel,rule);
        }

      }
    });
  }
}
