// unique k-character combinations

import type { UKCCDict } from "models/ukcc";

export function getAllUniqueKCharacterCombinations(
  w: Word
): UKCCDict {
  const UKCCs: UKCCDict = {
    U2CCs: [],
    U3CCs: [],
    U4CCs: [],
    U5CC: w.split('').toSorted().join('')
  };

  for (let i = 0; i < 5; i++) {
    for (let j = i + 1; j < 5; j++) {
      const c2 = getUKCCString(w, i, j);
      if (c2) UKCCs.U2CCs.push(c2);

      for (let k = j + 1; k < 5; k++) {
        const c3 = getUKCCString(w, i, j, k);
        if (c3) UKCCs.U3CCs.push(c3);

        for (let l = k + 1; l < 5; l++) {
          const c4 = getUKCCString(w, i, j, k, l);
          if (c4) UKCCs.U4CCs.push(c4);
        }

      }
    }
  }

  return UKCCs;
}
/**
 *
 * @param w Word
 * @param indices Character indices
 * @returns Alphabetically sorted string of characters
 */
export function getUKCCString(w: Word, ...indices: Array<number>): UKCC | null {
  const k = indices.length;
  const UKCCArr: Array<Character> = [];

  for (let ki = 0; ki < k; ki++) {
    const characterIndex = indices[ki];
    const character = w[characterIndex];

    if (!character) return null

    if (!UKCCArr.includes(character)) {
      UKCCArr.push(character);
    } else {
      // non-uniqueness detected, stop everything
      return null;
    }
  }

  const UKCCStr = UKCCArr.toSorted().join('');

  return UKCCStr;
}
