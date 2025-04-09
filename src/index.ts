import DatatypesJSON from '../assets/datatypes.json' assert { type: 'json' };
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
} from './datatypes';
import {
  ArithmeticExpression,
  cmplx,
  dble,
  dcmplx,
  int,
  qcmplx,
  qreal,
  real,
} from './expressions';
import { isComplex } from './utils';

export default class Fortran {
  public static BYTE(value: Byte): FByte;
  public static BYTE(value: FortranArray<Byte>): FByteArray;
  public static BYTE(value: Byte | FortranArray<Byte>) {
    if (Array.isArray(value)) {
      return new FByteArray(value);
    }
    return new FByte(value);
  }

  public static CHARACTER(value: string, len?: number): FCharacter;
  public static CHARACTER(
    value: FortranArray<string>,
    len?: number,
  ): FCharacterArray;
  public static CHARACTER(value: string | FortranArray<string>, len?: number) {
    if (Array.isArray(value)) {
      return new FCharacterArray(value, {
        ...FCharacterArray.DefaultOptions,
        len,
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
  ) {
    if (Array.isArray(value)) {
      return new FComplexArray(value, {
        ...FComplexArray.DefaultOptions,
        kind,
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
  ) {
    if (Array.isArray(value)) {
      return new FRealArray(value, {
        ...FRealArray.DefaultOptions,
        name: DatatypesJSON.doublePrecision.name,
        description: DatatypesJSON.doublePrecision.description,
        kind: 8,
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
  ) {
    if (Array.isArray(value)) {
      return new FComplexArray(value, {
        ...FComplexArray.DefaultOptions,
        name: DatatypesJSON.doubleComplex.name,
        description: DatatypesJSON.doubleComplex.description,
        kind: 16,
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
  ) {
    if (Array.isArray(value)) {
      return new FIntegerArray(value, {
        ...FIntegerArray.DefaultOptions,
        kind,
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
  ) {
    if (Array.isArray(value)) {
      return new FLogicalArray(value, {
        ...FLogicalArray.DefaultOptions,
        kind,
      });
    }
    return new FLogical(value, { ...FLogical.DefaultOptions, kind });
  }

  public static QCMPLX(value: Complex): FComplex;
  public static QCMPLX(value: ArithmeticExpression): FComplex;
  public static QCMPLX(value: FortranArray<Complex>): FComplexArray;
  public static QCMPLX(
    value: Complex | ArithmeticExpression | FortranArray<Complex>,
  ) {
    if (Array.isArray(value)) {
      return new FComplexArray(value, {
        ...FComplexArray.DefaultOptions,
        kind: 32,
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
  ) {
    if (Array.isArray(value)) {
      return new FRealArray(value, {
        ...FRealArray.DefaultOptions,
        kind: 16,
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
  ) {
    if (Array.isArray(value)) {
      return new FRealArray(value, { ...FRealArray.DefaultOptions, kind });
    }
    if (typeof value === 'number') {
      return new FReal(value, { ...FReal.DefaultOptions, kind });
    }
    return real(value);
  }
}
