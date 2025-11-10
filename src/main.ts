// @deno-types="npm:@types/leaflet"
import leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import "./style.css";

import "./_leafletWorkaround.ts";
import luck from "./_luck.ts";

const mapDiv = document.createElement("div");
mapDiv.id = "map";
document.body.append(mapDiv);

// Our classroom location
const CLASSROOM_LATLNG = leaflet.latLng(
  36.997936938057016,
  -122.05703507501151,
);

// Tunable gameplay parameters
const GAMEPLAY_ZOOM_LEVEL = 19;
const NEIGHBORHOOD_SIZE = 8;
const TILE_DEGREES = 1e-4;
const SPAWN_PROBABILITY = 0.1;

const map = leaflet.map(mapDiv, {
  center: CLASSROOM_LATLNG,
  zoom: GAMEPLAY_ZOOM_LEVEL,
  minZoom: GAMEPLAY_ZOOM_LEVEL,
  maxZoom: GAMEPLAY_ZOOM_LEVEL,
  zoomControl: false,
  scrollWheelZoom: false,
});

leaflet
  .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  })
  .addTo(map);

const playerMarker = leaflet.marker(CLASSROOM_LATLNG);
playerMarker.bindTooltip("You");
playerMarker.addTo(map);

function createCell(i: number, j: number) {
  const bounds = leaflet.latLngBounds([
    [
      CLASSROOM_LATLNG.lat + i * TILE_DEGREES,
      CLASSROOM_LATLNG.lng + j * TILE_DEGREES,
    ],
    [
      CLASSROOM_LATLNG.lat + (i + 1) * TILE_DEGREES,
      CLASSROOM_LATLNG.lng + (j + 1) * TILE_DEGREES,
    ],
  ]);

  leaflet.rectangle(bounds).addTo(map);
}

for (let i = -NEIGHBORHOOD_SIZE; i < NEIGHBORHOOD_SIZE; i++) {
  for (let j = -NEIGHBORHOOD_SIZE; j < NEIGHBORHOOD_SIZE; j++) {
    if (luck([i, j].toString()) < SPAWN_PROBABILITY) {
      createCell(i, j);
    }
  }
}
