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
    expect(byte.value).toStrictEqual(97);
  });

  test('from boolean value', () => {
    const byte = Fortran.BYTE(true);

    expect(byte).toBeInstanceOf(FByte);
    expect(byte.value).toStrictEqual(true);
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

    expect(byteArray.value[1]).toStrictEqual(97);
    expect(byteArray.value[2]).toStrictEqual(98);
    expect(byteArray.value[3]).toStrictEqual(99);
  });

  test('from array of boolean values', () => {
    const byteArray = Fortran.BYTE([true, false, true]);

    expect(byteArray).toBeInstanceOf(FByteArray);
    assert(byteArray instanceof FByteArray);
    expect(byteArray.dim).toStrictEqual([3]);

    expect(byteArray.value[1]).toStrictEqual(true);
    expect(byteArray.value[2]).toStrictEqual(false);
    expect(byteArray.value[3]).toStrictEqual(true);
  });

  test('from array of assorted values', () => {
    const byteArray = Fortran.BYTE(['a', 98, true]);

    expect(byteArray).toBeInstanceOf(FByteArray);
    assert(byteArray instanceof FByteArray);
    expect(byteArray.dim).toStrictEqual([3]);

    expect(byteArray.value[1]).toStrictEqual('a');
    expect(byteArray.value[2]).toStrictEqual(98);
    expect(byteArray.value[3]).toStrictEqual(true);
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
    expect(byteArray.value[1][2]).toStrictEqual(98);
    expect(byteArray.value[2][1]).toStrictEqual(true);
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

  test('truncated from string value with length', () => {
    const char = Fortran.CHARACTER('hello world', 5);

    expect(char).toBeInstanceOf(FCharacter);
    expect(char.value).toStrictEqual('hello');
    expect(char.len).toStrictEqual(5);
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
    const charArray = Fortran.CHARACTER(['hello', 'worldwide'], 5);

    expect(charArray).toBeInstanceOf(FCharacterArray);
    assert(charArray instanceof FCharacterArray);
    expect(charArray.dim).toStrictEqual([2]);

    expect(charArray.value[1]).toStrictEqual('hello');
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
