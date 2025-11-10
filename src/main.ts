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

const cells = new Map<string, Cell>();

class Cell {
  i: number;
  j: number;
  bounds: leaflet.LatLngBounds;
  rectangle: leaflet.Rectangle;
  token: number | undefined;
  text: leaflet.Marker | undefined;

  constructor(i: number, j: number) {
    this.i = i;
    this.j = j;
    this.bounds = leaflet.latLngBounds([
      [
        CLASSROOM_LATLNG.lat + i * TILE_DEGREES,
        CLASSROOM_LATLNG.lng + j * TILE_DEGREES,
      ],
      [
        CLASSROOM_LATLNG.lat + (i + 1) * TILE_DEGREES,
        CLASSROOM_LATLNG.lng + (j + 1) * TILE_DEGREES,
      ],
    ]);

    this.rectangle = leaflet.rectangle(this.bounds).addTo(map);
    this.rectangle.on("click", () => {
      if (this.token && !player.heldToken) {
        player.heldToken = this.token;
        this.token = undefined;
        if (this.text) {
          this.text.remove();
          this.text = undefined;
        }
        updateStatus();
      }
    });
    if (luck([i, j, "token-exists"].toString()) < 0.5) {
      this.token = luck([i, j, "token-value"].toString()) < 0.5 ? 1 : 2;
      this.text = leaflet.marker(this.bounds.getCenter(), {
        icon: leaflet.divIcon({
          className: "token-label",
          html: `<div>${this.token}</div>`,
        }),
      }).addTo(map);
    }
  }
}

class Player {
  latlng: leaflet.LatLng;
  heldToken: number | undefined;
  marker: leaflet.Marker;

  constructor(latlng: leaflet.LatLng) {
    this.latlng = latlng;
    this.marker = leaflet.marker(latlng).addTo(map);
    this.marker.bindTooltip("You");
  }
}

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

const player = new Player(CLASSROOM_LATLNG);

const statusPanel = document.createElement("div");
statusPanel.id = "statusPanel";
document.body.append(statusPanel);

function updateStatus() {
  if (player.heldToken) {
    statusPanel.textContent = `Holding token: ${player.heldToken}`;
  } else {
    statusPanel.textContent = "Not holding a token";
  }
}

updateStatus();

for (let i = -NEIGHBORHOOD_SIZE; i < NEIGHBORHOOD_SIZE; i++) {
  for (let j = -NEIGHBORHOOD_SIZE; j < NEIGHBORHOOD_SIZE; j++) {
    if (luck([i, j].toString()) < SPAWN_PROBABILITY) {
      cells.set(`${i},${j}`, new Cell(i, j));
    }
  }
}
