/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import "RCTBundleURLProvider.h"
#import "RCTRootView.h"
#import "BaiduMobStat.h"
@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];

//  jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true"];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"NovelReader"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  
  
  
  [self startBaiduMobileStat];
  return YES;
}

// 启动百度移动统计
- (void)startBaiduMobileStat{
  /*若应用是基于iOS 9系统开发，需要在程序的info.plist文件中添加一项参数配置，确保日志正常发送，配置如下：
   NSAppTransportSecurity(NSDictionary):
   NSAllowsArbitraryLoads(Boolen):YES
   详情参考本Demo的BaiduMobStatSample-Info.plist文件中的配置
   */
  BaiduMobStat* statTracker = [BaiduMobStat defaultStat];
  // 此处(startWithAppId之前)可以设置初始化的可选参数，具体有哪些参数，可详见BaiduMobStat.h文件，例如：
  statTracker.shortAppVersion  = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];
  statTracker.enableDebugOn = YES;
  
  [statTracker startWithAppId:@"3ac9aecc2a"]; // 设置您在mtj网站上添加的app的appkey,此处AppId即为应用的appKey
  NSLog(@"百度统计初始化完毕");
}

@end
