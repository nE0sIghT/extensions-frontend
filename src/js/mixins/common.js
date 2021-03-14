let prerelease_versions = {
    'alpha': -3,
    'beta': -2,
    'rc': -1,
};

function parseGNOMEVersion(value) {
    if(Object.keys(prerelease_versions).includes(value)) {
        return prerelease_versions[value];
    }

    return parseInt(value);
}

export default {
    methods: {
        getExtensionIcon(extension) {
            return extension.icon || '/images/plugin.png';
        },

        versionCompare(a, b) {
            a = a.split(".").map(parseGNOMEVersion);
            b = b.split(".").map(parseGNOMEVersion);

            for(let i = 0; i < Math.max(a.length, b.length); i++) {
                if(typeof(a[i]) == 'undefined' || typeof(b[i]) == 'undefined')
                {
                    return typeof(a[i]) == 'undefined' && -1 || 1;
                }
                else if(a[i] !== b[i]) {
                    return a[i] - b[i];
                }
            }

            return 0;
        },
    }
}
