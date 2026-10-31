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

  test('Fortran 77 specific ABS names enforce their type and result kinds', () => {
    expect(Fortran.IABS(Fortran.INTEGER(-5))).toMatchObject({ value: 5 });
    expect(Fortran.DABS(Fortran.REAL(-2.5, 8))).toMatchObject({
      value: 2.5,
      kind: 8,
    });
    expect(
      Fortran.CABS(Fortran.COMPLEX({ r: 3, i: 4 }, 8)),
    ).toMatchObject({ value: 5, kind: 4 });
    expect(() => Fortran.DABS(Fortran.REAL(1))).toThrow(
      'DABS requires kind 8',
    );
    expect(() => Fortran.CABS(Fortran.COMPLEX({ r: 1, i: 0 }, 16))).toThrow(
      'CABS requires kind 8',
    );
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

  test('specific conversion intrinsics return their required default kinds', () => {
    const singlePrecision = Fortran.FLOAT(Fortran.INTEGER(16777217));
    const doublePrecision = Fortran.DBLE(-2.9);
    const doubleFloat = Fortran.DFLOAT(Fortran.INTEGER(16777217));
    const roundedSingle = Fortran.SNGL(Fortran.DBLE(1.234567890123));

    expect(singlePrecision).toBeInstanceOf(FReal);
    expect(singlePrecision).toMatchObject({ value: 16777216, kind: 4 });
    expect(doubleFloat).toMatchObject({ value: 16777217, kind: 8 });
    expect(doubleFloat.standard).toBe(Fortran.INTEGER(1).standard);
    expect(Fortran.IFIX(Fortran.REAL(-2.9))).toMatchObject({
      value: -2,
      kind: 4,
    });
    expect(Fortran.IDINT(doublePrecision)).toMatchObject({
      value: -2,
      kind: 4,
    });
    expect(roundedSingle).toMatchObject({
      value: Math.fround(1.234567890123),
      kind: 4,
    });
  });

  test('double-precision rounding intrinsics return the required kinds', () => {
    const doublePrecision = Fortran.DBLE(-2.5);

    expect(Fortran.DINT(doublePrecision)).toMatchObject({
      value: -2,
      kind: 8,
    });
    expect(Fortran.DNINT(doublePrecision)).toMatchObject({
      value: -3,
      kind: 8,
    });
    expect(Fortran.IDNINT(doublePrecision)).toMatchObject({
      value: -3,
      kind: 4,
    });
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

  test('specific DIM, MOD, and SIGN names preserve their declared precision', () => {
    expect(
      Fortran.IDIM(Fortran.INTEGER(8), Fortran.INTEGER(3)),
    ).toMatchObject({ value: 5 });
    expect(Fortran.ADIM(Fortran.REAL(8), Fortran.REAL(3))).toMatchObject({
      value: 5,
    });
    expect(
      Fortran.DDIM(Fortran.REAL(8, 8), Fortran.REAL(3, 8)),
    ).toMatchObject({ value: 5, kind: 8 });
    expect(Fortran.AMOD(Fortran.REAL(-7.5), Fortran.REAL(3)).value).toBe(-1.5);
    expect(
      Fortran.DMOD(Fortran.REAL(-7.5, 8), Fortran.REAL(3, 8)),
    ).toMatchObject({ value: -1.5, kind: 8 });
    expect(
      Fortran.ISIGN(Fortran.INTEGER(5), Fortran.INTEGER(-1)),
    ).toMatchObject({ value: -5 });
    expect(
      Fortran.DSIGN(Fortran.REAL(5, 8), Fortran.REAL(-1, 8)),
    ).toMatchObject({ value: -5, kind: 8 });
    expect(() =>
      Fortran.IDIM(Fortran.INTEGER(1, 2), Fortran.INTEGER(0, 2)),
    ).toThrow('IDIM requires kind 4');
  });

  test('specific double-precision math names require and preserve kind eight', () => {
    expect(Fortran.ALOG(Fortran.REAL(Math.E)).value).toBeCloseTo(1);
    expect(Fortran.ALOG10(Fortran.REAL(100)).value).toBe(2);
    expect(Fortran.DEXP(Fortran.REAL(1, 8))).toMatchObject({
      value: Math.E,
      kind: 8,
    });
    expect(Fortran.DLOG(Fortran.REAL(Math.E, 8)).value).toBeCloseTo(1);
    expect(Fortran.DLOG10(Fortran.REAL(100, 8)).value).toBe(2);
    expect(Fortran.DSQRT(Fortran.REAL(9, 8))).toMatchObject({
      value: 3,
      kind: 8,
    });
    expect(Fortran.DSIN(Fortran.REAL(0, 8)).value).toBe(0);
    expect(Fortran.DCOS(Fortran.REAL(0, 8)).value).toBe(1);
    expect(Fortran.DTAN(Fortran.REAL(0, 8)).value).toBe(0);
    expect(Fortran.DASIN(Fortran.REAL(0, 8)).value).toBe(0);
    expect(Fortran.DACOS(Fortran.REAL(1, 8)).value).toBe(0);
    expect(Fortran.DATAN(Fortran.REAL(0, 8)).value).toBe(0);
    expect(
      Fortran.DATAN2(Fortran.REAL(1, 8), Fortran.REAL(1, 8)).value,
    ).toBeCloseTo(Math.PI / 4);
    expect(() => Fortran.DEXP(Fortran.REAL(1))).toThrow(
      'DEXP requires kind 8',
    );
    expect(() =>
      Fortran.DATAN2(Fortran.REAL(1, 8), Fortran.REAL(1, 4)),
    ).toThrow('DATAN2 requires kind 8');
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

  test('specific MAX and MIN names preserve their documented argument/result types', () => {
    expect(Fortran.MAX0(Fortran.INTEGER(4), Fortran.INTEGER(9))).toMatchObject({
      value: 9,
    });
    expect(Fortran.AMAX1(Fortran.REAL(4), Fortran.REAL(9))).toMatchObject({
      value: 9,
    });
    expect(
      Fortran.DMAX1(Fortran.REAL(4, 8), Fortran.REAL(9, 8)),
    ).toMatchObject({ value: 9, kind: 8 });
    expect(Fortran.AMAX0(Fortran.INTEGER(4), Fortran.INTEGER(9))).toMatchObject({
      value: 9,
      kind: 4,
    });
    expect(
      Fortran.MAX1(Fortran.REAL(-2.2), Fortran.REAL(-1.7)),
    ).toMatchObject({ value: -1, kind: 4 });

    expect(Fortran.MIN0(Fortran.INTEGER(4), Fortran.INTEGER(9))).toMatchObject({
      value: 4,
    });
    expect(Fortran.AMIN1(Fortran.REAL(4), Fortran.REAL(9))).toMatchObject({
      value: 4,
    });
    expect(
      Fortran.DMIN1(Fortran.REAL(4, 8), Fortran.REAL(9, 8)),
    ).toMatchObject({ value: 4, kind: 8 });
    expect(Fortran.AMIN0(Fortran.INTEGER(4), Fortran.INTEGER(9))).toMatchObject({
      value: 4,
      kind: 4,
    });
    expect(
      Fortran.MIN1(Fortran.REAL(-2.2), Fortran.REAL(-1.7)),
    ).toMatchObject({ value: -2, kind: 4 });
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
    expect(() => Fortran.DMAX1(Fortran.REAL(1), Fortran.REAL(2))).toThrow(
      'DMAX1 requires kind 8',
    );
    expect(() => Fortran.AMAX0(Fortran.INTEGER(1))).toThrow(
      'AMAX0 requires at least two arguments',
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

  test('double-precision hyperbolic specific names require and preserve kind eight', () => {
    expect(Fortran.DSINH(Fortran.REAL(0, 8))).toMatchObject({
      value: 0,
      kind: 8,
    });
    expect(Fortran.DCOSH(Fortran.REAL(0, 8))).toMatchObject({
      value: 1,
      kind: 8,
    });
    expect(Fortran.DTANH(Fortran.REAL(0, 8))).toMatchObject({
      value: 0,
      kind: 8,
    });
    expect(() => Fortran.DSINH(Fortran.REAL(0))).toThrow(
      'DSINH requires kind 8',
    );
    expect(() => Fortran.DCOSH(Fortran.REAL(0))).toThrow(
      'DCOSH requires kind 8',
    );
    expect(() => Fortran.DTANH(Fortran.REAL(0))).toThrow(
      'DTANH requires kind 8',
    );
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

  describe('character intrinsic functions', () => {
    test('CHAR and ACHAR create ASCII characters; ICHAR and IACHAR return codes', () => {
      const character = Fortran.ACHAR(Fortran.INTEGER(65));

      expect(character.value).toBe('A');
      expect(character.len).toBe(1);
      expect(Fortran.CHAR(Fortran.INTEGER(97)).value).toBe('a');
      expect(Fortran.IACHAR(character)).toMatchObject({ value: 65, kind: 4 });
      expect(Fortran.ICHAR(Fortran.CHARACTER('z'))).toMatchObject({
        value: 122,
        kind: 4,
      });
    });

    test('character-code intrinsics reject non-ASCII and empty values', () => {
      expect(() => Fortran.ACHAR(Fortran.INTEGER(128))).toThrow(
        'Character code must be an ASCII integer from 0 through 127',
      );
      expect(() => Fortran.CHAR(Fortran.INTEGER(-1))).toThrow(
        'Character code must be an ASCII integer from 0 through 127',
      );
      expect(() => Fortran.ICHAR(Fortran.CHARACTER(''))).toThrow(
        'ICHAR requires a non-empty character value',
      );
      expect(() => Fortran.IACHAR(Fortran.CHARACTER(''))).toThrow(
        'IACHAR requires a non-empty character value',
      );
    });

    test('LEN reports declared length including trailing blank padding', () => {
      expect(Fortran.LEN(Fortran.CHARACTER('hi', 5))).toMatchObject({
        value: 5,
        kind: 4,
      });
      expect(Fortran.LEN(Fortran.CHARACTER('hi'))).toMatchObject({
        value: 2,
        kind: 4,
      });
    });

    test('lexical comparisons use character ordering with blank-padded operands', () => {
      expect(
        Fortran.LGE(Fortran.CHARACTER('abc '), Fortran.CHARACTER('abc')),
      ).toMatchObject({ value: true });
      expect(
        Fortran.LGT(Fortran.CHARACTER('b'), Fortran.CHARACTER('A')),
      ).toMatchObject({ value: true });
      expect(
        Fortran.LLE(Fortran.CHARACTER('abc'), Fortran.CHARACTER('abc ')),
      ).toMatchObject({ value: true });
      expect(
        Fortran.LLT(Fortran.CHARACTER('A'), Fortran.CHARACTER('b')),
      ).toMatchObject({ value: true });
      expect(
        Fortran.LLT(Fortran.CHARACTER('a'), Fortran.CHARACTER('A')),
      ).toMatchObject({ value: false });
    });

    test('INDEX finds substrings in either direction and reports no match as zero', () => {
      const string = Fortran.CHARACTER('ababa');
      const substring = Fortran.CHARACTER('ba');

      expect(Fortran.INDEX(string, substring).value).toBe(2);
      expect(
        Fortran.INDEX(string, substring, Fortran.LOGICAL(true)).value,
      ).toBe(4);
      expect(Fortran.INDEX(string, Fortran.CHARACTER('xy')).value).toBe(0);
      expect(Fortran.INDEX(string, Fortran.CHARACTER('')).value).toBe(6);
    });

    test('SCAN finds a character from a set and supports backward search', () => {
      const string = Fortran.CHARACTER('banana');
      const set = Fortran.CHARACTER('an');

      expect(Fortran.SCAN(string, set).value).toBe(2);
      expect(Fortran.SCAN(string, set, Fortran.LOGICAL(true)).value).toBe(6);
      expect(Fortran.SCAN(string, Fortran.CHARACTER('xyz')).value).toBe(0);
      expect(Fortran.SCAN(string, Fortran.CHARACTER('')).value).toBe(0);
    });

    test('VERIFY finds a character outside a set and supports backward search', () => {
      const string = Fortran.CHARACTER('baac');
      const set = Fortran.CHARACTER('a');

      expect(Fortran.VERIFY(string, set).value).toBe(1);
      expect(Fortran.VERIFY(string, set, Fortran.LOGICAL(true)).value).toBe(4);
      expect(Fortran.VERIFY(Fortran.CHARACTER('aaaa'), set).value).toBe(0);
      expect(Fortran.VERIFY(string, Fortran.CHARACTER('')).value).toBe(1);
      expect(
        Fortran.VERIFY(string, Fortran.CHARACTER(''), Fortran.LOGICAL(true)).value,
      ).toBe(4);
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
