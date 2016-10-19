//
//  BaiduMobStat.h
//  BaiduMobStat
//
//  Created by Lidongdong on 15/7/22.
//  Copyright (c) 2015年 Baidu. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
@class UIViewController;

/**
 *  日志发送策略
 */
typedef enum _BaiduMobStatLogStrategy {
    BaiduMobStatLogStrategyAppLaunch = 0,   //每次程序启动时发送（默认策略，推荐使用!）
    BaiduMobStatLogStrategyDay = 1,         //每天的程序第一次进入启动
    BaiduMobStatLogStrategyCustom = 2,      //根据设定的时间间隔发送
} BaiduMobStatLogStrategy;

/**
 *  自动监控策略
 *  启动自动监控策略后，原先相应调用Api手动埋点的代码需要删除，避免重复统计！！
 *  举例：启动BaiduMobStatMonitorStrategyPageView策略，则不需要调用pageviewStartWithName等接口进行页面统计。
 */
typedef enum _BaiduMobStatMonitorStrategy {
    BaiduMobStatMonitorStrategyNone = 0,        //不启用自动监控
    BaiduMobStatMonitorStrategyPageView = 1,    //只启动页面统计自动监控
    BaiduMobStatMonitorStrategyButton = 2,      //只启动button统计自动监控
    BaiduMobStatMonitorStrategyAll = 3,         //启动页面统计与button统计自动监控
} BaiduMobStatMonitorStrategy;

/**
 *  百度移动应用统计接口
 *  当前版本 4.1.0
 */
@interface BaiduMobStat : NSObject
/**
 *  以下property属性，均为可选设置
 */

/**
 *  设置app的版本号
 *  从4.1版本开始，默认统计CFBundleShortVersionString中的版本号（即与AppStore上一致的版本号
 *  如需统计自行设定的版本号，可由此传入
 */
@property (nonatomic, copy) NSString *shortAppVersion;

/**
 *  设置渠道Id
 *  默认值为 "AppStore"
 */
@property (nonatomic, copy) NSString *channelId;

/**
 *  是否启用Crash日志收集
 *  默认值 YES
 */
@property (nonatomic) BOOL enableExceptionLog;

/**
 *  是否仅在wifi网络状态下才发送日志
 *  默认值 NO
 */
@property (nonatomic) BOOL logSendWifiOnly;

/**
 *  设置应用进入后台再回到前台为同一次启动的最大间隔时间，有效值范围0～600s
 *  例如设置值30s，则应用进入后台后，30s内唤醒为同一次启动
 *  默认值 30s
 */
@property (nonatomic) int sessionResumeInterval;

/**
 *  设置日志发送策略
 *  默认值 BaiduMobStatLogStrategyAppLaunch
 */
@property (nonatomic) BaiduMobStatLogStrategy logStrategy;

/**
 *  设置日志发送时间间隔
 *  当logStrategy设置为BaiduMobStatLogStrategyCustom时生效
 *  单位为小时，有效值为1~24
 *  默认值为 1
 */
@property (nonatomic) int logSendInterval;

/**
 *  设置是否打印SDK中的日志，用于调试
 *  默认值 NO
 */
@property (nonatomic) BOOL enableDebugOn;

/**
 *  设置设备adid
 *  若有需要，开发者可自行获取到adid后传入，使统计更精确
 *  默认值 空字符串:@""
 */
@property (nonatomic, copy) NSString *adid;

/**
 *  设置自动监控策略
 *  默认值 BaiduMobStatMonitorStrategyNone 不启动自动监控
 */
@property (nonatomic, assign) BaiduMobStatMonitorStrategy monitorStrategy;

/**
 *  获取统计对象的实例
 *
 *  @return 一个统计对象实例
 */
+ (BaiduMobStat *)defaultStat;

/**
 *  设置应用的appkey，启动统计SDK。
 *  注意！！！以下行为Api调用前，必须先调用该接口。
 *
 *  @param appKey 用户在mtj网站上创建应用，获取对应的appKey
 */
- (void)startWithAppId:(NSString *)appKey;

/**
 *  记录一次事件的点击，eventId请在网站上创建。未创建的evenId记录将无效。
 *
 *  @param eventId 自定义事件Id，提前在网站端创建
 *  @param eventLabel 自定义事件Label，附加参数，不能为空字符串
 */
- (void)logEvent:(NSString *)eventId eventLabel:(NSString *)eventLabel;

/**
 *  记录一次事件的时长，eventId请在网站上创建。未创建的evenId记录将无效。
 *
 *  @param eventId 自定义事件Id，提前在网站端创建
 *  @param eventLabel 自定义事件Label，附加参数，不能为空字符串
 *  @param duration 已知的自定义事件时长，单位为毫秒（ms）
 */
- (void)logEventWithDurationTime:(NSString *)eventId eventLabel:(NSString *)eventLabel durationTime:(unsigned long)duration;

/**
 *  记录一次事件的开始，eventId请在网站上创建。未创建的evenId记录将无效。
 *
 *  @param eventId 自定义事件Id，提前在网站端创建
 *  @param eventLabel 自定义事件Label，附加参数，不能为空字符串
 */
- (void)eventStart:(NSString *)eventId eventLabel:(NSString *)eventLabel;

/**
 *  记录一次事件的结束，eventId请在网站上创建。未创建的evenId记录将无效。
 *
 *  @param eventId 自定义事件Id，提前在网站端创建
 *  @param eventLabel 自定义事件Label，附加参数，不能为空字符串
 */
- (void)eventEnd:(NSString *)eventId eventLabel:(NSString *)eventLabel;

/**
 *  记录某个页面访问的开始，请参见Example程序，在合适的位置调用。
 *  建议在ViewController的viewDidAppear函数中调用
 *
 *  @param name 页面名称
 */
- (void)pageviewStartWithName:(NSString *)name;

/**
 *  记录某个页面访问的结束，与pageviewStartWithName配对使用，请参见Example程序，在合适的位置调用。
 *  建议在ViewController的viewDidDisappear函数中调用
 *
 *  @param name 页面名称
 */
- (void)pageviewEndWithName:(NSString *)name;

/**
 *  记录UIWebView中的行为（需要在网页的JS代码中进行相应配置，详见文档与Demo程序）
 *  在UIWebView的代理方法：
 *  - (BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType
 *  中，调用此接口，传入request参数，开始统计JS中的操作
 *
 *  @param request UIWebView的请求参数
 */
- (void)webviewStartLoadWithRequest:(NSURLRequest *)request;

/**
 *  获取cuid的值
 *  返回SDK生成的cuid
 *
 *  @return 设备Cuid
 */
- (NSString *)getDeviceCuid;


@end

/**
 *  Category 声明
 */
#define BAIDU_MOB_STAT_DEFINE_CATEGORY \
@interface UIViewController (BaiduMobStatViewController) \
@property (nonatomic, assign) BOOL baiduMobStatHandleRecord; \
@property (nonatomic, strong) NSString *titleForBaiduMobStat; \
@end \
@interface UIWindow (BaiduMobStatWindow) \
@end \
@interface UIButton (BaiduMobStatButton) \
@property (nonatomic, assign) BOOL baiduMobStatHandleRecord; \
@property (nonatomic, strong) NSString *titleForBaiduMobStat; \
@property (nonatomic, strong) NSString *labelForBaiduMobStat; \
@end

BAIDU_MOB_STAT_DEFINE_CATEGORY
