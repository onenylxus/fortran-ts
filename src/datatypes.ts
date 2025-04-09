import assert from 'assert';
import { isAscii, isRangedInteger } from './utils';
import DatatypesJSON from '../assets/datatypes.json' assert { type: 'json' };

interface FDataOptions {
  standard: FortranStandard;
  name: string;
  description: string;
}

type FIntrinsicOptions = FDataOptions;

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
  public constructor(
    value: Byte,
    options: FByteOptions = FByte.DefaultOptions,
  ) {
    super(
      options.standard,
      DatatypesJSON.byte.name,
      DatatypesJSON.byte.description,
    );

    this.value = value;
  }

  public set value(v: Byte) {
    if (typeof v === 'string') {
      assert(isAscii(v));
      this._value = v;
    } else if (typeof v === 'number') {
      assert(isRangedInteger(v, 8, true));
      this._value = v;
    } else if (typeof v === 'boolean') {
      this._value = v;
    }
    assert.fail();
  }

  public get value(): Byte {
    return this._value;
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
    value: FortranArray<Byte>,
    options: FByteArrayOptions = FByteArray.DefaultOptions,
  ) {
    super(
      options.standard,
      DatatypesJSON.byte.name,
      DatatypesJSON.byte.description,
    );

    this.value = value;
    this.dim = options.dim;
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
    value: string,
    options: FCharacterOptions = FCharacter.DefaultOptions,
  ) {
    super(options.standard, options.name, options.description);

    this.value = value;
    this.len = options.len;
  }

  public override get name(): string {
    if (this.len === undefined) {
      return super.name;
    }
    return super.name.concat('*', this.len.toString());
  }

  public set value(v: string) {
    assert(isAscii(v));
    this._value = v;
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
  private _len: number | undefined;

  public constructor(
    value: FortranArray<string>,
    options: FCharacterArrayOptions = FCharacterArray.DefaultOptions,
  ) {
    super(
      options.standard,
      DatatypesJSON.character.name,
      DatatypesJSON.character.description,
    );

    this.value = value;
    this.dim = options.dim;
  }

  protected build(v: string): FCharacter {
    return new FCharacter(v, {
      ...FCharacter.DefaultOptions,
      standard: this._standard,
      len: this._len,
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
    value: Complex,
    options: FComplexOptions = FComplex.DefaultOptions,
  ) {
    super(options.standard, options.name, options.description);

    this.value = value;
    this.kind = options.kind;
  }

  public override get name(): string {
    if (this.kind === undefined) {
      return super.name;
    }
    return super.name.concat('*', this.kind.toString());
  }

  public set value(v: Complex) {
    assert('r' in v && typeof v.r === 'number');
    assert('i' in v && typeof v.i === 'number');
    if (this.kind === undefined || this.kind === 8) {
      assert(Math.fround(v.r) === v.r);
      assert(Math.fround(v.i) === v.i);
    }
    this._value = v;
  }

  public get value(): Complex {
    return this._value;
  }

  private set kind(k: ComplexKind | undefined) {
    if (k !== undefined) {
      assert([8, 16, 32].includes(k));
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
  private _kind: ComplexKind | undefined;

  public constructor(
    value: FortranArray<Complex>,
    options: FComplexArrayOptions = FComplexArray.DefaultOptions,
  ) {
    super(
      options.standard,
      DatatypesJSON.complex.name,
      DatatypesJSON.complex.description,
    );

    this.value = value;
    this.dim = options.dim;
  }

  protected build(v: Complex): FComplex {
    return new FComplex(v, {
      ...FComplex.DefaultOptions,
      standard: this._standard,
      kind: this._kind,
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
    value: number,
    options: FIntegerOptions = FInteger.DefaultOptions,
  ) {
    super(options.standard, options.name, options.description);

    this.value = value;
    this.kind = options.kind;
  }

  public override get name(): string {
    if (this.kind === undefined) {
      return super.name;
    }
    return super.name.concat('*', this.kind.toString());
  }

  public set value(v: number) {
    assert(isRangedInteger(v, 32, true));
    this._value = v;
  }

  public get value(): number {
    return this._value;
  }

  private set kind(k: IntegerKind | undefined) {
    if (k !== undefined) {
      assert([2, 4, 8].includes(k));
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
  private _kind: IntegerKind | undefined;

  public constructor(
    value: FortranArray<number>,
    options: FIntegerArrayOptions = FIntegerArray.DefaultOptions,
  ) {
    super(
      options.standard,
      DatatypesJSON.integer.name,
      DatatypesJSON.integer.description,
    );

    this.value = value;
    this.dim = options.dim;
  }

  protected build(v: number): FInteger {
    return new FInteger(v, {
      ...FInteger.DefaultOptions,
      standard: this._standard,
      kind: this._kind,
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
    value: boolean,
    options: FLogicalOptions = FLogical.DefaultOptions,
  ) {
    super(options.standard, options.name, options.description);

    this.value = value;
    this.kind = options.kind;
  }

  public override get name(): string {
    if (this.kind === undefined) {
      return super.name;
    }
    return super.name.concat('*', this.kind.toString());
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
      assert([1, 2, 4, 8].includes(k));
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
  private _kind: LogicalKind | undefined;

  public constructor(
    value: FortranArray<boolean>,
    options: FLogicalArrayOptions = FLogicalArray.DefaultOptions,
  ) {
    super(
      options.standard,
      DatatypesJSON.logical.name,
      DatatypesJSON.logical.description,
    );

    this.value = value;
    this.dim = options.dim;
  }

  protected build(v: boolean): FLogical {
    return new FLogical(v, {
      ...FLogical.DefaultOptions,
      standard: this._standard,
      kind: this._kind,
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

  public constructor(
    value: number,
    options: FRealOptions = FReal.DefaultOptions,
  ) {
    super(
      options.standard,
      DatatypesJSON.real.name,
      DatatypesJSON.real.description,
    );

    this.value = value;
    this.kind = options.kind;
  }

  public override get name(): string {
    if (this.kind === undefined) {
      return super.name;
    }
    return super.name.concat('*', this.kind.toString());
  }

  public set value(v: number) {
    assert(typeof v === 'number');
    if (this.kind === undefined || this.kind === 4) {
      assert(Math.fround(v) === v);
    }
    this._value = v;
  }

  public get value(): number {
    return this._value;
  }

  private set kind(k: RealKind | undefined) {
    if (k !== undefined) {
      assert([4, 8, 16].includes(k));
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
  private _kind: RealKind | undefined;

  public constructor(
    value: FortranArray<number>,
    options: FRealArrayOptions = FRealArray.DefaultOptions,
  ) {
    super(
      options.standard,
      DatatypesJSON.real.name,
      DatatypesJSON.real.description,
    );

    this.value = value;
    this.dim = options.dim;
  }

  protected build(v: number): FReal {
    return new FReal(v, {
      ...FReal.DefaultOptions,
      standard: this._standard,
      kind: this._kind,
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
