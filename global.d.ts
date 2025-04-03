declare global {
  enum FortranStandard {
    f66 = 'Fortran66',
    f77 = 'Fortran77',
    f90 = 'Fortran90',
    f95 = 'Fortran95',
    f03 = 'Fortran2003',
    f08 = 'Fortran2008',
    f18 = 'Fortran2018',
  }

  type Byte = string | number | boolean;
  type Complex = { r: number; i: number };

  type ComplexKind = 8 | 16 | 32;
  type IntegerKind = 2 | 4 | 8;
  type LogicalKind = 1 | 2 | 4 | 8;
  type RealKind = 4 | 8 | 16;
}

export {};
