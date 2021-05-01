import Coordinate from '../src/coordinate';
import Vector from '../src/vector';

describe('Coordinate#move', () => {
  test('success', () => {
    const cood = new Coordinate(new Vector(0, 0), 0);
    cood.move(1, 0);
    expect(cood.pos).toEqual(expect.objectContaining({x: 1, y: 0}));
  });

  test('when rotated', () => {
    const cood = new Coordinate(new Vector(0, 0), 45);
    cood.move(1, 0);
    expect(cood.pos.x).toBeCloseTo(0.707106, 5);
    expect(cood.pos.y).toBeCloseTo(0.707106, 5);
  });
});

describe('Coordinate#rotate', () => {
  test('success', () => {
    const cood = new Coordinate(new Vector(0, 0), 0);
    cood.rotate(10);
    expect(cood).toEqual(expect.objectContaining({theta: 10}));
  });

  test('when result of thete is over 360 degree', () => {
    const cood = new Coordinate(new Vector(0, 0), 180);
    cood.rotate(190);
    expect(cood).toEqual(expect.objectContaining({theta: 10}));
  });
});

describe('Coordinate#convertToWorld', () => {
  test('success', () => {
    const cood = new Coordinate(new Vector(3, 3), 90);
    expect(cood.convertToWorld(new Vector(1, 1))).toEqual(expect.objectContaining({x: 2, y: 4}));
  });
});

describe('Coordinate#convertToLocal', () => {
  test('success', () => {
    const cood = new Coordinate(new Vector(3, 3), 90);
    const actual = cood.convertToLocal(new Vector(1, 1));
    expect(actual.x).toBeCloseTo(-2, 5);
    expect(actual.y).toBeCloseTo(2, 5);
  });

  test('rotate inverse', () => {
    const cood = new Coordinate(new Vector(3, 3), -90);
    const actual = cood.convertToLocal(new Vector(1, 1));
    expect(actual.x).toBeCloseTo(2, 5);
    expect(actual.y).toBeCloseTo(-2, 5);
  });

  test('rotate minus', () => {
    const cood = new Coordinate(new Vector(0, 0), -45);
    const actual = cood.convertToLocal(new Vector(1, 1));
    expect(actual.x).toBeCloseTo(0, 5);
    expect(actual.y).toBeCloseTo(1.41421, 5);
  });

  test('rotate and move', () => {
    const cood = new Coordinate(new Vector(3, 3), 45);
    const actual = cood.convertToLocal(new Vector(1, 1));
    expect(actual.x).toBeCloseTo(-2.828427, 5);
    expect(actual.y).toBeCloseTo(0, 5);
  });
});
