package com.AirMaps;

import android.content.Context;

import com.google.android.gms.maps.GoogleMap;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.TileOverlay;
import com.google.android.gms.maps.model.TileOverlayOptions;
import com.google.maps.android.heatmaps.HeatmapTileProvider;
import java.util.ArrayList;
import java.util.List;
import android.util.Log;
import com.google.maps.android.heatmaps.WeightedLatLng;

public class AirMapHeatmap extends AirMapFeature {

    private TileOverlayOptions tileOverlayOptions;
    private TileOverlay tileOverlay;

    //Settings
    private ArrayList<WeightedLatLng> coordinates = null;
    private double opacity = 0.7;
    private int radius = 20;
    private float zIndex;
    private boolean isVisible;
    private HeatmapTileProvider heatmapTileProvider;
    private GoogleMap googleMap;

    public AirMapHeatmap(Context context) {
        super(context);
    }

    public void setOpacity(double opacity) {
        this.opacity = opacity;
        updateTileProvider();
    }

    public void setRadius(int radius) {
        this.radius = radius;
        updateTileProvider();
    }

    public void setZIndex(float zIndex) {
        this.zIndex = zIndex;
        if (tileOverlay != null) {
            tileOverlay.setZIndex(zIndex);
        }
    }

    public void setCoordinates(ReadableArray coordinates) {
      this.coordinates = new ArrayList<>(coordinates.size());
      for (int i = 0; i < coordinates.size(); i++) {
          ReadableMap coordinate = coordinates.getMap(i);
          this.coordinates.add(i,
              new WeightedLatLng(new LatLng(coordinate.getDouble("latitude"), coordinate.getDouble("longitude")), coordinate.getDouble("intensity")));
      }
      updateTileProvider();
    }

    public void updateTileProvider() {
      if (coordinates == null) {
        return;
      }
      heatmapTileProvider = new HeatmapTileProvider.Builder().weightedData(coordinates).radius(radius).opacity(opacity).build();
      if (tileOverlay != null) {
        tileOverlay.remove();
        tileOverlay = googleMap.addTileOverlay(createTileOverlayOptions());
      }
    }

    public void setVisible(boolean isVisible) {
        this.isVisible = isVisible;
        if (tileOverlay != null) {
            tileOverlay.setVisible(isVisible);
        }
    }

    public TileOverlayOptions getTileOverlayOptions() {
        if (tileOverlayOptions == null) {
            tileOverlayOptions = createTileOverlayOptions();
        }
        return tileOverlayOptions;
    }

    private TileOverlayOptions createTileOverlayOptions() {
        TileOverlayOptions options = new TileOverlayOptions();
        options.zIndex(zIndex);
        options.isVisible();
        options.tileProvider(heatmapTileProvider);
        return options;
    }

    @Override
    public Object getFeature() {
        return tileOverlay;
    }

    @Override
    public void addToMap(GoogleMap map) {
        googleMap = map;
        tileOverlay = map.addTileOverlay(getTileOverlayOptions());
    }

    @Override
    public void removeFromMap(GoogleMap map) {
        tileOverlay.remove();
    }
}
