import Fortran from '../src/index';
import {
  FByte,
  FByteArray,
  FCharacter,
  FCharacterArray,
  FComplex,
  FComplexArray,
  FInteger,
  FIntegerArray,
  FLogical,
  FLogicalArray,
  FReal,
  FRealArray,
} from '../src/datatypes';
import assert from 'assert';

describe('BYTE', () => {
  test('from string value', () => {
    const byte = Fortran.BYTE('a');

    expect(byte).toBeInstanceOf(FByte);
    expect(byte.value).toStrictEqual('a');
  });

  test('from numeric value', () => {
    const byte = Fortran.BYTE(97);

    expect(byte).toBeInstanceOf(FByte);
    expect(byte.value).toStrictEqual('a');
  });

  test('from boolean value', () => {
    const byte = Fortran.BYTE(true);

    expect(byte).toBeInstanceOf(FByte);
    expect(byte.value).toStrictEqual('\x01');
  });

  test('from array of string values', () => {
    const byteArray = Fortran.BYTE(['a', 'b', 'c']);

    expect(byteArray).toBeInstanceOf(FByteArray);
    assert(byteArray instanceof FByteArray);
    expect(byteArray.dim).toStrictEqual([3]);

    expect(byteArray.value[1]).toStrictEqual('a');
    expect(byteArray.value[2]).toStrictEqual('b');
    expect(byteArray.value[3]).toStrictEqual('c');
  });

  test('from array of numeric values', () => {
    const byteArray = Fortran.BYTE([97, 98, 99]);

    expect(byteArray).toBeInstanceOf(FByteArray);
    assert(byteArray instanceof FByteArray);
    expect(byteArray.dim).toStrictEqual([3]);

    expect(byteArray.value[1]).toStrictEqual('a');
    expect(byteArray.value[2]).toStrictEqual('b');
    expect(byteArray.value[3]).toStrictEqual('c');
  });

  test('from array of boolean values', () => {
    const byteArray = Fortran.BYTE([true, false, true]);

    expect(byteArray).toBeInstanceOf(FByteArray);
    assert(byteArray instanceof FByteArray);
    expect(byteArray.dim).toStrictEqual([3]);

    expect(byteArray.value[1]).toStrictEqual('\x01');
    expect(byteArray.value[2]).toStrictEqual('\x00');
    expect(byteArray.value[3]).toStrictEqual('\x01');
  });

  test('from array of assorted values', () => {
    const byteArray = Fortran.BYTE(['a', 98, true]);

    expect(byteArray).toBeInstanceOf(FByteArray);
    assert(byteArray instanceof FByteArray);
    expect(byteArray.dim).toStrictEqual([3]);

    expect(byteArray.value[1]).toStrictEqual('a');
    expect(byteArray.value[2]).toStrictEqual('b');
    expect(byteArray.value[3]).toStrictEqual('\x01');
  });

  test('from nested array of values', () => {
    const byteArray = Fortran.BYTE([
      ['a', 98],
      [true, 'd'],
    ]);

    expect(byteArray).toBeInstanceOf(FByteArray);
    assert(byteArray instanceof FByteArray);
    expect(byteArray.dim).toStrictEqual([2, 2]);

    expect(byteArray.value[1][1]).toStrictEqual('a');
    expect(byteArray.value[1][2]).toStrictEqual('b');
    expect(byteArray.value[2][1]).toStrictEqual('\x01');
    expect(byteArray.value[2][2]).toStrictEqual('d');
  });
});

describe('CHARACTER', () => {
  test('from string value', () => {
    const char = Fortran.CHARACTER('hello');

    expect(char).toBeInstanceOf(FCharacter);
    expect(char.value).toStrictEqual('hello');
    expect(char.len).toBeUndefined();
  });

  test('from string value with length', () => {
    const char = Fortran.CHARACTER('hello', 5);

    expect(char).toBeInstanceOf(FCharacter);
    expect(char.value).toStrictEqual('hello');
    expect(char.len).toStrictEqual(5);
  });

  test('pads short string values to the declared length', () => {
    const char = Fortran.CHARACTER('hi', 5);

    expect(char.value).toStrictEqual('hi   ');
    expect(char.value.length).toStrictEqual(5);
  });

  test('truncated from string value with length', () => {
    const char = Fortran.CHARACTER('hello world', 5);

    expect(char).toBeInstanceOf(FCharacter);
    expect(char.value).toStrictEqual('hello');
    expect(char.len).toStrictEqual(5);
  });

  test('pads and truncates reassigned values to the declared length', () => {
    const char = Fortran.CHARACTER('hello', 5);

    char.value = 'hi';
    expect(char.value).toStrictEqual('hi   ');

    char.value = 'goodbye';
    expect(char.value).toStrictEqual('goodb');
  });

  test('extracts substrings with 1-based inclusive bounds', () => {
    const char = Fortran.CHARACTER('Fortran', 7);

    expect(char.substring(2, 4).value).toStrictEqual('ort');
    expect(char.substring(undefined, 3).value).toStrictEqual('For');
    expect(char.substring(5).value).toStrictEqual('ran');
    expect(char.substring().value).toStrictEqual('Fortran');
  });

  test('assigns to substrings with truncation and blank padding', () => {
    const char = Fortran.CHARACTER('Fortran', 7);

    char.assignSubstring('TS', 2, 4);
    expect(char.value).toStrictEqual('FTS ran');

    char.assignSubstring('typed', 5, 7);
    expect(char.value).toStrictEqual('FTS typ');
  });

  test('rejects substring bounds outside the character value', () => {
    const char = Fortran.CHARACTER('Fortran', 7);

    expect(() => char.substring(0, 2)).toThrow(
      'Substring bounds must satisfy 1 <= start <= end <= character length',
    );
    expect(() => char.substring(3, 8)).toThrow(
      'Substring bounds must satisfy 1 <= start <= end <= character length',
    );
    expect(() => char.substring(4, 2)).toThrow(
      'Substring bounds must satisfy 1 <= start <= end <= character length',
    );
    expect(() => char.substring(1.5, 2)).toThrow(
      'Substring start must be an integer',
    );
  });

  test('from array of string values', () => {
    const charArray = Fortran.CHARACTER(['hello', 'world']);

    expect(charArray).toBeInstanceOf(FCharacterArray);
    assert(charArray instanceof FCharacterArray);
    expect(charArray.dim).toStrictEqual([2]);

    expect(charArray.value[1]).toStrictEqual('hello');
    expect(charArray.value[2]).toStrictEqual('world');
  });

  test('inherits options from array of string values with length', () => {
    const charArray = Fortran.CHARACTER(['hi', 'worldwide'], 5);

    expect(charArray).toBeInstanceOf(FCharacterArray);
    assert(charArray instanceof FCharacterArray);
    expect(charArray.dim).toStrictEqual([2]);

    expect(charArray.value[1]).toStrictEqual('hi   ');
    expect(charArray.value[2]).toStrictEqual('world');
  });

  test('from nested array of string values', () => {
    const charArray = Fortran.CHARACTER([
      ['hello', 'fortran'],
      ['typescript', 'world'],
    ]);

    expect(charArray).toBeInstanceOf(FCharacterArray);
    assert(charArray instanceof FCharacterArray);
    expect(charArray.dim).toStrictEqual([2, 2]);

    expect(charArray.value[1][1]).toStrictEqual('hello');
    expect(charArray.value[1][2]).toStrictEqual('fortran');
    expect(charArray.value[2][1]).toStrictEqual('typescript');
    expect(charArray.value[2][2]).toStrictEqual('world');
  });
});

describe('CMPLX (alias COMPLEX)', () => {
  test('from complex value', () => {
    const cmplx = Fortran.COMPLEX({ r: 1, i: 2 });

    expect(cmplx).toBeInstanceOf(FComplex);
    expect(cmplx.value).toStrictEqual({ r: 1, i: 2 });
    expect(cmplx.kind).toBeUndefined();
  });

  test('from complex value with kind', () => {
    const cmplx = Fortran.COMPLEX({ r: 1, i: 2 }, 8);

    expect(cmplx).toBeInstanceOf(FComplex);
    expect(cmplx.value).toStrictEqual({ r: 1, i: 2 });
    expect(cmplx.kind).toStrictEqual(8);
  });

  test('from array of complex values', () => {
    const cmplxArray = Fortran.COMPLEX([
      { r: 1, i: 2 },
      { r: 3, i: 4 },
    ]);

    expect(cmplxArray).toBeInstanceOf(FComplexArray);
    assert(cmplxArray instanceof FComplexArray);
    expect(cmplxArray.dim).toStrictEqual([2]);

    expect(cmplxArray.value[1]).toStrictEqual({ r: 1, i: 2 });
    expect(cmplxArray.value[2]).toStrictEqual({ r: 3, i: 4 });
  });

  test('from array of complex values with kind', () => {
    const cmplxArray = Fortran.COMPLEX(
      [
        { r: 1, i: 2 },
        { r: 3, i: 4 },
      ],
      16,
    );

    expect(cmplxArray).toBeInstanceOf(FComplexArray);
    assert(cmplxArray instanceof FComplexArray);
    expect(cmplxArray.dim).toStrictEqual([2]);

    expect(cmplxArray.value[1]).toStrictEqual({ r: 1, i: 2 });
    expect(cmplxArray.value[2]).toStrictEqual({ r: 3, i: 4 });
  });

  test('from nested array of complex values', () => {
    const cmplxArray = Fortran.COMPLEX([
      [
        { r: 1, i: 2 },
        { r: 3, i: 4 },
      ],
      [
        { r: 5, i: 6 },
        { r: 7, i: 8 },
      ],
    ]);

    expect(cmplxArray).toBeInstanceOf(FComplexArray);
    assert(cmplxArray instanceof FComplexArray);
    expect(cmplxArray.dim).toStrictEqual([2, 2]);

    expect(cmplxArray.value[1][1]).toStrictEqual({ r: 1, i: 2 });
    expect(cmplxArray.value[1][2]).toStrictEqual({ r: 3, i: 4 });
    expect(cmplxArray.value[2][1]).toStrictEqual({ r: 5, i: 6 });
    expect(cmplxArray.value[2][2]).toStrictEqual({ r: 7, i: 8 });
  });
});

describe('DBLE (alias DOUBLE_PRECISION)', () => {
  test('from numeric value', () => {
    const dble = Fortran.DOUBLE_PRECISION(3.14);

    expect(dble).toBeInstanceOf(FReal);
    expect(dble.value).toStrictEqual(3.14);
    expect(dble.kind).toStrictEqual(8);
  });

  test('from array of numeric values', () => {
    const dbleArray = Fortran.DOUBLE_PRECISION([3.14, 2.71, 1.61]);

    expect(dbleArray).toBeInstanceOf(FRealArray);
    assert(dbleArray instanceof FRealArray);
    expect(dbleArray.dim).toStrictEqual([3]);

    expect(dbleArray.value[1]).toStrictEqual(3.14);
    expect(dbleArray.value[2]).toStrictEqual(2.71);
    expect(dbleArray.value[3]).toStrictEqual(1.61);
  });

  test('from nested array of numeric values', () => {
    const dbleArray = Fortran.DOUBLE_PRECISION([
      [3.14, 2.71],
      [1.61, 0.57],
    ]);

    expect(dbleArray).toBeInstanceOf(FRealArray);
    assert(dbleArray instanceof FRealArray);
    expect(dbleArray.dim).toStrictEqual([2, 2]);

    expect(dbleArray.value[1][1]).toStrictEqual(3.14);
    expect(dbleArray.value[1][2]).toStrictEqual(2.71);
    expect(dbleArray.value[2][1]).toStrictEqual(1.61);
    expect(dbleArray.value[2][2]).toStrictEqual(0.57);
  });
});

describe('DCMPLX (alias DOUBLE_COMPLEX)', () => {
  test('from complex value', () => {
    const dcmplx = Fortran.DOUBLE_COMPLEX({ r: 1, i: 2 });

    expect(dcmplx).toBeInstanceOf(FComplex);
    expect(dcmplx.value).toStrictEqual({ r: 1, i: 2 });
    expect(dcmplx.kind).toStrictEqual(16);
  });

  test('from array of complex values', () => {
    const dcmplxArray = Fortran.DOUBLE_COMPLEX([
      { r: 1, i: 2 },
      { r: 3, i: 4 },
    ]);

    expect(dcmplxArray).toBeInstanceOf(FComplexArray);
    assert(dcmplxArray instanceof FComplexArray);
    expect(dcmplxArray.dim).toStrictEqual([2]);

    expect(dcmplxArray.value[1]).toStrictEqual({ r: 1, i: 2 });
    expect(dcmplxArray.value[2]).toStrictEqual({ r: 3, i: 4 });
  });

  test('from nested array of complex values', () => {
    const dcmplxArray = Fortran.DOUBLE_COMPLEX([
      [
        { r: 1, i: 2 },
        { r: 3, i: 4 },
      ],
      [
        { r: 5, i: 6 },
        { r: 7, i: 8 },
      ],
    ]);

    expect(dcmplxArray).toBeInstanceOf(FComplexArray);
    assert(dcmplxArray instanceof FComplexArray);
    expect(dcmplxArray.dim).toStrictEqual([2, 2]);

    expect(dcmplxArray.value[1][1]).toStrictEqual({ r: 1, i: 2 });
    expect(dcmplxArray.value[1][2]).toStrictEqual({ r: 3, i: 4 });
    expect(dcmplxArray.value[2][1]).toStrictEqual({ r: 5, i: 6 });
    expect(dcmplxArray.value[2][2]).toStrictEqual({ r: 7, i: 8 });
  });
});

describe('INT (alias INTEGER)', () => {
  test('from numeric value', () => {
    const int = Fortran.INTEGER(42);

    expect(int).toBeInstanceOf(FInteger);
    expect(int.value).toStrictEqual(42);
    expect(int.kind).toBeUndefined();
  });

  test('from numeric value with kind', () => {
    const int = Fortran.INTEGER(42, 8);

    expect(int).toBeInstanceOf(FInteger);
    expect(int.value).toStrictEqual(42);
    expect(int.kind).toStrictEqual(8);
  });

  test('from array of numeric values', () => {
    const intArray = Fortran.INTEGER([1, 2, 3]);

    expect(intArray).toBeInstanceOf(FIntegerArray);
    assert(intArray instanceof FIntegerArray);
    expect(intArray.dim).toStrictEqual([3]);
    expect(intArray.rank).toBe(1);

    expect(intArray.value[1]).toStrictEqual(1);
    expect(intArray.value[2]).toStrictEqual(2);
    expect(intArray.value[3]).toStrictEqual(3);
  });

  test('from array of numeric values with kind', () => {
    const intArray = Fortran.INTEGER([1, 2, 3], 4);

    expect(intArray).toBeInstanceOf(FIntegerArray);
    assert(intArray instanceof FIntegerArray);
    expect(intArray.dim).toStrictEqual([3]);

    expect(intArray.value[1]).toStrictEqual(1);
    expect(intArray.value[2]).toStrictEqual(2);
    expect(intArray.value[3]).toStrictEqual(3);
  });

  test('from nested array of numeric values', () => {
    const intArray = Fortran.INTEGER([
      [1, 2],
      [3, 4],
    ]);

    expect(intArray).toBeInstanceOf(FIntegerArray);
    assert(intArray instanceof FIntegerArray);
    expect(intArray.dim).toStrictEqual([2, 2]);
    expect(intArray.rank).toBe(2);

    expect(intArray.value[1][1]).toStrictEqual(1);
    expect(intArray.value[1][2]).toStrictEqual(2);
    expect(intArray.value[2][1]).toStrictEqual(3);
    expect(intArray.value[2][2]).toStrictEqual(4);
  });
});

describe('LOGICAL', () => {
  test('from boolean value', () => {
    const logical = Fortran.LOGICAL(true);

    expect(logical).toBeInstanceOf(FLogical);
    expect(logical.value).toStrictEqual(true);
    expect(logical.kind).toBeUndefined();
  });

  test('from boolean value with kind', () => {
    const logical = Fortran.LOGICAL(false, 2);

    expect(logical).toBeInstanceOf(FLogical);
    expect(logical.value).toStrictEqual(false);
    expect(logical.kind).toStrictEqual(2);
  });

  test('from array of boolean values', () => {
    const logicalArray = Fortran.LOGICAL([true, false, true]);

    expect(logicalArray).toBeInstanceOf(FLogicalArray);
    assert(logicalArray instanceof FLogicalArray);
    expect(logicalArray.dim).toStrictEqual([3]);

    expect(logicalArray.value[1]).toStrictEqual(true);
    expect(logicalArray.value[2]).toStrictEqual(false);
    expect(logicalArray.value[3]).toStrictEqual(true);
  });

  test('from array of boolean values with kind', () => {
    const logicalArray = Fortran.LOGICAL([false, true, false], 4);

    expect(logicalArray).toBeInstanceOf(FLogicalArray);
    assert(logicalArray instanceof FLogicalArray);
    expect(logicalArray.dim).toStrictEqual([3]);

    expect(logicalArray.value[1]).toStrictEqual(false);
    expect(logicalArray.value[2]).toStrictEqual(true);
    expect(logicalArray.value[3]).toStrictEqual(false);
  });

  test('from nested array of boolean values', () => {
    const logicalArray = Fortran.LOGICAL([
      [true, false],
      [false, true],
    ]);

    expect(logicalArray).toBeInstanceOf(FLogicalArray);
    assert(logicalArray instanceof FLogicalArray);
    expect(logicalArray.dim).toStrictEqual([2, 2]);

    expect(logicalArray.value[1][1]).toStrictEqual(true);
    expect(logicalArray.value[1][2]).toStrictEqual(false);
    expect(logicalArray.value[2][1]).toStrictEqual(false);
    expect(logicalArray.value[2][2]).toStrictEqual(true);
  });
});

describe('QCMPLX', () => {
  test('from complex value', () => {
    const qcmplx = Fortran.QCMPLX({ r: 1, i: 2 });

    expect(qcmplx).toBeInstanceOf(FComplex);
    expect(qcmplx.value).toStrictEqual({ r: 1, i: 2 });
    expect(qcmplx.kind).toStrictEqual(32);
  });

  test('from array of complex values', () => {
    const qcmplxArray = Fortran.QCMPLX([
      { r: 1, i: 2 },
      { r: 3, i: 4 },
    ]);

    expect(qcmplxArray).toBeInstanceOf(FComplexArray);
    assert(qcmplxArray instanceof FComplexArray);
    expect(qcmplxArray.dim).toStrictEqual([2]);

    expect(qcmplxArray.value[1]).toStrictEqual({ r: 1, i: 2 });
    expect(qcmplxArray.value[2]).toStrictEqual({ r: 3, i: 4 });
  });

  test('from nested array of complex values', () => {
    const qcmplxArray = Fortran.QCMPLX([
      [
        { r: 1, i: 2 },
        { r: 3, i: 4 },
      ],
      [
        { r: 5, i: 6 },
        { r: 7, i: 8 },
      ],
    ]);

    expect(qcmplxArray).toBeInstanceOf(FComplexArray);
    assert(qcmplxArray instanceof FComplexArray);
    expect(qcmplxArray.dim).toStrictEqual([2, 2]);

    expect(qcmplxArray.value[1][1]).toStrictEqual({ r: 1, i: 2 });
    expect(qcmplxArray.value[1][2]).toStrictEqual({ r: 3, i: 4 });
    expect(qcmplxArray.value[2][1]).toStrictEqual({ r: 5, i: 6 });
    expect(qcmplxArray.value[2][2]).toStrictEqual({ r: 7, i: 8 });
  });
});

describe('QREAL', () => {
  test('from numeric value', () => {
    const qreal = Fortran.QREAL(3.14);

    expect(qreal).toBeInstanceOf(FReal);
    expect(qreal.value).toStrictEqual(3.14);
    expect(qreal.kind).toStrictEqual(16);
  });

  test('from array of numeric values', () => {
    const qrealArray = Fortran.QREAL([3.14, 2.71, 1.61]);

    expect(qrealArray).toBeInstanceOf(FRealArray);
    assert(qrealArray instanceof FRealArray);
    expect(qrealArray.dim).toStrictEqual([3]);

    expect(qrealArray.value[1]).toStrictEqual(3.14);
    expect(qrealArray.value[2]).toStrictEqual(2.71);
    expect(qrealArray.value[3]).toStrictEqual(1.61);
  });

  test('from nested array of numeric values', () => {
    const qrealArray = Fortran.QREAL([
      [3.14, 2.71],
      [1.61, 0.57],
    ]);

    expect(qrealArray).toBeInstanceOf(FRealArray);
    assert(qrealArray instanceof FRealArray);
    expect(qrealArray.dim).toStrictEqual([2, 2]);

    expect(qrealArray.value[1][1]).toStrictEqual(3.14);
    expect(qrealArray.value[1][2]).toStrictEqual(2.71);
    expect(qrealArray.value[2][1]).toStrictEqual(1.61);
    expect(qrealArray.value[2][2]).toStrictEqual(0.57);
  });
});

describe('REAL', () => {
  test('from numeric value', () => {
    const real = Fortran.REAL(3.14);

    expect(real).toBeInstanceOf(FReal);
    expect(real.value).toBeCloseTo(3.14);
    expect(real.kind).toBeUndefined();
  });

  test('from numeric value with kind', () => {
    const real = Fortran.REAL(3.14, 8);

    expect(real).toBeInstanceOf(FReal);
    expect(real.value).toBeCloseTo(3.14);
    expect(real.kind).toStrictEqual(8);
  });

  test('from array of numeric values', () => {
    const realArray = Fortran.REAL([3.14, 2.71, 1.61]);

    expect(realArray).toBeInstanceOf(FRealArray);
    assert(realArray instanceof FRealArray);
    expect(realArray.dim).toStrictEqual([3]);

    expect(realArray.value[1]).toBeCloseTo(3.14);
    expect(realArray.value[2]).toBeCloseTo(2.71);
    expect(realArray.value[3]).toBeCloseTo(1.61);
  });

  test('from array of numeric values with kind', () => {
    const realArray = Fortran.REAL([3.14, 2.71, 1.61], 4);

    expect(realArray).toBeInstanceOf(FRealArray);
    assert(realArray instanceof FRealArray);
    expect(realArray.dim).toStrictEqual([3]);

    expect(realArray.value[1]).toBeCloseTo(3.14);
    expect(realArray.value[2]).toBeCloseTo(2.71);
    expect(realArray.value[3]).toBeCloseTo(1.61);
  });

  test('from nested array of numeric values', () => {
    const realArray = Fortran.REAL([
      [3.14, 2.71],
      [1.61, 0.57],
    ]);

    expect(realArray).toBeInstanceOf(FRealArray);
    assert(realArray instanceof FRealArray);
    expect(realArray.dim).toStrictEqual([2, 2]);

    expect(realArray.value[1][1]).toBeCloseTo(3.14);
    expect(realArray.value[1][2]).toBeCloseTo(2.71);
    expect(realArray.value[2][1]).toBeCloseTo(1.61);
    expect(realArray.value[2][2]).toBeCloseTo(0.57);
  });
});

describe('invalid constructor and assignment inputs', () => {
  test('rejects invalid scalar values and kinds with clear errors', () => {
    expect(() => new FByte(128)).toThrow(
      'BYTE numeric values must be signed 8-bit integers',
    );
    expect(() => new FCharacter('€')).toThrow(
      'CHARACTER values must contain only 8-bit characters',
    );
    expect(() => new FCharacter('x', { len: 0 })).toThrow(
      'CHARACTER length must be a positive integer',
    );
    expect(() => new FComplex({ r: 1 } as unknown as Complex)).toThrow(
      'COMPLEX imaginary part must be a number',
    );
    expect(
      () => new FInteger(1, { kind: 3 as unknown as IntegerKind }),
    ).toThrow('Invalid integer kind: 3');
    expect(() => new FInteger(2147483648)).toThrow(
      'INTEGER values must be safe integers within the signed 4-byte range',
    );
    expect(() => new FLogical(1 as unknown as boolean)).toThrow(
      'LOGICAL values must be booleans',
    );
    expect(() => new FReal('1' as unknown as number)).toThrow(
      'REAL values must be numbers',
    );
  });

  test('rejects invalid array lengths, dimensions, and shapes', () => {
    expect(() => new FCharacterArray(['x'], { len: 0 })).toThrow(
      'CHARACTER length must be a positive integer',
    );
    expect(() => new FIntegerArray([1], { dim: [0] })).toThrow(
      'Fortran array extents must be positive integers',
    );
    expect(() => new FIntegerArray([1], { dim: [2] })).toThrow(
      'Fortran array extents must match declared dimensions',
    );
    expect(
      () => new FIntegerArray([[1], [2, 3]], { dim: [2, 2] }),
    ).toThrow('Fortran array extents must match declared dimensions');
  });

  test('stores array bounds while preserving dimensions as extents', () => {
    const array = new FIntegerArray(
      [
        [1, 2],
        [3, 4],
      ],
      { dim: [2, 2], bounds: [[-1, 0], [3, 4]] },
    );

    expect(array.dim).toStrictEqual([2, 2]);
    expect(array.bounds).toStrictEqual([
      [-1, 0],
      [3, 4],
    ]);
    expect(array.lowerBounds).toStrictEqual([-1, 3]);
    expect(array.upperBounds).toStrictEqual([0, 4]);

    array.bounds[0][0] = 100;
    expect(array.lowerBounds).toStrictEqual([-1, 3]);
  });

  test('defaults array bounds to one-based dimension extents', () => {
    const array = new FIntegerArray([1, 2, 3], { dim: [3] });

    expect(array.bounds).toStrictEqual([[1, 3]]);
    expect(array.lowerBounds).toStrictEqual([1]);
    expect(array.upperBounds).toStrictEqual([3]);
  });

  test('rejects invalid array bounds', () => {
    expect(
      () => new FIntegerArray([1, 2], { bounds: [[0, 2]] }),
    ).toThrow(
      'Fortran array bounds must be integer pairs matching declared extents',
    );
    expect(
      () =>
        new FIntegerArray(
          [
            [1, 2],
            [3, 4],
          ],
          { dim: [2, 2], bounds: [[1, 2]] },
        ),
    ).toThrow(
      'Fortran array bounds must be integer pairs matching declared extents',
    );
    expect(
      () => new FIntegerArray([1], { bounds: [[2, 1]] }),
    ).toThrow(
      'Fortran array bounds must be integer pairs matching declared extents',
    );
  });

  test('exposes and validates numeric array kinds', () => {
    expect(new FIntegerArray([1], { kind: 8 }).kind).toBe(8);
    expect(new FRealArray([1], { kind: 16 }).kind).toBe(16);
    expect(new FComplexArray([{ r: 1, i: 2 }], { kind: 32 }).kind).toBe(32);
    expect(new FLogicalArray([true], { kind: 1 }).kind).toBe(1);
    expect(
      () => new FIntegerArray([1], { kind: 3 as unknown as IntegerKind }),
    ).toThrow('Invalid integer kind: 3');
    expect(
      () => new FRealArray([1], { kind: 3 as unknown as RealKind }),
    ).toThrow('Invalid real kind: 3');
  });

  test('gets and sets elements using Fortran subscripts and declared bounds', () => {
    const array = new FIntegerArray(
      [
        [10, 20],
        [30, 40],
      ],
      { dim: [2, 2], bounds: [[-1, 0], [3, 4]] },
    );

    expect(array.getElement(-1, 3)).toMatchObject({ value: 10 });
    expect(array.getElement(0, 4)).toMatchObject({ value: 40 });

    array.setElement(99, 0, 3);
    expect(array.getElement(0, 3)).toMatchObject({ value: 99 });
    expect(array.value).toStrictEqual([
      undefined,
      [undefined, 10, 20],
      [undefined, 99, 40],
    ]);
  });

  test('rejects subscripts with invalid rank, type, or bounds', () => {
    const array = new FIntegerArray([10, 20], {
      dim: [2],
      bounds: [[-2, -1]],
    });

    expect(() => array.getElement()).toThrow(
      'Fortran array subscripts must provide exactly 1 indices',
    );
    expect(() => array.getElement(-2, -1)).toThrow(
      'Fortran array subscripts must provide exactly 1 indices',
    );
    expect(() => array.getElement(-1.5)).toThrow(
      'Fortran array subscript -1.5 is outside bounds -2:-1 in dimension 1',
    );
    expect(() => array.getElement(0)).toThrow(
      'Fortran array subscript 0 is outside bounds -2:-1 in dimension 1',
    );
    expect(() => array.setElement(1, -3)).toThrow(
      'Fortran array subscript -3 is outside bounds -2:-1 in dimension 1',
    );
  });

  test('flattens arrays in column-major order', () => {
    const array = new FIntegerArray(
      [
        [1, 2, 3],
        [4, 5, 6],
      ],
      { dim: [2, 3], bounds: [[0, 1], [-1, 1]] },
    );

    expect(array.toColumnMajorArray()).toStrictEqual([1, 4, 2, 5, 3, 6]);

    array.setElement(99, 1, -1);
    expect(array.toColumnMajorArray()).toStrictEqual([1, 99, 2, 5, 3, 6]);
  });

  test('flattens rank-one arrays without changing their order', () => {
    const array = new FIntegerArray([3, 1, 2], { dim: [3] });

    expect(array.toColumnMajorArray()).toStrictEqual([3, 1, 2]);
  });

  test('preserves requested kinds in scalar conversions', () => {
    const complex = Fortran.COMPLEX({ r: 1.0000000596046448, i: 2 }, 16);
    const real = Fortran.REAL(complex, 8);
    const integer = Fortran.INTEGER(
      Fortran.REAL(3.75, 8),
      8,
    );
    const widenedComplex = Fortran.COMPLEX(
      Fortran.REAL(1.0000000596046448, 8),
      16,
    );
    const convertedComplex = Fortran.COMPLEX(
      Fortran.REAL(1.0000000596046448, 8),
      32,
    );

    expect(real.kind).toBe(8);
    expect(real.value).toBe(1.0000000596046448);
    expect(integer).toMatchObject({ value: 3, kind: 8 });
    expect(widenedComplex.kind).toBe(16);
    expect(widenedComplex.value.r).toBe(1.0000000596046448);
    expect(convertedComplex.kind).toBe(32);
    expect(convertedComplex.value.r).toBe(1.0000000596046448);
    expect(Fortran.DOUBLE_PRECISION(3.14).kind).toBe(8);
    expect(Fortran.DOUBLE_COMPLEX({ r: 1, i: 2 }).kind).toBe(16);
    expect(Fortran.INTEGER(3.75)).toMatchObject({ value: 3 });
    expect(Fortran.INTEGER(-3.75)).toMatchObject({ value: -3 });
  });

  test('extracts sections with scalar selectors, bounds, and strides', () => {
    const array = new FIntegerArray(
      [
        [1, 2, 3],
        [4, 5, 6],
      ],
      {
        kind: 8,
        dim: [2, 3],
        bounds: [[-1, 0], [4, 6]],
      },
    );

    const section = array.getSection(0, {
      lower: 6,
      upper: 4,
      stride: -2,
    });
    expect(section).toBeInstanceOf(FIntegerArray);
    expect(section).toMatchObject({
      dim: [2],
      bounds: [[1, 2]],
      value: [undefined, 6, 4],
    });
    expect((section as FIntegerArray).getElement(1).kind).toBe(8);

    const defaultBoundsSection = array.getSection(-1, { stride: 2 });
    expect(defaultBoundsSection).toMatchObject({
      dim: [2],
      value: [undefined, 1, 3],
    });

    const scalar = array.getSection(0, 5);
    expect(scalar).toMatchObject({ value: 5, kind: 8 });

    const characters = new FCharacterArray([['a', 'b']], {
      len: 3,
      dim: [1, 2],
    });
    const characterSection = characters.getSection(1, { lower: 2 });
    expect(characterSection).toMatchObject({
      value: [undefined, 'b  '],
    });
  });

  test('assigns sections and validates selector and assignment shapes', () => {
    const array = new FIntegerArray(
      [
        [1, 2, 3],
        [4, 5, 6],
      ],
      { dim: [2, 3], bounds: [[-1, 0], [4, 6]] },
    );

    array.setSection(
      [
        [20, 30],
        [50, 60],
      ],
      { lower: 0, upper: -1, stride: -1 },
      { lower: 4, upper: 6, stride: 2 },
    );
    expect(array.toColumnMajorArray()).toStrictEqual([50, 20, 2, 5, 60, 30]);

    expect(() => array.getSection()).toThrow(
      'Fortran array sections must provide exactly 2 selectors',
    );
    expect(() =>
      array.getSection(0, { lower: 4, upper: 6, stride: 0 }),
    ).toThrow('Fortran array section stride must be a non-zero integer');
    expect(() =>
      array.getSection(0, { lower: 3, upper: 5 }),
    ).toThrow(
      'Fortran array section bounds must be within 4:6 in dimension 2',
    );
    expect(() =>
      array.getSection(0, { lower: 4, upper: 6, stride: -1 }),
    ).toThrow('Fortran array section bounds must follow the stride direction');
    expect(() =>
      array.setSection([1, 2, 3], 0, { lower: 4, upper: 6, stride: 2 }),
    ).toThrow('Fortran array extents must match declared dimensions');
  });

  test('rejects invalid reassigned values', () => {
    const integer = new FInteger(1);
    const character = new FCharacter('a');

    expect(() => {
      integer.value = 1.5;
    }).toThrow('INTEGER values must be safe integers');
    expect(() => {
      character.value = '€';
    }).toThrow('CHARACTER values must contain only 8-bit characters');
    expect(() => character.assignSubstring('€')).toThrow(
      'CHARACTER values must contain only 8-bit characters',
    );
  });
});
