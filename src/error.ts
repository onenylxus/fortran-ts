import assert from 'assert';
import {
  isComplexKind,
  isIntegerKind,
  isLogicalKind,
  isRealKind,
} from './utils';

export function assertComplexKind(kind: number): asserts kind is ComplexKind {
  assert(isComplexKind(kind), `Invalid complex kind: ${kind}`);
}

export function assertIntegerKind(kind: number): asserts kind is IntegerKind {
  assert(isIntegerKind(kind), `Invalid integer kind: ${kind}`);
}

export function assertLogicalKind(kind: number): asserts kind is LogicalKind {
  assert(isLogicalKind(kind), `Invalid logical kind: ${kind}`);
}

export function assertRealKind(kind: number): asserts kind is RealKind {
  assert(isRealKind(kind), `Invalid real kind: ${kind}`);
}
