import { describe, expect, it } from 'vitest';
import { isValidCoordinates } from './store-coordinates';

describe('isValidCoordinates', () => {
  it('accepts geographic boundaries and coordinates in Spain', () => {
    expect(isValidCoordinates(-90, -180)).toBe(true);
    expect(isValidCoordinates(90, 180)).toBe(true);
    expect(isValidCoordinates(40.4168, -3.7038)).toBe(true);
  });

  it('rejects values outside geographic ranges', () => {
    expect(isValidCoordinates(-90.01, 0)).toBe(false);
    expect(isValidCoordinates(90.01, 0)).toBe(false);
    expect(isValidCoordinates(0, -180.01)).toBe(false);
    expect(isValidCoordinates(0, 180.01)).toBe(false);
  });

  it('rejects missing and non-finite runtime values', () => {
    expect(isValidCoordinates(undefined, 0)).toBe(false);
    expect(isValidCoordinates(0, undefined)).toBe(false);
    expect(isValidCoordinates(Number.NaN, 0)).toBe(false);
    expect(isValidCoordinates(0, Number.POSITIVE_INFINITY)).toBe(false);
    expect(isValidCoordinates('40', '-3')).toBe(false);
  });
});
