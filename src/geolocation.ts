import leaflet from "leaflet";
import { Cell, updateAllCells } from "./cell.ts";
import { map } from "./map.ts";
import { MovementController } from "./movement.ts";
import { Player } from "./player.ts";

export class GeolocationMovementController implements MovementController {
  private cells: Map<string, Cell>;

  constructor(cells: Map<string, Cell>) {
    this.cells = cells;
  }

  setup(player: Player): void {
    navigator.geolocation.watchPosition((position) => {
      const newLatLng = new leaflet.LatLng(
        position.coords.latitude,
        position.coords.longitude,
      );
      player.latlng = newLatLng;
      player.marker.setLatLng(player.latlng);
      updateAllCells(this.cells, player);
      map.setView(player.latlng, map.getZoom());
    });
  }
}
