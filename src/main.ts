// @deno-types="npm:@types/leaflet"
import "leaflet/dist/leaflet.css";
import "./style.css";

import leaflet from "leaflet";
import "./_leafletWorkaround.ts";
import { ButtonMovementController, createMovementButtons } from "./button.ts";
import { Cell, spawnCells, updateAllCells } from "./cell.ts";
import { clearGameState, loadGameState, saveGameState } from "./gamestate.ts";
import { GeolocationMovementController } from "./geolocation.ts";
import {
  createMap,
  DEFAULT_SPAWN,
  map,
  setupMapEventListeners,
} from "./map.ts";
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
const newGameButton = document.createElement("button");
newGameButton.textContent = "New Game";
newGameButton.onclick = () => {
  clearGameState();
  location.reload();
};
controlPanel.innerHTML = "";
controlPanel.append(newGameButton);
infoPanel.append(controlPanel);
// #endregion

// #region Gameplay variables
const ENDGAME_TOKEN_VALUE = 32;
let worldState = new WorldState();
const cells = new Map<string, Cell>();
// #endregion

// Setup map and player
createMap();

function initializeGame(player: Player, initialWorldState: WorldState) {
  worldState = initialWorldState;

  const urlParams = new URLSearchParams(globalThis.location.search);
  const movementType = urlParams.get("movement");

  let movementController: MovementController;
  if (movementType === "geo") {
    movementController = new GeolocationMovementController();
  } else {
    const buttonController = new ButtonMovementController(cells);
    movementController = buttonController;
    createMovementButtons(player, controlPanel, buttonController);
  }
  movementController.setup(player);

  let lastPlayerI = player.tileI;
  let lastPlayerJ = player.tileJ;

  setInterval(() => {
    if (lastPlayerI !== player.tileI || lastPlayerJ !== player.tileJ) {
      updateAllCells(cells, player);
      lastPlayerI = player.tileI;
      lastPlayerJ = player.tileJ;
    }
  }, 200);

  setupMapEventListeners(
    cells,
    worldState,
    player,
    (message?: string) => {
      player.updateTokenStatus(statusPanel, ENDGAME_TOKEN_VALUE, message);
      saveGameState(player, worldState);
    },
  );

  // Initialize player token status
  player.updateTokenStatus(statusPanel, ENDGAME_TOKEN_VALUE);

  // Initialize map with cells
  spawnCells(
    cells,
    worldState,
    player,
    (message?: string) =>
      player.updateTokenStatus(statusPanel, ENDGAME_TOKEN_VALUE, message),
  );
  updateAllCells(cells, player);

  map.setView(player.latlng, map.getZoom());
}

const savedGame = loadGameState();
if (savedGame) {
  initializeGame(savedGame.player, savedGame.worldState);
} else {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const player = new Player(
        new leaflet.LatLng(position.coords.latitude, position.coords.longitude),
      );
      initializeGame(player, new WorldState());
    },
    () => {
      const player = new Player(DEFAULT_SPAWN);
      initializeGame(player, new WorldState());
    },
  );
}
