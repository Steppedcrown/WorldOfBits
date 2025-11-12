// #region Imports
// @deno-types="npm:@types/leaflet"
import leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import "./style.css";

import "./_leafletWorkaround.ts";
import luck from "./_luck.ts";
// #endregion

// #region Create divs
const mapDiv = document.createElement("div");
mapDiv.id = "map";
document.body.append(mapDiv);

const infoPanel = document.createElement("div");
infoPanel.id = "infoPanel";
document.body.append(infoPanel);

const statusPanel = document.createElement("div");
statusPanel.id = "statusPanel";
infoPanel.append(statusPanel);

const controlPanel = document.createElement("div");
controlPanel.id = "controlPanel";
controlPanel.innerHTML = "Controls: <br> w,a,s,d to move";
infoPanel.append(controlPanel);
// #endregion

// #region Gameplay parameters
const GAMEPLAY_ZOOM_LEVEL = 19;
const TILE_DEGREES = 1e-4;
const SPAWN_PROBABILITY = 0.1;
const INTERACTION_RANGE = 5;
const ENDGAME_TOKEN_VALUE = 32;
let gameWon = false;

const cells = new Map<string, Cell>();
// #endregion

// #region Leaflet map setup
// Default location
const CLASSROOM_LATLNG = leaflet.latLng(
  36.997936938057016,
  -122.05703507501151,
);

const NULL_ISLAND = leaflet.latLng(0, 0);

// Map parameters
const MIN_ZOOM_LEVEL = 17;

const map = leaflet.map(mapDiv, {
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

// #endregion

// #region Player class and functions
class Player {
  latlng: leaflet.LatLng;
  tileI: number;
  tileJ: number;
  private heldToken: number | undefined;
  marker: leaflet.Marker;

  constructor(latlng: leaflet.LatLng) {
    this.latlng = latlng;
    this.tileI = Math.round((latlng.lat - NULL_ISLAND.lat) / TILE_DEGREES);
    this.tileJ = Math.round((latlng.lng - NULL_ISLAND.lng) / TILE_DEGREES);
    this.marker = leaflet.marker(latlng).addTo(map);
    this.marker.bindTooltip("You");
  }

  getHeldToken(): number | undefined {
    return this.heldToken;
  }

  setHeldToken(value: number | undefined) {
    this.heldToken = value;
  }

  move(di: number, dj: number) {
    this.tileI += di;
    this.tileJ += dj;
    this.latlng = new leaflet.LatLng(
      this.latlng.lat + di * TILE_DEGREES,
      this.latlng.lng + dj * TILE_DEGREES,
    );
    this.marker.setLatLng(this.latlng);
  }
}

// Player movement
function updatePlayer(di: number, dj: number) {
  player.move(di, dj);
  map.setView(player.latlng, map.getZoom());
}

// Handle keyboard input for movement
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      updatePlayer(1, 0);
      break;
    case "s":
      updatePlayer(-1, 0);
      break;
    case "a":
      updatePlayer(0, -1);
      break;
    case "d":
      updatePlayer(0, 1);
      break;
  }
});
// #endregion

// #region Cell class
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
        NULL_ISLAND.lat + i * TILE_DEGREES,
        NULL_ISLAND.lng + j * TILE_DEGREES,
      ],
      [
        NULL_ISLAND.lat + (i + 1) * TILE_DEGREES,
        NULL_ISLAND.lng + (j + 1) * TILE_DEGREES,
      ],
    ]);

    this.rectangle = leaflet.rectangle(this.bounds).addTo(map);

    // Handle token collection, placement, and merging
    this.rectangle.on("click", () => {
      const distance = Math.sqrt(
        (this.i - player.tileI) ** 2 + (this.j - player.tileJ) ** 2,
      );
      if (distance > INTERACTION_RANGE) {
        return;
      }
      if (player.getHeldToken()) {
        if (!this.token) this.setToken(player.getHeldToken());
        else if (this.token === player.getHeldToken()) {
          this.setToken(this.token * 2);
        }
        player.setHeldToken(undefined);
        updateStatus();
      } else if (this.token) {
        player.setHeldToken(this.token);
        this.setToken(undefined);
        updateStatus();
      }
    });

    // Create random token assignment and value
    if (luck([i, j, "token-exists"].toString()) < 0.5) {
      this.token = luck([i, j, "token-value"].toString()) < 0.5 ? 1 : 2;
      this.setText();
    }
  }

  setToken(value: number | undefined) {
    this.token = value;

    if (this.text) {
      this.text.remove();
      this.text = undefined;
    }

    if (this.token) {
      this.setText();
    }
  }

  setText() {
    this.text = leaflet.marker(this.bounds.getCenter(), {
      icon: leaflet.divIcon({
        className: "token-label",
        html: `<div>${this.token}</div>`,
      }),
    }).addTo(map);
  }
}
// #endregion

const player = new Player(CLASSROOM_LATLNG);

// Handle token status updates
function updateStatus() {
  const heldToken = player.getHeldToken();
  if (heldToken) {
    statusPanel.textContent = `Holding token: ${heldToken}`;
    if (heldToken === ENDGAME_TOKEN_VALUE && !gameWon) {
      gameWon = true;
      statusPanel.textContent += " - You Win! ";

      const restartButton = document.createElement("button");
      restartButton.textContent = "Restart";
      restartButton.onclick = () => location.reload();
      statusPanel.append(restartButton);

      const continueButton = document.createElement("button");
      continueButton.textContent = "Continue";
      continueButton.onclick = () => {
        restartButton.remove();
        continueButton.remove();
        statusPanel.textContent = `Holding token: ${heldToken}`;
      };
      statusPanel.append(continueButton);
    }
  } else {
    statusPanel.textContent = "Not holding a token";
  }
}
updateStatus();

// Cell functions
function spawnCells() {
  const bounds = map.getBounds();
  const northEast = bounds.getNorthEast();
  const southWest = bounds.getSouthWest();

  const minI = Math.round((southWest.lat - NULL_ISLAND.lat) / TILE_DEGREES);
  const maxI = Math.round((northEast.lat - NULL_ISLAND.lat) / TILE_DEGREES);
  const minJ = Math.round((southWest.lng - NULL_ISLAND.lng) / TILE_DEGREES);
  const maxJ = Math.round((northEast.lng - NULL_ISLAND.lng) / TILE_DEGREES);

  for (let i = minI; i <= maxI; i++) {
    for (let j = minJ; j <= maxJ; j++) {
      const key = `${i},${j}`;
      if (!cells.has(key) && luck([i, j].toString()) < SPAWN_PROBABILITY) {
        cells.set(key, new Cell(i, j));
      }
    }
  }
}
spawnCells();

map.on("moveend", () => {
  const bounds = map.getBounds();
  for (const [key, cell] of cells.entries()) {
    if (!bounds.intersects(cell.bounds)) {
      cell.rectangle.remove();
      if (cell.text) {
        cell.text.remove();
      }
      cells.delete(key);
    }
  }
  spawnCells();
});
