// @deno-types="npm:@types/leaflet"
import leaflet from "leaflet";
import { map, NULL_ISLAND, TILE_DEGREES } from "./map.ts";

export class Player {
  latlng: leaflet.LatLng;
  tileI: number;
  tileJ: number;
  marker: leaflet.Marker;
  private heldToken: number | undefined;
  private gameWon = false;

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

  updateTokenStatus(statusPanel: HTMLDivElement, ENDGAME_TOKEN_VALUE: number) {
    if (this.heldToken) {
      statusPanel.textContent = `Holding token: ${this.heldToken}`;
      if (this.heldToken === ENDGAME_TOKEN_VALUE && !this.gameWon) {
        this.gameWon = true;
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
          statusPanel.textContent = `Holding token: ${this.heldToken}`;
        };
        statusPanel.append(continueButton);
      }
    } else {
      statusPanel.textContent = "Not holding a token";
    }
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

export function setupPlayerMovement(player: Player) {
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "w":
      case "ArrowUp":
        updatePlayer(1, 0, player);
        break;
      case "s":
      case "ArrowDown":
        updatePlayer(-1, 0, player);
        break;
      case "a":
      case "ArrowLeft":
        updatePlayer(0, -1, player);
        break;
      case "d":
      case "ArrowRight":
        updatePlayer(0, 1, player);
        break;
    }
  });
}

function updatePlayer(di: number, dj: number, player: Player) {
  player.move(di, dj);
  map.setView(player.latlng, map.getZoom());
}
