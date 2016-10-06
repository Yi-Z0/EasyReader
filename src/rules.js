import parse from 'url-parse';

const rules = [
  {
    domain: `www.luoqiu.com`,
    encode:'gbk',
    //工作在搜索引擎提取的url中
    directoryUrlRegexp: /^\/read\/\d+\/?(index\.html)?$/,

    //工作在搜索引擎提取页面
    titleRule: /.*(?=最新章节)/,
    //工作在列表页面
    authorRule: $=>$("h1.bname").next('div').find('a:eq(0)').text(),
    //工作在列表页面,返回一个a标签
    articleLinkRule: $=>$("td>.dccss>a"),
    //工作在文章页面
    articleContentRule: $=>{
      $("#content br").replaceWith("\r\n");
      return $("#content").text();
    },
  },
  // {
  //   domain: `www.23wx.com`,
  //   encode:'gbk',
  //   //工作在搜索引擎提取的url中
  //   directoryUrlRegexp: /^\/html\/\d+\/\d+\/?(index\.html)?$/,
  //   //工作在搜索引擎提取页面
  //   titleRule: /^[^\s]*/,
  //   //工作在列表页面
  //   authorRule: $=>$("h3").text().replace(/^.*：/,''),
  //   //工作在列表页面,返回一个a标签
  //   articleLinkRule: $=>$("td.L>a"),
  //   //工作在文章页面
  //   articleContentRule: $=>{
  //     $("#contents br").replaceWith("\r\n");
  //     return $("#contents").text();
  //   },
  // },
  // {
  //   domain: `www.bxwx8.org`,
  //   encode:'gbk',
  //   //工作在搜索引擎提取的url中
  //   directoryUrlRegexp: /^\/b\/\d+\/\d+\/?(index\.html)?$/,
  //   //工作在搜索引擎提取页面
  //   titleRule: /.*(?=最新)/,
  //   //工作在列表页面
  //   authorRule: $ => $("#info a").eq(0).text(),
  //   //工作在列表页面,返回一个a标签
  //   articleLinkRule: $ => {
  //     //网站对顺序进行了处理
  //     //返回大组
  //     let box = $('<div/>');
  //     let links = [];
  //     $("#TabCss dd>a").each((i, link) => {
  //       let base = Math.floor(i / 4.0);
  //       let plus = 0;
  //       switch (i % 4) {
  //         case 0:
  //           plus = 4
  //           break;
  //         case 1:
  //           plus = 1
  //           break;
  //         case 2:
  //           plus = 3
  //           break;
  //         case 3:
  //           plus = 2
  //           break;
  //       }
  //       links[base*4+plus] = link;
  //     });
  // 
  //     for (let link of links) {
  //       if (link) {
  //         box.append(link);
  //       }
  //     }
  // 
  //     return box.find('a');
  //   },
  //   //工作在文章页面
  //   articleContentRule: $ => {
  //     $("#content br").replaceWith("\r\n");
  //     return $("#content").text();
  //   },
  // },
  // {
  //   domain: `www.biquge.tw`,
  //   encode:'utf8',
  //   //工作在搜索引擎提取的url中
  //   directoryUrlRegexp: /^\/\d+_\d+\/?(index\.html)?$/,
  //   //工作在搜索引擎提取页面
  //   titleRule: /.*(?=最新)/,
  //   //工作在列表页面
  //   authorRule: $=>$("#info>p").eq(0).text().replace(/(?=：).*$/,''),
  //   //工作在列表页面,返回一个a标签
  //   articleLinkRule: $=>$("#list dd>a"),
  //   //工作在文章页面
  //   articleContentRule: $=>{
  //     $("#content br").replaceWith("\r\n");
  //     return $("#content").text().replace('readx();&nbsp;&nbsp;&nbsp;&nbsp;','');
  //   },
  // },
];
export default rules;

function replaceBR(html:string){
  html.replace(/<br>/)
}
export function getRuleByUrl(url:string):Rule|null{
  let urlObject = parse(url);
  let domain = urlObject.hostname;
  for(var rule of rules){
    if (rule.domain == domain) {
      return rule;
    }
  }
  return null;
}