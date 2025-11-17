import { map } from "./map.ts";
import { MovementController } from "./movement.ts";
import { Player } from "./player.ts";

export class ButtonMovementController implements MovementController {
  setup(player: Player): void {
    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "w":
        case "ArrowUp":
          this.updatePlayer(1, 0, player);
          break;
        case "s":
        case "ArrowDown":
          this.updatePlayer(-1, 0, player);
          break;
        case "a":
        case "ArrowLeft":
          this.updatePlayer(0, -1, player);
          break;
        case "d":
        case "ArrowRight":
          this.updatePlayer(0, 1, player);
          break;
      }
    });
  }

  private updatePlayer(di: number, dj: number, player: Player) {
    player.move(di, dj);
    map.setView(player.latlng, map.getZoom());
  }
}
