// @deno-types="npm:@types/leaflet"
import leaflet from "leaflet";

export const TILE_DEGREES = 1e-4;
export const GAMEPLAY_ZOOM_LEVEL = 19;

// Default location
export const CLASSROOM_LATLNG = leaflet.latLng(
  36.997936938057016,
  -122.05703507501151,
);

export const NULL_ISLAND = leaflet.latLng(0, 0);

// Map parameters
const MIN_ZOOM_LEVEL = 17;

export let map: leaflet.Map;

export function createMap(): leaflet.Map {
  map = leaflet.map("map", {
    center: CLASSROOM_LATLNG,
    zoom: GAMEPLAY_ZOOM_LEVEL,
    minZoom: MIN_ZOOM_LEVEL,
    zoomControl: false,
    scrollWheelZoom: true,
  });

  leaflet
    .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    })
    .addTo(map);

  return map;
}
