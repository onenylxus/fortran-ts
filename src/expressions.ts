import assert from 'assert';
import {
  ArithmeticExpression,
  FByte,
  FComplex,
  FInteger,
  FLogical,
  FReal,
} from './datatypes';
import { byteToNumber } from './mixed';

export function int(
  e: ArithmeticExpression | number,
  kind: IntegerKind = 4,
): FInteger {
  if (e instanceof FByte) {
    return new FInteger(byteToNumber(e.value), {
      ...FInteger.DefaultOptions,
      standard: e.standard,
      kind,
    });
  }
  if (e instanceof FComplex) {
    return new FInteger(Math.trunc(e.value.r), {
      ...FInteger.DefaultOptions,
      standard: e.standard,
      kind,
    });
  }
  if (e instanceof FInteger) {
    return new FInteger(e.value, {
      ...FInteger.DefaultOptions,
      standard: e.standard,
      kind,
    });
  }
  if (e instanceof FLogical) {
    return new FInteger(e.value ? 1 : 0, {
      ...FInteger.DefaultOptions,
      standard: e.standard,
      kind,
    });
  }
  if (e instanceof FReal) {
    return new FInteger(Math.trunc(e.value), {
      ...FInteger.DefaultOptions,
      standard: e.standard,
      kind,
    });
  }
  assert.fail('Unsupported arithmetic expression');
}

export function real(e: ArithmeticExpression, kind: RealKind = 4): FReal {
  if (e instanceof FByte) {
    return new FReal(byteToNumber(e.value), {
      ...FReal.DefaultOptions,
      standard: e.standard,
      kind,
    });
  }
  if (e instanceof FComplex) {
    return new FReal(e.value.r, {
      ...FReal.DefaultOptions,
      standard: e.standard,
      kind,
    });
  }
  if (e instanceof FInteger) {
    return new FReal(e.value, {
      ...FReal.DefaultOptions,
      standard: e.standard,
      kind,
    });
  }
  if (e instanceof FLogical) {
    return new FReal(e.value ? 1 : 0, {
      ...FReal.DefaultOptions,
      standard: e.standard,
      kind,
    });
  }
  if (e instanceof FReal) {
    return new FReal(e.value, {
      ...FReal.DefaultOptions,
      standard: e.standard,
      kind,
    });
  }
  assert.fail('Unsupported arithmetic expression');
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
  assert.fail('Unsupported arithmetic expression');
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
  assert.fail('Unsupported arithmetic expression');
}

export function cmplx(
  e: ArithmeticExpression,
  kind: ComplexKind = 8,
): FComplex {
  if (e instanceof FByte) {
    return new FComplex(
      { r: byteToNumber(e.value), i: 0 },
      {
        ...FComplex.DefaultOptions,
        standard: e.standard,
        kind,
      },
    );
  }
  if (e instanceof FComplex) {
    return new FComplex(
      { r: e.value.r, i: e.value.i },
      {
        ...FComplex.DefaultOptions,
        standard: e.standard,
        kind,
      },
    );
  }
  if (e instanceof FInteger) {
    return new FComplex(
      { r: e.value, i: 0 },
      {
        ...FComplex.DefaultOptions,
        standard: e.standard,
        kind,
      },
    );
  }
  if (e instanceof FLogical) {
    return new FComplex(
      { r: e.value ? 1 : 0, i: 0 },
      {
        ...FComplex.DefaultOptions,
        standard: e.standard,
        kind,
      },
    );
  }
  if (e instanceof FReal) {
    return new FComplex(
      { r: e.value, i: 0 },
      {
        ...FComplex.DefaultOptions,
        standard: e.standard,
        kind,
      },
    );
  }
  assert.fail('Unsupported arithmetic expression');
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
  assert.fail('Unsupported arithmetic expression');
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
  assert.fail('Unsupported arithmetic expression');
}
