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
  abs,
  acos,
  aimag,
  aint,
  anint,
  asin,
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
  ichar,
  index,
  len,
  log,
  log10,
  max,
  min,
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

export default class Fortran {
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

  public static CMPLX(value: Complex, kind?: ComplexKind): FComplex;
  public static CMPLX(value: ArithmeticExpression): FComplex;
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
    return cmplx(value as ArithmeticExpression);
  }
  public static COMPLEX = Fortran.CMPLX;

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
  public static DOUBLE_PRECISION = Fortran.DBLE;

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
  public static DOUBLE_COMPLEX = Fortran.DCMPLX;

  public static INT(value: number, kind?: IntegerKind): FInteger;
  public static INT(value: ArithmeticExpression): FInteger;
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
      return new FInteger(value, { ...FInteger.DefaultOptions, kind });
    }
    return int(value);
  }
  public static INTEGER = Fortran.INT;

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

  public static REAL(value: number, kind?: RealKind): FReal;
  public static REAL(value: ArithmeticExpression): FReal;
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
    return real(value);
  }

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

  public static AINT(value: FReal): FReal {
    return aint(value);
  }

  public static ANINT(value: FReal): FReal {
    return anint(value);
  }

  public static NINT(value: FReal): FInteger {
    return nint(value);
  }

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

  public static SQRT(value: FReal): FReal {
    return sqrt(value);
  }

  public static EXP(value: FReal): FReal {
    return exp(value);
  }

  public static LOG(value: FReal): FReal {
    return log(value);
  }

  public static LOG10(value: FReal): FReal {
    return log10(value);
  }

  public static SIN(value: FReal): FReal {
    return sin(value);
  }

  public static COS(value: FReal): FReal {
    return cos(value);
  }

  public static TAN(value: FReal): FReal {
    return tan(value);
  }

  public static ASIN(value: FReal): FReal {
    return asin(value);
  }

  public static ACOS(value: FReal): FReal {
    return acos(value);
  }

  public static ATAN(value: FReal): FReal {
    return atan(value);
  }

  public static ATAN2(y: FReal, x: FReal): FReal {
    return atan2(y, x);
  }

  public static SINH(value: FReal): FReal {
    return sinh(value);
  }

  public static COSH(value: FReal): FReal {
    return cosh(value);
  }

  public static TANH(value: FReal): FReal {
    return tanh(value);
  }

  public static AIMAG(value: FComplex): FReal {
    return aimag(value);
  }

  public static CONJG(value: FComplex): FComplex {
    return conjg(value);
  }

  public static CSQRT(value: FComplex): FComplex {
    return csqrt(value);
  }

  public static CEXP(value: FComplex): FComplex {
    return cexp(value);
  }

  public static CLOG(value: FComplex): FComplex {
    return clog(value);
  }

  public static CSIN(value: FComplex): FComplex {
    return csin(value);
  }

  public static CCOS(value: FComplex): FComplex {
    return ccos(value);
  }

  public static DPROD(a: FReal, b: FReal): FReal {
    return dprod(a, b);
  }

  public static ACHAR(code: FInteger): FCharacter {
    return achar(code);
  }

  public static CHAR(code: FInteger): FCharacter {
    return char(code);
  }

  public static IACHAR(value: FCharacter): FInteger {
    return iachar(value);
  }

  public static ICHAR(value: FCharacter): FInteger {
    return ichar(value);
  }

  public static LEN(value: FCharacter): FInteger {
    return len(value);
  }

  public static INDEX(
    string: FCharacter,
    substring: FCharacter,
    back?: FLogical,
  ): FInteger {
    return index(string, substring, back);
  }

  public static SCAN(
    string: FCharacter,
    set: FCharacter,
    back?: FLogical,
  ): FInteger {
    return scan(string, set, back);
  }

  public static VERIFY(
    string: FCharacter,
    set: FCharacter,
    back?: FLogical,
  ): FInteger {
    return verify(string, set, back);
  }

  public static EQ(a: FCharacter, b: FCharacter): FLogical;
  public static EQ<
    A extends ArithmeticExpression,
    B extends ArithmeticExpression,
  >(a: A, b: B): FLogical;
  public static EQ(
    a: ArithmeticExpression | FCharacter,
    b: ArithmeticExpression | FCharacter,
  ): FLogical {
    if (a instanceof FCharacter && b instanceof FCharacter) {
      return eq(a, b);
    }
    return eq(a as ArithmeticExpression, b as ArithmeticExpression);
  }

  public static LT(a: FCharacter, b: FCharacter): FLogical;
  public static LT<
    A extends ArithmeticExpression,
    B extends ArithmeticExpression,
  >(a: A, b: B): FLogical;
  public static LT(
    a: ArithmeticExpression | FCharacter,
    b: ArithmeticExpression | FCharacter,
  ): FLogical {
    return lt(a, b);
  }

  public static LE(a: FCharacter, b: FCharacter): FLogical;
  public static LE<
    A extends ArithmeticExpression,
    B extends ArithmeticExpression,
  >(a: A, b: B): FLogical;
  public static LE(
    a: ArithmeticExpression | FCharacter,
    b: ArithmeticExpression | FCharacter,
  ): FLogical {
    return le(a, b);
  }

  public static NE(a: FCharacter, b: FCharacter): FLogical;
  public static NE<
    A extends ArithmeticExpression,
    B extends ArithmeticExpression,
  >(a: A, b: B): FLogical;
  public static NE(
    a: ArithmeticExpression | FCharacter,
    b: ArithmeticExpression | FCharacter,
  ): FLogical {
    if (a instanceof FCharacter && b instanceof FCharacter) {
      return ne(a, b);
    }
    return ne(a as ArithmeticExpression, b as ArithmeticExpression);
  }

  public static GT(a: FCharacter, b: FCharacter): FLogical;
  public static GT<
    A extends ArithmeticExpression,
    B extends ArithmeticExpression,
  >(a: A, b: B): FLogical;
  public static GT(
    a: ArithmeticExpression | FCharacter,
    b: ArithmeticExpression | FCharacter,
  ): FLogical {
    return gt(a, b);
  }

  public static GE(a: FCharacter, b: FCharacter): FLogical;
  public static GE<
    A extends ArithmeticExpression,
    B extends ArithmeticExpression,
  >(a: A, b: B): FLogical;
  public static GE(
    a: ArithmeticExpression | FCharacter,
    b: ArithmeticExpression | FCharacter,
  ): FLogical {
    return ge(a, b);
  }

  public static ADD<
    A extends ArithmeticExpression,
    B extends ArithmeticExpression,
  >(a: A, b: B): Mix<A, B> {
    return add(a, b);
  }

  public static SUB<
    A extends ArithmeticExpression,
    B extends ArithmeticExpression,
  >(a: A, b: B): Mix<A, B> {
    return sub(a, b);
  }

  public static MUL<
    A extends ArithmeticExpression,
    B extends ArithmeticExpression,
  >(a: A, b: B): Mix<A, B> {
    return mul(a, b);
  }

  public static DIV<
    A extends ArithmeticExpression,
    B extends ArithmeticExpression,
  >(a: A, b: B): Mix<A, B> {
    return div(a, b);
  }

  public static POW<
    A extends ArithmeticExpression,
    B extends ArithmeticExpression,
  >(a: A, b: B): Mix<A, B> {
    return pow(a, b);
  }

  public static UPLUS<A extends ArithmeticExpression>(a: A): A {
    return uplus(a);
  }

  public static UMINUS<A extends ArithmeticExpression>(a: A): A {
    return uminus(a);
  }

  public static NOT(a: FLogical): FLogical {
    return not(a);
  }

  public static AND(a: FLogical, b: FLogical): FLogical {
    return and(a, b);
  }

  public static OR(a: FLogical, b: FLogical): FLogical {
    return or(a, b);
  }

  public static NEQV(a: FLogical, b: FLogical): FLogical {
    return neqv(a, b);
  }

  public static XOR(a: FLogical, b: FLogical): FLogical {
    return xor(a, b);
  }

  public static EQV(a: FLogical, b: FLogical): FLogical {
    return eqv(a, b);
  }

  public static CONCAT(a: FCharacter, b: FCharacter): FCharacter {
    return concat(a, b);
  }
}
