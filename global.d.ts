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

  type Array1d<T> = T[];
  type Array2d<T> = Array1d<T>[];
  type Array3d<T> = Array2d<T>[];
  type Array4d<T> = Array3d<T>[];
  type Array5d<T> = Array4d<T>[];
  type Array6d<T> = Array5d<T>[];
  type Array7d<T> = Array6d<T>[];

  type FortranArray<T> =
    | Array1d<T>
    | Array2d<T>
    | Array3d<T>
    | Array4d<T>
    | Array5d<T>
    | Array6d<T>
    | Array7d<T>;

  type Dimension1d = [number];
  type Dimension2d = [number, number];
  type Dimension3d = [number, number, number];
  type Dimension4d = [number, number, number, number];
  type Dimension5d = [number, number, number, number, number];
  type Dimension6d = [number, number, number, number, number, number];
  type Dimension7d = [number, number, number, number, number, number, number];

  type Dimension =
    | Dimension1d
    | Dimension2d
    | Dimension3d
    | Dimension4d
    | Dimension5d
    | Dimension6d
    | Dimension7d;
}

export {};
