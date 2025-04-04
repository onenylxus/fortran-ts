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

  public static COMPLEX(value: Complex): FComplex;
  public static COMPLEX(value: FortranArray<Complex>): FComplexArray;
  public static COMPLEX(
    value: Complex | FortranArray<Complex>,
    kind?: ComplexKind,
  ) {
    if (Array.isArray(value)) {
      return new FComplexArray(value, {
        ...FComplexArray.DefaultOptions,
        kind,
      });
    }
    return new FComplex(value, { ...FComplex.DefaultOptions, kind });
  }

  public static DOUBLE_COMPLEX(value: Complex): FComplex;
  public static DOUBLE_COMPLEX(value: FortranArray<Complex>): FComplexArray;
  public static DOUBLE_COMPLEX(value: Complex | FortranArray<Complex>) {
    if (Array.isArray(value)) {
      return new FComplexArray(value, {
        ...FComplexArray.DefaultOptions,
        name: DatatypesJSON.doubleComplex.name,
        description: DatatypesJSON.doubleComplex.description,
        kind: 16,
      });
    }
    return new FComplex(value, {
      ...FComplex.DefaultOptions,
      name: DatatypesJSON.doubleComplex.name,
      description: DatatypesJSON.doubleComplex.description,
      kind: 16,
    });
  }

  public static DOUBLE_PRECISION(value: number): FReal;
  public static DOUBLE_PRECISION(value: FortranArray<number>): FRealArray;
  public static DOUBLE_PRECISION(value: number | FortranArray<number>) {
    if (Array.isArray(value)) {
      return new FRealArray(value, {
        ...FRealArray.DefaultOptions,
        name: DatatypesJSON.doublePrecision.name,
        description: DatatypesJSON.doublePrecision.description,
        kind: 8,
      });
    }
    return new FReal(value, {
      ...FReal.DefaultOptions,
      name: DatatypesJSON.doublePrecision.name,
      description: DatatypesJSON.doublePrecision.description,
      kind: 8,
    });
  }

  public static INTEGER(value: number, kind?: IntegerKind): FInteger;
  public static INTEGER(
    value: FortranArray<number>,
    kind?: IntegerKind,
  ): FIntegerArray;
  public static INTEGER(
    value: number | FortranArray<number>,
    kind?: IntegerKind,
  ) {
    if (Array.isArray(value)) {
      return new FIntegerArray(value, {
        ...FIntegerArray.DefaultOptions,
        kind,
      });
    }
    return new FInteger(value, { ...FInteger.DefaultOptions, kind });
  }

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

  public static REAL(value: number, kind?: RealKind): FReal;
  public static REAL(value: FortranArray<number>, kind?: RealKind): FRealArray;
  public static REAL(value: number | FortranArray<number>, kind?: RealKind) {
    if (Array.isArray(value)) {
      return new FRealArray(value, { ...FRealArray.DefaultOptions, kind });
    }
    return new FReal(value, { ...FReal.DefaultOptions, kind });
  }
}
