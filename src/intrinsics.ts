import assert from 'assert';
import { FCharacter, FComplex, FInteger, FLogical, FReal } from './datatypes';

type RealUnaryOperation = (value: number) => number;

function complexResult(value: Complex, source: FComplex): FComplex {
  return new FComplex(value, {
    standard: source.standard,
    kind: source.kind,
  });
}

function realResult(value: number, source: FReal): FReal {
  return new FReal(value, {
    standard: source.standard,
    kind: source.kind,
  });
}

function integerResult(value: number, source: FInteger): FInteger {
  return new FInteger(value, {
    standard: source.standard,
    kind: source.kind,
  });
}

function complexRealKind(source: FComplex): RealKind | undefined {
  switch (source.kind) {
    case 8:
    case undefined:
      return 4;
    case 16:
      return 8;
    case 32:
      return 16;
  }
}

function realUnary(
  value: FReal,
  operation: RealUnaryOperation,
): FReal {
  return realResult(operation(value.value), value);
}

function roundNearestAwayFromZero(value: number): number {
  return Math.sign(value) * Math.floor(Math.abs(value) + 0.5);
}

function effectiveKind(value: FInteger | FReal): number {
  return value.kind ?? 4;
}

function assertSpecificKind(
  value: FInteger | FReal | FComplex,
  kind: number,
  name: string,
): void {
  const actual =
    value instanceof FInteger || value instanceof FReal
      ? effectiveKind(value)
      : (value.kind ?? 8);
  assert(actual === kind, `${name} requires kind ${kind}`);
}

function assertMatchingNumericTypes(
  a: FInteger | FReal,
  b: FInteger | FReal,
  name: string,
): void {
  assert(
    a.constructor === b.constructor && effectiveKind(a) === effectiveKind(b),
    `${name} operands must have the same numeric type and kind`,
  );
}

function characterResult(characterCode: number): FCharacter {
  assert(
    Number.isInteger(characterCode) && characterCode >= 0 && characterCode <= 127,
    'Character code must be an ASCII integer from 0 through 127',
  );
  return new FCharacter(String.fromCharCode(characterCode), { len: 1 });
}

function findSetPosition(
  string: string,
  set: string,
  back: boolean,
  invert: boolean,
): number {
  if (string.length === 0) {
    return 0;
  }

  const start = back ? string.length - 1 : 0;
  const end = back ? -1 : string.length;
  const step = back ? -1 : 1;
  for (let index = start; index !== end; index += step) {
    const isInSet = set.includes(string[index]);
    if (invert ? !isInSet : isInSet) {
      return index + 1;
    }
  }
  return 0;
}

export function achar(code: FInteger): FCharacter {
  return characterResult(code.value);
}

export function char(code: FInteger): FCharacter {
  return characterResult(code.value);
}

export function iachar(value: FCharacter): FInteger {
  assert(value.value.length > 0, 'IACHAR requires a non-empty character value');
  return new FInteger(value.value.charCodeAt(0), {
    standard: value.standard,
    kind: 4,
  });
}

export function ichar(value: FCharacter): FInteger {
  assert(value.value.length > 0, 'ICHAR requires a non-empty character value');
  return new FInteger(value.value.charCodeAt(0), {
    standard: value.standard,
    kind: 4,
  });
}

export function len(value: FCharacter): FInteger {
  return new FInteger(value.len ?? value.value.length, {
    standard: value.standard,
    kind: 4,
  });
}

export function index(
  string: FCharacter,
  substring: FCharacter,
  back: FLogical = new FLogical(false),
): FInteger {
  const source = string.value;
  const target = substring.value;
  let position: number;
  if (target.length === 0) {
    position = source.length + 1;
  } else if (back.value) {
    position = source.lastIndexOf(target) + 1;
  } else {
    position = source.indexOf(target) + 1;
  }
  return new FInteger(position, { standard: string.standard, kind: 4 });
}

export function scan(
  string: FCharacter,
  set: FCharacter,
  back: FLogical = new FLogical(false),
): FInteger {
  return new FInteger(
    findSetPosition(string.value, set.value, back.value, false),
    { standard: string.standard, kind: 4 },
  );
}

export function verify(
  string: FCharacter,
  set: FCharacter,
  back: FLogical = new FLogical(false),
): FInteger {
  return new FInteger(
    findSetPosition(string.value, set.value, back.value, true),
    { standard: string.standard, kind: 4 },
  );
}

export function abs(value: FInteger): FInteger;
export function abs(value: FReal): FReal;
export function abs(value: FComplex): FReal;
export function abs(value: FInteger | FReal | FComplex): FInteger | FReal {
  if (value instanceof FInteger) {
    return integerResult(Math.abs(value.value), value);
  }
  if (value instanceof FReal) {
    return realResult(Math.abs(value.value), value);
  }
  if (value instanceof FComplex) {
    return new FReal(Math.hypot(value.value.r, value.value.i), {
      standard: value.standard,
      kind: complexRealKind(value),
    });
  }
  assert.fail('ABS requires an integer, real, or complex value');
}

export function iabs(value: FInteger): FInteger {
  assertSpecificKind(value, 4, 'IABS');
  return integerResult(Math.abs(value.value), value);
}

export function dabs(value: FReal): FReal {
  assertSpecificKind(value, 8, 'DABS');
  return realResult(Math.abs(value.value), value);
}

export function cabs(value: FComplex): FReal {
  assertSpecificKind(value, 8, 'CABS');
  return new FReal(Math.hypot(value.value.r, value.value.i), {
    standard: value.standard,
    kind: 4,
  });
}

export function aint(value: FReal): FReal {
  return realResult(Math.trunc(value.value), value);
}

export function anint(value: FReal): FReal {
  return realResult(roundNearestAwayFromZero(value.value), value);
}

export function nint(value: FReal): FInteger {
  return new FInteger(roundNearestAwayFromZero(value.value), {
    standard: value.standard,
    kind: 4,
  });
}

export function sign(value: FInteger, signSource: FInteger): FInteger;
export function sign(value: FReal, signSource: FReal): FReal;
export function sign(
  value: FInteger | FReal,
  signSource: FInteger | FReal,
): FInteger | FReal {
  assertMatchingNumericTypes(value, signSource, 'SIGN');
  const magnitude = Math.abs(value.value);
  const result = signSource.value < 0 ? -magnitude : magnitude;
  if (value instanceof FInteger) {
    return integerResult(result, value);
  }
  return realResult(result, value);
}

export function isign(value: FInteger, signSource: FInteger): FInteger {
  assertSpecificKind(value, 4, 'ISIGN');
  assertSpecificKind(signSource, 4, 'ISIGN');
  return sign(value, signSource);
}

export function dsign(value: FReal, signSource: FReal): FReal {
  assertSpecificKind(value, 8, 'DSIGN');
  assertSpecificKind(signSource, 8, 'DSIGN');
  return sign(value, signSource);
}

export function dim(value: FInteger, subtrahend: FInteger): FInteger;
export function dim(value: FReal, subtrahend: FReal): FReal;
export function dim(
  value: FInteger | FReal,
  subtrahend: FInteger | FReal,
): FInteger | FReal {
  assertMatchingNumericTypes(value, subtrahend, 'DIM');
  const difference = Math.max(value.value - subtrahend.value, 0);
  if (value instanceof FInteger) {
    return integerResult(difference, value);
  }
  return realResult(difference, value);
}

export function idim(value: FInteger, subtrahend: FInteger): FInteger {
  assertSpecificKind(value, 4, 'IDIM');
  assertSpecificKind(subtrahend, 4, 'IDIM');
  return integerResult(Math.max(value.value - subtrahend.value, 0), value);
}

export function adim(value: FReal, subtrahend: FReal): FReal {
  assertSpecificKind(value, 4, 'ADIM');
  assertSpecificKind(subtrahend, 4, 'ADIM');
  assertMatchingNumericTypes(value, subtrahend, 'ADIM');
  return realResult(Math.max(value.value - subtrahend.value, 0), value);
}

export function ddim(value: FReal, subtrahend: FReal): FReal {
  assertSpecificKind(value, 8, 'DDIM');
  assertSpecificKind(subtrahend, 8, 'DDIM');
  assertMatchingNumericTypes(value, subtrahend, 'DDIM');
  return realResult(Math.max(value.value - subtrahend.value, 0), value);
}

export function mod(value: FInteger, divisor: FInteger): FInteger;
export function mod(value: FReal, divisor: FReal): FReal;
export function mod(
  value: FInteger | FReal,
  divisor: FInteger | FReal,
): FInteger | FReal {
  assertMatchingNumericTypes(value, divisor, 'MOD');
  assert(divisor.value !== 0, 'MOD divisor must not be zero');
  const remainder =
    value instanceof FInteger
      ? value.value % divisor.value
      : value.value - Math.trunc(value.value / divisor.value) * divisor.value;
  if (value instanceof FInteger) {
    return integerResult(remainder, value);
  }
  return realResult(remainder, value);
}

export function amod(value: FReal, divisor: FReal): FReal {
  assertSpecificKind(value, 4, 'AMOD');
  assertSpecificKind(divisor, 4, 'AMOD');
  return mod(value, divisor);
}

export function dmod(value: FReal, divisor: FReal): FReal {
  assertSpecificKind(value, 8, 'DMOD');
  assertSpecificKind(divisor, 8, 'DMOD');
  return mod(value, divisor);
}

export function max(value: FInteger, ...others: FInteger[]): FInteger;
export function max(value: FReal, ...others: FReal[]): FReal;
export function max(
  value: FInteger | FReal,
  ...others: (FInteger | FReal)[]
): FInteger | FReal {
  assert(others.length > 0, 'MAX requires at least two arguments');
  assert(
    others.every(
      (other) =>
        other.constructor === value.constructor &&
        effectiveKind(other) === effectiveKind(value),
    ),
    'MAX arguments must have the same numeric type and kind',
  );
  const result = Math.max(value.value, ...others.map((other) => other.value));
  if (value instanceof FInteger) {
    return integerResult(result, value);
  }
  return realResult(result, value);
}

export function min(value: FInteger, ...others: FInteger[]): FInteger;
export function min(value: FReal, ...others: FReal[]): FReal;
export function min(
  value: FInteger | FReal,
  ...others: (FInteger | FReal)[]
): FInteger | FReal {
  assert(others.length > 0, 'MIN requires at least two arguments');
  assert(
    others.every(
      (other) =>
        other.constructor === value.constructor &&
        effectiveKind(other) === effectiveKind(value),
    ),
    'MIN arguments must have the same numeric type and kind',
  );
  const result = Math.min(value.value, ...others.map((other) => other.value));
  if (value instanceof FInteger) {
    return integerResult(result, value);
  }
  return realResult(result, value);
}

export function sqrt(value: FReal): FReal {
  return realUnary(value, Math.sqrt);
}

export function exp(value: FReal): FReal {
  return realUnary(value, Math.exp);
}

export function log(value: FReal): FReal {
  return realUnary(value, Math.log);
}

export function alog(value: FReal): FReal {
  assertSpecificKind(value, 4, 'ALOG');
  return realUnary(value, Math.log);
}

export function dlog(value: FReal): FReal {
  assertSpecificKind(value, 8, 'DLOG');
  return realUnary(value, Math.log);
}

export function log10(value: FReal): FReal {
  return realUnary(value, Math.log10);
}

export function alog10(value: FReal): FReal {
  assertSpecificKind(value, 4, 'ALOG10');
  return realUnary(value, Math.log10);
}

export function dlog10(value: FReal): FReal {
  assertSpecificKind(value, 8, 'DLOG10');
  return realUnary(value, Math.log10);
}

export function dexp(value: FReal): FReal {
  assertSpecificKind(value, 8, 'DEXP');
  return realUnary(value, Math.exp);
}

export function sin(value: FReal): FReal {
  return realUnary(value, Math.sin);
}

export function dsin(value: FReal): FReal {
  assertSpecificKind(value, 8, 'DSIN');
  return realUnary(value, Math.sin);
}

export function cos(value: FReal): FReal {
  return realUnary(value, Math.cos);
}

export function dcos(value: FReal): FReal {
  assertSpecificKind(value, 8, 'DCOS');
  return realUnary(value, Math.cos);
}

export function tan(value: FReal): FReal {
  return realUnary(value, Math.tan);
}

export function dtan(value: FReal): FReal {
  assertSpecificKind(value, 8, 'DTAN');
  return realUnary(value, Math.tan);
}

export function asin(value: FReal): FReal {
  return realUnary(value, Math.asin);
}

export function dasin(value: FReal): FReal {
  assertSpecificKind(value, 8, 'DASIN');
  return realUnary(value, Math.asin);
}

export function acos(value: FReal): FReal {
  return realUnary(value, Math.acos);
}

export function dacos(value: FReal): FReal {
  assertSpecificKind(value, 8, 'DACOS');
  return realUnary(value, Math.acos);
}

export function atan(value: FReal): FReal {
  return realUnary(value, Math.atan);
}

export function datan(value: FReal): FReal {
  assertSpecificKind(value, 8, 'DATAN');
  return realUnary(value, Math.atan);
}

export function atan2(y: FReal, x: FReal): FReal {
  assert(
    effectiveKind(y) === effectiveKind(x),
    'ATAN2 operands must have the same kind',
  );
  return realResult(Math.atan2(y.value, x.value), y);
}

export function datan2(y: FReal, x: FReal): FReal {
  assertSpecificKind(y, 8, 'DATAN2');
  assertSpecificKind(x, 8, 'DATAN2');
  assertMatchingNumericTypes(y, x, 'DATAN2');
  return realResult(Math.atan2(y.value, x.value), y);
}

export function sinh(value: FReal): FReal {
  return realUnary(value, Math.sinh);
}

export function cosh(value: FReal): FReal {
  return realUnary(value, Math.cosh);
}

export function tanh(value: FReal): FReal {
  return realUnary(value, Math.tanh);
}

export function dsqrt(value: FReal): FReal {
  assertSpecificKind(value, 8, 'DSQRT');
  return realUnary(value, Math.sqrt);
}

export function aimag(value: FComplex): FReal {
  return new FReal(value.value.i, {
    standard: value.standard,
    kind: complexRealKind(value),
  });
}

export function conjg(value: FComplex): FComplex {
  return complexResult(
    { r: value.value.r, i: -value.value.i },
    value,
  );
}

export function csqrt(value: FComplex): FComplex {
  const { r, i } = value.value;
  const magnitude = Math.hypot(r, i);
  const realPart = Math.sqrt(Math.max(magnitude / 2 + r / 2, 0));
  const imaginaryMagnitude = Math.sqrt(Math.max(magnitude / 2 - r / 2, 0));
  const imaginaryPart =
    i < 0 || Object.is(i, -0) ? -imaginaryMagnitude : imaginaryMagnitude;
  return complexResult({ r: realPart, i: imaginaryPart }, value);
}

export function cexp(value: FComplex): FComplex {
  const { r, i } = value.value;
  const magnitude = Math.exp(r);
  return complexResult(
    { r: magnitude * Math.cos(i), i: magnitude * Math.sin(i) },
    value,
  );
}

export function clog(value: FComplex): FComplex {
  const { r, i } = value.value;
  return complexResult(
    { r: Math.log(Math.hypot(r, i)), i: Math.atan2(i, r) },
    value,
  );
}

export function csin(value: FComplex): FComplex {
  const { r, i } = value.value;
  return complexResult(
    { r: Math.sin(r) * Math.cosh(i), i: Math.cos(r) * Math.sinh(i) },
    value,
  );
}

export function ccos(value: FComplex): FComplex {
  const { r, i } = value.value;
  return complexResult(
    { r: Math.cos(r) * Math.cosh(i), i: -Math.sin(r) * Math.sinh(i) },
    value,
  );
}

export function dprod(a: FReal, b: FReal): FReal {
  return new FReal(a.value * b.value, {
    standard: a.standard,
    kind: 8,
  });
}
