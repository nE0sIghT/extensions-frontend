/**
 * @param {string} a 
 * @param {string} b
 * @returns {number}
 */
export function versionCompare(a, b) {
    let av = a.split(".").map(parseInt);
    let bv = b.split(".").map(parseInt);

    for (let i = 0; i < Math.max(av.length, bv.length); i++) {
        if (typeof (av[i]) == 'undefined' || typeof (bv[i]) == 'undefined') {
            return typeof (av[i]) == 'undefined' && -1 || 1;
        }
        else if (av[i] !== bv[i]) {
            return av[i] - bv[i];
        }
    }

    return 0;
}