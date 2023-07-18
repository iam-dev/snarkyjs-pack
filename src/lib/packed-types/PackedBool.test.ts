import { Bool, Provable } from 'snarkyjs';
import { PackedBoolFactory } from './PackedBool';

describe('PackedBool', () => {
  class PackedBool extends PackedBoolFactory(254) {}
  const booleans = new Array(127).fill([true, false]).flat();
  const bools = booleans.map((x) => Bool(x));
  describe('Outside of the circuit', () => {
    it('#fromBooleans', () => {
      const myPackedBool = PackedBool.fromBooleans(booleans);
      expect(myPackedBool.toBooleans()).toMatchObject(booleans);
    });

    it('#pack and #unPack', () => {
      const packed = PackedBool.pack(bools);
      const unpacked = PackedBool.unpack(packed);

      expect(unpacked.length).toBe(bools.length);
      expect(unpacked).toMatchObject(bools);
    });
  });
  describe('Provable Properties', () => {
    it('#sizeInFields', () => {
      class one extends PackedBoolFactory(1) {}
      class two_five_four extends PackedBoolFactory(254) {}

      expect(one.sizeInFields()).toBe(1);
      expect(two_five_four.sizeInFields()).toBe(1);
    });
  });
  describe('Defensive Cases', () => {
    it('throws for input >= 255 bools', () => {
      expect(() => PackedBoolFactory(254)).not.toThrow();
      expect(() => PackedBoolFactory(255)).toThrow();
    });

    it('initalizes with more input than allowed', () => {
      const tooMany = [...booleans].concat(false);

      expect(() => {
        PackedBool.fromBooleans(tooMany);
      }).toThrow();
    });
  });
  describe('In the circuit', () => {
    const outsidePackedBool = PackedBool.fromBooleans(booleans);

    it('Initializes', () => {
      expect(() => {
        Provable.runAndCheck(() => {
          const packedBool = new PackedBool(
            outsidePackedBool.packed,
            outsidePackedBool.aux
          );

          PackedBool.check({ packed: packedBool.packed });
        });
      }).not.toThrow();
    });
    it('#assertEquals', () => {
      expect(() => {
        Provable.runAndCheck(() => {
          const packedBool = new PackedBool(
            outsidePackedBool.packed,
            outsidePackedBool.aux
          );
          packedBool.assertEquals(outsidePackedBool);
        });
      }).not.toThrow();
      expect(() => {
        Provable.runAndCheck(() => {
          const fakePacked = outsidePackedBool.packed.add(32);
          const packedBool = new PackedBool(fakePacked, outsidePackedBool.aux);
          packedBool.assertEquals(outsidePackedBool);
        });
      }).toThrow();
    });
  });
});
