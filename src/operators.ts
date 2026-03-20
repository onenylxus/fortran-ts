import {
  ArithmeticExpression,
  FByte,
  FComplex,
  FInteger,
  FLogical,
  FReal,
} from './datatypes';
import { byteToNumber, getKind, mix, Mix, numberToByte } from './mixed';

function divideComplex(a: Complex, b: Complex): Complex {
  const denominator = b.r * b.r + b.i * b.i;
  return {
    r: (a.r * b.r + a.i * b.i) / denominator,
    i: (a.i * b.r - a.r * b.i) / denominator,
  };
}

function powComplex(a: Complex, b: Complex): Complex {
  const magnitude = Math.sqrt(a.r * a.r + a.i * a.i);
  const angle = Math.atan2(a.i, a.r);
  const logR = Math.log(magnitude);

  const x = b.r * logR - b.i * angle;
  const y = b.i * logR + b.r * angle;
  const expX = Math.exp(x);

  return {
    r: expX * Math.cos(y),
    i: expX * Math.sin(y),
  };
}

export function eq<
  A extends ArithmeticExpression,
  B extends ArithmeticExpression,
>(a: A, b: B): FLogical {
  const { c, d } = mix(a, b);

  if (c instanceof FByte && d instanceof FByte) {
    return new FLogical(byteToNumber(c.value) === byteToNumber(d.value));
  }
  if (c instanceof FComplex && d instanceof FComplex) {
    return new FLogical(c.value.r === d.value.r && c.value.i === d.value.i);
  }
  if (c instanceof FInteger && d instanceof FInteger) {
    return new FLogical(c.value === d.value);
  }
  if (c instanceof FLogical && d instanceof FLogical) {
    return new FLogical(c.value === d.value);
  }
  if (c instanceof FReal && d instanceof FReal) {
    return new FLogical(c.value === d.value);
  }
}

export function ne<
  A extends ArithmeticExpression,
  B extends ArithmeticExpression,
>(a: A, b: B): FLogical {
  const { c, d } = mix(a, b);

  if (c instanceof FByte && d instanceof FByte) {
    return new FLogical(byteToNumber(c.value) !== byteToNumber(d.value));
  }
  if (c instanceof FComplex && d instanceof FComplex) {
    return new FLogical(c.value.r !== d.value.r || c.value.i !== d.value.i);
  }
  if (c instanceof FInteger && d instanceof FInteger) {
    return new FLogical(c.value !== d.value);
  }
  if (c instanceof FLogical && d instanceof FLogical) {
    return new FLogical(c.value !== d.value);
  }
  if (c instanceof FReal && d instanceof FReal) {
    return new FLogical(c.value !== d.value);
  }
}

export function add<
  A extends ArithmeticExpression,
  B extends ArithmeticExpression,
>(a: A, b: B): Mix<A, B> {
  const { c, d } = mix(a, b);
  const kind = getKind(c);

  if (c instanceof FByte && d instanceof FByte) {
    return new FByte(
      numberToByte(byteToNumber(c.value) + byteToNumber(d.value)),
    ) as Mix<A, B>;
  }
  if (c instanceof FComplex && d instanceof FComplex) {
    return new FComplex(
      {
        r: c.value.r + d.value.r,
        i: c.value.i + d.value.i,
      },
      { kind: kind as ComplexKind },
    ) as Mix<A, B>;
  }
  if (c instanceof FInteger && d instanceof FInteger) {
    return new FInteger(c.value + d.value, {
      kind: kind as IntegerKind,
    }) as Mix<A, B>;
  }
  if (c instanceof FLogical && d instanceof FLogical) {
    return new FLogical(Boolean(c.value || d.value), {
      kind: kind as LogicalKind,
    }) as Mix<A, B>;
  }
  if (c instanceof FReal && d instanceof FReal) {
    return new FReal(c.value + d.value, {
      kind: kind as RealKind,
    }) as Mix<A, B>;
  }
}

export function sub<
  A extends ArithmeticExpression,
  B extends ArithmeticExpression,
>(a: A, b: B): Mix<A, B> {
  const { c, d } = mix(a, b);
  const kind = getKind(c);

  if (c instanceof FByte && d instanceof FByte) {
    return new FByte(
      numberToByte(byteToNumber(c.value) - byteToNumber(d.value)),
    ) as Mix<A, B>;
  }

  if (c instanceof FComplex && d instanceof FComplex) {
    return new FComplex(
      {
        r: c.value.r - d.value.r,
        i: c.value.i - d.value.i,
      },
      { kind: kind as ComplexKind },
    ) as Mix<A, B>;
  }

  if (c instanceof FInteger && d instanceof FInteger) {
    return new FInteger(c.value - d.value, {
      kind: kind as IntegerKind,
    }) as Mix<A, B>;
  }

  if (c instanceof FLogical && d instanceof FLogical) {
    return new FLogical(Boolean(c.value && !d.value), {
      kind: kind as LogicalKind,
    }) as Mix<A, B>;
  }

  if (c instanceof FReal && d instanceof FReal) {
    return new FReal(c.value - d.value, {
      kind: kind as RealKind,
    }) as Mix<A, B>;
  }
}

export function mul<
  A extends ArithmeticExpression,
  B extends ArithmeticExpression,
>(a: A, b: B): Mix<A, B> {
  const { c, d } = mix(a, b);
  const kind = getKind(c);

  if (c instanceof FByte && d instanceof FByte) {
    return new FByte(
      numberToByte(Math.trunc(byteToNumber(c.value) * byteToNumber(d.value))),
    ) as Mix<A, B>;
  }

  if (c instanceof FComplex && d instanceof FComplex) {
    return new FComplex(
      {
        r: c.value.r * d.value.r - c.value.i * d.value.i,
        i: c.value.r * d.value.i + c.value.i * d.value.r,
      },
      { kind: kind as ComplexKind },
    ) as Mix<A, B>;
  }

  if (c instanceof FInteger && d instanceof FInteger) {
    return new FInteger(c.value * d.value, {
      kind: kind as IntegerKind,
    }) as Mix<A, B>;
  }

  if (c instanceof FLogical && d instanceof FLogical) {
    return new FLogical(Boolean(c.value && d.value), {
      kind: kind as LogicalKind,
    }) as Mix<A, B>;
  }

  if (c instanceof FReal && d instanceof FReal) {
    return new FReal(c.value * d.value, {
      kind: kind as RealKind,
    }) as Mix<A, B>;
  }
}

export function div<
  A extends ArithmeticExpression,
  B extends ArithmeticExpression,
>(a: A, b: B): Mix<A, B> {
  const { c, d } = mix(a, b);
  const kind = getKind(c);

  if (c instanceof FByte && d instanceof FByte) {
    return new FByte(
      numberToByte(Math.trunc(byteToNumber(c.value) / byteToNumber(d.value))),
    ) as Mix<A, B>;
  }

  if (c instanceof FComplex && d instanceof FComplex) {
    return new FComplex(divideComplex(c.value, d.value), {
      kind: kind as ComplexKind,
    }) as Mix<A, B>;
  }

  if (c instanceof FInteger && d instanceof FInteger) {
    return new FInteger(Math.trunc(c.value / d.value), {
      kind: kind as IntegerKind,
    }) as Mix<A, B>;
  }

  if (c instanceof FLogical && d instanceof FLogical) {
    return new FLogical(Boolean(c.value && d.value), {
      kind: kind as LogicalKind,
    }) as Mix<A, B>;
  }

  if (c instanceof FReal && d instanceof FReal) {
    return new FReal(c.value / d.value, {
      kind: kind as RealKind,
    }) as Mix<A, B>;
  }
}

export function pow<
  A extends ArithmeticExpression,
  B extends ArithmeticExpression,
>(a: A, b: B): Mix<A, B> {
  const { c, d } = mix(a, b);
  const kind = getKind(c);

  if (c instanceof FByte && d instanceof FByte) {
    return new FByte(
      numberToByte(
        Math.trunc(Math.pow(byteToNumber(c.value), byteToNumber(d.value))),
      ),
    ) as Mix<A, B>;
  }

  if (c instanceof FComplex && d instanceof FComplex) {
    return new FComplex(powComplex(c.value, d.value), {
      kind: kind as ComplexKind,
    }) as Mix<A, B>;
  }

  if (c instanceof FInteger && d instanceof FInteger) {
    return new FInteger(Math.trunc(Math.pow(c.value, d.value)), {
      kind: kind as IntegerKind,
    }) as Mix<A, B>;
  }

  if (c instanceof FLogical && d instanceof FLogical) {
    return new FLogical(Boolean(Number(c.value) ** Number(d.value)), {
      kind: kind as LogicalKind,
    }) as Mix<A, B>;
  }

  if (c instanceof FReal && d instanceof FReal) {
    return new FReal(Math.pow(c.value, d.value), {
      kind: kind as RealKind,
    }) as Mix<A, B>;
  }
}
