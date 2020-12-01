<template>
    <b-container b-fluid='md'>
        <browser-api>
            <local-extensions-list
                :extensions="installedExtensions"
                controls
            ></local-extensions-list>
            <div slot="fallback">
                <i18n
                    tag="p"
                    path="missing-native-plugin.text"
                    for="missing-native-plugin.link"
                >
                    <template v-slot:link>
                        <a href="/about/#no-detection">{{ $t('missing-native-plugin.link') }}</a>
                    </template>
                </i18n>
            </div>
        </browser-api>
    </b-container>
</template>

<script src="../js/installed.js"></script>
