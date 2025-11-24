export const GEOHASH_REGEX = /^[0-9bcdefghjkmnpqrstuvwxyz]{1,12}$/;
const GEOHASH_BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';

export function decodeGeohash(geohash) {
    if (typeof geohash !== 'string' || !isValidGeohash(geohash)) {
        throw new Error('Invalid geohash');
    }

    const bounds = {
        lat: [-90, 90],
        lng: [-180, 180]
    };

    let isEven = true;
    for (let i = 0; i < geohash.length; i++) {
        const cd = GEOHASH_BASE32.indexOf(geohash[i].toLowerCase());
        for (let j = 4; j >= 0; j--) {
            const mask = 1 << j;
            if (isEven) {
                bounds.lng = (cd & mask)
                    ? [(bounds.lng[0] + bounds.lng[1]) / 2, bounds.lng[1]]
                    : [bounds.lng[0], (bounds.lng[0] + bounds.lng[1]) / 2];
            } else {
                bounds.lat = (cd & mask)
                    ? [(bounds.lat[0] + bounds.lat[1]) / 2, bounds.lat[1]]
                    : [bounds.lat[0], (bounds.lat[0] + bounds.lat[1]) / 2];
            }
            isEven = !isEven;
        }
    }

    return {
        lat: (bounds.lat[0] + bounds.lat[1]) / 2,
        lng: (bounds.lng[0] + bounds.lng[1]) / 2
    };
}

export function getGeohashLocation(geohash) {
    const coords = decodeGeohash(geohash);
    const lat = coords.lat;
    const lng = coords.lng;

    const latStr = `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? 'N' : 'S'}`;
    const lngStr = `${Math.abs(lng).toFixed(2)}°${lng >= 0 ? 'E' : 'W'}`;

    return `${latStr}, ${lngStr}`;
}

export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export function isValidGeohash(str) {
    if (!str) return false;
    return GEOHASH_REGEX.test(str.toLowerCase());
}

export function validateGeohashInput(input) {
    const validChars = '0123456789bcdefghjkmnpqrstuvwxyz';
    return input.split('').every(char => validChars.includes(char.toLowerCase()));
}

export function describeGeohashDistance(origin, target) {
    const originCoords = typeof origin === 'string' ? decodeGeohash(origin) : origin;
    const targetCoords = typeof target === 'string' ? decodeGeohash(target) : target;
    return calculateDistance(originCoords.lat, originCoords.lng, targetCoords.lat, targetCoords.lng);
}

export default {
    GEOHASH_REGEX,
    decodeGeohash,
    getGeohashLocation,
    calculateDistance,
    isValidGeohash,
    validateGeohashInput,
    describeGeohashDistance
};
