import ExtensionRow from '../components/ExtensionRow'

export default {
    components: {
      ExtensionRow,
    },

    data() {
        return {
            extension: {
              downloads: 0,
              rated: 0,
            },
            ready: false,
            screenshotMaximized: false,
        };
    },

    computed: {
        lastVersion() {
            if(!this.extension?.versions)
                return {};

            return this.extension.versions.reduce((previous, current) => {
                return previous.version > current.version && previous || current;
            });
        },
    },

    created() {
        return this.$serverApiFp.v1ExtensionsRetrieve(this.$route.params.uuid).then(({ data: extension }) => {
            this.$serverApiFp.v1ExtensionsVersionsList(extension.uuid).then(({ data: {results: versions} }) => {
                this.extension = extension;
                this.extension.versions = versions;

                return this.$browserApi.then(api => {
                    return api.getExtensionInfo(this.$route.params.uuid).then(extension => {
                        this.extension = Object.assign({}, extension, this.extension);
                    });
                }).finally(() => {
                  this.ready = true;
                });
            });
        });
    },
};
