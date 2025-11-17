import { Player } from "./player.ts";

export interface MovementController {
  setup(player: Player): void;
}
