import { describe, expect, it } from 'vitest';
import {
    GEOHASH_REGEX,
    calculateDistance,
    decodeGeohash,
    getGeohashLocation,
    isValidGeohash,
    validateGeohashInput
} from '../src/geoUtils.js';

describe('geoUtils', () => {
    it('validates geohash characters', () => {
        expect(isValidGeohash('u4pruydqqvj')).toBe(true);
        expect(isValidGeohash('U4PRUYDQQVJ')).toBe(true);
        expect(isValidGeohash('bad*chars')).toBe(false);
    });

    it('exposes a reusable regex', () => {
        expect(GEOHASH_REGEX.test('ezs42')).toBe(true);
        expect(GEOHASH_REGEX.test('invalid!')).toBe(false);
    });

    it('decodes geohashes into coordinates', () => {
        const coords = decodeGeohash('ezs42');
        expect(coords).toHaveProperty('lat');
        expect(coords).toHaveProperty('lng');
        expect(coords.lat).toBeGreaterThan(40);
        expect(coords.lng).toBeLessThan(-70);
    });

    it('formats a geohash location string', () => {
        expect(getGeohashLocation('ezs42')).toMatch(/°N, .*°W/);
    });

    it('calculates great-circle distance between points', () => {
        const boston = decodeGeohash('drt2yz');
        const newYork = decodeGeohash('dr5reg');
        const distance = calculateDistance(boston.lat, boston.lng, newYork.lat, newYork.lng);
        expect(distance).toBeGreaterThan(250);
        expect(distance).toBeLessThan(400);
    });

    it('validates raw geohash input characters', () => {
        expect(validateGeohashInput('u4pruydqqvj')).toBe(true);
        expect(validateGeohashInput('u4p ruydqqvj')).toBe(false);
    });
});
