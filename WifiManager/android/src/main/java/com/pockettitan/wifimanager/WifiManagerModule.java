package com.pockettitan.wifimanager;

import android.net.wifi.WifiManager;
import android.net.wifi.WifiInfo;

import android.app.Activity;
import android.content.Context;
import com.facebook.react.uimanager.ViewManager;
import android.util.Log;

import com.facebook.react.bridge.*;

import java.util.Map;

public class WifiManagerModule extends ReactContextBaseJavaModule {
  private static Activity mActivity;
  public WifiManagerModule(ReactApplicationContext reactContext, Activity activity) {
    super(reactContext);
    mActivity = activity;
  }

  @Override
  public String getName() {
    return "WifiManagerModule";
  }

  @ReactMethod
  public void getRssi(Promise promise) {
    WifiManager wifiManager = (WifiManager) getReactApplicationContext().getSystemService(Context.WIFI_SERVICE);
    WifiInfo info = wifiManager.getConnectionInfo();
    int rssi = info.getRssi();
    int signal = wifiManager.calculateSignalLevel(rssi, 5);
    promise.resolve(signal);
  }
}
