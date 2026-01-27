import {
  ArithmeticExpression,
  FByte,
  FComplex,
  FInteger,
  FLogical,
  FReal,
} from './datatypes';
import { byteToNumber, getKind, mix, Mix, numberToByte } from './mixed';

export function add<
  A extends ArithmeticExpression,
  B extends ArithmeticExpression,
>(a: A, b: B): Mix<A, B> {
  const { c, d } = mix(a, b);
  const kind = getKind(c);

  if (c instanceof FByte && d instanceof FByte) {
    return new FByte(
      numberToByte(byteToNumber(c.value) + byteToNumber(d.value)),
      { ...FByte.DefaultOptions },
    ) as Mix<A, B>;
  }
  if (c instanceof FComplex && d instanceof FComplex) {
    return new FComplex(
      {
        r: c.value.r + d.value.r,
        i: c.value.i + d.value.i,
      },
      { ...FComplex.DefaultOptions, kind: kind as ComplexKind },
    ) as Mix<A, B>;
  }
  if (c instanceof FInteger && d instanceof FInteger) {
    return new FInteger(c.value + d.value, {
      ...FInteger.DefaultOptions,
      kind: kind as IntegerKind,
    }) as Mix<A, B>;
  }
  if (c instanceof FLogical && d instanceof FLogical) {
    return new FLogical(Boolean(c.value || d.value), {
      ...FLogical.DefaultOptions,
      kind: kind as LogicalKind,
    }) as Mix<A, B>;
  }
  if (c instanceof FReal && d instanceof FReal) {
    return new FReal(c.value + d.value, {
      ...FReal.DefaultOptions,
      kind: kind as RealKind,
    }) as Mix<A, B>;
  }
}
