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
import { Mix } from './mixed';
import {
  add,
  and,
  div,
  eq,
  eqv,
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

  public static EQ<
    A extends ArithmeticExpression,
    B extends ArithmeticExpression,
  >(a: A, b: B): FLogical {
    return eq(a, b);
  }

  public static NE<
    A extends ArithmeticExpression,
    B extends ArithmeticExpression,
  >(a: A, b: B): FLogical {
    return ne(a, b);
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
}
