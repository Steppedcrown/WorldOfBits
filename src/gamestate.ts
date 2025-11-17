import leaflet from "leaflet";
import { Player } from "./player.ts";
import { WorldState } from "./world.ts";

const GAME_STATE_KEY = "worldOfBits_gameState";

interface SerializablePlayer {
  lat: number;
  lng: number;
  heldToken: number | undefined;
}

interface SerializableGameState {
  player: SerializablePlayer;
  worldState: [string, number][];
}

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
