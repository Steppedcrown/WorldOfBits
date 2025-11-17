import { Point } from "leaflet";

export class WorldState {
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
