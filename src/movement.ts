import { Player } from "./player.ts";

// Facade and Interface Segregation Pattern:
// The `MovementController` interface is a key part of a Facade that simplifies
// player movement. It also embodies the Interface Segregation Principle.

// 1. Interface Segregation: This interface defines a clear, minimal contract
//    for any object that can control player movement. It separates the high-level
//    concept of "movement control" from the specific implementation details
//    (e.g., using geolocation vs. using buttons). The main game logic only
//    needs to know about this interface, not the concrete classes.

// 2. Facade: This interface acts as a simplified entry point (a Facade) to the
//    potentially complex subsystems of player movement. Whether movement is
//    driven by asynchronous browser APIs (Geolocation) or DOM events (buttons),
//    the rest of the application interacts with it through the single, simple
//    `setup` method defined here.
export interface MovementController {
  setup(player: Player): void;
}
