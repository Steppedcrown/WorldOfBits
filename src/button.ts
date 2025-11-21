import { Cell, updateAllCells } from "./cell.ts";
import { map } from "./map.ts";
import { MovementController } from "./movement.ts";
import { Player } from "./player.ts";

export class ButtonMovementController implements MovementController {
  private cells: Map<string, Cell>;

  constructor(cells: Map<string, Cell>) {
    this.cells = cells;
  }

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

  public updatePlayer(di: number, dj: number, player: Player) {
    player.move(di, dj);
    updateAllCells(this.cells, player);
    map.setView(player.latlng, map.getZoom());
  }
}

export function createMovementButtons(
  player: Player,
  controlPanel: HTMLElement,
  controller: ButtonMovementController,
) {
  const upButton = document.createElement("button");
  upButton.textContent = "Up";
  upButton.onclick = () => controller.updatePlayer(1, 0, player);

  const downButton = document.createElement("button");
  downButton.textContent = "Down";
  downButton.onclick = () => controller.updatePlayer(-1, 0, player);

  const leftButton = document.createElement("button");
  leftButton.textContent = "Left";
  leftButton.onclick = () => controller.updatePlayer(0, -1, player);

  const rightButton = document.createElement("button");
  rightButton.textContent = "Right";
  rightButton.onclick = () => controller.updatePlayer(0, 1, player);

  controlPanel.append(upButton, downButton, leftButton, rightButton);
}
