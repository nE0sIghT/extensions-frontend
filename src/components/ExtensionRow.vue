<template>
  <b-overlay
    :show="extension.busy"
    rounded
    opacity="0.6"
    spinner-variant="primary"
    no-fade
  >
    <b-media>
      <template #aside>
        <b-img
          :src="getExtensionIcon(extension)"
          :alt="extension.name"
          class="extension-icon"
          :style="iconStyle"
        ></b-img>
      </template>

      <div class="extension-row-header">
        <h5 class="mt-0">
          <b-link :to="`/extension/${extension.uuid}`">
            {{ extension.name }}
          </b-link>
        </h5>
        <div class="status-icons">
          <b-icon
            v-if="isSystem(extension)"
            v-b-popover.hover="$t('This extension is installed systemwide')"
            icon="lock-fill"
            :class="getIconClasses('bg-primary')"
            aria-hidden="true"
          ></b-icon>
          <b-icon
            v-if="extension.hasUpdate"
            v-b-popover.hover="
              $t('Update will be applied on next Shell restart')
            "
            icon="cloud-download"
            :class="getIconClasses('bg-success')"
            aria-hidden="true"
          ></b-icon>
          <b-icon
            v-if="haveError(extension)"
            v-b-popover.hover="
              `${$t('Extension error occured:')} ${extension.error}`
            "
            icon="exclamation"
            class="extension-error"
            :class="getIconClasses('bg-danger')"
            aria-hidden="true"
          ></b-icon>
        </div>
        <div v-if="controlsAvailable(extension)" class="controls">
          <extension-toggle
            :checked="isEnabled(extension)"
            @click="toggle(extension)"
          ></extension-toggle>
          <b-icon
            v-if="isServerUpdateAvailable(extension)"
            icon="cloud-download"
            :class="getIconClasses('bg-success')"
            @click="installExtension(extension)"
            v-b-popover.hover.top="$t('Update')"
            aria-hidden="true"
          ></b-icon>
          <b-icon
            icon="gear"
            :class="getPreferencesIconClasses(extension)"
            @click="openPreferences(extension)"
            v-b-popover.hover.top="$t('Settings')"
            aria-hidden="true"
          ></b-icon>
          <div
            class="icon-wrapper"
            v-b-popover.hover.top="getUninstallPopover(extension)"
          >
            <b-icon
              icon="x"
              :class="getDeleteIconClasses(extension)"
              @click="uninstallExtension(extension)"
              aria-hidden="true"
            ></b-icon>
          </div>
        </div>
        <div v-if="showControls && isUninstalled(extension)" class="controls">
          <b-button variant="primary" class="float-right">Install</b-button>
        </div>
      </div>
      <h6 class="author">by <user-link :user="extension.creator" /></h6>
      <p class="d-flex align-items-center" v-if="showRating">
        <b-form-rating
          inline
          no-border
          readonly
          class="pl-0 pr-1"
          size="sm"
          :value="extension.rating"
          v-b-tooltip.hover
          :title="`${rating(extension)} from ${extension.rated} voices`"
        />
        {{ extension.rated }}
        <span class="divider"></span>
        <b-icon-people-fill class="mr-1" />{{ downloads(extension) }} downloads
      </p>
      <p v-if="showDescription">{{ extension.description }}</p>
    </b-media>
  </b-overlay>
</template>

<script>
import common from "../js/mixins/common";
import browserMixin from "../js/mixins/browser";
import ExtensionToggle from "./ExtensionToggle";
import UserLink from "../components/UserLink";
import constants from "../js/constants";

const defaultIconClasses = {
  "rounded-circle": true,
};

export default {
  mixins: [common, browserMixin],

  components: {
    ExtensionToggle,
    UserLink,
  },

  props: {
    extension: Object,
    iconWidth: String,
    showControls: {
      type: Boolean,
      default: false,
    },
    showDescription: {
      type: Boolean,
      default: true,
    },
    showRating: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {};
  },

  computed: {
    iconStyle() {
      if (this.iconWidth) {
        return {
          width: this.iconWidth,
        };
      }

      return {};
    },
  },

  methods: {
    controlsAvailable(extension) {
      return this.showControls && !this.isUninstalled(extension);
    },

    getIconClasses(backgroundClass, extraClasses) {
      return Object.assign(
        {},
        defaultIconClasses,
        {
          [backgroundClass]: true,
        },
        extraClasses
      );
    },

    getPreferencesIconClasses(extension) {
      return this.getIconClasses("bg-info", { disabled: !extension.hasPrefs });
    },

    getDeleteIconClasses(extension) {
      return this.getIconClasses("bg-danger", {
        disabled: this.isSystem(extension),
      });
    },

    getToggleIcon(extension) {
      return (this.isEnabled(extension) && "toggle-on") || "toggle-off";
    },

    getToggleVariant(extension) {
      return (this.isEnabled(extension) && "success") || "secondary";
    },

    getUninstallPopover(extension) {
      return (
        (this.isSystem(extension) &&
          this.$t("Systemwide extensions can not be uninstalled here")) ||
        this.$t("Uninstall")
      );
    },

    isServerUpdateAvailable(extension) {
      return (
        !extension.hasUpdate &&
        extension.update?.action == "change" &&
        extension.version != extension.update?.version
      );
    },

    isUninstalled(extension) {
      return (
        !extension.state ||
        extension.state == constants.ExtensionState.UNINSTALLED
      );
    },

    downloads(extension) {
      return extension?.downloads?.toLocaleString();
    },

    rating(extension) {
      return Math.round(extension.rating * 100) / 100;
    },

    async toggle(extension) {
      if (extension.busy) {
        return;
      }

      extension.busy = true;
      let enabled = this.isEnabled(extension);
      let api = await this.api.browser;

      return api.setExtensionEnabled(extension.uuid, !enabled).then(() => {
        extension.busy = false;
      });
    },
  },
};
</script>

<style lang='scss' scoped>
  .author {
    color: #333;
  }

  .divider {
    margin: 0 10px;
    width: 1px;
    height: 1em;
    display: inline-block;
    border-left: 1px solid #333;
  }

  .extension-icon {
    min-width: 32px;
    max-width: 96px;
  }

  $extension-toggle-width: 54px;
  $icon_width: 32px;
  $control_padding: 2px;
  $extension-row-padding: 1.5rem;

  .extension-row {
    padding: $extension-row-padding 0;
    position: relative;
  }

  .extension-row:not(:last-child):after {
    content: "";
    position: absolute;
    left: 10%;
    bottom: 0px;
    width: 80%;
    border-bottom: 1px solid #aaa;
  }

  .extension-row-header {
    display: flex;
    align-items: center;

    h3 {
      font-size: 1.2rem;
      line-height: 32px;
    }

    img {
      width: 32px;
      height: 32px;
      margin-right: 6px;
      vertical-align: bottom;
    }

    .status-icons {
      margin-left: 5px;

      .b-icon {
        width: 20px;
        height: 20px;
        padding: 0 4px;
        margin: 0 $control_padding;
      }

      .extension-error {
        padding: 0;
      }
    }

    .controls {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-left: auto;
      min-width: $extension-toggle-width + ($icon_width * 3) +
        ($control_padding * 4 * 2);

      > * {
        margin: 0 $control_padding;
      }

      .b-icon {
        color: #fff;
      }

      .b-icon:hover {
        filter: brightness(125%);
      }

      .icon-wrapper,
      .b-icon {
        width: $icon_width;
        height: $icon_width;
        cursor: pointer;
      }

      .b-icon {
        padding: 7px;
      }

      .b-icon:hover {
        filter: brightness(125%);
      }

      .b-icon.disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }

      .b-icon.switch {
        width: 48px;
        height: 100%;
        padding: 0;
        margin: 0 2px;
      }

      .switch::before {
        content: "";
        width: 16px;
        height: 16px;
        border-radius: 50%;
        display: block;
        background: #f00;
        transition: background-color 0.25s, background-color 0.25s,
          transform 0.25s;
      }
    }
  }

  .icon-align {
    margin-left: 38px;
  }

  .author {
    margin-bottom: 5px;
  }
</style>
