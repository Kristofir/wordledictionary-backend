/**
 * For setting up overload
 */
export function defineArrayIntersectOverride(): void {
  Object.defineProperty(Object.prototype, "intersects", {
    configurable: false,
    writable: false,
    value: function (array: Array<any>): boolean {
      for (const a of this) {
        for (const b of array) {
          if (a == b) return true;
        }
      }
      return false;
    }
  })
}