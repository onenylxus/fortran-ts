import assert from 'assert';
import {
  ArithmeticExpression,
  FByte,
  FByteArray,
  FCharacter,
  FCharacterArray,
  FComplex,
  FComplexArray,
  FInteger,
  FIntegerArray,
  FLogical,
  FLogicalArray,
  FReal,
  FRealArray,
} from './datatypes';
import { byteToNumber, getKind, mix, Mix, numberToByte } from './mixed';
import { getDim } from './utils';

type ArrayExpression =
  | FByteArray
  | FCharacterArray
  | FComplexArray
  | FIntegerArray
  | FLogicalArray
  | FRealArray;

type ScalarExpression = ArithmeticExpression | FCharacter;
type OperatorOperand = ArrayExpression | ScalarExpression;
type ArithmeticArray =
  | FByteArray
  | FComplexArray
  | FIntegerArray
  | FLogicalArray
  | FRealArray;
type ScalarOperation = (
  left: ScalarExpression,
  right: ScalarExpression,
) => ScalarExpression;

function isArrayExpression(value: OperatorOperand): value is ArrayExpression {
  return (
    value instanceof FByteArray ||
    value instanceof FCharacterArray ||
    value instanceof FComplexArray ||
    value instanceof FIntegerArray ||
    value instanceof FLogicalArray ||
    value instanceof FRealArray
  );
}

function createArrayExpression(
  values: FortranArray<unknown>,
  shape: number[],
  sample: ScalarExpression,
): ArrayExpression {
  const dim = getDim(values);
  const bounds = shape.map((extent) => [1, extent] as [number, number]);

  if (sample instanceof FByte) {
    return new FByteArray(values as FortranArray<Byte>, {
      standard: sample.standard,
      dim,
      bounds,
    });
  }
  if (sample instanceof FCharacter) {
    return new FCharacterArray(values as FortranArray<string>, {
      standard: sample.standard,
      len: sample.len,
      dim,
      bounds,
    });
  }
  if (sample instanceof FComplex) {
    return new FComplexArray(values as FortranArray<Complex>, {
      standard: sample.standard,
      kind: sample.kind,
      dim,
      bounds,
    });
  }
  if (sample instanceof FInteger) {
    return new FIntegerArray(values as FortranArray<number>, {
      standard: sample.standard,
      kind: sample.kind,
      dim,
      bounds,
    });
  }
  if (sample instanceof FLogical) {
    return new FLogicalArray(values as FortranArray<boolean>, {
      standard: sample.standard,
      kind: sample.kind,
      dim,
      bounds,
    });
  }
  if (sample instanceof FReal) {
    return new FRealArray(values as FortranArray<number>, {
      standard: sample.standard,
      kind: sample.kind,
      dim,
      bounds,
    });
  }
  assert.fail('Unsupported array operation result');
}

function applyArrayOperation(
  left: OperatorOperand,
  right: OperatorOperand,
  operation: ScalarOperation,
): ArrayExpression | undefined {
  const leftArray = isArrayExpression(left) ? left : undefined;
  const rightArray = isArrayExpression(right) ? right : undefined;
  if (leftArray === undefined && rightArray === undefined) {
    return undefined;
  }

  const template = leftArray ?? rightArray!;
  const shape = template.dim;
  for (const array of [leftArray, rightArray]) {
    if (array !== undefined) {
      assert(
        array.rank === template.rank &&
          array.dim.every((extent, index) => extent === shape[index]),
        'Fortran array operands must have conformable shapes',
      );
    }
  }

  const flatResults: ScalarExpression[] = [];
  const indices = Array<number>(shape.length);
  const values = (dimension: number): FortranArray<unknown> | unknown => {
    if (dimension === shape.length) {
      const leftValue = leftArray
        ? leftArray.getElement(
            ...indices.map(
              (index, axis) => leftArray.lowerBounds[axis] + index,
            ),
          )
        : left;
      const rightValue = rightArray
        ? rightArray.getElement(
            ...indices.map(
              (index, axis) => rightArray.lowerBounds[axis] + index,
            ),
          )
        : right;
      const result = operation(
        leftValue as ScalarExpression,
        rightValue as ScalarExpression,
      );
      flatResults.push(result);
      return result.value;
    }
    return Array.from({ length: shape[dimension] }, (_, index) => {
      indices[dimension] = index;
      return values(dimension + 1);
    });
  };

  const resultValues = values(0) as FortranArray<unknown>;
  return createArrayExpression(resultValues, shape, flatResults[0]);
}

function compareCharacters(a: FCharacter, b: FCharacter): number {
  const length = Math.max(a.value.length, b.value.length);
  const left = a.value.padEnd(length, ' ');
  const right = b.value.padEnd(length, ' ');

  if (left < right) {
    return -1;
  }
  if (left > right) {
    return 1;
  }
  return 0;
}

function assertOrderable(
  a: ArithmeticExpression | FCharacter,
  b: ArithmeticExpression | FCharacter,
): void {
  assert(
    !(a instanceof FComplex || b instanceof FComplex),
    'Ordering comparisons are not supported for complex values',
  );
}

export function eq(a: FCharacter, b: FCharacter): FLogical;
export function eq<
  A extends ArithmeticExpression,
  B extends ArithmeticExpression,
>(a: A, b: B): FLogical;
export function eq(
  a: FCharacter | FCharacterArray,
  b: FCharacter | FCharacterArray,
): FLogicalArray;
export function eq(
  a: ArithmeticExpression | ArithmeticArray,
  b: ArithmeticExpression | ArithmeticArray,
): FLogicalArray;
export function eq(
  a: OperatorOperand,
  b: OperatorOperand,
): FLogical | FLogicalArray {
  const arrayResult = applyArrayOperation(a, b, (left, right) =>
    eq(left as ArithmeticExpression | FCharacter, right as ArithmeticExpression | FCharacter),
  );
  if (arrayResult !== undefined) {
    assert(arrayResult instanceof FLogicalArray);
    return arrayResult;
  }

  if (a instanceof FCharacter && b instanceof FCharacter) {
    return new FLogical(compareCharacters(a, b) === 0, {
      standard: a.standard,
    });
  }

  const { c, d } = mix(
    a as ArithmeticExpression,
    b as ArithmeticExpression,
  );

  if (c instanceof FByte && d instanceof FByte) {
    return new FLogical(byteToNumber(c.value) === byteToNumber(d.value), {
      standard: c.standard,
    });
  }
  if (c instanceof FComplex && d instanceof FComplex) {
    return new FLogical(c.value.r === d.value.r && c.value.i === d.value.i, {
      standard: c.standard,
    });
  }
  if (c instanceof FInteger && d instanceof FInteger) {
    return new FLogical(c.value === d.value, { standard: c.standard });
  }
  if (c instanceof FLogical && d instanceof FLogical) {
    return new FLogical(c.value === d.value, { standard: c.standard });
  }
  if (c instanceof FReal && d instanceof FReal) {
    return new FLogical(c.value === d.value, { standard: c.standard });
  }
  assert.fail('Unsupported arithmetic operands');
}

export function lt(
  a: ArithmeticExpression | FCharacter,
  b: ArithmeticExpression | FCharacter,
): FLogical;
export function lt(
  a: FCharacter | FCharacterArray,
  b: FCharacter | FCharacterArray,
): FLogicalArray;
export function lt(
  a: ArithmeticExpression | ArithmeticArray,
  b: ArithmeticExpression | ArithmeticArray,
): FLogicalArray;
export function lt(
  a: OperatorOperand,
  b: OperatorOperand,
): FLogical | FLogicalArray {
  const arrayResult = applyArrayOperation(a, b, (left, right) =>
    lt(left as ArithmeticExpression | FCharacter, right as ArithmeticExpression | FCharacter),
  );
  if (arrayResult !== undefined) {
    assert(arrayResult instanceof FLogicalArray);
    return arrayResult;
  }

  assertOrderable(
    a as ArithmeticExpression | FCharacter,
    b as ArithmeticExpression | FCharacter,
  );
  if (a instanceof FCharacter && b instanceof FCharacter) {
    return new FLogical(compareCharacters(a, b) < 0, {
      standard: a.standard,
    });
  }

  const { c, d } = mix(a as ArithmeticExpression, b as ArithmeticExpression);

  if (c instanceof FByte && d instanceof FByte) {
    return new FLogical(byteToNumber(c.value) < byteToNumber(d.value), {
      standard: c.standard,
    });
  }
  if (c instanceof FInteger && d instanceof FInteger) {
    return new FLogical(c.value < d.value, { standard: c.standard });
  }
  if (c instanceof FLogical && d instanceof FLogical) {
    return new FLogical(Number(c.value) < Number(d.value), {
      standard: c.standard,
    });
  }
  if (c instanceof FReal && d instanceof FReal) {
    return new FLogical(c.value < d.value, { standard: c.standard });
  }
  assert.fail('Unsupported arithmetic operands');
}

export function le(
  a: ArithmeticExpression | FCharacter,
  b: ArithmeticExpression | FCharacter,
): FLogical;
export function le(
  a: FCharacter | FCharacterArray,
  b: FCharacter | FCharacterArray,
): FLogicalArray;
export function le(
  a: ArithmeticExpression | ArithmeticArray,
  b: ArithmeticExpression | ArithmeticArray,
): FLogicalArray;
export function le(
  a: OperatorOperand,
  b: OperatorOperand,
): FLogical | FLogicalArray {
  const arrayResult = applyArrayOperation(a, b, (left, right) =>
    le(left as ArithmeticExpression | FCharacter, right as ArithmeticExpression | FCharacter),
  );
  if (arrayResult !== undefined) {
    assert(arrayResult instanceof FLogicalArray);
    return arrayResult;
  }

  assertOrderable(
    a as ArithmeticExpression | FCharacter,
    b as ArithmeticExpression | FCharacter,
  );
  if (a instanceof FCharacter && b instanceof FCharacter) {
    return new FLogical(compareCharacters(a, b) <= 0, {
      standard: a.standard,
    });
  }

  const { c, d } = mix(a as ArithmeticExpression, b as ArithmeticExpression);

  if (c instanceof FByte && d instanceof FByte) {
    return new FLogical(byteToNumber(c.value) <= byteToNumber(d.value), {
      standard: c.standard,
    });
  }
  if (c instanceof FInteger && d instanceof FInteger) {
    return new FLogical(c.value <= d.value, { standard: c.standard });
  }
  if (c instanceof FLogical && d instanceof FLogical) {
    return new FLogical(Number(c.value) <= Number(d.value), {
      standard: c.standard,
    });
  }
  if (c instanceof FReal && d instanceof FReal) {
    return new FLogical(c.value <= d.value, { standard: c.standard });
  }
  assert.fail('Unsupported arithmetic operands');
}

export function gt(
  a: ArithmeticExpression | FCharacter,
  b: ArithmeticExpression | FCharacter,
): FLogical;
export function gt(
  a: FCharacter | FCharacterArray,
  b: FCharacter | FCharacterArray,
): FLogicalArray;
export function gt(
  a: ArithmeticExpression | ArithmeticArray,
  b: ArithmeticExpression | ArithmeticArray,
): FLogicalArray;
export function gt(
  a: OperatorOperand,
  b: OperatorOperand,
): FLogical | FLogicalArray {
  const arrayResult = applyArrayOperation(a, b, (left, right) =>
    gt(left as ArithmeticExpression | FCharacter, right as ArithmeticExpression | FCharacter),
  );
  if (arrayResult !== undefined) {
    assert(arrayResult instanceof FLogicalArray);
    return arrayResult;
  }

  assertOrderable(
    a as ArithmeticExpression | FCharacter,
    b as ArithmeticExpression | FCharacter,
  );
  if (a instanceof FCharacter && b instanceof FCharacter) {
    return new FLogical(compareCharacters(a, b) > 0, {
      standard: a.standard,
    });
  }

  const { c, d } = mix(a as ArithmeticExpression, b as ArithmeticExpression);

  if (c instanceof FByte && d instanceof FByte) {
    return new FLogical(byteToNumber(c.value) > byteToNumber(d.value), {
      standard: c.standard,
    });
  }
  if (c instanceof FInteger && d instanceof FInteger) {
    return new FLogical(c.value > d.value, { standard: c.standard });
  }
  if (c instanceof FLogical && d instanceof FLogical) {
    return new FLogical(Number(c.value) > Number(d.value), {
      standard: c.standard,
    });
  }
  if (c instanceof FReal && d instanceof FReal) {
    return new FLogical(c.value > d.value, { standard: c.standard });
  }
  assert.fail('Unsupported arithmetic operands');
}

export function ge(
  a: ArithmeticExpression | FCharacter,
  b: ArithmeticExpression | FCharacter,
): FLogical;
export function ge(
  a: FCharacter | FCharacterArray,
  b: FCharacter | FCharacterArray,
): FLogicalArray;
export function ge(
  a: ArithmeticExpression | ArithmeticArray,
  b: ArithmeticExpression | ArithmeticArray,
): FLogicalArray;
export function ge(
  a: OperatorOperand,
  b: OperatorOperand,
): FLogical | FLogicalArray {
  const arrayResult = applyArrayOperation(a, b, (left, right) =>
    ge(left as ArithmeticExpression | FCharacter, right as ArithmeticExpression | FCharacter),
  );
  if (arrayResult !== undefined) {
    assert(arrayResult instanceof FLogicalArray);
    return arrayResult;
  }

  assertOrderable(
    a as ArithmeticExpression | FCharacter,
    b as ArithmeticExpression | FCharacter,
  );
  if (a instanceof FCharacter && b instanceof FCharacter) {
    return new FLogical(compareCharacters(a, b) >= 0, {
      standard: a.standard,
    });
  }

  const { c, d } = mix(a as ArithmeticExpression, b as ArithmeticExpression);

  if (c instanceof FByte && d instanceof FByte) {
    return new FLogical(byteToNumber(c.value) >= byteToNumber(d.value), {
      standard: c.standard,
    });
  }
  if (c instanceof FInteger && d instanceof FInteger) {
    return new FLogical(c.value >= d.value, { standard: c.standard });
  }
  if (c instanceof FLogical && d instanceof FLogical) {
    return new FLogical(Number(c.value) >= Number(d.value), {
      standard: c.standard,
    });
  }
  if (c instanceof FReal && d instanceof FReal) {
    return new FLogical(c.value >= d.value, { standard: c.standard });
  }
  assert.fail('Unsupported arithmetic operands');
}

export function concat(a: FCharacter, b: FCharacter): FCharacter;
export function concat(
  a: FCharacter | FCharacterArray,
  b: FCharacter | FCharacterArray,
): FCharacterArray;
export function concat(
  a: FCharacter | FCharacterArray,
  b: FCharacter | FCharacterArray,
): FCharacter | FCharacterArray {
  const arrayResult = applyArrayOperation(a, b, (left, right) =>
    concat(left as FCharacter, right as FCharacter),
  );
  if (arrayResult !== undefined) {
    assert(arrayResult instanceof FCharacterArray);
    return arrayResult;
  }
  return new FCharacter(
    `${(a as FCharacter).value}${(b as FCharacter).value}`,
    { standard: (a as FCharacter).standard },
  );
}

export function ne(a: FCharacter, b: FCharacter): FLogical;
export function ne<
  A extends ArithmeticExpression,
  B extends ArithmeticExpression,
>(a: A, b: B): FLogical;
export function ne(
  a: FCharacter | FCharacterArray,
  b: FCharacter | FCharacterArray,
): FLogicalArray;
export function ne(
  a: ArithmeticExpression | ArithmeticArray,
  b: ArithmeticExpression | ArithmeticArray,
): FLogicalArray;
export function ne(
  a: OperatorOperand,
  b: OperatorOperand,
): FLogical | FLogicalArray {
  const arrayResult = applyArrayOperation(a, b, (left, right) =>
    ne(left as ArithmeticExpression | FCharacter, right as ArithmeticExpression | FCharacter),
  );
  if (arrayResult !== undefined) {
    assert(arrayResult instanceof FLogicalArray);
    return arrayResult;
  }

  if (a instanceof FCharacter && b instanceof FCharacter) {
    return new FLogical(compareCharacters(a, b) !== 0, {
      standard: a.standard,
    });
  }

  const { c, d } = mix(
    a as ArithmeticExpression,
    b as ArithmeticExpression,
  );

  if (c instanceof FByte && d instanceof FByte) {
    return new FLogical(byteToNumber(c.value) !== byteToNumber(d.value), {
      standard: c.standard,
    });
  }
  if (c instanceof FComplex && d instanceof FComplex) {
    return new FLogical(c.value.r !== d.value.r || c.value.i !== d.value.i, {
      standard: c.standard,
    });
  }
  if (c instanceof FInteger && d instanceof FInteger) {
    return new FLogical(c.value !== d.value, { standard: c.standard });
  }
  if (c instanceof FLogical && d instanceof FLogical) {
    return new FLogical(c.value !== d.value, { standard: c.standard });
  }
  if (c instanceof FReal && d instanceof FReal) {
    return new FLogical(c.value !== d.value, { standard: c.standard });
  }
  assert.fail('Unsupported arithmetic operands');
}

export function add<
  A extends ArithmeticExpression,
  B extends ArithmeticExpression,
>(a: A, b: B): Mix<A, B>;
export function add(
  a: ArithmeticExpression | ArithmeticArray,
  b: ArithmeticExpression | ArithmeticArray,
): ArrayExpression;
export function add(
  a: ArithmeticExpression | ArithmeticArray,
  b: ArithmeticExpression | ArithmeticArray,
): ArithmeticExpression | ArrayExpression {
  const arrayResult = applyArrayOperation(a, b, (left, right) =>
    add(left as ArithmeticExpression, right as ArithmeticExpression),
  );
  if (arrayResult !== undefined) {
    return arrayResult;
  }
  const { c, d } = mix(
    a as ArithmeticExpression,
    b as ArithmeticExpression,
  );
  const kind = getKind(c);

  if (c instanceof FByte && d instanceof FByte) {
    return new FByte(
      numberToByte(byteToNumber(c.value) + byteToNumber(d.value)),
      { standard: c.standard },
    ) as ArithmeticExpression;
  }
  if (c instanceof FComplex && d instanceof FComplex) {
    return new FComplex(
      {
        r: c.value.r + d.value.r,
        i: c.value.i + d.value.i,
      },
      { standard: c.standard, kind: kind as ComplexKind },
    ) as ArithmeticExpression;
  }
  if (c instanceof FInteger && d instanceof FInteger) {
    return new FInteger(c.value + d.value, {
      standard: c.standard,
      kind: kind as IntegerKind,
    }) as ArithmeticExpression;
  }
  if (c instanceof FLogical && d instanceof FLogical) {
    return new FLogical(Boolean(c.value || d.value), {
      standard: c.standard,
      kind: kind as LogicalKind,
    }) as ArithmeticExpression;
  }
  if (c instanceof FReal && d instanceof FReal) {
    return new FReal(c.value + d.value, {
      standard: c.standard,
      kind: kind as RealKind,
    }) as ArithmeticExpression;
  }
  assert.fail('Unsupported arithmetic operands');
}

export function sub<
  A extends ArithmeticExpression,
  B extends ArithmeticExpression,
>(a: A, b: B): Mix<A, B>;
export function sub(
  a: ArithmeticExpression | ArithmeticArray,
  b: ArithmeticExpression | ArithmeticArray,
): ArrayExpression;
export function sub(
  a: ArithmeticExpression | ArithmeticArray,
  b: ArithmeticExpression | ArithmeticArray,
): ArithmeticExpression | ArrayExpression {
  const arrayResult = applyArrayOperation(a, b, (left, right) =>
    sub(left as ArithmeticExpression, right as ArithmeticExpression),
  );
  if (arrayResult !== undefined) {
    return arrayResult;
  }
  const { c, d } = mix(
    a as ArithmeticExpression,
    b as ArithmeticExpression,
  );
  const kind = getKind(c);

  if (c instanceof FByte && d instanceof FByte) {
    return new FByte(
      numberToByte(byteToNumber(c.value) - byteToNumber(d.value)),
      { standard: c.standard },
    ) as ArithmeticExpression;
  }

  if (c instanceof FComplex && d instanceof FComplex) {
    return new FComplex(
      {
        r: c.value.r - d.value.r,
        i: c.value.i - d.value.i,
      },
      { standard: c.standard, kind: kind as ComplexKind },
    ) as ArithmeticExpression;
  }

  if (c instanceof FInteger && d instanceof FInteger) {
    return new FInteger(c.value - d.value, {
      standard: c.standard,
      kind: kind as IntegerKind,
    }) as ArithmeticExpression;
  }

  if (c instanceof FLogical && d instanceof FLogical) {
    return new FLogical(Boolean(c.value && !d.value), {
      standard: c.standard,
      kind: kind as LogicalKind,
    }) as ArithmeticExpression;
  }

  if (c instanceof FReal && d instanceof FReal) {
    return new FReal(c.value - d.value, {
      standard: c.standard,
      kind: kind as RealKind,
    }) as ArithmeticExpression;
  }
  assert.fail('Unsupported arithmetic operands');
}

export function mul<
  A extends ArithmeticExpression,
  B extends ArithmeticExpression,
>(a: A, b: B): Mix<A, B>;
export function mul(
  a: ArithmeticExpression | ArithmeticArray,
  b: ArithmeticExpression | ArithmeticArray,
): ArrayExpression;
export function mul(
  a: ArithmeticExpression | ArithmeticArray,
  b: ArithmeticExpression | ArithmeticArray,
): ArithmeticExpression | ArrayExpression {
  const arrayResult = applyArrayOperation(a, b, (left, right) =>
    mul(left as ArithmeticExpression, right as ArithmeticExpression),
  );
  if (arrayResult !== undefined) {
    return arrayResult;
  }
  const { c, d } = mix(
    a as ArithmeticExpression,
    b as ArithmeticExpression,
  );
  const kind = getKind(c);

  if (c instanceof FByte && d instanceof FByte) {
    return new FByte(
      numberToByte(Math.trunc(byteToNumber(c.value) * byteToNumber(d.value))),
      { standard: c.standard },
    ) as ArithmeticExpression;
  }

  if (c instanceof FComplex && d instanceof FComplex) {
    return new FComplex(
      {
        r: c.value.r * d.value.r - c.value.i * d.value.i,
        i: c.value.r * d.value.i + c.value.i * d.value.r,
      },
      { standard: c.standard, kind: kind as ComplexKind },
    ) as ArithmeticExpression;
  }

  if (c instanceof FInteger && d instanceof FInteger) {
    return new FInteger(c.value * d.value, {
      standard: c.standard,
      kind: kind as IntegerKind,
    }) as ArithmeticExpression;
  }

  if (c instanceof FLogical && d instanceof FLogical) {
    return new FLogical(Boolean(c.value && d.value), {
      standard: c.standard,
      kind: kind as LogicalKind,
    }) as ArithmeticExpression;
  }

  if (c instanceof FReal && d instanceof FReal) {
    return new FReal(c.value * d.value, {
      standard: c.standard,
      kind: kind as RealKind,
    }) as ArithmeticExpression;
  }
  assert.fail('Unsupported arithmetic operands');
}

export function div<
  A extends ArithmeticExpression,
  B extends ArithmeticExpression,
>(a: A, b: B): Mix<A, B>;
export function div(
  a: ArithmeticExpression | ArithmeticArray,
  b: ArithmeticExpression | ArithmeticArray,
): ArrayExpression;
export function div(
  a: ArithmeticExpression | ArithmeticArray,
  b: ArithmeticExpression | ArithmeticArray,
): ArithmeticExpression | ArrayExpression {
  const arrayResult = applyArrayOperation(a, b, (left, right) =>
    div(left as ArithmeticExpression, right as ArithmeticExpression),
  );
  if (arrayResult !== undefined) {
    return arrayResult;
  }
  const { c, d } = mix(
    a as ArithmeticExpression,
    b as ArithmeticExpression,
  );
  const kind = getKind(c);

  if (c instanceof FByte && d instanceof FByte) {
    return new FByte(
      numberToByte(Math.trunc(byteToNumber(c.value) / byteToNumber(d.value))),
      { standard: c.standard },
    ) as ArithmeticExpression;
  }

  if (c instanceof FComplex && d instanceof FComplex) {
    const m = d.value.r * d.value.r + d.value.i * d.value.i;
    return new FComplex(
      {
        r: (c.value.r * d.value.r + c.value.i * d.value.i) / m,
        i: (c.value.i * d.value.r - c.value.r * d.value.i) / m,
      },
      {
        standard: c.standard,
        kind: kind as ComplexKind,
      },
    ) as ArithmeticExpression;
  }

  if (c instanceof FInteger && d instanceof FInteger) {
    return new FInteger(Math.trunc(c.value / d.value), {
      standard: c.standard,
      kind: kind as IntegerKind,
    }) as ArithmeticExpression;
  }

  if (c instanceof FLogical && d instanceof FLogical) {
    return new FLogical(Boolean(c.value && d.value), {
      standard: c.standard,
      kind: kind as LogicalKind,
    }) as ArithmeticExpression;
  }

  if (c instanceof FReal && d instanceof FReal) {
    return new FReal(c.value / d.value, {
      standard: c.standard,
      kind: kind as RealKind,
    }) as ArithmeticExpression;
  }
  assert.fail('Unsupported arithmetic operands');
}

export function pow<
  A extends ArithmeticExpression,
  B extends ArithmeticExpression,
>(a: A, b: B): Mix<A, B>;
export function pow(
  a: ArithmeticExpression | ArithmeticArray,
  b: ArithmeticExpression | ArithmeticArray,
): ArrayExpression;
export function pow(
  a: ArithmeticExpression | ArithmeticArray,
  b: ArithmeticExpression | ArithmeticArray,
): ArithmeticExpression | ArrayExpression {
  const arrayResult = applyArrayOperation(a, b, (left, right) =>
    pow(left as ArithmeticExpression, right as ArithmeticExpression),
  );
  if (arrayResult !== undefined) {
    return arrayResult;
  }
  const { c, d } = mix(
    a as ArithmeticExpression,
    b as ArithmeticExpression,
  );
  const kind = getKind(c);

  if (c instanceof FByte && d instanceof FByte) {
    return new FByte(
      numberToByte(
        Math.trunc(Math.pow(byteToNumber(c.value), byteToNumber(d.value))),
      ),
      { standard: c.standard },
    ) as ArithmeticExpression;
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
        standard: c.standard,
        kind: kind as ComplexKind,
      },
    ) as ArithmeticExpression;
  }

  if (c instanceof FInteger && d instanceof FInteger) {
    return new FInteger(Math.trunc(Math.pow(c.value, d.value)), {
      standard: c.standard,
      kind: kind as IntegerKind,
    }) as ArithmeticExpression;
  }

  if (c instanceof FLogical && d instanceof FLogical) {
    return new FLogical(Boolean(Number(c.value) ** Number(d.value)), {
      standard: c.standard,
      kind: kind as LogicalKind,
    }) as ArithmeticExpression;
  }

  if (c instanceof FReal && d instanceof FReal) {
    return new FReal(Math.pow(c.value, d.value), {
      standard: c.standard,
      kind: kind as RealKind,
    }) as ArithmeticExpression;
  }
  assert.fail('Unsupported arithmetic operands');
}

export function uplus<A extends ArithmeticExpression>(a: A): A;
export function uplus(a: ArithmeticArray): ArrayExpression;
export function uplus(
  a: ArithmeticExpression | ArithmeticArray,
): ArithmeticExpression | ArrayExpression {
  const arrayResult = applyArrayOperation(a, a, (value) =>
    uplus(value as ArithmeticExpression),
  );
  if (arrayResult !== undefined) {
    return arrayResult;
  }
  a = a as ArithmeticExpression;
  const kind = getKind(a);

  if (a instanceof FByte) {
    return new FByte(byteToNumber(a.value), { standard: a.standard });
  }

  if (a instanceof FComplex) {
    return new FComplex(
      {
        r: +a.value.r,
        i: +a.value.i,
      },
      { standard: a.standard, kind: kind as ComplexKind },
    );
  }

  if (a instanceof FInteger) {
    return new FInteger(+a.value, {
      standard: a.standard,
      kind: kind as IntegerKind,
    });
  }

  if (a instanceof FLogical) {
    return new FLogical(a.value, {
      standard: a.standard,
      kind: kind as LogicalKind,
    });
  }

  if (a instanceof FReal) {
    return new FReal(+a.value, {
      standard: a.standard,
      kind: kind as RealKind,
    });
  }
  assert.fail('Unsupported arithmetic expression');
}

export function uminus<A extends ArithmeticExpression>(a: A): A;
export function uminus(a: ArithmeticArray): ArrayExpression;
export function uminus(
  a: ArithmeticExpression | ArithmeticArray,
): ArithmeticExpression | ArrayExpression {
  const arrayResult = applyArrayOperation(a, a, (value) =>
    uminus(value as ArithmeticExpression),
  );
  if (arrayResult !== undefined) {
    return arrayResult;
  }
  a = a as ArithmeticExpression;
  const kind = getKind(a);

  if (a instanceof FByte) {
    return new FByte(-byteToNumber(a.value), { standard: a.standard });
  }

  if (a instanceof FComplex) {
    return new FComplex(
      {
        r: -a.value.r,
        i: -a.value.i,
      },
      { standard: a.standard, kind: kind as ComplexKind },
    );
  }

  if (a instanceof FInteger) {
    return new FInteger(-a.value, {
      standard: a.standard,
      kind: kind as IntegerKind,
    });
  }

  if (a instanceof FLogical) {
    return new FLogical(!a.value, {
      standard: a.standard,
      kind: kind as LogicalKind,
    });
  }

  if (a instanceof FReal) {
    return new FReal(-a.value, {
      standard: a.standard,
      kind: kind as RealKind,
    });
  }
  assert.fail('Unsupported arithmetic expression');
}

export function not(a: FLogical): FLogical;
export function not(a: FLogicalArray): FLogicalArray;
export function not(a: FLogical | FLogicalArray): FLogical | FLogicalArray {
  const arrayResult = applyArrayOperation(a, a, (value) =>
    not(value as FLogical),
  );
  if (arrayResult !== undefined) {
    assert(arrayResult instanceof FLogicalArray);
    return arrayResult;
  }
  a = a as FLogical;
  return new FLogical(!a.value, {
    standard: a.standard,
    kind: a.kind,
  });
}

export function and<A extends FLogical, B extends FLogical>(
  a: A,
  b: B,
): FLogical;
export function and(
  a: FLogical | FLogicalArray,
  b: FLogical | FLogicalArray,
): FLogicalArray;
export function and(
  a: FLogical | FLogicalArray,
  b: FLogical | FLogicalArray,
): FLogical | FLogicalArray;
export function and<A extends FLogical, B extends FLogical>(
  a: A | FLogicalArray,
  b: B | FLogicalArray,
): FLogical | FLogicalArray {
  const arrayResult = applyArrayOperation(a, b, (left, right) =>
    and(left as FLogical, right as FLogical),
  );
  if (arrayResult !== undefined) {
    assert(arrayResult instanceof FLogicalArray);
    return arrayResult;
  }
  const { c, d } = mix(a as FLogical, b as FLogical);
  const kind = getKind(c);

  if (c instanceof FLogical && d instanceof FLogical) {
    return new FLogical(c.value && d.value, {
      standard: c.standard,
      kind: kind as LogicalKind,
    });
  }
  assert.fail('Unsupported logical operands');
}

export function or<A extends FLogical, B extends FLogical>(
  a: A,
  b: B,
): FLogical;
export function or(
  a: FLogical | FLogicalArray,
  b: FLogical | FLogicalArray,
): FLogicalArray;
export function or(
  a: FLogical | FLogicalArray,
  b: FLogical | FLogicalArray,
): FLogical | FLogicalArray {
  const arrayResult = applyArrayOperation(a, b, (left, right) =>
    or(left as FLogical, right as FLogical),
  );
  if (arrayResult !== undefined) {
    assert(arrayResult instanceof FLogicalArray);
    return arrayResult;
  }
  const { c, d } = mix(a as FLogical, b as FLogical);
  const kind = getKind(c);

  if (c instanceof FLogical && d instanceof FLogical) {
    return new FLogical(c.value || d.value, {
      standard: c.standard,
      kind: kind as LogicalKind,
    });
  }
  assert.fail('Unsupported logical operands');
}

export function neqv<A extends FLogical, B extends FLogical>(
  a: A,
  b: B,
): FLogical;
export function neqv(
  a: FLogical | FLogicalArray,
  b: FLogical | FLogicalArray,
): FLogicalArray;
export function neqv(
  a: FLogical | FLogicalArray,
  b: FLogical | FLogicalArray,
): FLogical | FLogicalArray {
  const arrayResult = applyArrayOperation(a, b, (left, right) =>
    neqv(left as FLogical, right as FLogical),
  );
  if (arrayResult !== undefined) {
    assert(arrayResult instanceof FLogicalArray);
    return arrayResult;
  }
  const { c, d } = mix(a as FLogical, b as FLogical);
  const kind = getKind(c);

  if (c instanceof FLogical && d instanceof FLogical) {
    return new FLogical(c.value !== d.value, {
      standard: c.standard,
      kind: kind as LogicalKind,
    });
  }
  assert.fail('Unsupported logical operands');
}

export function xor<A extends FLogical, B extends FLogical>(
  a: A,
  b: B,
): FLogical;
export function xor(
  a: FLogical | FLogicalArray,
  b: FLogical | FLogicalArray,
): FLogicalArray;
export function xor(
  a: FLogical | FLogicalArray,
  b: FLogical | FLogicalArray,
): FLogical | FLogicalArray {
  const arrayResult = applyArrayOperation(a, b, (left, right) =>
    xor(left as FLogical, right as FLogical),
  );
  if (arrayResult !== undefined) {
    assert(arrayResult instanceof FLogicalArray);
    return arrayResult;
  }
  const { c, d } = mix(a as FLogical, b as FLogical);
  const kind = getKind(c);

  if (c instanceof FLogical && d instanceof FLogical) {
    return new FLogical(c.value !== d.value, {
      standard: c.standard,
      kind: kind as LogicalKind,
    });
  }
  assert.fail('Unsupported logical operands');
}

export function eqv<A extends FLogical, B extends FLogical>(
  a: A,
  b: B,
): FLogical;
export function eqv(
  a: FLogical | FLogicalArray,
  b: FLogical | FLogicalArray,
): FLogicalArray;
export function eqv(
  a: FLogical | FLogicalArray,
  b: FLogical | FLogicalArray,
): FLogical | FLogicalArray {
  const arrayResult = applyArrayOperation(a, b, (left, right) =>
    eqv(left as FLogical, right as FLogical),
  );
  if (arrayResult !== undefined) {
    assert(arrayResult instanceof FLogicalArray);
    return arrayResult;
  }
  const { c, d } = mix(a as FLogical, b as FLogical);
  const kind = getKind(c);

  if (c instanceof FLogical && d instanceof FLogical) {
    return new FLogical(c.value === d.value, {
      standard: c.standard,
      kind: kind as LogicalKind,
    });
  }
  assert.fail('Unsupported logical operands');
}
