import { Point } from "leaflet";

// Flyweight Pattern:
// The WorldState class implements the Flyweight pattern to efficiently manage
// the state of a potentially infinite world grid. Instead of storing state
// for every cell, we only store the state of cells that have been modified
// from their default, pseudo-randomly generated state.

// This separates the "intrinsic" state (the default, shared, and unstored state
// calculated on-the-fly) from the "extrinsic" state (the unique, modified
// state that is stored). This significantly reduces memory usage, as we avoid
// storing data for the vast majority of cells that remain in their default,
// unmodified state.
export class WorldState {
  // This map holds the "extrinsic" or "unique" state for modified cells.
  // The key is a string representation of the cell's coordinates, and the
  // value is its token. Unmodified cells are not present in this map.
  private cellStates: Map<string, number> = new Map();

  private pointToKey(p: Point): string {
    return `${p.x},${p.y}`;
  }

  setCellToken(p: Point, tokenValue: number) {
    const key = this.pointToKey(p);
    this.cellStates.set(key, tokenValue);
  }

  getCellToken(p: Point): number | undefined {
    const key = this.pointToKey(p);
    return this.cellStates.get(key);
  }

  getSerializableState(): [string, number][] {
    return Array.from(this.cellStates.entries());
  }

  loadFromSerializableState(state: [string, number][]) {
    this.cellStates = new Map(state);
  }
}
