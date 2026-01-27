import assert from 'assert';
import { isAscii, isRangedInteger } from './utils';
import DatatypesJSON from '../assets/datatypes.json' with { type: 'json' };
import {
  assertComplexKind,
  assertIntegerKind,
  assertLogicalKind,
  assertRealKind,
} from './error';

enum FortranStandard {
  f66 = 'Fortran66',
  f77 = 'Fortran77',
  f90 = 'Fortran90',
  f95 = 'Fortran95',
  f03 = 'Fortran2003',
  f08 = 'Fortran2008',
  f18 = 'Fortran2018',
}

interface FDataOptions {
  standard: FortranStandard;
  name: string;
  description: string;
}

type FIntrinsicOptions = FDataOptions;

export type ArithmeticExpression =
  | FByte
  | FComplex
  | FInteger
  | FLogical
  | FReal;

abstract class FIntrinsic<T> implements FDataOptions {
  protected _value: T;

  public constructor(
    protected _standard: FortranStandard,
    protected _name: string,
    protected _description: string,
  ) {}

  public get standard(): FortranStandard {
    return this._standard;
  }

  public get name(): string {
    return this._name;
  }

  public get description(): string {
    return this._description;
  }

  public abstract set value(v: T);
  public abstract get value(): T;
}

type FArrayOptions = {
  dim: Dimension;
} & FDataOptions;

abstract class FArray<P, T = FIntrinsic<P>> implements FDataOptions {
  protected _value: FortranArray<T>;
  private _dim: Dimension;

  public constructor(
    protected _standard: FortranStandard,
    protected _name: string,
    protected _description: string,
  ) {}

  public get standard(): FortranStandard {
    return this._standard;
  }

  public get name(): string {
    return this._name;
  }

  public get description(): string {
    return this._description;
  }

  protected abstract build(v: P): T;

  protected fromValue(a: FortranArray<P>, d: number): FortranArray<T> {
    assert(Array.isArray(a));
    assert(a.length === this.dim[d]);

    if (d === 0) {
      return a.map((v) => this.build(v));
    }
    return a.map((v) => this.fromValue(v, d - 1)) as FortranArray<T>;
  }

  protected toValue(a: FortranArray<T>): FortranArray<P> {
    return [
      undefined,
      ...a.map((v) => {
        if (Array.isArray(v)) {
          return this.toValue(v);
        }
        return v.value;
      }),
    ];
  }

  public set value(v: FortranArray<P>) {
    this._value = this.fromValue(v, this.dim.length - 1);
  }

  public get value(): FortranArray<P> {
    return this.toValue(this._value);
  }

  protected set dim(d: Dimension) {
    assert(Array.isArray(d));
    assert(d.length >= 1 && d.length <= 7);
    assert(d.every((l) => Number.isInteger(l) && l > 0));
    this._dim = d;
  }

  public get dim(): Dimension {
    if (typeof this._dim === 'number') {
      return [this._dim];
    }
    return this._dim;
  }
}

type FByteOptions = FIntrinsicOptions;

export class FByte extends FIntrinsic<Byte> {
  public constructor(value: Byte = 0, options: Partial<FByteOptions> = {}) {
    super(
      options.standard ?? FByte.DefaultOptions.standard,
      FByte.DefaultOptions.name,
      FByte.DefaultOptions.description,
    );

    this.value = value;
  }

  public set value(v: Byte) {
    switch (typeof v) {
      case 'string':
        assert(isAscii(v));
        this._value = v;
        break;
      case 'number':
        assert(isRangedInteger(v, 8, true));
        this._value = v;
        break;
      case 'boolean':
        this._value = v;
        break;
      default:
        assert.fail();
    }
  }

  public get value(): Byte {
    switch (typeof this._value) {
      case 'string':
        return this._value;
      case 'number':
        return String.fromCharCode(this._value);
      case 'boolean':
        return this._value ? '\x01' : '\x00';
      default:
        assert.fail();
    }
  }

  public static get DefaultOptions(): FByteOptions {
    return {
      standard: FortranStandard.f77,
      name: DatatypesJSON.byte.name,
      description: DatatypesJSON.byte.description,
    };
  }
}

type FByteArrayOptions = FArrayOptions;

export class FByteArray extends FArray<Byte> {
  public constructor(
    value: FortranArray<Byte> = [],
    options: Partial<FByteArrayOptions> = {},
  ) {
    super(
      options.standard ?? FByteArray.DefaultOptions.standard,
      FByteArray.DefaultOptions.name,
      FByteArray.DefaultOptions.description,
    );

    this.dim = options.dim ?? FByteArray.DefaultOptions.dim;
    this.value = value;
  }

  protected build(v: Byte): FByte {
    return new FByte(v, { ...FByte.DefaultOptions, standard: this._standard });
  }

  public static get DefaultOptions(): FByteArrayOptions {
    return {
      standard: FortranStandard.f77,
      name: DatatypesJSON.byte.name,
      description: DatatypesJSON.byte.description,
      dim: [1],
    };
  }
}

type FCharacterOptions = {
  len?: number;
} & FIntrinsicOptions;

export class FCharacter extends FIntrinsic<string> {
  private _len: number | undefined;

  public constructor(
    value: string = ' ',
    options: Partial<FCharacterOptions> = {},
  ) {
    super(
      options.standard ?? FCharacter.DefaultOptions.standard,
      options.name ?? FCharacter.DefaultOptions.name,
      options.description ?? FCharacter.DefaultOptions.description,
    );

    this.len = options.len;
    this.value = value;
  }

  public override get name(): string {
    return this.len ? `${super.name}*${this.len}` : super.name;
  }

  public set value(v: string) {
    assert(v.split('').every((c) => isAscii(c)));
    this._value = v.substring(0, this.len);
  }

  public get value(): string {
    return this._value;
  }

  private set len(l: number | undefined) {
    if (l !== undefined) {
      assert(Number.isInteger(l));
      assert(l > 0);
    }
    this._len = l;
  }

  public get len(): number | undefined {
    return this._len;
  }

  public static get DefaultOptions(): FCharacterOptions {
    return {
      standard: FortranStandard.f77,
      name: DatatypesJSON.character.name,
      description: DatatypesJSON.character.description,
    };
  }
}

type FCharacterArrayOptions = {
  len?: number;
} & FArrayOptions;

export class FCharacterArray extends FArray<string> {
  private _elementLen: number | undefined;

  public constructor(
    value: FortranArray<string> = [],
    options: Partial<FCharacterArrayOptions> = {},
  ) {
    super(
      options.standard ?? FCharacterArray.DefaultOptions.standard,
      FCharacterArray.DefaultOptions.name,
      FCharacterArray.DefaultOptions.description,
    );

    this._elementLen = options.len;
    this.dim = options.dim ?? FCharacterArray.DefaultOptions.dim;
    this.value = value;
  }

  protected build(v: string): FCharacter {
    return new FCharacter(v, {
      ...FCharacter.DefaultOptions,
      standard: this._standard,
      len: this._elementLen,
    });
  }

  public static get DefaultOptions(): FCharacterArrayOptions {
    return {
      standard: FortranStandard.f77,
      name: DatatypesJSON.character.name,
      description: DatatypesJSON.character.description,
      dim: [1],
    };
  }
}

type FComplexOptions = {
  kind?: ComplexKind;
} & FIntrinsicOptions;

export class FComplex extends FIntrinsic<Complex> {
  private _kind: ComplexKind | undefined;

  public constructor(
    value: Complex = { r: 0, i: 0 },
    options: Partial<FComplexOptions> = {},
  ) {
    super(
      options.standard ?? FComplex.DefaultOptions.standard,
      options.name ?? FComplex.DefaultOptions.name,
      options.description ?? FComplex.DefaultOptions.description,
    );

    this.kind = options.kind;
    this.value = value;
  }

  public override get name(): string {
    return this.kind ? `${super.name}*${this.kind}` : super.name;
  }

  public set value(v: Complex) {
    assert(typeof v === 'object' && v !== null);
    assert('r' in v && typeof v.r === 'number');
    assert('i' in v && typeof v.i === 'number');
    this._value = v;
  }

  public get value(): Complex {
    if (this.kind === undefined || this.kind === 8) {
      return { r: Math.fround(this._value.r), i: Math.fround(this._value.i) };
    }
    return this._value;
  }

  private set kind(k: ComplexKind | undefined) {
    if (k !== undefined) {
      assertComplexKind(k);
    }
    this._kind = k;
  }

  public get kind(): ComplexKind | undefined {
    return this._kind;
  }

  public static get DefaultOptions(): FComplexOptions {
    return {
      standard: FortranStandard.f77,
      name: DatatypesJSON.complex.name,
      description: DatatypesJSON.complex.description,
    };
  }
}

type FComplexArrayOptions = {
  kind?: ComplexKind;
} & FArrayOptions;

export class FComplexArray extends FArray<Complex> {
  private _elementKind: ComplexKind | undefined;

  public constructor(
    value: FortranArray<Complex> = [],
    options: Partial<FComplexArrayOptions> = {},
  ) {
    super(
      options.standard ?? FComplexArray.DefaultOptions.standard,
      FComplexArray.DefaultOptions.name,
      FComplexArray.DefaultOptions.description,
    );

    this._elementKind = options.kind;
    this.dim = options.dim ?? FComplexArray.DefaultOptions.dim;
    this.value = value;
  }

  protected build(v: Complex): FComplex {
    return new FComplex(v, {
      ...FComplex.DefaultOptions,
      standard: this._standard,
      kind: this._elementKind,
    });
  }

  public static get DefaultOptions(): FComplexArrayOptions {
    return {
      standard: FortranStandard.f77,
      name: DatatypesJSON.complex.name,
      description: DatatypesJSON.complex.description,
      dim: [1],
    };
  }
}

type FIntegerOptions = {
  kind?: IntegerKind;
} & FIntrinsicOptions;

export class FInteger extends FIntrinsic<number> {
  private _kind: IntegerKind | undefined;

  public constructor(
    value: number = 0,
    options: Partial<FIntegerOptions> = {},
  ) {
    super(
      options.standard ?? FInteger.DefaultOptions.standard,
      options.name ?? FInteger.DefaultOptions.name,
      options.description ?? FInteger.DefaultOptions.description,
    );

    this.kind = options.kind;
    this.value = value;
  }

  public override get name(): string {
    return this.kind ? `${super.name}*${this.kind}` : super.name;
  }

  public set value(v: number) {
    assert(isRangedInteger(v, (this.kind ?? 4) * 8, true));
    this._value = v;
  }

  public get value(): number {
    return this._value;
  }

  private set kind(k: IntegerKind | undefined) {
    if (k !== undefined) {
      assertIntegerKind(k);
    }
    this._kind = k;
  }

  public get kind(): IntegerKind | undefined {
    return this._kind;
  }

  public static get DefaultOptions(): FIntegerOptions {
    return {
      standard: FortranStandard.f77,
      name: DatatypesJSON.integer.name,
      description: DatatypesJSON.integer.description,
    };
  }
}

type FIntegerArrayOptions = {
  kind?: IntegerKind;
} & FArrayOptions;

export class FIntegerArray extends FArray<number> {
  private _elementKind: IntegerKind | undefined;

  public constructor(
    value: FortranArray<number> = [],
    options: Partial<FIntegerArrayOptions> = {},
  ) {
    super(
      options.standard ?? FIntegerArray.DefaultOptions.standard,
      FIntegerArray.DefaultOptions.name,
      FIntegerArray.DefaultOptions.description,
    );

    this._elementKind = options.kind;
    this.dim = options.dim ?? FIntegerArray.DefaultOptions.dim;
    this.value = value;
  }

  protected build(v: number): FInteger {
    return new FInteger(v, {
      ...FInteger.DefaultOptions,
      standard: this._standard,
      kind: this._elementKind,
    });
  }

  public static get DefaultOptions(): FIntegerArrayOptions {
    return {
      standard: FortranStandard.f77,
      name: DatatypesJSON.integer.name,
      description: DatatypesJSON.integer.description,
      dim: [1],
    };
  }
}

type FLogicalOptions = {
  kind?: LogicalKind;
} & FIntrinsicOptions;

export class FLogical extends FIntrinsic<boolean> {
  private _kind: LogicalKind | undefined;

  public constructor(
    value: boolean = false,
    options: Partial<FLogicalOptions> = {},
  ) {
    super(
      options.standard ?? FLogical.DefaultOptions.standard,
      options.name ?? FLogical.DefaultOptions.name,
      options.description ?? FLogical.DefaultOptions.description,
    );

    this.kind = options.kind;
    this.value = value;
  }

  public override get name(): string {
    return this.kind ? `${super.name}*${this.kind}` : super.name;
  }

  public set value(v: boolean) {
    assert(typeof v === 'boolean');
    this._value = v;
  }

  public get value(): boolean {
    return this._value;
  }

  private set kind(k: LogicalKind | undefined) {
    if (k !== undefined) {
      assertLogicalKind(k);
    }
    this._kind = k;
  }

  public get kind(): LogicalKind | undefined {
    return this._kind;
  }

  public static get DefaultOptions(): FLogicalOptions {
    return {
      standard: FortranStandard.f77,
      name: DatatypesJSON.logical.name,
      description: DatatypesJSON.logical.description,
    };
  }
}

type FLogicalArrayOptions = {
  kind?: LogicalKind;
} & FArrayOptions;

export class FLogicalArray extends FArray<boolean> {
  private _elementKind: LogicalKind | undefined;

  public constructor(
    value: FortranArray<boolean> = [],
    options: Partial<FLogicalArrayOptions> = {},
  ) {
    super(
      options.standard ?? FLogicalArray.DefaultOptions.standard,
      FLogicalArray.DefaultOptions.name,
      FLogicalArray.DefaultOptions.description,
    );

    this._elementKind = options.kind;
    this.dim = options.dim ?? FLogicalArray.DefaultOptions.dim;
    this.value = value;
  }

  protected build(v: boolean): FLogical {
    return new FLogical(v, {
      ...FLogical.DefaultOptions,
      standard: this._standard,
      kind: this._elementKind,
    });
  }

  public static get DefaultOptions(): FLogicalArrayOptions {
    return {
      standard: FortranStandard.f77,
      name: DatatypesJSON.logical.name,
      description: DatatypesJSON.logical.description,
      dim: [1],
    };
  }
}

type FRealOptions = {
  kind?: RealKind;
} & FIntrinsicOptions;

export class FReal extends FIntrinsic<number> {
  private _kind: RealKind | undefined;

  public constructor(value: number = 0, options: Partial<FRealOptions> = {}) {
    super(
      options.standard ?? FReal.DefaultOptions.standard,
      options.name ?? FReal.DefaultOptions.name,
      options.description ?? FReal.DefaultOptions.description,
    );

    this.kind = options.kind;
    this.value = value;
  }

  public override get name(): string {
    return this.kind ? `${super.name}*${this.kind}` : super.name;
  }

  public set value(v: number) {
    assert(typeof v === 'number');
    this._value = v;
  }

  public get value(): number {
    if (this.kind === undefined || this.kind === 4) {
      return Math.fround(this._value);
    }
    return this._value;
  }

  private set kind(k: RealKind | undefined) {
    if (k !== undefined) {
      assertRealKind(k);
    }
    this._kind = k;
  }

  public get kind(): RealKind | undefined {
    return this._kind;
  }

  public static get DefaultOptions(): FRealOptions {
    return {
      standard: FortranStandard.f77,
      name: DatatypesJSON.real.name,
      description: DatatypesJSON.real.description,
    };
  }
}

type FRealArrayOptions = {
  kind?: RealKind;
} & FArrayOptions;

export class FRealArray extends FArray<number> {
  private _elementKind: RealKind | undefined;

  public constructor(
    value: FortranArray<number> = [],
    options: Partial<FRealArrayOptions> = {},
  ) {
    super(
      options.standard ?? FRealArray.DefaultOptions.standard,
      FRealArray.DefaultOptions.name,
      FRealArray.DefaultOptions.description,
    );

    this._elementKind = options.kind;
    this.dim = options.dim ?? FRealArray.DefaultOptions.dim;
    this.value = value;
  }

  protected build(v: number): FReal {
    return new FReal(v, {
      ...FReal.DefaultOptions,
      standard: this._standard,
      kind: this._elementKind,
    });
  }

  public static get DefaultOptions(): FRealArrayOptions {
    return {
      standard: FortranStandard.f77,
      name: DatatypesJSON.real.name,
      description: DatatypesJSON.real.description,
      dim: [1],
    };
  }
}
