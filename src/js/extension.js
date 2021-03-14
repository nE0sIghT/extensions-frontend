import browserMixin from './mixins/browser'
import serverMixin from './mixins/server'
import ExtensionRow from '../components/ExtensionRow'

export default {
    mixins: [browserMixin, serverMixin],

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
        return this.api.server.extension(this.$route.params.uuid).then(({ data: extension }) => {
            this.api.server.extensionVersions(extension.uuid).then(({ data: {results: versions} }) => {
                this.extension = extension;
                this.extension.versions = versions;

                return this.api.browser.then(api => {
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
