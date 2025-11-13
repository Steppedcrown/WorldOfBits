// @deno-types="npm:@types/leaflet"
import leaflet from "leaflet";
import { map, NULL_ISLAND, TILE_DEGREES } from "./map.ts";

export class Player {
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

export function handlePlayerMovement(player: Player) {
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "w":
        updatePlayer(1, 0, player);
        break;
      case "s":
        updatePlayer(-1, 0, player);
        break;
      case "a":
        updatePlayer(0, -1, player);
        break;
      case "d":
        updatePlayer(0, 1, player);
        break;
    }
  });
}

function updatePlayer(di: number, dj: number, player: Player) {
  player.move(di, dj);
  map.setView(player.latlng, map.getZoom());
}
