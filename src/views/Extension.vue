<template>
  <b-container b-fluid="md">
    <b-row>
      <b-col md="12">
        <extension-row
            :extension="extension"
            show-controls
            show-rating
            :show-description="false"
        />
      </b-col>
    </b-row>
    <b-row v-if='extension.screenshot'>
      <b-col md='12'>
        <b-img
          fluid
          center
          @click='screenshotMaximized = !screenshotMaximized'
          :src='extension.screenshot'
          :class='{ screenshot: true, "screenshot-maximized": screenshotMaximized }'
        />
      </b-col>
    </b-row>
    <b-row class='mt-3'>
      <b-col md="9">
        <b-card>
          <h5 class="mt-0">Description</h5>
          <p>{{ extension.description }}</p>
        </b-card>
      </b-col>
      <b-col md="3">
        <b-card>
          <h5 class="mt-0">Information</h5>

          <dd v-if="extension.url">
            <b-link :href="extension.url" target='_blank'><b-icon-house-door-fill /> Website</b-link>
          </dd>
          <dl>
            <dt>Version</dt>
            <dd>{{ lastVersion.version }}</dd>

            <dt>Updated</dt>
            <dd v-if="extension.updated">
              {{ extension.updated | moment("from", "now") }}
            </dd>
            <dd v-else>Unknown</dd>
          </dl>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<style lang='scss' scoped>
  .screenshot {
    cursor: pointer;
    max-height: 400px;
  }

  .screenshot-maximized {
    max-height: 1000px;
  }
</style>

<script>
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
</script>
