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
type ArrayExpression =
  | ArithmeticArray
  | FCharacterArray;

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

  public static DFLOAT(value: FInteger): FReal {
    return dfloat(value);
  }

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
  public static INT(
    value: ArithmeticExpression,
    kind?: IntegerKind,
  ): FInteger;
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
  public static INTEGER = Fortran.INT;

  public static IFIX(value: FReal): FInteger {
    return int(value);
  }

  public static IDINT(value: FReal): FInteger {
    return int(value);
  }

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

  public static FLOAT(value: FInteger): FReal {
    return real(value);
  }

  public static SNGL(value: FReal): FReal {
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

  public static IABS(value: FInteger): FInteger {
    return iabs(value);
  }

  public static DABS(value: FReal): FReal {
    return dabs(value);
  }

  public static CABS(value: FComplex): FReal {
    return cabs(value);
  }

  public static AINT(value: FReal): FReal {
    return aint(value);
  }

  public static DINT(value: FReal): FReal {
    return dble(aint(value));
  }

  public static ANINT(value: FReal): FReal {
    return anint(value);
  }

  public static DNINT(value: FReal): FReal {
    return dble(anint(value));
  }

  public static NINT(value: FReal): FInteger {
    return nint(value);
  }

  public static IDNINT(value: FReal): FInteger {
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

  public static ISIGN(value: FInteger, signSource: FInteger): FInteger {
    return isign(value, signSource);
  }

  public static DSIGN(value: FReal, signSource: FReal): FReal {
    return dsign(value, signSource);
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

  public static IDIM(value: FInteger, subtrahend: FInteger): FInteger {
    return idim(value, subtrahend);
  }

  public static ADIM(value: FReal, subtrahend: FReal): FReal {
    return adim(value, subtrahend);
  }

  public static DDIM(value: FReal, subtrahend: FReal): FReal {
    return ddim(value, subtrahend);
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

  public static AMOD(value: FReal, divisor: FReal): FReal {
    return amod(value, divisor);
  }

  public static DMOD(value: FReal, divisor: FReal): FReal {
    return dmod(value, divisor);
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

  public static MAX0(value: FInteger, ...others: FInteger[]): FInteger {
    return max0(value, ...others);
  }

  public static AMAX1(value: FReal, ...others: FReal[]): FReal {
    return amax1(value, ...others);
  }

  public static DMAX1(value: FReal, ...others: FReal[]): FReal {
    return dmax1(value, ...others);
  }

  public static AMAX0(value: FInteger, ...others: FInteger[]): FReal {
    return amax0(value, ...others);
  }

  public static MAX1(value: FReal, ...others: FReal[]): FInteger {
    return max1(value, ...others);
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

  public static MIN0(value: FInteger, ...others: FInteger[]): FInteger {
    return min0(value, ...others);
  }

  public static AMIN1(value: FReal, ...others: FReal[]): FReal {
    return amin1(value, ...others);
  }

  public static DMIN1(value: FReal, ...others: FReal[]): FReal {
    return dmin1(value, ...others);
  }

  public static AMIN0(value: FInteger, ...others: FInteger[]): FReal {
    return amin0(value, ...others);
  }

  public static MIN1(value: FReal, ...others: FReal[]): FInteger {
    return min1(value, ...others);
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

  public static ALOG(value: FReal): FReal {
    return alog(value);
  }

  public static DLOG(value: FReal): FReal {
    return dlog(value);
  }

  public static LOG10(value: FReal): FReal {
    return log10(value);
  }

  public static ALOG10(value: FReal): FReal {
    return alog10(value);
  }

  public static DLOG10(value: FReal): FReal {
    return dlog10(value);
  }

  public static DEXP(value: FReal): FReal {
    return dexp(value);
  }

  public static SIN(value: FReal): FReal {
    return sin(value);
  }

  public static DSIN(value: FReal): FReal {
    return dsin(value);
  }

  public static COS(value: FReal): FReal {
    return cos(value);
  }

  public static DCOS(value: FReal): FReal {
    return dcos(value);
  }

  public static TAN(value: FReal): FReal {
    return tan(value);
  }

  public static DTAN(value: FReal): FReal {
    return dtan(value);
  }

  public static ASIN(value: FReal): FReal {
    return asin(value);
  }

  public static DASIN(value: FReal): FReal {
    return dasin(value);
  }

  public static ACOS(value: FReal): FReal {
    return acos(value);
  }

  public static DACOS(value: FReal): FReal {
    return dacos(value);
  }

  public static ATAN(value: FReal): FReal {
    return atan(value);
  }

  public static DATAN(value: FReal): FReal {
    return datan(value);
  }

  public static ATAN2(y: FReal, x: FReal): FReal {
    return atan2(y, x);
  }

  public static DATAN2(y: FReal, x: FReal): FReal {
    return datan2(y, x);
  }

  public static SINH(value: FReal): FReal {
    return sinh(value);
  }

  public static COSH(value: FReal): FReal {
    return cosh(value);
  }

  public static DSINH(value: FReal): FReal {
    return dsinh(value);
  }

  public static TANH(value: FReal): FReal {
    return tanh(value);
  }

  public static DCOSH(value: FReal): FReal {
    return dcosh(value);
  }

  public static DTANH(value: FReal): FReal {
    return dtanh(value);
  }

  public static DSQRT(value: FReal): FReal {
    return dsqrt(value);
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

  public static LGE(a: FCharacter, b: FCharacter): FLogical {
    return lge(a, b);
  }

  public static LGT(a: FCharacter, b: FCharacter): FLogical {
    return lgt(a, b);
  }

  public static LLE(a: FCharacter, b: FCharacter): FLogical {
    return lle(a, b);
  }

  public static LLT(a: FCharacter, b: FCharacter): FLogical {
    return llt(a, b);
  }

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

  public static NOT(a: FLogical): FLogical;
  public static NOT(a: FLogicalArray): FLogicalArray;
  public static NOT(a: FLogical | FLogicalArray): FLogical | FLogicalArray {
    if (a instanceof FLogicalArray) {
      return not(a);
    }
    return not(a);
  }

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
