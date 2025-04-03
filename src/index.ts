import DatatypesJSON from '../assets/datatypes.json' assert { type: 'json' };
import {
  FByte,
  FCharacter,
  FComplex,
  FInteger,
  FLogical,
  FReal,
} from './datatypes';

export default class Fortran {
  public static BYTE(value: Byte): FByte {
    return new FByte(value);
  }

  public static CHARACTER(value: string, len?: number) {
    return new FCharacter(value, { ...FCharacter.DefaultOptions, len });
  }

  public static COMPLEX(value: Complex, kind?: ComplexKind) {
    return new FComplex(value, { ...FComplex.DefaultOptions, kind });
  }

  public static DOUBLE_COMPLEX(value: Complex): FComplex {
    return new FComplex(value, {
      ...FComplex.DefaultOptions,
      name: DatatypesJSON.doubleComplex.name,
      description: DatatypesJSON.doubleComplex.description,
      kind: 16,
    });
  }

  public static DOUBLE_PRECISION(value: number): FReal {
    return new FReal(value, {
      ...FReal.DefaultOptions,
      name: DatatypesJSON.doublePrecision.name,
      description: DatatypesJSON.doublePrecision.description,
      kind: 8,
    });
  }

  public static INTEGER(value: number, kind?: IntegerKind) {
    return new FInteger(value, { ...FInteger.DefaultOptions, kind });
  }

  public static LOGICAL(value: boolean, kind?: LogicalKind) {
    return new FLogical(value, { ...FLogical.DefaultOptions, kind });
  }

  public static REAL(value: number, kind?: RealKind) {
    return new FReal(value, { ...FReal.DefaultOptions, kind });
  }
}
