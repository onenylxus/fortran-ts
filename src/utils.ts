export function isRangedInteger(
  value: unknown,
  bits: number,
  signed: boolean,
): value is number {
  if (!Number.isInteger(value)) {
    return false;
  }
  const num = value as number;
  const min = signed ? -(1 << (bits - 1)) : 0;
  const max = signed ? 1 << (bits - 1) : 1 << bits;
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
