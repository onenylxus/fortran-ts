const COMPLEX_KIND = [8, 16, 32] as const;
const INTEGER_KIND = [2, 4, 8] as const;
const LOGICAL_KIND = [1, 2, 4, 8] as const;
const REAL_KIND = [4, 8, 16] as const;

export function isRangedInteger(
  value: unknown,
  bits: number,
  signed: boolean,
): value is number {
  if (!Number.isInteger(value)) {
    return false;
  }
  const num = value as number;
  const min = signed ? -Math.abs(1 << (bits - 1)) : 0;
  const max = signed ? Math.abs(1 << (bits - 1)) : Math.abs(1 << bits);
  return num >= min && num < max;
}

export function isAscii(value: unknown): value is string {
  if (typeof value !== 'string' || value.length !== 1) {
    return false;
  }
  return isRangedInteger(value.charCodeAt(0), 8, false);
}

export function isComplex(value: unknown): value is Complex {
  return (
    typeof value === 'object' &&
    value !== null &&
    'r' in value &&
    typeof value.r === 'number' &&
    'i' in value &&
    typeof value.i === 'number'
  );
}

export function isComplexKind(kind: number): kind is ComplexKind {
  return COMPLEX_KIND.includes(kind as ComplexKind);
}

export function isIntegerKind(kind: number): kind is IntegerKind {
  return INTEGER_KIND.includes(kind as IntegerKind);
}

export function isLogicalKind(kind: number): kind is LogicalKind {
  return LOGICAL_KIND.includes(kind as LogicalKind);
}

export function isRealKind(kind: number): kind is RealKind {
  return REAL_KIND.includes(kind as RealKind);
}

export function getDim(dim: FortranArray<unknown>): Dimension {
  const isLastDim = !Array.isArray(dim[0]);
  if (isLastDim) {
    return [dim.length];
  }
  return [
    dim.length,
    ...(getDim(dim[0] as FortranArray<unknown>) as number[]),
  ] as Dimension;
}
