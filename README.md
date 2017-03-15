# EasyReader
基于React native 的开源小说阅读器 , QQ群 : 579376280
[安卓下载链接](https://fir.im/anovel)

## 支持
如果喜欢这个项目可以使用支付宝进行捐赠 , 您的支持是我前进的动力.
 ![image](https://github.com/YouYII/EasyReader/raw/master/qrcode.png)


# 手指左右滑动翻页
请使用slidepage分支进行打包运行测试,目前没有动画实现.

# Features

- [x] 小说站点规则解析
- [x] 多重规则,多个站点同时搜索
- [x] 目录解析
- [x] 文章解析,文章预加载
- [x] 收藏小说
- [x] 文本阅读器,上下滚动条模式
- [x] 文本宽度/分页计算 [参考并且使用 /src/containers/Reader/Reader.js 这个文件代替默认的 /src/containers/Reader.js]
- [x] 文本阅读器,左右点击翻页模式
- [x] 收藏页下拉更新所有小说 (20161028)
- [ ] 后台更新所有小说 (20161028)
- [ ] 文本阅读器,左右点击翻页模式需要支持左右滑动翻页
- [ ] 文字大小设置,背景设置
- [ ] 小说logo解析
- [ ] android 体验优化
- [ ] 滚动到当前章节优化
- [ ] 章节页面执行刷新

# Running
因为使用了realm 数据库, 首次运行会在 Downloading dependency: core 1.1.2 这里停留的比较久
> npm install

> react-native run-ios

# Build
> npm run build

# 已知问题
- 当标题太长的时候,会影响导航上的按钮
- android 跳转到已读章节有问题(react-native scroll view 导致的)
- ~~删除过已读列表中的内容后,再读新的书,会导致已读列表中更新失败~~
- ~~进入目录页面刷新列表的时候,在获取到列表前切换到另外一个目录中,会导致目录错误~~
- ~~安卓上,目录页加载的时候,loading覆盖高度有问题~~

# 声明
本软件仅作学习用途 
