import {
  ArithmeticExpression,
  FByte,
  FComplex,
  FInteger,
  FLogical,
  FReal,
} from './datatypes';
import assert from 'assert';
import { isRangedInteger } from './utils';
import {
  assertComplexKind,
  assertIntegerKind,
  assertLogicalKind,
  assertRealKind,
} from './error';

// prettier-ignore
export type Mix<
  A extends ArithmeticExpression,
  B extends ArithmeticExpression,
> =
A extends FByte
  ? B extends FByte ? FByte
  : B extends FComplex ? FComplex
  : B extends FInteger ? FInteger
  : B extends FLogical ? FLogical
  : B extends FReal ? FReal : never
: A extends FComplex
  ? B extends FByte ? FComplex
  : B extends FComplex ? FComplex
  : B extends FInteger ? FComplex
  : B extends FLogical ? FComplex
  : B extends FReal ? FComplex : never
: A extends FInteger
  ? B extends FByte ? FInteger
  : B extends FComplex ? FComplex
  : B extends FInteger ? FInteger
  : B extends FLogical ? FInteger
  : B extends FReal ? FReal : never
: A extends FLogical
  ? B extends FByte ? FLogical
  : B extends FComplex ? FComplex
  : B extends FInteger ? FInteger
  : B extends FLogical ? FLogical
  : B extends FReal ? FReal : never
: A extends FReal
  ? B extends FByte ? FReal
  : B extends FComplex ? FComplex
  : B extends FInteger ? FReal
  : B extends FLogical ? FReal
  : B extends FReal ? FReal : never
: never;

export function byteToNumber(b: Byte): number {
  return typeof b === 'string' ? b.charCodeAt(0) : +b;
}

export function numberToByte(n: number): Byte {
  assert(isRangedInteger(n, 8, true));
  return String.fromCharCode(n);
}

export function numberToComplex(n: number): Complex {
  return { r: n, i: 0 };
}

export function getKind(e: ArithmeticExpression): number {
  if (e instanceof FByte) {
    return 1;
  }
  if (e instanceof FComplex) {
    return e.kind ?? 8;
  }
  if (e instanceof FInteger) {
    return e.kind ?? 4;
  }
  if (e instanceof FLogical) {
    return e.kind ?? 4;
  }
  if (e instanceof FReal) {
    return e.kind ?? 4;
  }
  assert.fail('Unsupported arithmetic expression');
}

function getRank(e: ArithmeticExpression): number {
  const k = getKind(e);
  if (e instanceof FByte) {
    return 1;
  }
  if (e instanceof FComplex) {
    return 9 + Math.log2(k / 8);
  }
  if (e instanceof FInteger) {
    return 4 + Math.log2(k / 4);
  }
  if (e instanceof FLogical) {
    return k === 8 ? 6 : 1 + Math.log2(k);
  }
  if (e instanceof FReal) {
    return 6 + Math.log2(k / 4);
  }
  assert.fail('Unsupported arithmetic expression');
}

type PromotionTarget =
  | typeof FComplex
  | typeof FInteger
  | typeof FLogical
  | typeof FReal;

function toNumber(e: ArithmeticExpression): number {
  if (e instanceof FByte) {
    return byteToNumber(e.value);
  }
  if (e instanceof FInteger || e instanceof FReal) {
    return e.value;
  }
  if (e instanceof FLogical) {
    return e.value ? 1 : 0;
  }
  assert.fail('Cannot convert a complex value to a real number');
}

function promote(
  e: ArithmeticExpression,
  target: PromotionTarget,
  kind: number,
): ArithmeticExpression {
  if (target === FComplex) {
    const value = e instanceof FComplex ? e.value : numberToComplex(toNumber(e));
    return new FComplex(value, { kind: kind as ComplexKind });
  }
  if (target === FInteger) {
    return new FInteger(toNumber(e), { kind: kind as IntegerKind });
  }
  if (target === FLogical) {
    const value = e instanceof FLogical ? e.value : Boolean(e.value);
    return new FLogical(value, { kind: kind as LogicalKind });
  }
  if (target === FReal) {
    return new FReal(toNumber(e), { kind: kind as RealKind });
  }
  assert.fail('Unsupported promotion target');
}

export function mix<
  A extends ArithmeticExpression,
  B extends ArithmeticExpression,
>(a: A, b: B): { c: Mix<A, B>; d: Mix<A, B> } {
  const rankA = getRank(a);
  const rankB = getRank(b);
  const resultRank = Math.max(rankA, rankB);
  const resultKind = Math.max(getKind(a), getKind(b));

  let c: Mix<A, B> | undefined;
  let d: Mix<A, B> | undefined;

  if (rankA > rankB) {
    if (a instanceof FComplex) {
      assertComplexKind(resultKind);
      c = promote(a, FComplex, resultKind) as Mix<A, B>;
      d = promote(b, FComplex, resultKind) as Mix<A, B>;
    }
    if (a instanceof FInteger) {
      assertIntegerKind(resultKind);
      c = promote(a, FInteger, resultKind) as Mix<A, B>;
      d = promote(b, FInteger, resultKind) as Mix<A, B>;
    }
    if (a instanceof FLogical) {
      assertLogicalKind(resultKind);
      c = promote(a, FLogical, resultKind) as Mix<A, B>;
      d = promote(b, FLogical, resultKind) as Mix<A, B>;
    }
    if (a instanceof FReal) {
      assertRealKind(resultKind);
      c = promote(a, FReal, resultKind) as Mix<A, B>;
      d = promote(b, FReal, resultKind) as Mix<A, B>;
    }
  } else if (rankA < rankB) {
    if (b instanceof FComplex) {
      assertComplexKind(resultKind);
      c = promote(a, FComplex, resultKind) as Mix<A, B>;
      d = promote(b, FComplex, resultKind) as Mix<A, B>;
    }
    if (b instanceof FInteger) {
      assertIntegerKind(resultKind);
      c = promote(a, FInteger, resultKind) as Mix<A, B>;
      d = promote(b, FInteger, resultKind) as Mix<A, B>;
    }
    if (b instanceof FLogical) {
      assertLogicalKind(resultKind);
      c = promote(a, FLogical, resultKind) as Mix<A, B>;
      d = promote(b, FLogical, resultKind) as Mix<A, B>;
    }
    if (b instanceof FReal) {
      assertRealKind(resultKind);
      c = promote(a, FReal, resultKind) as Mix<A, B>;
      d = promote(b, FReal, resultKind) as Mix<A, B>;
    }
  } else {
    if (a instanceof FInteger && b instanceof FInteger) {
      assertIntegerKind(resultKind);
      c = promote(a, FInteger, resultKind) as Mix<A, B>;
      d = promote(b, FInteger, resultKind) as Mix<A, B>;
    } else if (a instanceof FInteger && b instanceof FLogical) {
      assertIntegerKind(resultKind);
      c = promote(a, FInteger, resultKind) as Mix<A, B>;
      d = promote(b, FInteger, resultKind) as Mix<A, B>;
    } else if (a instanceof FInteger && b instanceof FReal) {
      assertRealKind(resultKind);
      c = promote(a, FReal, resultKind) as Mix<A, B>;
      d = promote(b, FReal, resultKind) as Mix<A, B>;
    } else if (a instanceof FLogical && b instanceof FInteger) {
      assertIntegerKind(resultKind);
      c = promote(a, FInteger, resultKind) as Mix<A, B>;
      d = promote(b, FInteger, resultKind) as Mix<A, B>;
    } else if (a instanceof FLogical && b instanceof FLogical) {
      assertLogicalKind(resultKind);
      c = promote(a, FLogical, resultKind) as Mix<A, B>;
      d = promote(b, FLogical, resultKind) as Mix<A, B>;
    } else if (a instanceof FLogical && b instanceof FReal) {
      assertRealKind(resultKind);
      c = promote(a, FReal, resultKind) as Mix<A, B>;
      d = promote(b, FReal, resultKind) as Mix<A, B>;
    } else if (a instanceof FReal && b instanceof FInteger) {
      assertRealKind(resultKind);
      c = promote(a, FReal, resultKind) as Mix<A, B>;
      d = promote(b, FReal, resultKind) as Mix<A, B>;
    } else if (a instanceof FReal && b instanceof FLogical) {
      assertRealKind(resultKind);
      c = promote(a, FReal, resultKind) as Mix<A, B>;
      d = promote(b, FReal, resultKind) as Mix<A, B>;
    } else if (a instanceof FReal && b instanceof FReal) {
      assertRealKind(resultKind);
      c = promote(a, FReal, resultKind) as Mix<A, B>;
      d = promote(b, FReal, resultKind) as Mix<A, B>;
    } else {
      c = a as unknown as Mix<A, B>;
      d = b as unknown as Mix<A, B>;
    }
  }

  assert(c !== undefined);
  assert(d !== undefined);
  assert(getRank(c) === resultRank);
  assert(getRank(d) === resultRank);
  return { c, d };
}
