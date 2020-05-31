export default (() => {
    return {
        ExtensionType: {
            SYSTEM:     1,
            PER_USER:   2,
        },

        ExtensionState: {
            ENABLED:        1,
            DISABLED:       2,
            ERROR:          3,
            OUT_OF_DATE:    4,
            DOWNLOADING:    5,
            INITIALIZED:    6,

            // Used as an error state for operations on unknown extensions,
            // should never be in a real extensionMeta object.
            UNINSTALLED: 99,
        },

        STATUS: {
            UNREVIEWED: 0,
            REJECTED:   1,
            INACTIVE:   2,
            ACTIVE:     3,
            WAITING:    4,
        },
    };
})();
