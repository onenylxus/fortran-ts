import assert from 'assert';
import DatatypesJSON from '../assets/datatypes.json' with { type: 'json' };
import {
  ArithmeticExpression,
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
} from './datatypes';
import { cmplx, dble, dcmplx, int, qcmplx, qreal, real } from './expressions';
import {
  achar,
  adim,
  abs,
  alog,
  alog10,
  amax0,
  amax1,
  amin0,
  amin1,
  amod,
  acos,
  cabs,
  aimag,
  aint,
  anint,
  asin,
  dasin,
  dacos,
  datan,
  datan2,
  dabs,
  dcosh,
  dfloat,
  dmax1,
  dmin1,
  dcos,
  dexp,
  ddim,
  dlog,
  dlog10,
  dmod,
  dsin,
  dsinh,
  dsqrt,
  dsign,
  dtan,
  dtanh,
  atan,
  atan2,
  char,
  ccos,
  cexp,
  clog,
  conjg,
  cos,
  cosh,
  csin,
  csqrt,
  dim,
  dprod,
  exp,
  iachar,
  idim,
  iabs,
  isign,
  ichar,
  index,
  len,
  lge,
  lgt,
  lle,
  llt,
  log,
  log10,
  max,
  max0,
  max1,
  min,
  min0,
  min1,
  mod,
  nint,
  sign,
  sin,
  sinh,
  scan,
  sqrt,
  tan,
  tanh,
  verify,
} from './intrinsics';
import { Mix } from './mixed';
import {
  add,
  and,
  concat,
  div,
  eq,
  eqv,
  ge,
  gt,
  le,
  lt,
  mul,
  ne,
  neqv,
  not,
  or,
  pow,
  sub,
  uminus,
  uplus,
  xor,
} from './operators';
import { getDim, isComplex } from './utils';

function areIntegers(values: (FInteger | FReal)[]): values is FInteger[] {
  return values.every((value) => value instanceof FInteger);
}

function areReals(values: (FInteger | FReal)[]): values is FReal[] {
  return values.every((value) => value instanceof FReal);
}

type ArithmeticArray =
  | FByteArray
  | FComplexArray
  | FIntegerArray
  | FLogicalArray
  | FRealArray;
type ArrayExpression = ArithmeticArray | FCharacterArray;

function isArithmeticArray(
  value: ArithmeticExpression | ArithmeticArray,
): value is ArithmeticArray {
  return (
    value instanceof FByteArray ||
    value instanceof FComplexArray ||
    value instanceof FIntegerArray ||
    value instanceof FLogicalArray ||
    value instanceof FRealArray
  );
}

function isCharacterArray(value: unknown): value is FCharacterArray {
  return value instanceof FCharacterArray;
}

/**
 * Public facade for constructing Fortran values and applying intrinsic
 * operations to scalar values and arrays.
 */
export default class Fortran {
  /**
   * Constructs an 8-bit byte value or infers an array from nested byte values.
   * @param value A byte-compatible scalar or rectangular nested array.
   * @returns Result matching the selected overload.
   */
  public static BYTE(value: Byte): FByte;
  public static BYTE(value: FortranArray<Byte>): FByteArray;
  public static BYTE(value: Byte | FortranArray<Byte>): FByte | FByteArray {
    if (Array.isArray(value)) {
      return new FByteArray(value, {
        ...FByteArray.DefaultOptions,
        dim: getDim(value),
      });
    }
    return new FByte(value);
  }

  /**
   * Constructs a character value or character array.
   * @param value A string or rectangular nested array of strings.
   * @param len Optional fixed character length; values are blank-padded or truncated.
   * @returns Result matching the selected overload.
   */
  public static CHARACTER(value: string, len?: number): FCharacter;
  public static CHARACTER(
    value: FortranArray<string>,
    len?: number,
  ): FCharacterArray;
  public static CHARACTER(
    value: string | FortranArray<string>,
    len?: number,
  ): FCharacter | FCharacterArray {
    if (Array.isArray(value)) {
      return new FCharacterArray(value, {
        ...FCharacterArray.DefaultOptions,
        len,
        dim: getDim(value),
      });
    }
    return new FCharacter(value, { ...FCharacter.DefaultOptions, len });
  }

  /**
   * Converts a value to complex, or constructs a complex value from its parts.
   * @param value A complex pair, arithmetic scalar, or nested array of complex pairs.
   * @param kind Optional complex kind; defaults to the standard complex kind.
   * @returns Converted scalar or array result matching the input shape.
   */
  public static CMPLX(value: Complex, kind?: ComplexKind): FComplex;
  public static CMPLX(
    value: ArithmeticExpression,
    kind?: ComplexKind,
  ): FComplex;
  public static CMPLX(
    value: FortranArray<Complex>,
    kind?: ComplexKind,
  ): FComplexArray;
  public static CMPLX(
    value: Complex | ArithmeticExpression | FortranArray<Complex>,
    kind?: ComplexKind,
  ): FComplex | FComplexArray {
    if (Array.isArray(value)) {
      return new FComplexArray(value, {
        ...FComplexArray.DefaultOptions,
        kind,
        dim: getDim(value),
      });
    }
    if (isComplex(value)) {
      return new FComplex(value as Complex, {
        ...FComplex.DefaultOptions,
        kind,
      });
    }
    return cmplx(value as ArithmeticExpression, kind);
  }
  /** Alias for {@link CMPLX}. */
  public static COMPLEX = Fortran.CMPLX;

  /**
   * Converts a value to double precision.
   * @param value A number, arithmetic scalar, or nested array of numbers.
   * @returns Converted scalar or array result matching the input shape.
   */
  public static DBLE(value: number): FReal;
  public static DBLE(value: ArithmeticExpression): FReal;
  public static DBLE(value: FortranArray<number>): FRealArray;
  public static DBLE(
    value: number | ArithmeticExpression | FortranArray<number>,
  ): FReal | FRealArray {
    if (Array.isArray(value)) {
      return new FRealArray(value, {
        ...FRealArray.DefaultOptions,
        name: DatatypesJSON.doublePrecision.name,
        description: DatatypesJSON.doublePrecision.description,
        kind: 8,
        dim: getDim(value),
      });
    }
    if (typeof value === 'number') {
      return new FReal(value, {
        ...FReal.DefaultOptions,
        name: DatatypesJSON.doublePrecision.name,
        description: DatatypesJSON.doublePrecision.description,
        kind: 8,
      });
    }
    return dble(value as ArithmeticExpression);
  }
  /** Alias for {@link DBLE}. */
  public static DOUBLE_PRECISION = Fortran.DBLE;

  /**
   * Converts an integer to a double-precision real value.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static DFLOAT(value: FInteger): FReal {
    return dfloat(value);
  }

  /**
   * Converts a value to double complex.
   * @param value A complex pair, arithmetic scalar, or nested array of pairs.
   * @returns Converted scalar or array result matching the input shape.
   */
  public static DCMPLX(value: Complex): FComplex;
  public static DCMPLX(value: ArithmeticExpression): FComplex;
  public static DCMPLX(value: FortranArray<Complex>): FComplexArray;
  public static DCMPLX(
    value: Complex | ArithmeticExpression | FortranArray<Complex>,
  ): FComplex | FComplexArray {
    if (Array.isArray(value)) {
      return new FComplexArray(value, {
        ...FComplexArray.DefaultOptions,
        name: DatatypesJSON.doubleComplex.name,
        description: DatatypesJSON.doubleComplex.description,
        kind: 16,
        dim: getDim(value),
      });
    }
    if (isComplex(value)) {
      return new FComplex(value as Complex, {
        ...FComplex.DefaultOptions,
        name: DatatypesJSON.doubleComplex.name,
        description: DatatypesJSON.doubleComplex.description,
        kind: 16,
      });
    }
    return dcmplx(value as ArithmeticExpression);
  }
  /** Alias for {@link DCMPLX}. */
  public static DOUBLE_COMPLEX = Fortran.DCMPLX;

  /**
   * Converts a value to integer, truncating real and complex values toward zero.
   * @param value A number, arithmetic scalar, or nested array of numbers.
   * @param kind Optional integer kind.
   * @returns Converted scalar or array result matching the input shape.
   */
  public static INT(value: number, kind?: IntegerKind): FInteger;
  public static INT(value: ArithmeticExpression, kind?: IntegerKind): FInteger;
  public static INT(
    value: FortranArray<number>,
    kind?: IntegerKind,
  ): FIntegerArray;
  public static INT(
    value: number | ArithmeticExpression | FortranArray<number>,
    kind?: IntegerKind,
  ): FInteger | FIntegerArray {
    if (Array.isArray(value)) {
      return new FIntegerArray(value, {
        ...FIntegerArray.DefaultOptions,
        kind,
        dim: getDim(value),
      });
    }
    if (typeof value === 'number') {
      return new FInteger(Math.trunc(value), {
        ...FInteger.DefaultOptions,
        kind,
      });
    }
    return int(value, kind);
  }
  /** Alias for {@link INT}. */
  public static INTEGER = Fortran.INT;

  /**
   * Converts a single-precision real to integer by truncating toward zero.
   * @param value Input scalar value or array.
   * @returns Integer result.
   */
  public static IFIX(value: FReal): FInteger {
    return int(value);
  }

  /**
   * Converts a double-precision real to integer by truncating toward zero.
   * @param value Input scalar value or array.
   * @returns Integer result.
   */
  public static IDINT(value: FReal): FInteger {
    return int(value);
  }

  /**
   * Constructs a logical scalar or array.
   * @param value A boolean or rectangular nested array of booleans.
   * @param kind Optional logical kind.
   * @returns Result matching the selected overload.
   */
  public static LOGICAL(value: boolean, kind?: LogicalKind): FLogical;
  public static LOGICAL(
    value: FortranArray<boolean>,
    kind?: LogicalKind,
  ): FLogicalArray;
  public static LOGICAL(
    value: boolean | FortranArray<boolean>,
    kind?: LogicalKind,
  ): FLogical | FLogicalArray {
    if (Array.isArray(value)) {
      return new FLogicalArray(value, {
        ...FLogicalArray.DefaultOptions,
        kind,
        dim: getDim(value),
      });
    }
    return new FLogical(value, { ...FLogical.DefaultOptions, kind });
  }

  /**
   * Converts a value to quad-complex kind (kind 32).
   * @param value Input scalar value or array.
   * @returns Converted scalar or array result matching the input shape.
   */
  public static QCMPLX(value: Complex): FComplex;
  public static QCMPLX(value: ArithmeticExpression): FComplex;
  public static QCMPLX(value: FortranArray<Complex>): FComplexArray;
  public static QCMPLX(
    value: Complex | ArithmeticExpression | FortranArray<Complex>,
  ): FComplex | FComplexArray {
    if (Array.isArray(value)) {
      return new FComplexArray(value, {
        ...FComplexArray.DefaultOptions,
        kind: 32,
        dim: getDim(value),
      });
    }
    if (isComplex(value)) {
      return new FComplex(value as Complex, {
        ...FComplex.DefaultOptions,
        kind: 32,
      });
    }
    return qcmplx(value as ArithmeticExpression);
  }

  /**
   * Converts a value to quad-real kind (kind 16).
   * @param value Input scalar value or array.
   * @returns Converted scalar or array result matching the input shape.
   */
  public static QREAL(value: number): FReal;
  public static QREAL(value: ArithmeticExpression): FReal;
  public static QREAL(value: FortranArray<number>): FRealArray;
  public static QREAL(
    value: number | ArithmeticExpression | FortranArray<number>,
  ): FReal | FRealArray {
    if (Array.isArray(value)) {
      return new FRealArray(value, {
        ...FRealArray.DefaultOptions,
        kind: 16,
        dim: getDim(value),
      });
    }
    if (typeof value === 'number') {
      return new FReal(value, {
        ...FReal.DefaultOptions,
        kind: 16,
      });
    }
    return qreal(value);
  }

  /**
   * Converts a value to real.
   * @param value A number, arithmetic scalar, or nested array of numbers.
   * @param kind Optional real kind.
   * @returns Converted scalar or array result matching the input shape.
   */
  public static REAL(value: number, kind?: RealKind): FReal;
  public static REAL(value: ArithmeticExpression, kind?: RealKind): FReal;
  public static REAL(value: FortranArray<number>, kind?: RealKind): FRealArray;
  public static REAL(
    value: number | ArithmeticExpression | FortranArray<number>,
    kind?: RealKind,
  ): FReal | FRealArray {
    if (Array.isArray(value)) {
      return new FRealArray(value, {
        ...FRealArray.DefaultOptions,
        kind,
        dim: getDim(value),
      });
    }
    if (typeof value === 'number') {
      return new FReal(value, { ...FReal.DefaultOptions, kind });
    }
    return real(value, kind);
  }

  /**
   * Converts an integer to single-precision real.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static FLOAT(value: FInteger): FReal {
    return real(value);
  }

  /**
   * Converts a real value to single-precision kind.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static SNGL(value: FReal): FReal {
    return real(value);
  }

  /**
   * Returns the absolute value; complex input produces a real magnitude.
   * @param value Input scalar value or array.
   * @returns Absolute value as an integer or real, depending on the operand type.
   */
  public static ABS(value: FInteger): FInteger;
  public static ABS(value: FReal): FReal;
  public static ABS(value: FComplex): FReal;
  public static ABS(value: FInteger | FReal | FComplex): FInteger | FReal {
    if (value instanceof FInteger) {
      return abs(value);
    }
    if (value instanceof FReal) {
      return abs(value);
    }
    if (value instanceof FComplex) {
      return abs(value);
    }
    assert.fail('ABS requires an integer, real, or complex value');
  }

  /**
   * Returns the absolute value of a default-kind integer.
   * @param value Input scalar value or array.
   * @returns Integer result.
   */
  public static IABS(value: FInteger): FInteger {
    return iabs(value);
  }

  /**
   * Returns the absolute value of a double-precision real.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static DABS(value: FReal): FReal {
    return dabs(value);
  }

  /**
   * Returns the magnitude of a single-precision complex value.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static CABS(value: FComplex): FReal {
    return cabs(value);
  }

  /**
   * Truncates a real value toward zero, preserving its real kind.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static AINT(value: FReal): FReal {
    return aint(value);
  }

  /**
   * Truncates a real value toward zero and returns double precision.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static DINT(value: FReal): FReal {
    return dble(aint(value));
  }

  /**
   * Rounds a real value to the nearest whole value, with ties away from zero.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static ANINT(value: FReal): FReal {
    return anint(value);
  }

  /**
   * Rounds a real value to the nearest whole value and returns double precision.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static DNINT(value: FReal): FReal {
    return dble(anint(value));
  }

  /**
   * Rounds a real value to the nearest integer, with ties away from zero.
   * @param value Input scalar value or array.
   * @returns Integer result.
   */
  public static NINT(value: FReal): FInteger {
    return nint(value);
  }

  /**
   * Rounds a real value to the nearest default-kind integer.
   * @param value Input scalar value or array.
   * @returns Integer result.
   */
  public static IDNINT(value: FReal): FInteger {
    return nint(value);
  }

  /**
   * Returns the magnitude of the first value with the sign of the second.
   * @param value Input scalar value or array.
   * @param signSource Value whose sign is applied to the first argument.
   * @returns Result with the same numeric type as the operands.
   */
  public static SIGN(value: FInteger, signSource: FInteger): FInteger;
  public static SIGN(value: FReal, signSource: FReal): FReal;
  public static SIGN(
    value: FInteger | FReal,
    signSource: FInteger | FReal,
  ): FInteger | FReal {
    if (value instanceof FInteger && signSource instanceof FInteger) {
      return sign(value, signSource);
    }
    if (value instanceof FReal && signSource instanceof FReal) {
      return sign(value, signSource);
    }
    assert.fail('SIGN operands must have the same numeric type and kind');
  }

  /**
   * [object Object],[object Object],[object Object]
   * @param value Input scalar value or array.
   * @param signSource Value whose sign is applied to the first argument.
   * @returns Integer result.
   */
  public static ISIGN(value: FInteger, signSource: FInteger): FInteger {
    return isign(value, signSource);
  }

  /**
   * [object Object],[object Object],[object Object]
   * @param value Input scalar value or array.
   * @param signSource Value whose sign is applied to the first argument.
   * @returns Real result.
   */
  public static DSIGN(value: FReal, signSource: FReal): FReal {
    return dsign(value, signSource);
  }

  /**
   * Returns the positive difference `max(a - b, 0)` for matching operands.
   * @param value Input scalar value or array.
   * @param subtrahend Value to subtract from the first argument.
   * @returns Result with the same numeric type as the operands.
   */
  public static DIM(value: FInteger, subtrahend: FInteger): FInteger;
  public static DIM(value: FReal, subtrahend: FReal): FReal;
  public static DIM(
    value: FInteger | FReal,
    subtrahend: FInteger | FReal,
  ): FInteger | FReal {
    if (value instanceof FInteger && subtrahend instanceof FInteger) {
      return dim(value, subtrahend);
    }
    if (value instanceof FReal && subtrahend instanceof FReal) {
      return dim(value, subtrahend);
    }
    assert.fail('DIM operands must have the same numeric type and kind');
  }

  /**
   * [object Object],[object Object],[object Object]
   * @param value Input scalar value or array.
   * @param subtrahend Value to subtract from the first argument.
   * @returns Integer result.
   */
  public static IDIM(value: FInteger, subtrahend: FInteger): FInteger {
    return idim(value, subtrahend);
  }

  /**
   * [object Object],[object Object],[object Object]
   * @param value Input scalar value or array.
   * @param subtrahend Value to subtract from the first argument.
   * @returns Real result.
   */
  public static ADIM(value: FReal, subtrahend: FReal): FReal {
    return adim(value, subtrahend);
  }

  /**
   * [object Object],[object Object],[object Object]
   * @param value Input scalar value or array.
   * @param subtrahend Value to subtract from the first argument.
   * @returns Real result.
   */
  public static DDIM(value: FReal, subtrahend: FReal): FReal {
    return ddim(value, subtrahend);
  }

  /**
   * Returns the remainder after division; operands must have matching types and kinds.
   * @param value Input scalar value or array.
   * @param divisor Divisor operand.
   * @returns Result with the same numeric type as the operands.
   */
  public static MOD(value: FInteger, divisor: FInteger): FInteger;
  public static MOD(value: FReal, divisor: FReal): FReal;
  public static MOD(
    value: FInteger | FReal,
    divisor: FInteger | FReal,
  ): FInteger | FReal {
    if (value instanceof FInteger && divisor instanceof FInteger) {
      return mod(value, divisor);
    }
    if (value instanceof FReal && divisor instanceof FReal) {
      return mod(value, divisor);
    }
    assert.fail('MOD operands must have the same numeric type and kind');
  }

  /**
   * [object Object],[object Object],[object Object]
   * @param value Input scalar value or array.
   * @param divisor Divisor operand.
   * @returns Real result.
   */
  public static AMOD(value: FReal, divisor: FReal): FReal {
    return amod(value, divisor);
  }

  /**
   * [object Object],[object Object],[object Object]
   * @param value Input scalar value or array.
   * @param divisor Divisor operand.
   * @returns Real result.
   */
  public static DMOD(value: FReal, divisor: FReal): FReal {
    return dmod(value, divisor);
  }

  /**
   * Returns the largest of two or more matching integer or real values.
   * @param value Input scalar value or array.
   * @param others Additional values; at least one is required.
   * @returns Result with the same numeric type as the operands.
   */
  public static MAX(value: FInteger, ...others: FInteger[]): FInteger;
  public static MAX(value: FReal, ...others: FReal[]): FReal;
  public static MAX(
    value: FInteger | FReal,
    ...others: (FInteger | FReal)[]
  ): FInteger | FReal {
    if (value instanceof FInteger && areIntegers(others)) {
      return max(value, ...others);
    }
    if (value instanceof FReal && areReals(others)) {
      return max(value, ...others);
    }
    assert.fail('MAX arguments must have the same numeric type and kind');
  }

  /**
   * Returns the largest of two or more default-kind integer values.
   * @param value Input scalar value or array.
   * @param others Additional values; at least one is required.
   * @returns Integer result.
   */
  public static MAX0(value: FInteger, ...others: FInteger[]): FInteger {
    return max0(value, ...others);
  }

  /**
   * Returns the largest of two or more single-precision real values.
   * @param value Input scalar value or array.
   * @param others Additional values; at least one is required.
   * @returns Real result.
   */
  public static AMAX1(value: FReal, ...others: FReal[]): FReal {
    return amax1(value, ...others);
  }

  /**
   * Returns the largest of two or more double-precision real values.
   * @param value Input scalar value or array.
   * @param others Additional values; at least one is required.
   * @returns Real result.
   */
  public static DMAX1(value: FReal, ...others: FReal[]): FReal {
    return dmax1(value, ...others);
  }

  /**
   * Returns the largest of default-kind integer arguments as a real.
   * @param value Input scalar value or array.
   * @param others Additional values; at least one is required.
   * @returns Real result.
   */
  public static AMAX0(value: FInteger, ...others: FInteger[]): FReal {
    return amax0(value, ...others);
  }

  /**
   * Returns the largest of single-precision real arguments as an integer.
   * @param value Input scalar value or array.
   * @param others Additional values; at least one is required.
   * @returns Integer result.
   */
  public static MAX1(value: FReal, ...others: FReal[]): FInteger {
    return max1(value, ...others);
  }

  /**
   * Returns the smallest of two or more matching integer or real values.
   * @param value Input scalar value or array.
   * @param others Additional values; at least one is required.
   * @returns Result with the same numeric type as the operands.
   */
  public static MIN(value: FInteger, ...others: FInteger[]): FInteger;
  public static MIN(value: FReal, ...others: FReal[]): FReal;
  public static MIN(
    value: FInteger | FReal,
    ...others: (FInteger | FReal)[]
  ): FInteger | FReal {
    if (value instanceof FInteger && areIntegers(others)) {
      return min(value, ...others);
    }
    if (value instanceof FReal && areReals(others)) {
      return min(value, ...others);
    }
    assert.fail('MIN arguments must have the same numeric type and kind');
  }

  /**
   * Returns the smallest of two or more default-kind integer values.
   * @param value Input scalar value or array.
   * @param others Additional values; at least one is required.
   * @returns Integer result.
   */
  public static MIN0(value: FInteger, ...others: FInteger[]): FInteger {
    return min0(value, ...others);
  }

  /**
   * Returns the smallest of two or more single-precision real values.
   * @param value Input scalar value or array.
   * @param others Additional values; at least one is required.
   * @returns Real result.
   */
  public static AMIN1(value: FReal, ...others: FReal[]): FReal {
    return amin1(value, ...others);
  }

  /**
   * Returns the smallest of two or more double-precision real values.
   * @param value Input scalar value or array.
   * @param others Additional values; at least one is required.
   * @returns Real result.
   */
  public static DMIN1(value: FReal, ...others: FReal[]): FReal {
    return dmin1(value, ...others);
  }

  /**
   * Returns the smallest of default-kind integer arguments as a real.
   * @param value Input scalar value or array.
   * @param others Additional values; at least one is required.
   * @returns Real result.
   */
  public static AMIN0(value: FInteger, ...others: FInteger[]): FReal {
    return amin0(value, ...others);
  }

  /**
   * Returns the smallest of single-precision real arguments as an integer.
   * @param value Input scalar value or array.
   * @param others Additional values; at least one is required.
   * @returns Integer result.
   */
  public static MIN1(value: FReal, ...others: FReal[]): FInteger {
    return min1(value, ...others);
  }

  /**
   * Returns the square root of a real value, preserving its kind.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static SQRT(value: FReal): FReal {
    return sqrt(value);
  }

  /**
   * Returns e raised to a real value, preserving its kind.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static EXP(value: FReal): FReal {
    return exp(value);
  }

  /**
   * Returns the natural logarithm of a real value, preserving its kind.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static LOG(value: FReal): FReal {
    return log(value);
  }

  /**
   * Single-precision real-specific natural logarithm.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static ALOG(value: FReal): FReal {
    return alog(value);
  }

  /**
   * Double-precision-specific natural logarithm.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static DLOG(value: FReal): FReal {
    return dlog(value);
  }

  /**
   * Returns the base-10 logarithm of a real value, preserving its kind.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static LOG10(value: FReal): FReal {
    return log10(value);
  }

  /**
   * Single-precision real-specific base-10 logarithm.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static ALOG10(value: FReal): FReal {
    return alog10(value);
  }

  /**
   * Double-precision-specific base-10 logarithm.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static DLOG10(value: FReal): FReal {
    return dlog10(value);
  }

  /**
   * Double-precision-specific exponential.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static DEXP(value: FReal): FReal {
    return dexp(value);
  }

  /**
   * Returns the sine of a real angle in radians, preserving its kind.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static SIN(value: FReal): FReal {
    return sin(value);
  }

  /**
   * Double-precision-specific sine.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static DSIN(value: FReal): FReal {
    return dsin(value);
  }

  /**
   * Returns the cosine of a real angle in radians, preserving its kind.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static COS(value: FReal): FReal {
    return cos(value);
  }

  /**
   * Double-precision-specific cosine.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static DCOS(value: FReal): FReal {
    return dcos(value);
  }

  /**
   * Returns the tangent of a real angle in radians, preserving its kind.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static TAN(value: FReal): FReal {
    return tan(value);
  }

  /**
   * Double-precision-specific tangent.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static DTAN(value: FReal): FReal {
    return dtan(value);
  }

  /**
   * Returns the arcsine of a real value, in radians.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static ASIN(value: FReal): FReal {
    return asin(value);
  }

  /**
   * Double-precision-specific arcsine.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static DASIN(value: FReal): FReal {
    return dasin(value);
  }

  /**
   * Returns the arccosine of a real value, in radians.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static ACOS(value: FReal): FReal {
    return acos(value);
  }

  /**
   * Double-precision-specific arccosine.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static DACOS(value: FReal): FReal {
    return dacos(value);
  }

  /**
   * Returns the arctangent of a real value, in radians.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static ATAN(value: FReal): FReal {
    return atan(value);
  }

  /**
   * Double-precision-specific arctangent.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static DATAN(value: FReal): FReal {
    return datan(value);
  }

  /**
   * Returns the two-argument arctangent in radians.
   * @param y First coordinate supplied to the two-argument arctangent.
   * @param x Second coordinate supplied to the two-argument arctangent.
   * @returns Real result.
   */
  public static ATAN2(y: FReal, x: FReal): FReal {
    return atan2(y, x);
  }

  /**
   * Double-precision-specific two-argument arctangent.
   * @param y First coordinate supplied to the two-argument arctangent.
   * @param x Second coordinate supplied to the two-argument arctangent.
   * @returns Real result.
   */
  public static DATAN2(y: FReal, x: FReal): FReal {
    return datan2(y, x);
  }

  /**
   * Returns the hyperbolic sine of a real value, preserving its kind.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static SINH(value: FReal): FReal {
    return sinh(value);
  }

  /**
   * Returns the hyperbolic cosine of a real value, preserving its kind.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static COSH(value: FReal): FReal {
    return cosh(value);
  }

  /**
   * Double-precision-specific hyperbolic sine.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static DSINH(value: FReal): FReal {
    return dsinh(value);
  }

  /**
   * Returns the hyperbolic tangent of a real value, preserving its kind.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static TANH(value: FReal): FReal {
    return tanh(value);
  }

  /**
   * Double-precision-specific hyperbolic cosine.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static DCOSH(value: FReal): FReal {
    return dcosh(value);
  }

  /**
   * Double-precision-specific hyperbolic tangent.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static DTANH(value: FReal): FReal {
    return dtanh(value);
  }

  /**
   * Double-precision-specific square root.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static DSQRT(value: FReal): FReal {
    return dsqrt(value);
  }

  /**
   * Returns the imaginary component of a complex value as a real value.
   * @param value Input scalar value or array.
   * @returns Real result.
   */
  public static AIMAG(value: FComplex): FReal {
    return aimag(value);
  }

  /**
   * Returns the complex conjugate of a complex value.
   * @param value Input scalar value or array.
   * @returns Complex result.
   */
  public static CONJG(value: FComplex): FComplex {
    return conjg(value);
  }

  /**
   * Returns the square root of a complex value.
   * @param value Input scalar value or array.
   * @returns Complex result.
   */
  public static CSQRT(value: FComplex): FComplex {
    return csqrt(value);
  }

  /**
   * Returns e raised to a complex value.
   * @param value Input scalar value or array.
   * @returns Complex result.
   */
  public static CEXP(value: FComplex): FComplex {
    return cexp(value);
  }

  /**
   * Returns the natural logarithm of a complex value.
   * @param value Input scalar value or array.
   * @returns Complex result.
   */
  public static CLOG(value: FComplex): FComplex {
    return clog(value);
  }

  /**
   * Returns the sine of a complex value.
   * @param value Input scalar value or array.
   * @returns Complex result.
   */
  public static CSIN(value: FComplex): FComplex {
    return csin(value);
  }

  /**
   * Returns the cosine of a complex value.
   * @param value Input scalar value or array.
   * @returns Complex result.
   */
  public static CCOS(value: FComplex): FComplex {
    return ccos(value);
  }

  /**
   * Multiplies two real values and returns a double-precision result.
   * @param a First operand or input value.
   * @param b Second operand or input value.
   * @returns Real result.
   */
  public static DPROD(a: FReal, b: FReal): FReal {
    return dprod(a, b);
  }

  /**
   * Converts an integer character code to a character.
   * @param code Integer character code.
   * @returns Character result.
   */
  public static ACHAR(code: FInteger): FCharacter {
    return achar(code);
  }

  /**
   * Converts an integer character code to a character.
   * @param code Integer character code.
   * @returns Character result.
   */
  public static CHAR(code: FInteger): FCharacter {
    return char(code);
  }

  /**
   * Returns the ASCII code of the first character.
   * @param value Input scalar value or array.
   * @returns Integer result.
   */
  public static IACHAR(value: FCharacter): FInteger {
    return iachar(value);
  }

  /**
   * Returns the character code of the first character.
   * @param value Input scalar value or array.
   * @returns Integer result.
   */
  public static ICHAR(value: FCharacter): FInteger {
    return ichar(value);
  }

  /**
   * Returns the declared character length, including trailing blanks.
   * @param value Input scalar value or array.
   * @returns Integer result.
   */
  public static LEN(value: FCharacter): FInteger {
    return len(value);
  }

  /**
   * Finds a substring and returns its one-based position, or zero when absent.
   * @param back When true, searches from the end of the string.
   * @param string Character string to search.
   * @param substring Substring to find.
   * @returns Integer result.
   */
  public static INDEX(
    string: FCharacter,
    substring: FCharacter,
    back?: FLogical,
  ): FInteger {
    return index(string, substring, back);
  }

  /**
   * Finds the first character in a set and returns its one-based position.
   * @param back When true, searches from the end of the string.
   * @param string Character string to search.
   * @param set Set of characters used for the search.
   * @returns Integer result.
   */
  public static SCAN(
    string: FCharacter,
    set: FCharacter,
    back?: FLogical,
  ): FInteger {
    return scan(string, set, back);
  }

  /**
   * Finds the first character not in a set and returns its one-based position.
   * @param back When true, searches from the end of the string.
   * @param string Character string to search.
   * @param set Set of characters used for the search.
   * @returns Integer result.
   */
  public static VERIFY(
    string: FCharacter,
    set: FCharacter,
    back?: FLogical,
  ): FInteger {
    return verify(string, set, back);
  }

  /**
   * Tests whether one character value is lexically greater than or equal to another.
   * @param a First operand or input value.
   * @param b Second operand or input value.
   * @returns Logical result.
   */
  public static LGE(a: FCharacter, b: FCharacter): FLogical {
    return lge(a, b);
  }

  /**
   * Tests whether one character value is lexically greater than another.
   * @param a First operand or input value.
   * @param b Second operand or input value.
   * @returns Logical result.
   */
  public static LGT(a: FCharacter, b: FCharacter): FLogical {
    return lgt(a, b);
  }

  /**
   * Tests whether one character value is lexically less than or equal to another.
   * @param a First operand or input value.
   * @param b Second operand or input value.
   * @returns Logical result.
   */
  public static LLE(a: FCharacter, b: FCharacter): FLogical {
    return lle(a, b);
  }

  /**
   * Tests whether one character value is lexically less than another.
   * @param a First operand or input value.
   * @param b Second operand or input value.
   * @returns Logical result.
   */
  public static LLT(a: FCharacter, b: FCharacter): FLogical {
    return llt(a, b);
  }

  /**
   * Compares two values for equality, element-wise when either operand is an array.
   * @param a First operand or input value.
   * @param b Second operand or input value.
   * @returns Logical scalar or array result.
   */
  public static EQ(a: FCharacter, b: FCharacter): FLogical;
  public static EQ<
    A extends ArithmeticExpression,
    B extends ArithmeticExpression,
  >(a: A, b: B): FLogical;
  public static EQ(
    a: FCharacter | FCharacterArray,
    b: FCharacter | FCharacterArray,
  ): FLogicalArray;
  public static EQ(
    a: ArithmeticExpression | ArithmeticArray,
    b: ArithmeticExpression | ArithmeticArray,
  ): FLogicalArray;
  public static EQ(
    a: ArithmeticExpression | FCharacter | ArrayExpression,
    b: ArithmeticExpression | FCharacter | ArrayExpression,
  ): FLogical | FLogicalArray {
    if (a instanceof FCharacter && b instanceof FCharacter) {
      return eq(a, b);
    }
    if (
      a instanceof FCharacter ||
      b instanceof FCharacter ||
      isCharacterArray(a) ||
      isCharacterArray(b)
    ) {
      return eq(
        a as FCharacter | FCharacterArray,
        b as FCharacter | FCharacterArray,
      );
    }
    return eq(
      a as ArithmeticExpression | ArithmeticArray,
      b as ArithmeticExpression | ArithmeticArray,
    );
  }

  /**
   * Tests whether the first value is less than the second.
   * @param a First operand or input value.
   * @param b Second operand or input value.
   * @returns Logical scalar or array result.
   */
  public static LT(a: FCharacter, b: FCharacter): FLogical;
  public static LT<
    A extends ArithmeticExpression,
    B extends ArithmeticExpression,
  >(a: A, b: B): FLogical;
  public static LT(
    a: FCharacter | FCharacterArray,
    b: FCharacter | FCharacterArray,
  ): FLogicalArray;
  public static LT(
    a: ArithmeticExpression | ArithmeticArray,
    b: ArithmeticExpression | ArithmeticArray,
  ): FLogicalArray;
  public static LT(
    a: ArithmeticExpression | FCharacter | ArrayExpression,
    b: ArithmeticExpression | FCharacter | ArrayExpression,
  ): FLogical | FLogicalArray {
    if (a instanceof FCharacter && b instanceof FCharacter) {
      return lt(a, b);
    }
    if (
      a instanceof FCharacter ||
      b instanceof FCharacter ||
      isCharacterArray(a) ||
      isCharacterArray(b)
    ) {
      return lt(
        a as FCharacter | FCharacterArray,
        b as FCharacter | FCharacterArray,
      );
    }
    return lt(
      a as ArithmeticExpression | ArithmeticArray,
      b as ArithmeticExpression | ArithmeticArray,
    );
  }

  /**
   * Tests whether the first value is less than or equal to the second.
   * @param a First operand or input value.
   * @param b Second operand or input value.
   * @returns Logical scalar or array result.
   */
  public static LE(a: FCharacter, b: FCharacter): FLogical;
  public static LE<
    A extends ArithmeticExpression,
    B extends ArithmeticExpression,
  >(a: A, b: B): FLogical;
  public static LE(
    a: FCharacter | FCharacterArray,
    b: FCharacter | FCharacterArray,
  ): FLogicalArray;
  public static LE(
    a: ArithmeticExpression | ArithmeticArray,
    b: ArithmeticExpression | ArithmeticArray,
  ): FLogicalArray;
  public static LE(
    a: ArithmeticExpression | FCharacter | ArrayExpression,
    b: ArithmeticExpression | FCharacter | ArrayExpression,
  ): FLogical | FLogicalArray {
    if (a instanceof FCharacter && b instanceof FCharacter) {
      return le(a, b);
    }
    if (
      a instanceof FCharacter ||
      b instanceof FCharacter ||
      isCharacterArray(a) ||
      isCharacterArray(b)
    ) {
      return le(
        a as FCharacter | FCharacterArray,
        b as FCharacter | FCharacterArray,
      );
    }
    return le(
      a as ArithmeticExpression | ArithmeticArray,
      b as ArithmeticExpression | ArithmeticArray,
    );
  }

  /**
   * Compares two values for inequality, element-wise when either operand is an array.
   * @param a First operand or input value.
   * @param b Second operand or input value.
   * @returns Logical scalar or array result.
   */
  public static NE(a: FCharacter, b: FCharacter): FLogical;
  public static NE<
    A extends ArithmeticExpression,
    B extends ArithmeticExpression,
  >(a: A, b: B): FLogical;
  public static NE(
    a: FCharacter | FCharacterArray,
    b: FCharacter | FCharacterArray,
  ): FLogicalArray;
  public static NE(
    a: ArithmeticExpression | ArithmeticArray,
    b: ArithmeticExpression | ArithmeticArray,
  ): FLogicalArray;
  public static NE(
    a: ArithmeticExpression | FCharacter | ArrayExpression,
    b: ArithmeticExpression | FCharacter | ArrayExpression,
  ): FLogical | FLogicalArray {
    if (a instanceof FCharacter && b instanceof FCharacter) {
      return ne(a, b);
    }
    if (
      a instanceof FCharacter ||
      b instanceof FCharacter ||
      isCharacterArray(a) ||
      isCharacterArray(b)
    ) {
      return ne(
        a as FCharacter | FCharacterArray,
        b as FCharacter | FCharacterArray,
      );
    }
    return ne(
      a as ArithmeticExpression | ArithmeticArray,
      b as ArithmeticExpression | ArithmeticArray,
    );
  }

  /**
   * Tests whether the first value is greater than the second.
   * @param a First operand or input value.
   * @param b Second operand or input value.
   * @returns Logical scalar or array result.
   */
  public static GT(a: FCharacter, b: FCharacter): FLogical;
  public static GT<
    A extends ArithmeticExpression,
    B extends ArithmeticExpression,
  >(a: A, b: B): FLogical;
  public static GT(
    a: FCharacter | FCharacterArray,
    b: FCharacter | FCharacterArray,
  ): FLogicalArray;
  public static GT(
    a: ArithmeticExpression | ArithmeticArray,
    b: ArithmeticExpression | ArithmeticArray,
  ): FLogicalArray;
  public static GT(
    a: ArithmeticExpression | FCharacter | ArrayExpression,
    b: ArithmeticExpression | FCharacter | ArrayExpression,
  ): FLogical | FLogicalArray {
    if (a instanceof FCharacter && b instanceof FCharacter) {
      return gt(a, b);
    }
    if (
      a instanceof FCharacter ||
      b instanceof FCharacter ||
      isCharacterArray(a) ||
      isCharacterArray(b)
    ) {
      return gt(
        a as FCharacter | FCharacterArray,
        b as FCharacter | FCharacterArray,
      );
    }
    return gt(
      a as ArithmeticExpression | ArithmeticArray,
      b as ArithmeticExpression | ArithmeticArray,
    );
  }

  /**
   * Tests whether the first value is greater than or equal to the second.
   * @param a First operand or input value.
   * @param b Second operand or input value.
   * @returns Logical scalar or array result.
   */
  public static GE(a: FCharacter, b: FCharacter): FLogical;
  public static GE<
    A extends ArithmeticExpression,
    B extends ArithmeticExpression,
  >(a: A, b: B): FLogical;
  public static GE(
    a: FCharacter | FCharacterArray,
    b: FCharacter | FCharacterArray,
  ): FLogicalArray;
  public static GE(
    a: ArithmeticExpression | ArithmeticArray,
    b: ArithmeticExpression | ArithmeticArray,
  ): FLogicalArray;
  public static GE(
    a: ArithmeticExpression | FCharacter | ArrayExpression,
    b: ArithmeticExpression | FCharacter | ArrayExpression,
  ): FLogical | FLogicalArray {
    if (a instanceof FCharacter && b instanceof FCharacter) {
      return ge(a, b);
    }
    if (
      a instanceof FCharacter ||
      b instanceof FCharacter ||
      isCharacterArray(a) ||
      isCharacterArray(b)
    ) {
      return ge(
        a as FCharacter | FCharacterArray,
        b as FCharacter | FCharacterArray,
      );
    }
    return ge(
      a as ArithmeticExpression | ArithmeticArray,
      b as ArithmeticExpression | ArithmeticArray,
    );
  }

  /**
   * Adds two numeric scalars or performs element-wise array addition.
   * @param a First operand or input value.
   * @param b Second operand or input value.
   * @returns Operation result with type determined by the operand values.
   */
  public static ADD<
    A extends ArithmeticExpression,
    B extends ArithmeticExpression,
  >(a: A, b: B): Mix<A, B>;
  public static ADD(
    a: ArithmeticExpression | ArithmeticArray,
    b: ArithmeticExpression | ArithmeticArray,
  ): ArrayExpression;
  public static ADD(
    a: ArithmeticExpression | ArithmeticArray,
    b: ArithmeticExpression | ArithmeticArray,
  ): ArithmeticExpression | ArrayExpression {
    return add(a, b);
  }

  /**
   * Subtracts the second numeric value from the first, element-wise for arrays.
   * @param a First operand or input value.
   * @param b Second operand or input value.
   * @returns Operation result with type determined by the operand values.
   */
  public static SUB<
    A extends ArithmeticExpression,
    B extends ArithmeticExpression,
  >(a: A, b: B): Mix<A, B>;
  public static SUB(
    a: ArithmeticExpression | ArithmeticArray,
    b: ArithmeticExpression | ArithmeticArray,
  ): ArrayExpression;
  public static SUB(
    a: ArithmeticExpression | ArithmeticArray,
    b: ArithmeticExpression | ArithmeticArray,
  ): ArithmeticExpression | ArrayExpression {
    return sub(a, b);
  }

  /**
   * Multiplies two numeric values element-wise when either operand is an array.
   * @param a First operand or input value.
   * @param b Second operand or input value.
   * @returns Operation result with type determined by the operand values.
   */
  public static MUL<
    A extends ArithmeticExpression,
    B extends ArithmeticExpression,
  >(a: A, b: B): Mix<A, B>;
  public static MUL(
    a: ArithmeticExpression | ArithmeticArray,
    b: ArithmeticExpression | ArithmeticArray,
  ): ArrayExpression;
  public static MUL(
    a: ArithmeticExpression | ArithmeticArray,
    b: ArithmeticExpression | ArithmeticArray,
  ): ArithmeticExpression | ArrayExpression {
    return mul(a, b);
  }

  /**
   * Divides the first numeric value by the second, element-wise for arrays.
   * @param a First operand or input value.
   * @param b Second operand or input value.
   * @returns Operation result with type determined by the operand values.
   */
  public static DIV<
    A extends ArithmeticExpression,
    B extends ArithmeticExpression,
  >(a: A, b: B): Mix<A, B>;
  public static DIV(
    a: ArithmeticExpression | ArithmeticArray,
    b: ArithmeticExpression | ArithmeticArray,
  ): ArrayExpression;
  public static DIV(
    a: ArithmeticExpression | ArithmeticArray,
    b: ArithmeticExpression | ArithmeticArray,
  ): ArithmeticExpression | ArrayExpression {
    return div(a, b);
  }

  /**
   * Raises the first numeric value to the power of the second, element-wise for arrays.
   * @param a First operand or input value.
   * @param b Second operand or input value.
   * @returns Operation result with type determined by the operand values.
   */
  public static POW<
    A extends ArithmeticExpression,
    B extends ArithmeticExpression,
  >(a: A, b: B): Mix<A, B>;
  public static POW(
    a: ArithmeticExpression | ArithmeticArray,
    b: ArithmeticExpression | ArithmeticArray,
  ): ArrayExpression;
  public static POW(
    a: ArithmeticExpression | ArithmeticArray,
    b: ArithmeticExpression | ArithmeticArray,
  ): ArithmeticExpression | ArrayExpression {
    return pow(a, b);
  }

  /**
   * Applies unary plus to a numeric scalar or each element of an array.
   * @param a First operand or input value.
   * @returns Operation result with type determined by the operand values.
   */
  public static UPLUS<A extends ArithmeticExpression>(a: A): A;
  public static UPLUS(a: ArithmeticArray): ArrayExpression;
  public static UPLUS(
    a: ArithmeticExpression | ArithmeticArray,
  ): ArithmeticExpression | ArrayExpression {
    if (isArithmeticArray(a)) {
      return uplus(a);
    }
    return uplus(a);
  }

  /**
   * Negates a numeric scalar or each element of an array.
   * @param a First operand or input value.
   * @returns Operation result with type determined by the operand values.
   */
  public static UMINUS<A extends ArithmeticExpression>(a: A): A;
  public static UMINUS(a: ArithmeticArray): ArrayExpression;
  public static UMINUS(
    a: ArithmeticExpression | ArithmeticArray,
  ): ArithmeticExpression | ArrayExpression {
    if (isArithmeticArray(a)) {
      return uminus(a);
    }
    return uminus(a);
  }

  /**
   * Negates a logical scalar or each element of a logical array.
   * @param a First operand or input value.
   * @returns Logical scalar or array result.
   */
  public static NOT(a: FLogical): FLogical;
  public static NOT(a: FLogicalArray): FLogicalArray;
  public static NOT(a: FLogical | FLogicalArray): FLogical | FLogicalArray {
    if (a instanceof FLogicalArray) {
      return not(a);
    }
    return not(a);
  }

  /**
   * Applies logical AND to scalars or conformable arrays.
   * @param a First operand or input value.
   * @param b Second operand or input value.
   * @returns Logical scalar or array result.
   */
  public static AND(a: FLogical, b: FLogical): FLogical;
  public static AND(
    a: FLogical | FLogicalArray,
    b: FLogical | FLogicalArray,
  ): FLogicalArray;
  public static AND(
    a: FLogical | FLogicalArray,
    b: FLogical | FLogicalArray,
  ): FLogical | FLogicalArray {
    return and(a, b);
  }

  /**
   * Applies logical OR to scalars or conformable arrays.
   * @param a First operand or input value.
   * @param b Second operand or input value.
   * @returns Logical scalar or array result.
   */
  public static OR(a: FLogical, b: FLogical): FLogical;
  public static OR(
    a: FLogical | FLogicalArray,
    b: FLogical | FLogicalArray,
  ): FLogicalArray;
  public static OR(
    a: FLogical | FLogicalArray,
    b: FLogical | FLogicalArray,
  ): FLogical | FLogicalArray {
    return or(a, b);
  }

  /**
   * Applies logical exclusive OR to scalars or conformable arrays.
   * @param a First operand or input value.
   * @param b Second operand or input value.
   * @returns Logical scalar or array result.
   */
  public static NEQV(a: FLogical, b: FLogical): FLogical;
  public static NEQV(
    a: FLogical | FLogicalArray,
    b: FLogical | FLogicalArray,
  ): FLogicalArray;
  public static NEQV(
    a: FLogical | FLogicalArray,
    b: FLogical | FLogicalArray,
  ): FLogical | FLogicalArray {
    return neqv(a, b);
  }

  /**
   * Applies logical exclusive OR to scalars or conformable arrays.
   * @param a First operand or input value.
   * @param b Second operand or input value.
   * @returns Logical scalar or array result.
   */
  public static XOR(a: FLogical, b: FLogical): FLogical;
  public static XOR(
    a: FLogical | FLogicalArray,
    b: FLogical | FLogicalArray,
  ): FLogicalArray;
  public static XOR(
    a: FLogical | FLogicalArray,
    b: FLogical | FLogicalArray,
  ): FLogical | FLogicalArray {
    return xor(a, b);
  }

  /**
   * Applies logical equivalence to scalars or conformable arrays.
   * @param a First operand or input value.
   * @param b Second operand or input value.
   * @returns Logical scalar or array result.
   */
  public static EQV(a: FLogical, b: FLogical): FLogical;
  public static EQV(
    a: FLogical | FLogicalArray,
    b: FLogical | FLogicalArray,
  ): FLogicalArray;
  public static EQV(
    a: FLogical | FLogicalArray,
    b: FLogical | FLogicalArray,
  ): FLogical | FLogicalArray {
    return eqv(a, b);
  }

  /**
   * Concatenates character scalars or conformable character arrays.
   * @param a First operand or input value.
   * @param b Second operand or input value.
   * @returns Character scalar or array result.
   */
  public static CONCAT(a: FCharacter, b: FCharacter): FCharacter;
  public static CONCAT(
    a: FCharacter | FCharacterArray,
    b: FCharacter | FCharacterArray,
  ): FCharacterArray;
  public static CONCAT(
    a: FCharacter | FCharacterArray,
    b: FCharacter | FCharacterArray,
  ): FCharacter | FCharacterArray {
    return concat(a, b);
  }
}
