import assert from 'assert';
import DatatypesJSON from '../assets/datatypes.json' assert { type: 'json' };

function isRangedInteger(v: number, bits: number, signed: boolean): boolean {
  assert(Number.isInteger(v));
  const min = signed ? -(1 << (bits - 1)) : 0;
  const max = signed ? 1 << (bits - 1) : 1 << bits;
  return v >= min && v < max;
}

function isAscii(c: string): boolean {
  assert(typeof c === 'string');
  assert(c.length === 1);
  return isRangedInteger(c.charCodeAt(0), 8, false);
}

interface FIntrinsicOptions {
  standard: FortranStandard;
  name: string;
  description: string;
}

abstract class FIntrinsic<T> {
  protected _value: T;

  public constructor(
    protected _standard: FortranStandard,
    protected _name: string,
    protected _description: string,
  ) {}

  public get standard(): string {
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

  private set len(v: number | undefined) {
    if (v !== undefined) {
      assert(Number.isInteger(v));
      assert(v > 0);
    }
    this._len = v;
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

  private set kind(v: ComplexKind | undefined) {
    if (v !== undefined) {
      assert([8, 16, 32].includes(v));
    }
    this._kind = v;
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

  private set kind(v: IntegerKind | undefined) {
    if (v !== undefined) {
      assert([2, 4, 8].includes(v));
    }
    this._kind = v;
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

  private set kind(v: LogicalKind | undefined) {
    if (v !== undefined) {
      assert([1, 2, 4, 8].includes(v));
    }
    this._kind = v;
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

  private set kind(v: RealKind | undefined) {
    if (v !== undefined) {
      assert([4, 8, 16].includes(v));
    }
    this._kind = v;
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
