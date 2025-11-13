// @deno-types="npm:@types/leaflet"
import "leaflet/dist/leaflet.css";
import "./style.css";

import "./_leafletWorkaround.ts";
import { Cell, spawnCells } from "./cell.ts";
import { CLASSROOM_LATLNG, createMap } from "./map.ts";
import { handlePlayerMovement, Player } from "./player.ts";
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
controlPanel.innerHTML = "Controls: <br> w,a,s,d to move";
infoPanel.append(controlPanel);
// #endregion

const map = createMap();

// #region Gameplay parameters
const ENDGAME_TOKEN_VALUE = 32;
let gameWon = false;

const worldState = new WorldState();
const cells = new Map<string, Cell>();
// #endregion

const player = new Player(CLASSROOM_LATLNG);
handlePlayerMovement(player);

// Handle token status updates
function updateTokenStatus() {
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
updateTokenStatus();

spawnCells(cells, worldState, player, updateTokenStatus);

map.on("moveend", () => {
  for (const [_key, cell] of cells.entries()) {
    cell.rectangle.remove();
    if (cell.text) {
      cell.text.remove();
    }
  }
  cells.clear();
  spawnCells(cells, worldState, player, updateTokenStatus);
});
