import {
  ArithmeticExpression,
  FByte,
  FCharacter,
  FComplex,
  FInteger,
  FLogical,
  FReal,
} from './datatypes';
import { byteToNumber, getKind, mix, Mix, numberToByte } from './mixed';

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

export function lt(
  a: ArithmeticExpression | FCharacter,
  b: ArithmeticExpression | FCharacter,
): FLogical {
  if (a instanceof FCharacter && b instanceof FCharacter) {
    return new FLogical(a.value < b.value);
  }

  const { c, d } = mix(a as ArithmeticExpression, b as ArithmeticExpression);

  if (c instanceof FByte && d instanceof FByte) {
    return new FLogical(byteToNumber(c.value) < byteToNumber(d.value));
  }
  if (c instanceof FComplex && d instanceof FComplex) {
    return new FLogical(
      c.value.r < d.value.r ||
        (c.value.r === d.value.r && c.value.i < d.value.i),
    );
  }
  if (c instanceof FInteger && d instanceof FInteger) {
    return new FLogical(c.value < d.value);
  }
  if (c instanceof FLogical && d instanceof FLogical) {
    return new FLogical(Number(c.value) < Number(d.value));
  }
  if (c instanceof FReal && d instanceof FReal) {
    return new FLogical(c.value < d.value);
  }
}

export function le(
  a: ArithmeticExpression | FCharacter,
  b: ArithmeticExpression | FCharacter,
): FLogical {
  if (a instanceof FCharacter && b instanceof FCharacter) {
    return new FLogical(a.value <= b.value);
  }

  const { c, d } = mix(a as ArithmeticExpression, b as ArithmeticExpression);

  if (c instanceof FByte && d instanceof FByte) {
    return new FLogical(byteToNumber(c.value) <= byteToNumber(d.value));
  }
  if (c instanceof FComplex && d instanceof FComplex) {
    return new FLogical(
      c.value.r < d.value.r ||
        (c.value.r === d.value.r && c.value.i <= d.value.i),
    );
  }
  if (c instanceof FInteger && d instanceof FInteger) {
    return new FLogical(c.value <= d.value);
  }
  if (c instanceof FLogical && d instanceof FLogical) {
    return new FLogical(Number(c.value) <= Number(d.value));
  }
  if (c instanceof FReal && d instanceof FReal) {
    return new FLogical(c.value <= d.value);
  }
}

export function gt(
  a: ArithmeticExpression | FCharacter,
  b: ArithmeticExpression | FCharacter,
): FLogical {
  if (a instanceof FCharacter && b instanceof FCharacter) {
    return new FLogical(a.value > b.value);
  }

  const { c, d } = mix(a as ArithmeticExpression, b as ArithmeticExpression);

  if (c instanceof FByte && d instanceof FByte) {
    return new FLogical(byteToNumber(c.value) > byteToNumber(d.value));
  }
  if (c instanceof FComplex && d instanceof FComplex) {
    return new FLogical(
      c.value.r > d.value.r ||
        (c.value.r === d.value.r && c.value.i > d.value.i),
    );
  }
  if (c instanceof FInteger && d instanceof FInteger) {
    return new FLogical(c.value > d.value);
  }
  if (c instanceof FLogical && d instanceof FLogical) {
    return new FLogical(Number(c.value) > Number(d.value));
  }
  if (c instanceof FReal && d instanceof FReal) {
    return new FLogical(c.value > d.value);
  }
}

export function ge(
  a: ArithmeticExpression | FCharacter,
  b: ArithmeticExpression | FCharacter,
): FLogical {
  if (a instanceof FCharacter && b instanceof FCharacter) {
    return new FLogical(a.value >= b.value);
  }

  const { c, d } = mix(a as ArithmeticExpression, b as ArithmeticExpression);

  if (c instanceof FByte && d instanceof FByte) {
    return new FLogical(byteToNumber(c.value) >= byteToNumber(d.value));
  }
  if (c instanceof FComplex && d instanceof FComplex) {
    return new FLogical(
      c.value.r > d.value.r ||
        (c.value.r === d.value.r && c.value.i >= d.value.i),
    );
  }
  if (c instanceof FInteger && d instanceof FInteger) {
    return new FLogical(c.value >= d.value);
  }
  if (c instanceof FLogical && d instanceof FLogical) {
    return new FLogical(Number(c.value) >= Number(d.value));
  }
  if (c instanceof FReal && d instanceof FReal) {
    return new FLogical(c.value >= d.value);
  }
}

export function concat(a: FCharacter, b: FCharacter): FCharacter {
  return new FCharacter(`${a.value}${b.value}`);
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
    const m = d.value.r * d.value.r + d.value.i * d.value.i;
    return new FComplex(
      {
        r: (c.value.r * d.value.r + c.value.i * d.value.i) / m,
        i: (c.value.i * d.value.r - c.value.r * d.value.i) / m,
      },
      {
        kind: kind as ComplexKind,
      },
    ) as Mix<A, B>;
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
    const m = Math.sqrt(c.value.r * c.value.r + c.value.i * c.value.i);
    const n = Math.atan2(c.value.i, c.value.r);
    const l = Math.log(m);

    const x = d.value.r * l - d.value.i * n;
    const y = d.value.i * l + d.value.r * n;
    const p = Math.exp(x);

    return new FComplex(
      {
        r: p * Math.cos(y),
        i: p * Math.sin(y),
      },
      {
        kind: kind as ComplexKind,
      },
    ) as Mix<A, B>;
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

export function uplus<A extends ArithmeticExpression>(a: A): A {
  const kind = getKind(a);

  if (a instanceof FByte) {
    return new FByte(byteToNumber(a.value)) as A;
  }

  if (a instanceof FComplex) {
    return new FComplex(
      {
        r: +a.value.r,
        i: +a.value.i,
      },
      { kind: kind as ComplexKind },
    ) as A;
  }

  if (a instanceof FInteger) {
    return new FInteger(+a.value, { kind: kind as IntegerKind }) as A;
  }

  if (a instanceof FLogical) {
    return new FLogical(a.value, { kind: kind as LogicalKind }) as A;
  }

  if (a instanceof FReal) {
    return new FReal(+a.value, { kind: kind as RealKind }) as A;
  }
}

export function uminus<A extends ArithmeticExpression>(a: A): A {
  const kind = getKind(a);

  if (a instanceof FByte) {
    return new FByte(-byteToNumber(a.value)) as A;
  }

  if (a instanceof FComplex) {
    return new FComplex(
      {
        r: -a.value.r,
        i: -a.value.i,
      },
      { kind: kind as ComplexKind },
    ) as A;
  }

  if (a instanceof FInteger) {
    return new FInteger(-a.value, { kind: kind as IntegerKind }) as A;
  }

  if (a instanceof FLogical) {
    return new FLogical(!a.value, { kind: kind as LogicalKind }) as A;
  }

  if (a instanceof FReal) {
    return new FReal(-a.value, { kind: kind as RealKind }) as A;
  }
}

export function not(a: FLogical): FLogical {
  return new FLogical(!a.value, { kind: a.kind });
}

export function and<A extends FLogical, B extends FLogical>(
  a: A,
  b: B,
): FLogical {
  const { c, d } = mix(a, b);
  const kind = getKind(c);

  if (c instanceof FLogical && d instanceof FLogical) {
    return new FLogical(c.value && d.value, { kind: kind as LogicalKind });
  }
}

export function or<A extends FLogical, B extends FLogical>(
  a: A,
  b: B,
): FLogical {
  const { c, d } = mix(a, b);
  const kind = getKind(c);

  if (c instanceof FLogical && d instanceof FLogical) {
    return new FLogical(c.value || d.value, { kind: kind as LogicalKind });
  }
}

export function neqv<A extends FLogical, B extends FLogical>(
  a: A,
  b: B,
): FLogical {
  const { c, d } = mix(a, b);
  const kind = getKind(c);

  if (c instanceof FLogical && d instanceof FLogical) {
    return new FLogical(c.value !== d.value, { kind: kind as LogicalKind });
  }
}

export function xor<A extends FLogical, B extends FLogical>(
  a: A,
  b: B,
): FLogical {
  const { c, d } = mix(a, b);
  const kind = getKind(c);

  if (c instanceof FLogical && d instanceof FLogical) {
    return new FLogical(c.value !== d.value, { kind: kind as LogicalKind });
  }
}

export function eqv<A extends FLogical, B extends FLogical>(
  a: A,
  b: B,
): FLogical {
  const { c, d } = mix(a, b);
  const kind = getKind(c);

  if (c instanceof FLogical && d instanceof FLogical) {
    return new FLogical(c.value === d.value, { kind: kind as LogicalKind });
  }
}
