/**
 * For setting up overload
 * @deprecated in favor of checkIntersection
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

export function doArraysIntersect(arrayA: Array<any>, arrayB: Array<any>): boolean {
  for (const a of arrayA) {
    for (const b of arrayB) {
      if (a == b) return true;
    }
  }
  return false;
}