import leaflet from "leaflet";
import { map, TILE_DEGREES, WORLD_ORIGIN } from "./map.ts";
import { MovementController } from "./movement.ts";
import { Player } from "./player.ts";

export class GeolocationMovementController implements MovementController {
  setup(player: Player): void {
    navigator.geolocation.watchPosition((position) => {
      const newLatLng = new leaflet.LatLng(
        position.coords.latitude,
        position.coords.longitude,
      );
      player.latlng = newLatLng;
      player.tileI = Math.round(
        (newLatLng.lat - WORLD_ORIGIN.lat) / TILE_DEGREES,
      );
      player.tileJ = Math.round(
        (newLatLng.lng - WORLD_ORIGIN.lng) / TILE_DEGREES,
      );
      player.marker.setLatLng(player.latlng);
      map.setView(player.latlng, map.getZoom());
    });
  }
}
