import { Circuit, Field, Provable, Struct, UInt32 } from 'snarkyjs';
import { PackedUInt32Factory } from './PackedUInt32';

describe('PackedUInt32', () => {
  it('packs and unpacks 2 UInt32 values', async () => {
    const uints = [UInt32.from(67), UInt32.from(2n ** 32n - 1n)];
    const PackedUInt32_2 = PackedUInt32Factory(2);

    const packedUInt32_2 = new PackedUInt32_2(
      PackedUInt32_2.pack(uints),
      uints
    );
    const f = packedUInt32_2.packed;
    const unpacked = PackedUInt32_2.unpack(f);

    expect(unpacked[0].toBigint()).toBe(67n);
    expect(unpacked[1].toBigint()).toBe(2n ** 32n - 1n);
    expect(unpacked[0].toBigint()).toBe(packedUInt32_2.aux[0].toBigint());
    expect(unpacked[1].toBigint()).toBe(packedUInt32_2.aux[1].toBigint());
  });
  it('packs and unpacks 5 UInt32 values', async () => {
    const uints = [
      UInt32.from(67),
      UInt32.from(2n ** 32n - 1n),
      UInt32.from(0),
      UInt32.from(0),
      UInt32.from(128),
    ];
    const PackedUInt32_5 = PackedUInt32Factory(5);

    const packedUInt32_5 = new PackedUInt32_5(
      PackedUInt32_5.pack(uints),
      uints
    );
    const f = packedUInt32_5.packed;
    const unpacked = PackedUInt32_5.unpack(f);

    expect(unpacked[0].toBigint()).toBe(67n);
    expect(unpacked[1].toBigint()).toBe(2n ** 32n - 1n);
    expect(unpacked[2].toBigint()).toBe(0n);
    expect(unpacked[3].toBigint()).toBe(0n);
    expect(unpacked[4].toBigint()).toBe(128n);

    expect(unpacked[0].toBigint()).toBe(packedUInt32_5.aux[0].toBigint());
    expect(unpacked[1].toBigint()).toBe(packedUInt32_5.aux[1].toBigint());
    expect(unpacked[2].toBigint()).toBe(packedUInt32_5.aux[2].toBigint());
    expect(unpacked[3].toBigint()).toBe(packedUInt32_5.aux[3].toBigint());
    expect(unpacked[4].toBigint()).toBe(packedUInt32_5.aux[4].toBigint());
  });
  it('Validates with #check', () => {
    const uints = [
      UInt32.from(67),
      UInt32.from(2n ** 32n - 1n),
      UInt32.from(0),
      UInt32.from(0),
      UInt32.from(128),
    ];
    const PackedUInt32_5 = PackedUInt32Factory(5);

    Provable.runAndCheck(() => {
      const packedUInt32_5 = new PackedUInt32_5(
        PackedUInt32_5.pack(uints),
        uints
      );
    });
  });
  it('Is one field in size', () => {
    const uints = [
      UInt32.from(67),
      UInt32.from(2n ** 32n - 1n),
      UInt32.from(0),
      UInt32.from(0),
      UInt32.from(128),
    ];
    const PackedUInt32_5 = PackedUInt32Factory(5);

    expect(PackedUInt32_5.sizeInFields()).toBe(1);
    expect(
      PackedUInt32_5.toFields({ packed: PackedUInt32_5.pack(uints) }).toString()
    ).toBe([PackedUInt32_5.pack(uints)].toString());
  });
  it('throws for input >= 8 uints', () => {
    expect(() => PackedUInt32Factory(7)).not.toThrow();
    expect(() => PackedUInt32Factory(8)).toThrow();
  });
});