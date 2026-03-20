import Fortran from '../src';
import { FByte, FComplex, FInteger, FLogical, FReal } from '../src/datatypes';

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
