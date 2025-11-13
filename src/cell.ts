// @deno-types="npm:@types/leaflet"
import leaflet, { Point } from "leaflet";
import luck from "./_luck.ts";
import { map, NULL_ISLAND, TILE_DEGREES } from "./map.ts";
import { Player } from "./player.ts";
import { WorldState } from "./world.ts";

const SPAWN_PROBABILITY = 0.1;
const INTERACTION_RANGE = 5;

export class Cell {
  i: number;
  j: number;
  bounds: leaflet.LatLngBounds;
  rectangle: leaflet.Rectangle;
  token: number | undefined;
  text: leaflet.Marker | undefined;

  constructor(
    i: number,
    j: number,
    token: number | undefined,
    player: Player,
    worldState: WorldState,
    updateStatus: () => void,
  ) {
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
    this.setToken(token);

    this.rectangle.on("click", () => {
      const distance = Math.sqrt(
        (this.i - player.tileI) ** 2 + (this.j - player.tileJ) ** 2,
      );
      if (distance > INTERACTION_RANGE) {
        return;
      }
      const currentCellPoint = new Point(this.i, this.j);
      if (player.getHeldToken()) {
        if (!this.token) {
          this.setToken(player.getHeldToken());
          worldState.setCellToken(currentCellPoint, this.token!);
        } else if (this.token === player.getHeldToken()) {
          this.setToken(this.token * 2);
          worldState.setCellToken(currentCellPoint, this.token!);
        }
        player.setHeldToken(undefined);
        updateStatus();
      } else if (this.token) {
        player.setHeldToken(this.token);
        this.setToken(undefined);
        worldState.setCellToken(currentCellPoint, 0);
        updateStatus();
      }
    });
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

export function spawnCells(
  cells: Map<string, Cell>,
  worldState: WorldState,
  player: Player,
  updateStatus: () => void,
) {
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
        const cellPoint = new Point(i, j);
        let token = worldState.getCellToken(cellPoint);
        if (token === undefined) {
          if (luck([i, j, "token-exists"].toString()) < 0.5) {
            token = luck([i, j, "token-value"].toString()) < 0.5 ? 1 : 2;
          }
        }
        cells.set(key, new Cell(i, j, token, player, worldState, updateStatus));
      }
    }
  }
}
