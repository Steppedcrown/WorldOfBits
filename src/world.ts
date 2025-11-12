import { Point } from "leaflet";

export class WorldState {
  private cellStates: Map<string, number> = new Map();

  private pointToKey(p: Point): string {
    return `${p.x},${p.y}`;
  }

  setCellToken(p: Point, tokenValue: number) {
    const key = this.pointToKey(p);
    if (tokenValue > 0) {
      this.cellStates.set(key, tokenValue);
    } else {
      this.cellStates.delete(key);
    }
  }

  getCellToken(p: Point): number | undefined {
    const key = this.pointToKey(p);
    return this.cellStates.get(key);
  }
}
