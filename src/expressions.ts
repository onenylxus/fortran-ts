import {
  ArithmeticExpression,
  FByte,
  FComplex,
  FInteger,
  FLogical,
  FReal,
} from './datatypes';
import { byteToNumber } from './mixed';

export function int(e: ArithmeticExpression | number): FInteger {
  if (e instanceof FByte) {
    return new FInteger(byteToNumber(e.value), {
      ...FInteger.DefaultOptions,
      standard: e.standard,
      kind: 4,
    });
  }
  if (e instanceof FComplex) {
    return new FInteger(Math.floor(e.value.r), {
      ...FInteger.DefaultOptions,
      standard: e.standard,
      kind: 4,
    });
  }
  if (e instanceof FInteger) {
    return new FInteger(e.value, {
      ...FInteger.DefaultOptions,
      standard: e.standard,
      kind: 4,
    });
  }
  if (e instanceof FLogical) {
    return new FInteger(e.value ? 1 : 0, {
      ...FInteger.DefaultOptions,
      standard: e.standard,
      kind: 4,
    });
  }
  if (e instanceof FReal) {
    return new FInteger(Math.floor(e.value), {
      ...FInteger.DefaultOptions,
      standard: e.standard,
      kind: 4,
    });
  }
  return new FInteger(e);
}

export function real(e: ArithmeticExpression): FReal {
  if (e instanceof FByte) {
    return new FReal(byteToNumber(e.value), {
      ...FReal.DefaultOptions,
      standard: e.standard,
      kind: 4,
    });
  }
  if (e instanceof FComplex) {
    return new FReal(Math.fround(e.value.r), {
      ...FReal.DefaultOptions,
      standard: e.standard,
      kind: 4,
    });
  }
  if (e instanceof FInteger) {
    return new FReal(e.value, {
      ...FReal.DefaultOptions,
      standard: e.standard,
      kind: 4,
    });
  }
  if (e instanceof FLogical) {
    return new FReal(e.value ? 1 : 0, {
      ...FReal.DefaultOptions,
      standard: e.standard,
      kind: 4,
    });
  }
  if (e instanceof FReal) {
    return new FReal(Math.fround(e.value), {
      ...FReal.DefaultOptions,
      standard: e.standard,
      kind: 4,
    });
  }
}

export function dble(e: ArithmeticExpression): FReal {
  if (e instanceof FByte) {
    return new FReal(byteToNumber(e.value), {
      ...FReal.DefaultOptions,
      standard: e.standard,
      kind: 8,
    });
  }
  if (e instanceof FComplex) {
    return new FReal(e.value.r, {
      ...FReal.DefaultOptions,
      standard: e.standard,
      kind: 8,
    });
  }
  if (e instanceof FInteger) {
    return new FReal(e.value, {
      ...FReal.DefaultOptions,
      standard: e.standard,
      kind: 8,
    });
  }
  if (e instanceof FLogical) {
    return new FReal(e.value ? 1 : 0, {
      ...FReal.DefaultOptions,
      standard: e.standard,
      kind: 8,
    });
  }
  if (e instanceof FReal) {
    return new FReal(e.value, {
      ...FReal.DefaultOptions,
      standard: e.standard,
      kind: 8,
    });
  }
}

export function qreal(e: ArithmeticExpression): FReal {
  if (e instanceof FByte) {
    return new FReal(byteToNumber(e.value), {
      ...FReal.DefaultOptions,
      standard: e.standard,
      kind: 16,
    });
  }
  if (e instanceof FComplex) {
    return new FReal(e.value.r, {
      ...FReal.DefaultOptions,
      standard: e.standard,
      kind: 16,
    });
  }
  if (e instanceof FInteger) {
    return new FReal(e.value, {
      ...FReal.DefaultOptions,
      standard: e.standard,
      kind: 16,
    });
  }
  if (e instanceof FLogical) {
    return new FReal(e.value ? 1 : 0, {
      ...FReal.DefaultOptions,
      standard: e.standard,
      kind: 16,
    });
  }
  if (e instanceof FReal) {
    return new FReal(e.value, {
      ...FReal.DefaultOptions,
      standard: e.standard,
      kind: 16,
    });
  }
}

export function cmplx(e: ArithmeticExpression): FComplex {
  if (e instanceof FByte) {
    return new FComplex(
      { r: byteToNumber(e.value), i: 0 },
      {
        ...FComplex.DefaultOptions,
        standard: e.standard,
        kind: 8,
      },
    );
  }
  if (e instanceof FComplex) {
    return new FComplex(
      { r: Math.fround(e.value.r), i: Math.fround(e.value.i) },
      {
        ...FComplex.DefaultOptions,
        standard: e.standard,
        kind: 8,
      },
    );
  }
  if (e instanceof FInteger) {
    return new FComplex(
      { r: e.value, i: 0 },
      {
        ...FComplex.DefaultOptions,
        standard: e.standard,
        kind: 8,
      },
    );
  }
  if (e instanceof FLogical) {
    return new FComplex(
      { r: e.value ? 1 : 0, i: 0 },
      {
        ...FComplex.DefaultOptions,
        standard: e.standard,
        kind: 8,
      },
    );
  }
  if (e instanceof FReal) {
    return new FComplex(
      { r: Math.fround(e.value), i: 0 },
      {
        ...FComplex.DefaultOptions,
        standard: e.standard,
        kind: 8,
      },
    );
  }
}

export function dcmplx(e: ArithmeticExpression): FComplex {
  if (e instanceof FByte) {
    return new FComplex(
      { r: byteToNumber(e.value), i: 0 },
      {
        ...FComplex.DefaultOptions,
        standard: e.standard,
        kind: 16,
      },
    );
  }
  if (e instanceof FComplex) {
    return new FComplex(e.value, {
      ...FComplex.DefaultOptions,
      standard: e.standard,
      kind: 16,
    });
  }
  if (e instanceof FInteger) {
    return new FComplex(
      { r: e.value, i: 0 },
      {
        ...FComplex.DefaultOptions,
        standard: e.standard,
        kind: 16,
      },
    );
  }
  if (e instanceof FLogical) {
    return new FComplex(
      { r: e.value ? 1 : 0, i: 0 },
      {
        ...FComplex.DefaultOptions,
        standard: e.standard,
        kind: 16,
      },
    );
  }
  if (e instanceof FReal) {
    return new FComplex(
      { r: e.value, i: 0 },
      {
        ...FComplex.DefaultOptions,
        standard: e.standard,
        kind: 16,
      },
    );
  }
}

export function qcmplx(e: ArithmeticExpression): FComplex {
  if (e instanceof FByte) {
    return new FComplex(
      { r: byteToNumber(e.value), i: 0 },
      {
        ...FComplex.DefaultOptions,
        standard: e.standard,
        kind: 32,
      },
    );
  }
  if (e instanceof FComplex) {
    return new FComplex(e.value, {
      ...FComplex.DefaultOptions,
      standard: e.standard,
      kind: 32,
    });
  }
  if (e instanceof FInteger) {
    return new FComplex(
      { r: e.value, i: 0 },
      {
        ...FComplex.DefaultOptions,
        standard: e.standard,
        kind: 32,
      },
    );
  }
  if (e instanceof FLogical) {
    return new FComplex(
      { r: e.value ? 1 : 0, i: 0 },
      {
        ...FComplex.DefaultOptions,
        standard: e.standard,
        kind: 32,
      },
    );
  }
  if (e instanceof FReal) {
    return new FComplex(
      { r: e.value, i: 0 },
      {
        ...FComplex.DefaultOptions,
        standard: e.standard,
        kind: 32,
      },
    );
  }
}
