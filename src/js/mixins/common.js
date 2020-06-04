export default {
    methods: {
        versionCompare(a, b) {
            a = a.split(".").map(parseInt);
            b = b.split(".").map(parseInt);

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
