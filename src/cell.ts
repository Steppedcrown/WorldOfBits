// @deno-types="npm:@types/leaflet"
import leaflet, { Point } from "leaflet";
import luck from "./_luck.ts";
import { map, TILE_DEGREES, WORLD_ORIGIN } from "./map.ts";
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
        WORLD_ORIGIN.lat + i * TILE_DEGREES,
        WORLD_ORIGIN.lng + j * TILE_DEGREES,
      ],
      [
        WORLD_ORIGIN.lat + (i + 1) * TILE_DEGREES,
        WORLD_ORIGIN.lng + (j + 1) * TILE_DEGREES,
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
        } else if (this.token === player.getHeldToken()) {
          this.setToken(this.token * 2);
        }
        worldState.setCellToken(currentCellPoint, this.token!);
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

    // Remove existing text marker
    if (this.text) {
      this.text.remove();
      this.text = undefined;
    }

    // Update text marker if token exists
    if (this.token) {
      this.text = leaflet.marker(this.bounds.getCenter(), {
        icon: leaflet.divIcon({
          className: "token-label",
          html: `<div>${this.token}</div>`,
        }),
      }).addTo(map);
    }
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

  const minI = Math.round((southWest.lat - WORLD_ORIGIN.lat) / TILE_DEGREES);
  const maxI = Math.round((northEast.lat - WORLD_ORIGIN.lat) / TILE_DEGREES);
  const minJ = Math.round((southWest.lng - WORLD_ORIGIN.lng) / TILE_DEGREES);
  const maxJ = Math.round((northEast.lng - WORLD_ORIGIN.lng) / TILE_DEGREES);

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
