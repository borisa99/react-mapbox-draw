import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYm9yaXNhOTkiLCJhIjoiY2xmcGkwN2VmMGJlajN3b2I0eDl2YXFlYyJ9.tvPC_MR8AtkujSi2MF5CaQ";

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-71.0611);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(12);
  const [roundedArea, setRoundedArea] = useState("");

  const draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
      polygon: true,
      trash: true,
    },

    defaultMode: "draw_polygon",
  });

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
    map.current.addControl(draw);
    map.current.on("draw.create", updateArea);
    map.current.on("draw.delete", updateArea);
    map.current.on("draw.update", updateArea);
  }, []);

  const updateArea = (e) => {
    const data = draw.getAll();
    if (data.features.length > 0) {
      const area = turf.area(data);
      setRoundedArea(Math.round(area * 100) / 100);
    } else {
      setRoundedArea("");
      if (e.type !== "draw.delete") alert("Click the map to draw a polygon.");
    }
  };

  return (
    <div className="container">
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div className="sidebar sidebar-right">
        <p>Click the map to draw a polygon.</p>
        {roundedArea && (
          <div>
            <p>
              <strong>{roundedArea}</strong>
            </p>
            <p>square meters</p>
          </div>
        )}
      </div>
      <div ref={mapContainer} className="map" />
    </div>
  );
}
