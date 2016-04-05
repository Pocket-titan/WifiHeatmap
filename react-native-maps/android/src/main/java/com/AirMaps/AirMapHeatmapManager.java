package com.AirMaps;

import android.content.Context;
import android.graphics.Color;
import android.os.Build;
import android.util.DisplayMetrics;
import android.view.WindowManager;

import com.facebook.react.bridge.ReadableArray;
import com.google.android.gms.maps.model.LatLng;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.google.android.gms.maps.model.LatLng;

public class AirMapHeatmapManager extends ViewGroupManager<AirMapHeatmap> {
    private DisplayMetrics metrics;

    public AirMapHeatmapManager(ReactApplicationContext reactContext) {
        super();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            metrics = new DisplayMetrics();
            ((WindowManager) reactContext.getSystemService(Context.WINDOW_SERVICE))
                    .getDefaultDisplay()
                    .getRealMetrics(metrics);
        } else {
            metrics = reactContext.getResources().getDisplayMetrics();
        }
    }

    @Override
    public String getName() {
        return "AIRMapHeatmap";
    }

    @Override
    public AirMapHeatmap createViewInstance(ThemedReactContext context) {
        return new AirMapHeatmap(context);
    }

    @ReactProp(name = "isVisible", defaultBoolean = true)
    public void setVisible(AirMapHeatmap view, boolean isVisible) {
        view.setVisible(isVisible);
    }

    @ReactProp(name = "opacity", defaultDouble = 0.7)
    public void setOpacity(AirMapHeatmap view, double opacity) {
        view.setOpacity(opacity);
    }

    @ReactProp(name = "radius", defaultInt = 20)
    public void setRadius(AirMapHeatmap view, int radius) {
        view.setRadius(radius);
    }

    @ReactProp(name = "coordinates")
    public void setCoordinate(AirMapHeatmap view, ReadableArray coordinates) {
        view.setCoordinates(coordinates);
    }

    @ReactProp(name = "zIndex", defaultFloat = 1.0f)
    public void setZIndex(AirMapHeatmap view, float zIndex) {
        view.setZIndex(zIndex);
    }

}
