package com.yihom.novel;

import com.facebook.react.ReactActivity;
import com.react.rnspinkit.RNSpinkitPackage;
import android.os.Bundle;

import com.baidu.mobstat.StatService;
import com.baidu.mobstat.SendStrategyEnum;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "NovelReader";
    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        StatService.setSendLogStrategy(this, SendStrategyEnum.APP_START, 1, false);
    }
}
