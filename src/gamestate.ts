import leaflet from "leaflet";
import { Player } from "./player.ts";
import { WorldState } from "./world.ts";

// Memento Pattern:
// This module acts as the "Caretaker" in the Memento pattern. It is
// responsible for saving and loading the game's state to and from
// localStorage, without needing to know the internal details of the objects
// being saved.

// The "Originators" (the objects whose state is being saved) are the `Player`
// and `WorldState` classes. They provide methods to get and set their state
// in a serializable format.

// The "Memento" is the `SerializableGameState` interface. It defines a
// data-only object that holds the state of the Originators at a specific
// point in time. This decouples the saved state from the implementation of
// the Originators themselves.

const GAME_STATE_KEY = "worldOfBits_gameState";

interface SerializablePlayer {
  lat: number;
  lng: number;
  heldToken: number | undefined;
}

// The Memento: A simple data structure for holding the state to be saved.
interface SerializableGameState {
  player: SerializablePlayer;
  worldState: [string, number][];
}

// Creates a Memento and asks the Caretaker (localStorage) to persist it.
export function saveGameState(player: Player, worldState: WorldState) {
  const serializablePlayer: SerializablePlayer = {
    lat: player.latlng.lat,
    lng: player.latlng.lng,
    heldToken: player.getHeldToken(),
  };

  const serializableState: SerializableGameState = {
    player: serializablePlayer,
    worldState: worldState.getSerializableState(),
  };

  localStorage.setItem(GAME_STATE_KEY, JSON.stringify(serializableState));
}

// Asks the Caretaker (localStorage) for a Memento and uses it to restore
// the state of the Originators.
export function loadGameState(): {
  player: Player;
  worldState: WorldState;
} | null {
  const savedState = localStorage.getItem(GAME_STATE_KEY);
  if (!savedState) {
    return null;
  }

  const parsedState: SerializableGameState = JSON.parse(savedState);

  const player = new Player(
    new leaflet.LatLng(parsedState.player.lat, parsedState.player.lng),
  );
  player.setHeldToken(parsedState.player.heldToken);

  const worldState = new WorldState();
  worldState.loadFromSerializableState(parsedState.worldState);

  return { player, worldState };
}

export function clearGameState() {
  localStorage.removeItem(GAME_STATE_KEY);
}
