import Fortran from '../src';
import { FInteger, FReal } from '../src/datatypes';

describe('numeric intrinsic functions', () => {
  test('ABS preserves integer and real kinds and returns real for complex values', () => {
    expect(Fortran.ABS(Fortran.INTEGER(-5, 2))).toMatchObject({
      value: 5,
      kind: 2,
    });
    expect(Fortran.ABS(Fortran.REAL(-2.5, 8))).toMatchObject({
      value: 2.5,
      kind: 8,
    });
    expect(Fortran.ABS(Fortran.COMPLEX({ r: 3, i: 4 }, 16))).toMatchObject({
      value: 5,
      kind: 8,
    });
  });

  test('AINT truncates toward zero and ANINT rounds ties away from zero', () => {
    expect(Fortran.AINT(Fortran.REAL(-2.9)).value).toBe(-2);
    expect(Fortran.ANINT(Fortran.REAL(2.5)).value).toBe(3);
    expect(Fortran.ANINT(Fortran.REAL(-2.5)).value).toBe(-3);
  });

  test('NINT returns default integer and INT conversion truncates toward zero', () => {
    const nearest = Fortran.NINT(Fortran.REAL(-2.5, 8));

    expect(nearest).toBeInstanceOf(FInteger);
    expect(nearest.value).toBe(-3);
    expect(nearest.kind).toBe(4);
    expect(Fortran.INT(Fortran.REAL(-2.9)).value).toBe(-2);
    expect(Fortran.INT(Fortran.COMPLEX({ r: -2.9, i: 7 })).value).toBe(-2);
  });

  test('SIGN uses the sign of the second argument', () => {
    expect(Fortran.SIGN(Fortran.INTEGER(-5, 2), Fortran.INTEGER(-1, 2))).toMatchObject({
      value: -5,
      kind: 2,
    });
    expect(Fortran.SIGN(Fortran.REAL(-2.5, 8), Fortran.REAL(0, 8))).toMatchObject({
      value: 2.5,
      kind: 8,
    });
  });

  test('DIM returns the positive part of the difference', () => {
    expect(Fortran.DIM(Fortran.INTEGER(8, 2), Fortran.INTEGER(3, 2))).toMatchObject({
      value: 5,
      kind: 2,
    });
    expect(Fortran.DIM(Fortran.REAL(2), Fortran.REAL(3)).value).toBe(0);
  });

  test('MOD keeps the dividend sign and preserves the numeric kind', () => {
    expect(Fortran.MOD(Fortran.INTEGER(-7, 8), Fortran.INTEGER(3, 8))).toMatchObject({
      value: -1,
      kind: 8,
    });
    expect(Fortran.MOD(Fortran.REAL(-7.5, 8), Fortran.REAL(3, 8)).value).toBe(-1.5);
  });

  test('MAX and MIN select values while preserving type and kind', () => {
    expect(
      Fortran.MAX(Fortran.INTEGER(4, 2), Fortran.INTEGER(9, 2), Fortran.INTEGER(2, 2)),
    ).toMatchObject({ value: 9, kind: 2 });
    expect(Fortran.MIN(Fortran.REAL(4, 8), Fortran.REAL(-1, 8))).toMatchObject({
      value: -1,
      kind: 8,
    });
  });

  test('rejects invalid operand type/kind combinations and missing values', () => {
    expect(() => Fortran.SIGN(Fortran.INTEGER(1), Fortran.REAL(1))).toThrow(
      'SIGN operands must have the same numeric type and kind',
    );
    expect(() => Fortran.MOD(Fortran.INTEGER(1), Fortran.INTEGER(0))).toThrow(
      'MOD divisor must not be zero',
    );
    expect(() => Fortran.MAX(Fortran.INTEGER(1))).toThrow(
      'MAX requires at least two arguments',
    );
    expect(() => Fortran.MIN(Fortran.REAL(1), Fortran.REAL(2, 8))).toThrow(
      'MIN arguments must have the same numeric type and kind',
    );
  });
});

describe('real-valued intrinsic functions', () => {
  test('SQRT, EXP, LOG, and LOG10 preserve the input kind', () => {
    const input = Fortran.REAL(4, 8);

    expect(Fortran.SQRT(input)).toMatchObject({ value: 2, kind: 8 });
    expect(Fortran.EXP(Fortran.REAL(0, 8))).toMatchObject({
      value: 1,
      kind: 8,
    });
    expect(Fortran.LOG(Fortran.REAL(Math.E, 8)).value).toBeCloseTo(1);
    expect(Fortran.LOG10(Fortran.REAL(100, 8)).value).toBe(2);
  });

  test('trigonometric and inverse trigonometric functions preserve kind', () => {
    const halfPi = Fortran.REAL(Math.PI / 2, 8);

    expect(Fortran.SIN(halfPi)).toMatchObject({ value: 1, kind: 8 });
    expect(Fortran.COS(Fortran.REAL(0, 8))).toMatchObject({
      value: 1,
      kind: 8,
    });
    expect(Fortran.TAN(Fortran.REAL(0, 8)).value).toBe(0);
    expect(Fortran.ASIN(Fortran.REAL(1, 8)).value).toBeCloseTo(Math.PI / 2);
    expect(Fortran.ACOS(Fortran.REAL(1, 8)).value).toBe(0);
    expect(Fortran.ATAN(Fortran.REAL(0, 8)).value).toBe(0);
    expect(Fortran.ATAN2(Fortran.REAL(1, 8), Fortran.REAL(0, 8)).value).toBeCloseTo(
      Math.PI / 2,
    );
  });

  test('hyperbolic functions preserve kind', () => {
    expect(Fortran.SINH(Fortran.REAL(0, 8))).toMatchObject({
      value: 0,
      kind: 8,
    });
    expect(Fortran.COSH(Fortran.REAL(0, 8))).toMatchObject({
      value: 1,
      kind: 8,
    });
    expect(Fortran.TANH(Fortran.REAL(0, 8))).toMatchObject({
      value: 0,
      kind: 8,
    });
  });

  test('ATAN2 requires matching kinds', () => {
    expect(() => Fortran.ATAN2(Fortran.REAL(1), Fortran.REAL(1, 8))).toThrow(
      'ATAN2 operands must have the same kind',
    );
  });
});

describe('complex intrinsic functions', () => {
  test('AIMAG and CONJG preserve the corresponding type metadata', () => {
    expect(Fortran.AIMAG(Fortran.COMPLEX({ r: 1, i: 3 }, 16))).toMatchObject({
      value: 3,
      kind: 8,
    });
    expect(Fortran.CONJG(Fortran.COMPLEX({ r: 1, i: -2 }, 16))).toMatchObject({
      value: { r: 1, i: 2 },
      kind: 16,
    });
  });

  test('complex exponential, logarithm, square root, sine, and cosine work', () => {
    const zero = Fortran.COMPLEX({ r: 0, i: 0 }, 16);
    const onePlusI = Fortran.COMPLEX({ r: 1, i: 1 }, 16);
    const squareRoot = Fortran.CSQRT(Fortran.COMPLEX({ r: -4, i: 0 }, 16));
    const lowerSquareRoot = Fortran.CSQRT(
      Fortran.COMPLEX({ r: -4, i: -0 }, 16),
    );
    const sine = Fortran.CSIN(zero);
    const cosine = Fortran.CCOS(zero);
    const exponential = Fortran.CEXP(onePlusI).value;
    const logarithm = Fortran.CLOG(onePlusI).value;
    const sineOnePlusI = Fortran.CSIN(onePlusI).value;
    const cosineOnePlusI = Fortran.CCOS(onePlusI).value;

    expect(Fortran.CEXP(zero)).toMatchObject({
      value: { r: 1, i: 0 },
      kind: 16,
    });
    expect(Fortran.CLOG(Fortran.COMPLEX({ r: 1, i: 0 }, 16))).toMatchObject({
      value: { r: 0, i: 0 },
      kind: 16,
    });
    expect(squareRoot.value.r).toBeCloseTo(0);
    expect(squareRoot.value.i).toBeCloseTo(2);
    expect(lowerSquareRoot.value.i).toBeCloseTo(-2);
    expect(sine.value).toMatchObject({ r: 0, i: 0 });
    expect(cosine.value.r).toBeCloseTo(1);
    expect(cosine.value.i).toBeCloseTo(0);
    expect(exponential.r).toBeCloseTo(Math.exp(1) * Math.cos(1));
    expect(exponential.i).toBeCloseTo(Math.exp(1) * Math.sin(1));
    expect(logarithm.r).toBeCloseTo(Math.log(Math.SQRT2));
    expect(logarithm.i).toBeCloseTo(Math.PI / 4);
    expect(sineOnePlusI.r).toBeCloseTo(Math.sin(1) * Math.cosh(1));
    expect(sineOnePlusI.i).toBeCloseTo(Math.cos(1) * Math.sinh(1));
    expect(cosineOnePlusI.r).toBeCloseTo(Math.cos(1) * Math.cosh(1));
    expect(cosineOnePlusI.i).toBeCloseTo(-Math.sin(1) * Math.sinh(1));
  });

  test('DPROD returns double precision', () => {
    const result = Fortran.DPROD(Fortran.REAL(1.5), Fortran.REAL(2));

    expect(result).toBeInstanceOf(FReal);
    expect(result.value).toBe(3);
    expect(result.kind).toBe(8);
  });
});
