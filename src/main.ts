// @deno-types="npm:@types/leaflet"
import "leaflet/dist/leaflet.css";
import "./style.css";

import "./_leafletWorkaround.ts";
import { ButtonMovementController } from "./button.ts";
import { Cell, spawnCells } from "./cell.ts";
import { GeolocationMovementController } from "./geolocation.ts";
import { createMap, DEFAULT_SPAWN, setupMapEventListeners } from "./map.ts";
import { MovementController } from "./movement.ts";
import { Player } from "./player.ts";
import { WorldState } from "./world.ts";

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
controlPanel.innerHTML = "Controls: w,a,s,d / arrows to move";
infoPanel.append(controlPanel);
// #endregion

// #region Gameplay variables
const ENDGAME_TOKEN_VALUE = 32;
const worldState = new WorldState();
const cells = new Map<string, Cell>();
// #endregion

// Setup map and player
createMap();
const player = new Player(DEFAULT_SPAWN);

const urlParams = new URLSearchParams(globalThis.location.search);
const movementType = urlParams.get("movement");

let movementController: MovementController;
if (movementType === "geo") {
  movementController = new GeolocationMovementController();
} else {
  movementController = new ButtonMovementController();
}
movementController.setup(player);

setupMapEventListeners(
  cells,
  worldState,
  player,
  () => player.updateTokenStatus(statusPanel, ENDGAME_TOKEN_VALUE),
);

// Initialize player token status
player.updateTokenStatus(statusPanel, ENDGAME_TOKEN_VALUE);

// Initialize map with cells
spawnCells(
  cells,
  worldState,
  player,
  () => player.updateTokenStatus(statusPanel, ENDGAME_TOKEN_VALUE),
);
