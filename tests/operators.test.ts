import Fortran from '../src';
import {
  FByte,
  FCharacter,
  FComplex,
  FInteger,
  FLogical,
  FReal,
} from '../src/datatypes';

describe('EQ', () => {
  test('with bytes', () => {
    const a = Fortran.BYTE('a');
    const b = Fortran.BYTE('a');
    const c = Fortran.EQ(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with byte and complex', () => {
    const a = Fortran.BYTE('a');
    const b = Fortran.COMPLEX({ r: 2, i: 3 });
    const c = Fortran.EQ(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(false);
  });

  test('with byte and integer', () => {
    const a = Fortran.BYTE('a');
    const b = Fortran.INTEGER(97);
    const c = Fortran.EQ(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with byte and logical', () => {
    const a = Fortran.BYTE('a');
    const b = Fortran.LOGICAL(true);
    const c = Fortran.EQ(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with byte and real', () => {
    const a = Fortran.BYTE('a');
    const b = Fortran.REAL(97.0);
    const c = Fortran.EQ(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with complex and byte', () => {
    const a = Fortran.COMPLEX({ r: 2, i: 3 });
    const b = Fortran.BYTE('a');
    const c = Fortran.EQ(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(false);
  });

  test('with complexes', () => {
    const a = Fortran.COMPLEX({ r: 1, i: 2 });
    const b = Fortran.COMPLEX({ r: 1, i: 2 });
    const c = Fortran.EQ(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with complex and integer', () => {
    const a = Fortran.COMPLEX({ r: 2, i: 0 });
    const b = Fortran.INTEGER(2);
    const c = Fortran.EQ(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with complex and logical', () => {
    const a = Fortran.COMPLEX({ r: 2, i: 3 });
    const b = Fortran.LOGICAL(true);
    const c = Fortran.EQ(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(false);
  });

  test('with complex and real', () => {
    const a = Fortran.COMPLEX({ r: 2.0, i: 0.0 });
    const b = Fortran.REAL(2.0);
    const c = Fortran.EQ(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with integer and byte', () => {
    const a = Fortran.INTEGER(97);
    const b = Fortran.BYTE('a');
    const c = Fortran.EQ(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with integer and complex', () => {
    const a = Fortran.INTEGER(2);
    const b = Fortran.COMPLEX({ r: 2, i: 0 });
    const c = Fortran.EQ(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with integers', () => {
    const a = Fortran.INTEGER(2);
    const b = Fortran.INTEGER(2);
    const c = Fortran.EQ(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with integer and logical', () => {
    const a = Fortran.INTEGER(1);
    const b = Fortran.LOGICAL(true);
    const c = Fortran.EQ(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with integer and real', () => {
    const a = Fortran.INTEGER(2);
    const b = Fortran.REAL(2.0);
    const c = Fortran.EQ(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with logical and byte', () => {
    const a = Fortran.LOGICAL(true);
    const b = Fortran.BYTE('a');
    const c = Fortran.EQ(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with logical and complex', () => {
    const a = Fortran.LOGICAL(true);
    const b = Fortran.COMPLEX({ r: 2, i: 3 });
    const c = Fortran.EQ(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(false);
  });

  test('with logical and integer', () => {
    const a = Fortran.LOGICAL(true);
    const b = Fortran.INTEGER(1);
    const c = Fortran.EQ(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with logicals', () => {
    const a = Fortran.LOGICAL(true);
    const b = Fortran.LOGICAL(true);
    const c = Fortran.EQ(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with logical and real', () => {
    const a = Fortran.LOGICAL(true);
    const b = Fortran.REAL(1.0);
    const c = Fortran.EQ(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with real and byte', () => {
    const a = Fortran.REAL(97.0);
    const b = Fortran.BYTE('a');
    const c = Fortran.EQ(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with real and complex', () => {
    const a = Fortran.REAL(2.0);
    const b = Fortran.COMPLEX({ r: 2, i: 0 });
    const c = Fortran.EQ(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with real and integer', () => {
    const a = Fortran.REAL(2.0);
    const b = Fortran.INTEGER(2);
    const c = Fortran.EQ(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with real and logical', () => {
    const a = Fortran.REAL(1.0);
    const b = Fortran.LOGICAL(true);
    const c = Fortran.EQ(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with reals', () => {
    const a = Fortran.REAL(2.0);
    const b = Fortran.REAL(2.0);
    const c = Fortran.EQ(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('compares characters after blank-padding the shorter value', () => {
    const a = Fortran.CHARACTER('text');
    const b = Fortran.CHARACTER('text  ');
    const c = Fortran.EQ(a, b);

    expect(c.value).toStrictEqual(true);
  });
});

describe('LT', () => {
  test('with integers', () => {
    const a = Fortran.INTEGER(1);
    const b = Fortran.INTEGER(2);
    const c = Fortran.LT(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with characters', () => {
    const a = Fortran.CHARACTER('ab');
    const b = Fortran.CHARACTER('ac');
    const c = Fortran.LT(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('orders values using blank-padding for unequal lengths', () => {
    const a = Fortran.CHARACTER('a');
    const b = Fortran.CHARACTER('aa');
    const c = Fortran.LT(a, b);

    expect(c.value).toStrictEqual(true);
  });
});

describe('LE', () => {
  test('with reals', () => {
    const a = Fortran.REAL(2.0);
    const b = Fortran.REAL(2.0);
    const c = Fortran.LE(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with characters', () => {
    const a = Fortran.CHARACTER('ab');
    const b = Fortran.CHARACTER('ab');
    const c = Fortran.LE(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });
});

describe('NE', () => {
  test('with bytes', () => {
    const a = Fortran.BYTE('a');
    const b = Fortran.BYTE('b');
    const c = Fortran.NE(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with byte and complex', () => {
    const a = Fortran.BYTE('a');
    const b = Fortran.COMPLEX({ r: 2, i: 3 });
    const c = Fortran.NE(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with byte and integer', () => {
    const a = Fortran.BYTE('a');
    const b = Fortran.INTEGER(98);
    const c = Fortran.NE(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with byte and logical', () => {
    const a = Fortran.BYTE('a');
    const b = Fortran.LOGICAL(true);
    const c = Fortran.NE(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(false);
  });

  test('with byte and real', () => {
    const a = Fortran.BYTE('a');
    const b = Fortran.REAL(98.0);
    const c = Fortran.NE(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with complex and byte', () => {
    const a = Fortran.COMPLEX({ r: 2, i: 3 });
    const b = Fortran.BYTE('a');
    const c = Fortran.NE(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with complexes', () => {
    const a = Fortran.COMPLEX({ r: 1, i: 2 });
    const b = Fortran.COMPLEX({ r: 3, i: 4 });
    const c = Fortran.NE(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with complex and integer', () => {
    const a = Fortran.COMPLEX({ r: 2, i: 0 });
    const b = Fortran.INTEGER(3);
    const c = Fortran.NE(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with complex and logical', () => {
    const a = Fortran.COMPLEX({ r: 2, i: 3 });
    const b = Fortran.LOGICAL(true);
    const c = Fortran.NE(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with complex and real', () => {
    const a = Fortran.COMPLEX({ r: 2.0, i: 0.0 });
    const b = Fortran.REAL(3.0);
    const c = Fortran.NE(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with integer and byte', () => {
    const a = Fortran.INTEGER(98);
    const b = Fortran.BYTE('a');
    const c = Fortran.NE(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with integer and complex', () => {
    const a = Fortran.INTEGER(2);
    const b = Fortran.COMPLEX({ r: 3, i: 0 });
    const c = Fortran.NE(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with integers', () => {
    const a = Fortran.INTEGER(2);
    const b = Fortran.INTEGER(3);
    const c = Fortran.NE(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with integer and logical', () => {
    const a = Fortran.INTEGER(1);
    const b = Fortran.LOGICAL(false);
    const c = Fortran.NE(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with integer and real', () => {
    const a = Fortran.INTEGER(2);
    const b = Fortran.REAL(3.0);
    const c = Fortran.NE(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with logical and byte', () => {
    const a = Fortran.LOGICAL(true);
    const b = Fortran.BYTE('a');
    const c = Fortran.NE(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(false);
  });

  test('with logical and complex', () => {
    const a = Fortran.LOGICAL(true);
    const b = Fortran.COMPLEX({ r: 2, i: 3 });
    const c = Fortran.NE(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with logical and integer', () => {
    const a = Fortran.LOGICAL(true);
    const b = Fortran.INTEGER(2);
    const c = Fortran.NE(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with logicals', () => {
    const a = Fortran.LOGICAL(true);
    const b = Fortran.LOGICAL(false);
    const c = Fortran.NE(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with logical and real', () => {
    const a = Fortran.LOGICAL(true);
    const b = Fortran.REAL(2.0);
    const c = Fortran.NE(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with real and byte', () => {
    const a = Fortran.REAL(98.0);
    const b = Fortran.BYTE('a');
    const c = Fortran.NE(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with real and complex', () => {
    const a = Fortran.REAL(2.0);
    const b = Fortran.COMPLEX({ r: 3, i: 0 });
    const c = Fortran.NE(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with real and integer', () => {
    const a = Fortran.REAL(2.0);
    const b = Fortran.INTEGER(3);
    const c = Fortran.NE(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with real and logical', () => {
    const a = Fortran.REAL(1.0);
    const b = Fortran.LOGICAL(false);
    const c = Fortran.NE(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with reals', () => {
    const a = Fortran.REAL(2.0);
    const b = Fortran.REAL(3.0);
    const c = Fortran.NE(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('treats trailing blanks as insignificant in character comparisons', () => {
    const a = Fortran.CHARACTER('text');
    const b = Fortran.CHARACTER('text ');
    const c = Fortran.NE(a, b);

    expect(c.value).toStrictEqual(false);
  });
});

describe('GT', () => {
  test('with bytes', () => {
    const a = Fortran.BYTE('b');
    const b = Fortran.BYTE('a');
    const c = Fortran.GT(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with characters', () => {
    const a = Fortran.CHARACTER('ba');
    const b = Fortran.CHARACTER('az');
    const c = Fortran.GT(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });
});

describe('GE', () => {
  test('with logicals', () => {
    const a = Fortran.LOGICAL(true);
    const b = Fortran.LOGICAL(false);
    const c = Fortran.GE(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with characters', () => {
    const a = Fortran.CHARACTER('az');
    const b = Fortran.CHARACTER('az');
    const c = Fortran.GE(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });
});

describe('ADD', () => {
  test('with bytes', () => {
    const a = Fortran.BYTE('a');
    const b = Fortran.BYTE(2);
    const c = Fortran.ADD(a, b);

    expect(c).toBeInstanceOf(FByte);
    expect(c.value).toStrictEqual('c');
  });

  test('with byte and complex', () => {
    const a = Fortran.BYTE('a');
    const b = Fortran.COMPLEX({ r: 2, i: 3 });
    const c = Fortran.ADD(a, b);

    expect(c).toBeInstanceOf(FComplex);
    expect(c.value).toMatchObject({ r: 99, i: 3 });
  });

  test('with byte and integer', () => {
    const a = Fortran.BYTE('a');
    const b = Fortran.INTEGER(2);
    const c = Fortran.ADD(a, b);

    expect(c).toBeInstanceOf(FInteger);
    expect(c.value).toStrictEqual(99);
  });

  test('with byte and logical', () => {
    const a = Fortran.BYTE('a');
    const b = Fortran.LOGICAL(true);
    const c = Fortran.ADD(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with byte and real', () => {
    const a = Fortran.BYTE('a');
    const b = Fortran.REAL(2.5);
    const c = Fortran.ADD(a, b);

    expect(c).toBeInstanceOf(FReal);
    expect(c.value).toBeCloseTo(99.5);
  });

  test('with complex and byte', () => {
    const a = Fortran.COMPLEX({ r: 2, i: 3 });
    const b = Fortran.BYTE('a');
    const c = Fortran.ADD(a, b);

    expect(c).toBeInstanceOf(FComplex);
    expect(c.value).toMatchObject({ r: 99, i: 3 });
  });

  test('with complexes', () => {
    const a = Fortran.COMPLEX({ r: 1, i: 2 });
    const b = Fortran.COMPLEX({ r: 3, i: 4 });
    const c = Fortran.ADD(a, b);

    expect(c).toBeInstanceOf(FComplex);
    expect(c.value).toMatchObject({ r: 4, i: 6 });
  });

  test('with complex and integer', () => {
    const a = Fortran.COMPLEX({ r: 2, i: 3 });
    const b = Fortran.INTEGER(2);
    const c = Fortran.ADD(a, b);

    expect(c).toBeInstanceOf(FComplex);
    expect(c.value).toMatchObject({ r: 4, i: 3 });
  });

  test('with complex and logical', () => {
    const a = Fortran.COMPLEX({ r: 2, i: 3 });
    const b = Fortran.LOGICAL(true);
    const c = Fortran.ADD(a, b);

    expect(c).toBeInstanceOf(FComplex);
    expect(c.value).toMatchObject({ r: 3, i: 3 });
  });

  test('with complex and real', () => {
    const a = Fortran.COMPLEX({ r: 2, i: 3 });
    const b = Fortran.REAL(2.5);
    const c = Fortran.ADD(a, b);

    expect(c).toBeInstanceOf(FComplex);
    expect(c.value).toMatchObject({ r: 4.5, i: 3 });
  });

  test('with integer and byte', () => {
    const a = Fortran.INTEGER(2);
    const b = Fortran.BYTE('a');
    const c = Fortran.ADD(a, b);

    expect(c).toBeInstanceOf(FInteger);
    expect(c.value).toStrictEqual(99);
  });

  test('with integer and complex', () => {
    const a = Fortran.INTEGER(2);
    const b = Fortran.COMPLEX({ r: 3, i: 4 });
    const c = Fortran.ADD(a, b);

    expect(c).toBeInstanceOf(FComplex);
    expect(c.value).toMatchObject({ r: 5, i: 4 });
  });

  test('with integers', () => {
    const a = Fortran.INTEGER(2);
    const b = Fortran.INTEGER(3);
    const c = Fortran.ADD(a, b);

    expect(c).toBeInstanceOf(FInteger);
    expect(c.value).toStrictEqual(5);
  });

  test('with integer and logical', () => {
    const a = Fortran.INTEGER(2);
    const b = Fortran.LOGICAL(true);
    const c = Fortran.ADD(a, b);

    expect(c).toBeInstanceOf(FInteger);
    expect(c.value).toStrictEqual(3);
  });

  test('with integer and real', () => {
    const a = Fortran.INTEGER(2);
    const b = Fortran.REAL(2.5);
    const c = Fortran.ADD(a, b);

    expect(c).toBeInstanceOf(FReal);
    expect(c.value).toBeCloseTo(4.5);
  });

  test('with logical and byte', () => {
    const a = Fortran.LOGICAL(true);
    const b = Fortran.BYTE('a');
    const c = Fortran.ADD(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with logical and complex', () => {
    const a = Fortran.LOGICAL(true);
    const b = Fortran.COMPLEX({ r: 2, i: 3 });
    const c = Fortran.ADD(a, b);

    expect(c).toBeInstanceOf(FComplex);
    expect(c.value).toMatchObject({ r: 3, i: 3 });
  });

  test('with logical and integer', () => {
    const a = Fortran.LOGICAL(true);
    const b = Fortran.INTEGER(2);
    const c = Fortran.ADD(a, b);

    expect(c).toBeInstanceOf(FInteger);
    expect(c.value).toStrictEqual(3);
  });

  test('with logicals', () => {
    const a = Fortran.LOGICAL(true);
    const b = Fortran.LOGICAL(false);
    const c = Fortran.ADD(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with logical and real', () => {
    const a = Fortran.LOGICAL(true);
    const b = Fortran.REAL(2.5);
    const c = Fortran.ADD(a, b);

    expect(c).toBeInstanceOf(FReal);
    expect(c.value).toBeCloseTo(3.5);
  });

  test('with real and byte', () => {
    const a = Fortran.REAL(2.5);
    const b = Fortran.BYTE('a');
    const c = Fortran.ADD(a, b);

    expect(c).toBeInstanceOf(FReal);
    expect(c.value).toBeCloseTo(99.5);
  });

  test('with real and complex', () => {
    const a = Fortran.REAL(2.5);
    const b = Fortran.COMPLEX({ r: 2, i: 3 });
    const c = Fortran.ADD(a, b);

    expect(c).toBeInstanceOf(FComplex);
    expect(c.value).toMatchObject({ r: 4.5, i: 3 });
  });

  test('with real and integer', () => {
    const a = Fortran.REAL(2.5);
    const b = Fortran.INTEGER(2);
    const c = Fortran.ADD(a, b);

    expect(c).toBeInstanceOf(FReal);
    expect(c.value).toBeCloseTo(4.5);
  });

  test('with real and logical', () => {
    const a = Fortran.REAL(2.5);
    const b = Fortran.LOGICAL(true);
    const c = Fortran.ADD(a, b);

    expect(c).toBeInstanceOf(FReal);
    expect(c.value).toBeCloseTo(3.5);
  });

  test('with reals', () => {
    const a = Fortran.REAL(2.5);
    const b = Fortran.REAL(3.5);
    const c = Fortran.ADD(a, b);

    expect(c).toBeInstanceOf(FReal);
    expect(c.value).toBeCloseTo(6.0);
  });
});

describe('byte and logical promotion edge cases', () => {
  test('converts byte values numerically instead of treating their strings as truthy', () => {
    expect(Fortran.ADD(Fortran.BYTE(0), Fortran.LOGICAL(false))).toMatchObject({
      value: false,
      kind: 4,
    });
    expect(Fortran.ADD(Fortran.BYTE(2), Fortran.LOGICAL(false))).toMatchObject({
      value: true,
      kind: 4,
    });
    expect(Fortran.EQ(Fortran.BYTE(0), Fortran.LOGICAL(false)).value).toBe(true);
  });

  test('promotes equal-rank byte and kind-one logical values in either order', () => {
    expect(
      Fortran.ADD(Fortran.BYTE(0), Fortran.LOGICAL(false, 1)),
    ).toMatchObject({ value: false, kind: 1 });
    expect(
      Fortran.ADD(Fortran.LOGICAL(false, 1), Fortran.BYTE(0)),
    ).toMatchObject({ value: false, kind: 1 });
    expect(
      Fortran.ADD(Fortran.BYTE(1), Fortran.LOGICAL(false, 1)),
    ).toMatchObject({ value: true, kind: 1 });
  });
});

describe('SUB', () => {
  test('with bytes', () => {
    const a = Fortran.BYTE('c');
    const b = Fortran.BYTE(2);
    const c = Fortran.SUB(a, b);

    expect(c).toBeInstanceOf(FByte);
    expect(c.value).toStrictEqual('a');
  });

  test('with byte and complex', () => {
    const a = Fortran.BYTE('c');
    const b = Fortran.COMPLEX({ r: 2, i: 3 });
    const c = Fortran.SUB(a, b);

    expect(c).toBeInstanceOf(FComplex);
    expect(c.value).toMatchObject({ r: 97, i: -3 });
  });

  test('with byte and integer', () => {
    const a = Fortran.BYTE('c');
    const b = Fortran.INTEGER(2);
    const c = Fortran.SUB(a, b);

    expect(c).toBeInstanceOf(FInteger);
    expect(c.value).toStrictEqual(97);
  });

  test('with byte and logical', () => {
    const a = Fortran.BYTE('c');
    const b = Fortran.LOGICAL(true);
    const c = Fortran.SUB(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(false);
  });

  test('with byte and real', () => {
    const a = Fortran.BYTE('c');
    const b = Fortran.REAL(2.5);
    const c = Fortran.SUB(a, b);

    expect(c).toBeInstanceOf(FReal);
    expect(c.value).toBeCloseTo(96.5);
  });

  test('with complex and byte', () => {
    const a = Fortran.COMPLEX({ r: 2, i: 3 });
    const b = Fortran.BYTE('c');
    const c = Fortran.SUB(a, b);

    expect(c).toBeInstanceOf(FComplex);
    expect(c.value).toMatchObject({ r: -97, i: 3 });
  });

  test('with complexes', () => {
    const a = Fortran.COMPLEX({ r: 3, i: 4 });
    const b = Fortran.COMPLEX({ r: 1, i: 2 });
    const c = Fortran.SUB(a, b);

    expect(c).toBeInstanceOf(FComplex);
    expect(c.value).toMatchObject({ r: 2, i: 2 });
  });

  test('with complex and integer', () => {
    const a = Fortran.COMPLEX({ r: 2, i: 3 });
    const b = Fortran.INTEGER(2);
    const c = Fortran.SUB(a, b);

    expect(c).toBeInstanceOf(FComplex);
    expect(c.value).toMatchObject({ r: 0, i: 3 });
  });

  test('with complex and logical', () => {
    const a = Fortran.COMPLEX({ r: 2, i: 3 });
    const b = Fortran.LOGICAL(true);
    const c = Fortran.SUB(a, b);

    expect(c).toBeInstanceOf(FComplex);
    expect(c.value).toMatchObject({ r: 1, i: 3 });
  });

  test('with complex and real', () => {
    const a = Fortran.COMPLEX({ r: 2, i: 3 });
    const b = Fortran.REAL(2.5);
    const c = Fortran.SUB(a, b);

    expect(c).toBeInstanceOf(FComplex);
    expect(c.value).toMatchObject({ r: -0.5, i: 3 });
  });

  test('with integer and byte', () => {
    const a = Fortran.INTEGER(2);
    const b = Fortran.BYTE('c');
    const c = Fortran.SUB(a, b);

    expect(c).toBeInstanceOf(FInteger);
    expect(c.value).toStrictEqual(-97);
  });

  test('with integer and complex', () => {
    const a = Fortran.INTEGER(2);
    const b = Fortran.COMPLEX({ r: 3, i: 4 });
    const c = Fortran.SUB(a, b);

    expect(c).toBeInstanceOf(FComplex);
    expect(c.value).toMatchObject({ r: -1, i: -4 });
  });

  test('with integers', () => {
    const a = Fortran.INTEGER(3);
    const b = Fortran.INTEGER(2);
    const c = Fortran.SUB(a, b);

    expect(c).toBeInstanceOf(FInteger);
    expect(c.value).toStrictEqual(1);
  });

  test('with integer and logical', () => {
    const a = Fortran.INTEGER(2);
    const b = Fortran.LOGICAL(true);
    const c = Fortran.SUB(a, b);

    expect(c).toBeInstanceOf(FInteger);
    expect(c.value).toStrictEqual(1);
  });

  test('with integer and real', () => {
    const a = Fortran.INTEGER(2);
    const b = Fortran.REAL(2.5);
    const c = Fortran.SUB(a, b);

    expect(c).toBeInstanceOf(FReal);
    expect(c.value).toBeCloseTo(-0.5);
  });

  test('with logical and byte', () => {
    const a = Fortran.LOGICAL(true);
    const b = Fortran.BYTE('c');
    const c = Fortran.SUB(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(false);
  });

  test('with logical and complex', () => {
    const a = Fortran.LOGICAL(true);
    const b = Fortran.COMPLEX({ r: 2, i: 3 });
    const c = Fortran.SUB(a, b);

    expect(c).toBeInstanceOf(FComplex);
    expect(c.value).toMatchObject({ r: -1, i: -3 });
  });

  test('with logical and integer', () => {
    const a = Fortran.LOGICAL(true);
    const b = Fortran.INTEGER(2);
    const c = Fortran.SUB(a, b);

    expect(c).toBeInstanceOf(FInteger);
    expect(c.value).toStrictEqual(-1);
  });

  test('with logicals', () => {
    const a = Fortran.LOGICAL(true);
    const b = Fortran.LOGICAL(false);
    const c = Fortran.SUB(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with logical and real', () => {
    const a = Fortran.LOGICAL(true);
    const b = Fortran.REAL(2.5);
    const c = Fortran.SUB(a, b);

    expect(c).toBeInstanceOf(FReal);
    expect(c.value).toBeCloseTo(-1.5);
  });

  test('with real and byte', () => {
    const a = Fortran.REAL(2.5);
    const b = Fortran.BYTE('c');
    const c = Fortran.SUB(a, b);

    expect(c).toBeInstanceOf(FReal);
    expect(c.value).toBeCloseTo(-96.5);
  });

  test('with real and complex', () => {
    const a = Fortran.REAL(2.5);
    const b = Fortran.COMPLEX({ r: 2, i: 3 });
    const c = Fortran.SUB(a, b);

    expect(c).toBeInstanceOf(FComplex);
    expect(c.value).toMatchObject({ r: 0.5, i: -3 });
  });

  test('with real and integer', () => {
    const a = Fortran.REAL(2.5);
    const b = Fortran.INTEGER(2);
    const c = Fortran.SUB(a, b);

    expect(c).toBeInstanceOf(FReal);
    expect(c.value).toBeCloseTo(0.5);
  });

  test('with real and logical', () => {
    const a = Fortran.REAL(2.5);
    const b = Fortran.LOGICAL(true);
    const c = Fortran.SUB(a, b);

    expect(c).toBeInstanceOf(FReal);
    expect(c.value).toBeCloseTo(1.5);
  });

  test('with reals', () => {
    const a = Fortran.REAL(3.5);
    const b = Fortran.REAL(2.5);
    const c = Fortran.SUB(a, b);

    expect(c).toBeInstanceOf(FReal);
    expect(c.value).toBeCloseTo(1.0);
  });
});

describe('MUL', () => {
  test('with bytes', () => {
    const a = Fortran.BYTE(5);
    const b = Fortran.BYTE(4);
    const c = Fortran.MUL(a, b);

    expect(c).toBeInstanceOf(FByte);
    expect(c.value).toStrictEqual(String.fromCharCode(20));
  });

  test('with byte and integer', () => {
    const a = Fortran.BYTE(5);
    const b = Fortran.INTEGER(4);
    const c = Fortran.MUL(a, b);

    expect(c).toBeInstanceOf(FInteger);
    expect(c.value).toStrictEqual(20);
  });

  test('with byte and real', () => {
    const a = Fortran.BYTE(5);
    const b = Fortran.REAL(2.5);
    const c = Fortran.MUL(a, b);

    expect(c).toBeInstanceOf(FReal);
    expect(c.value).toBeCloseTo(12.5);
  });

  test('with integers', () => {
    const a = Fortran.INTEGER(6);
    const b = Fortran.INTEGER(7);
    const c = Fortran.MUL(a, b);

    expect(c).toBeInstanceOf(FInteger);
    expect(c.value).toStrictEqual(42);
  });

  test('with reals', () => {
    const a = Fortran.REAL(1.5);
    const b = Fortran.REAL(4.0);
    const c = Fortran.MUL(a, b);

    expect(c).toBeInstanceOf(FReal);
    expect(c.value).toBeCloseTo(6);
  });

  test('with logicals', () => {
    const a = Fortran.LOGICAL(true);
    const b = Fortran.LOGICAL(false);
    const c = Fortran.MUL(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(false);
  });

  test('with complex and integer', () => {
    const a = Fortran.COMPLEX({ r: 2, i: 3 });
    const b = Fortran.INTEGER(2);
    const c = Fortran.MUL(a, b);

    expect(c).toBeInstanceOf(FComplex);
    expect(c.value).toMatchObject({ r: 4, i: 6 });
  });

  test('with real and complex', () => {
    const a = Fortran.REAL(1.5);
    const b = Fortran.COMPLEX({ r: 2, i: 3 });
    const c = Fortran.MUL(a, b);

    expect(c).toBeInstanceOf(FComplex);
    expect(c.value).toMatchObject({ r: 3, i: 4.5 });
  });

  test('with complexes', () => {
    const a = Fortran.COMPLEX({ r: 2, i: 3 });
    const b = Fortran.COMPLEX({ r: 4, i: -1 });
    const c = Fortran.MUL(a, b);

    expect(c).toBeInstanceOf(FComplex);
    expect(c.value.r).toBeCloseTo(11);
    expect(c.value.i).toBeCloseTo(10);
  });
});

describe('DIV', () => {
  test('with bytes', () => {
    const a = Fortran.BYTE(8);
    const b = Fortran.BYTE(2);
    const c = Fortran.DIV(a, b);

    expect(c).toBeInstanceOf(FByte);
    expect(c.value).toStrictEqual(String.fromCharCode(4));
  });

  test('with byte and integer', () => {
    const a = Fortran.BYTE(8);
    const b = Fortran.INTEGER(2);
    const c = Fortran.DIV(a, b);

    expect(c).toBeInstanceOf(FInteger);
    expect(c.value).toStrictEqual(4);
  });

  test('with integer and integer truncates', () => {
    const a = Fortran.INTEGER(7);
    const b = Fortran.INTEGER(2);
    const c = Fortran.DIV(a, b);

    expect(c).toBeInstanceOf(FInteger);
    expect(c.value).toStrictEqual(3);
  });

  test('with integer and real', () => {
    const a = Fortran.INTEGER(7);
    const b = Fortran.REAL(2.0);
    const c = Fortran.DIV(a, b);

    expect(c).toBeInstanceOf(FReal);
    expect(c.value).toBeCloseTo(3.5);
  });

  test('with reals', () => {
    const a = Fortran.REAL(7.5);
    const b = Fortran.REAL(2.5);
    const c = Fortran.DIV(a, b);

    expect(c).toBeInstanceOf(FReal);
    expect(c.value).toBeCloseTo(3);
  });

  test('with logicals', () => {
    const a = Fortran.LOGICAL(true);
    const b = Fortran.LOGICAL(true);
    const c = Fortran.DIV(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with complex and integer', () => {
    const a = Fortran.COMPLEX({ r: 2, i: 4 });
    const b = Fortran.INTEGER(2);
    const c = Fortran.DIV(a, b);

    expect(c).toBeInstanceOf(FComplex);
    expect(c.value.r).toBeCloseTo(1);
    expect(c.value.i).toBeCloseTo(2);
  });

  test('with real and complex', () => {
    const a = Fortran.REAL(2);
    const b = Fortran.COMPLEX({ r: 1, i: -1 });
    const c = Fortran.DIV(a, b);

    expect(c).toBeInstanceOf(FComplex);
    expect(c.value.r).toBeCloseTo(1);
    expect(c.value.i).toBeCloseTo(1);
  });

  test('with complexes', () => {
    const a = Fortran.COMPLEX({ r: 3, i: 2 });
    const b = Fortran.COMPLEX({ r: 4, i: -1 });
    const c = Fortran.DIV(a, b);

    expect(c).toBeInstanceOf(FComplex);
    expect(c.value.r).toBeCloseTo(10 / 17);
    expect(c.value.i).toBeCloseTo(11 / 17);
  });
});

describe('POW', () => {
  test('with bytes', () => {
    const a = Fortran.BYTE(2);
    const b = Fortran.BYTE(3);
    const c = Fortran.POW(a, b);

    expect(c).toBeInstanceOf(FByte);
    expect(c.value).toStrictEqual(String.fromCharCode(8));
  });

  test('with byte and integer', () => {
    const a = Fortran.BYTE(3);
    const b = Fortran.INTEGER(2);
    const c = Fortran.POW(a, b);

    expect(c).toBeInstanceOf(FInteger);
    expect(c.value).toStrictEqual(9);
  });

  test('with integers', () => {
    const a = Fortran.INTEGER(2);
    const b = Fortran.INTEGER(10);
    const c = Fortran.POW(a, b);

    expect(c).toBeInstanceOf(FInteger);
    expect(c.value).toStrictEqual(1024);
  });

  test('with real and integer', () => {
    const a = Fortran.REAL(9);
    const b = Fortran.INTEGER(2);
    const c = Fortran.POW(a, b);

    expect(c).toBeInstanceOf(FReal);
    expect(c.value).toBeCloseTo(81);
  });

  test('with reals', () => {
    const a = Fortran.REAL(2.5);
    const b = Fortran.REAL(2);
    const c = Fortran.POW(a, b);

    expect(c).toBeInstanceOf(FReal);
    expect(c.value).toBeCloseTo(6.25);
  });

  test('with logicals', () => {
    const a = Fortran.LOGICAL(true);
    const b = Fortran.LOGICAL(false);
    const c = Fortran.POW(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('with complex and integer', () => {
    const a = Fortran.COMPLEX({ r: 1, i: 1 });
    const b = Fortran.INTEGER(2);
    const c = Fortran.POW(a, b);

    expect(c).toBeInstanceOf(FComplex);
    expect(c.value.r).toBeCloseTo(0);
    expect(c.value.i).toBeCloseTo(2);
  });

  test('with real and complex', () => {
    const a = Fortran.REAL(2);
    const b = Fortran.COMPLEX({ r: 2, i: 0 });
    const c = Fortran.POW(a, b);

    expect(c).toBeInstanceOf(FComplex);
    expect(c.value.r).toBeCloseTo(4);
    expect(c.value.i).toBeCloseTo(0);
  });

  test('with complexes', () => {
    const a = Fortran.COMPLEX({ r: 2, i: 0 });
    const b = Fortran.COMPLEX({ r: 3, i: 0 });
    const c = Fortran.POW(a, b);

    expect(c).toBeInstanceOf(FComplex);
    expect(c.value.r).toBeCloseTo(8);
    expect(c.value.i).toBeCloseTo(0);
  });
});

describe('UPLUS', () => {
  test('with byte', () => {
    const a = Fortran.BYTE(3);
    const c = Fortran.UPLUS(a);

    expect(c).toBeInstanceOf(FByte);
    expect(c.value).toStrictEqual(String.fromCharCode(3));
  });

  test('with integer', () => {
    const a = Fortran.INTEGER(-7);
    const c = Fortran.UPLUS(a);

    expect(c).toBeInstanceOf(FInteger);
    expect(c.value).toStrictEqual(-7);
  });

  test('with real', () => {
    const a = Fortran.REAL(-3.5);
    const c = Fortran.UPLUS(a);

    expect(c).toBeInstanceOf(FReal);
    expect(c.value).toBeCloseTo(-3.5);
  });

  test('with complex', () => {
    const a = Fortran.COMPLEX({ r: -2, i: 3 });
    const c = Fortran.UPLUS(a);

    expect(c).toBeInstanceOf(FComplex);
    expect(c.value).toMatchObject({ r: -2, i: 3 });
  });

  test('with logical', () => {
    const a = Fortran.LOGICAL(true);
    const c = Fortran.UPLUS(a);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });
});

describe('UMINUS', () => {
  test('with byte', () => {
    const a = Fortran.BYTE(1);
    const c = Fortran.UMINUS(a);

    expect(c).toBeInstanceOf(FByte);
    expect(c.value).toStrictEqual(String.fromCharCode(-1));
  });

  test('with integer', () => {
    const a = Fortran.INTEGER(7);
    const c = Fortran.UMINUS(a);

    expect(c).toBeInstanceOf(FInteger);
    expect(c.value).toStrictEqual(-7);
  });

  test('with real', () => {
    const a = Fortran.REAL(3.5);
    const c = Fortran.UMINUS(a);

    expect(c).toBeInstanceOf(FReal);
    expect(c.value).toBeCloseTo(-3.5);
  });

  test('with complex', () => {
    const a = Fortran.COMPLEX({ r: 2, i: -3 });
    const c = Fortran.UMINUS(a);

    expect(c).toBeInstanceOf(FComplex);
    expect(c.value).toMatchObject({ r: -2, i: 3 });
  });

  test('with logical', () => {
    const a = Fortran.LOGICAL(true);
    const c = Fortran.UMINUS(a);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(false);
  });
});

describe('NOT', () => {
  test('inverts logical value', () => {
    const a = Fortran.LOGICAL(true);
    const c = Fortran.NOT(a);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(false);
  });
});

describe('AND', () => {
  test('true and true', () => {
    const a = Fortran.LOGICAL(true);
    const b = Fortran.LOGICAL(true);
    const c = Fortran.AND(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('true and false', () => {
    const a = Fortran.LOGICAL(true);
    const b = Fortran.LOGICAL(false);
    const c = Fortran.AND(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(false);
  });
});

describe('OR', () => {
  test('false or false', () => {
    const a = Fortran.LOGICAL(false);
    const b = Fortran.LOGICAL(false);
    const c = Fortran.OR(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(false);
  });

  test('true or false', () => {
    const a = Fortran.LOGICAL(true);
    const b = Fortran.LOGICAL(false);
    const c = Fortran.OR(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });
});

describe('NEQV', () => {
  test('true neqv false', () => {
    const a = Fortran.LOGICAL(true);
    const b = Fortran.LOGICAL(false);
    const c = Fortran.NEQV(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('true neqv true', () => {
    const a = Fortran.LOGICAL(true);
    const b = Fortran.LOGICAL(true);
    const c = Fortran.NEQV(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(false);
  });
});

describe('XOR', () => {
  test('false xor false', () => {
    const a = Fortran.LOGICAL(false);
    const b = Fortran.LOGICAL(false);
    const c = Fortran.XOR(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(false);
  });

  test('true xor false', () => {
    const a = Fortran.LOGICAL(true);
    const b = Fortran.LOGICAL(false);
    const c = Fortran.XOR(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });
});

describe('EQV', () => {
  test('true eqv true', () => {
    const a = Fortran.LOGICAL(true);
    const b = Fortran.LOGICAL(true);
    const c = Fortran.EQV(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(true);
  });

  test('true eqv false', () => {
    const a = Fortran.LOGICAL(true);
    const b = Fortran.LOGICAL(false);
    const c = Fortran.EQV(a, b);

    expect(c).toBeInstanceOf(FLogical);
    expect(c.value).toStrictEqual(false);
  });
});

describe('CONCAT', () => {
  test('concatenates character values', () => {
    const a = Fortran.CHARACTER('HELLO');
    const b = Fortran.CHARACTER(' WORLD');
    const c = Fortran.CONCAT(a, b);

    expect(c).toBeInstanceOf(FCharacter);
    expect(c.value).toStrictEqual('HELLO WORLD');
  });
});

describe('kind-aware mixed-mode arithmetic', () => {
  test('resolves equal-rank logical and real operands as real in either order', () => {
    const logical = Fortran.LOGICAL(true, 8);
    const real = Fortran.REAL(2.5, 4);

    expect(Fortran.ADD(logical, real)).toMatchObject({
      value: 3.5,
      kind: 4,
    });
    expect(Fortran.ADD(real, logical)).toMatchObject({
      value: 3.5,
      kind: 4,
    });
  });

  test('resolves equal-rank logical and integer operands as integer', () => {
    const logical = Fortran.LOGICAL(true, 4);
    const integer = Fortran.INTEGER(2, 2);

    expect(Fortran.ADD(logical, integer)).toMatchObject({
      value: 3,
      kind: 2,
    });
    expect(Fortran.ADD(integer, logical)).toMatchObject({
      value: 3,
      kind: 2,
    });
  });

  test('uses the real operand kind for mixed integer and real arithmetic', () => {
    const integer = Fortran.INTEGER(2, 8);
    const real = Fortran.REAL(2.5, 4);

    expect(Fortran.ADD(integer, real)).toMatchObject({
      value: 4.5,
      kind: 4,
    });
    expect(Fortran.ADD(real, integer)).toMatchObject({
      value: 4.5,
      kind: 4,
    });
  });

  test('promotes same-type operands to the wider kind in either order', () => {
    const single = Fortran.REAL(1.25, 4);
    const double = Fortran.REAL(2.5, 8);

    expect(Fortran.ADD(single, double)).toMatchObject({
      value: 3.75,
      kind: 8,
    });
    expect(Fortran.ADD(double, single)).toMatchObject({
      value: 3.75,
      kind: 8,
    });
  });

  test('preserves complex kind when promoted with a narrower real', () => {
    const complex = Fortran.COMPLEX({ r: 1, i: 2 }, 16);
    const real = Fortran.REAL(3.5, 4);

    expect(Fortran.ADD(complex, real)).toMatchObject({
      value: { r: 4.5, i: 2 },
      kind: 16,
    });
    expect(Fortran.ADD(real, complex)).toMatchObject({
      value: { r: 4.5, i: 2 },
      kind: 16,
    });
  });
});
