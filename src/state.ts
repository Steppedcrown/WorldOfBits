import { Player } from "./player.ts";
import { WorldState } from "./world.ts";

export class GameState {
  constructor(
    public worldState: WorldState,
    public player: Player,
  ) {}
}
