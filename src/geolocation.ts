import leaflet from "leaflet";
import { map } from "./map.ts";
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
      player.marker.setLatLng(player.latlng);
      map.setView(player.latlng, map.getZoom());
    });
  }
}
