import Vector from '../src/lib/Vector';

describe('Vector#magnitute', () => {
  test('success', () => {
    expect(new Vector(4, 3).magnitude()).toBe(5);
  });
});

describe('Vector#normalize', () => {
  test('vector length eq 1', () => {
    expect(new Vector(4, 3).normalize().magnitude()).toBe(1);
  });
});

describe('Vector#add', () => {
  test('success', () => {
    expect(new Vector(1, 0).add(new Vector(0, 1))).toEqual(expect.objectContaining({x: 1, y: 1}));
  });
});

describe('Vector#sub', () => {
  test('success', () => {
    expect(new Vector(1, 0).sub(new Vector(1, 1))).toEqual(expect.objectContaining({x: 0, y: -1}));
  });
});

describe('Vendor#cosin', () => {
  test('simple case', () => {
    expect(new Vector(1, 0).cosign(new Vector(1, 1))).toBeCloseTo(0.7071, 4);
  });

  test('when base is not vector', () => {
    expect(() => {
      new Vector(0, 0).cosign(new Vector(1, 1));
    }).toThrow();
  });

  test('when args is not vector', () => {
    expect(() => {
      new Vector(1, 0).cosign(new Vector(0, 0));
    }).toThrow();
  });
});

describe('Vector#angle', () => {
  test('when vectors are parallel', () => {
    expect(new Vector(1, 0).angle(new Vector(1, 0))).toEqual(0);
  });

  test('when vectors are right angle', () => {
    expect(new Vector(1, 0).angle(new Vector(0, 1))).toEqual(90);
  });

  test('when vector is first quadrant', () => {
    expect(new Vector(1, 0).angle(new Vector(1, 1))).toEqual(45);
  });

  test('when vector is second quadrant', () => {
    expect(new Vector(1, 0).angle(new Vector(-1, 1))).toEqual(135);
  });

  test('when vector is third quadrant', () => {
    expect(new Vector(1, 0).angle(new Vector(-1, -1))).toEqual(135);
  });

  test('when vector is fourth quadrant', () => {
    expect(new Vector(1, 0).angle(new Vector(1, -1))).toEqual(45);
  });

  test('when base object is not vector', () => {
    expect(() => {
      new Vector(0, 0).angle(new Vector(1, 0));
    }).toThrow();
  });

  test('when args object is not vector', () => {
    expect(() => {
      new Vector(1, 0).angle(new Vector(0, 0));
    }).toThrow();
  });
});
