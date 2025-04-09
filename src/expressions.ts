import { FByte, FComplex, FInteger, FLogical, FReal } from './datatypes';

export type ArithmeticExpression = FByte | FComplex | FInteger | FLogical | FReal;

function _getRank(a: ArithmeticExpression): number {
  if (a instanceof FByte) {
    return 1;
  } else if (a instanceof FComplex) {
    switch (a.kind) {
      case 8:
        return 9;
      case 16:
        return 10;
      case 32:
        return 11;
      default:
        return 9;
    }
  } else if (a instanceof FInteger) {
    switch (a.kind) {
      case 2:
        return 4;
      case 4:
        return 5;
      case 8:
        return 6;
      default:
        return 5;
    }
  } else if (a instanceof FLogical) {
    switch (a.kind) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 3;
      case 8:
        return 6;
      default:
        return 3;
    }
  } else if (a instanceof FReal) {
    switch (a.kind) {
      case 4:
        return 6;
      case 8:
        return 7;
      case 16:
        return 8;
      default:
        return 6;
    }
  }
}

function byteToNumber(e: FByte): number {
  return typeof e.value === 'string' ? e.value.charCodeAt(0) : +e.value;
}

export function int(e: ArithmeticExpression | number): FInteger {
  if (e instanceof FByte) {
    return new FInteger(byteToNumber(e), {
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
    return new FReal(byteToNumber(e), {
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
    return new FReal(byteToNumber(e), {
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
    return new FReal(byteToNumber(e), {
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
      { r: byteToNumber(e), i: 0 },
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
      { r: byteToNumber(e), i: 0 },
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
      { r: byteToNumber(e), i: 0 },
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
