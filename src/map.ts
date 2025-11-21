// @deno-types="npm:@types/leaflet"
import leaflet from "leaflet";
import { Cell, spawnCells, updateAllCells } from "./cell.ts";
import { Player } from "./player.ts";
import { WorldState } from "./world.ts";

// Parameters
export const TILE_DEGREES = 1e-4;
export const GAMEPLAY_ZOOM_LEVEL = 19;
const MIN_ZOOM_LEVEL = 17;

// Locations
export const DEFAULT_SPAWN = leaflet.latLng(
  36.997936938057016,
  -122.05703507501151,
);
export const WORLD_ORIGIN = leaflet.latLng(0, 0);

export let map: leaflet.Map;
export function createMap(): leaflet.Map {
  map = leaflet.map("map", {
    center: DEFAULT_SPAWN,
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

export function setupMapEventListeners(
  cells: Map<string, Cell>,
  worldState: WorldState,
  player: Player,
  updateStatus: () => void,
) {
  map.on("moveend", () => {
    for (const [_key, cell] of cells.entries()) {
      cell.rectangle.remove();
      if (cell.text) {
        cell.text.remove();
      }
    }
    cells.clear();
    spawnCells(cells, worldState, player, updateStatus);
    updateAllCells(cells, player);
  });
}
