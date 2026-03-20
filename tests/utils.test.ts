import { isRangedInteger } from '../src/utils';

describe('isRangedInteger', () => {
  test('validates signed 8-bit bounds', () => {
    expect(isRangedInteger(-128, 8, true)).toStrictEqual(true);
    expect(isRangedInteger(127, 8, true)).toStrictEqual(true);
    expect(isRangedInteger(-129, 8, true)).toStrictEqual(false);
    expect(isRangedInteger(128, 8, true)).toStrictEqual(false);
  });

  test('validates unsigned 8-bit bounds', () => {
    expect(isRangedInteger(0, 8, false)).toStrictEqual(true);
    expect(isRangedInteger(255, 8, false)).toStrictEqual(true);
    expect(isRangedInteger(-1, 8, false)).toStrictEqual(false);
    expect(isRangedInteger(256, 8, false)).toStrictEqual(false);
  });

  test('supports signed 64-bit checks within JS safe integer range', () => {
    expect(isRangedInteger(Number.MIN_SAFE_INTEGER, 64, true)).toStrictEqual(
      true,
    );
    expect(isRangedInteger(Number.MAX_SAFE_INTEGER, 64, true)).toStrictEqual(
      true,
    );
  });

  test('rejects unsafe integers', () => {
    expect(
      isRangedInteger(Number.MAX_SAFE_INTEGER + 1, 64, true),
    ).toStrictEqual(false);
  });
});
