// @deno-types="npm:@types/leaflet"
import leaflet from "leaflet";
import { map, TILE_DEGREES, WORLD_ORIGIN } from "./map.ts";

export class Player {
  latlng: leaflet.LatLng;
  tileI: number;
  tileJ: number;
  marker: leaflet.Marker;
  private heldToken: number | undefined;
  private gameWon = false;

  constructor(latlng: leaflet.LatLng) {
    this.latlng = latlng;
    this.tileI = Math.round((latlng.lat - WORLD_ORIGIN.lat) / TILE_DEGREES);
    this.tileJ = Math.round((latlng.lng - WORLD_ORIGIN.lng) / TILE_DEGREES);
    this.marker = leaflet.marker(latlng).addTo(map);
    this.marker.bindTooltip("You");
  }

  getHeldToken(): number | undefined {
    return this.heldToken;
  }

  setHeldToken(value: number | undefined) {
    this.heldToken = value;
  }

  updateTokenStatus(
    statusPanel: HTMLDivElement,
    ENDGAME_TOKEN_VALUE: number,
    message?: string,
  ) {
    if (message) {
      statusPanel.textContent = message;
      return;
    }
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
