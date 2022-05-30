<template>
    <b-container b-fluid='md'>
        <b-alert :show="browserError" variant="warning">
          There were errors from browser extension:
          {{ browserError}}
        </b-alert>
        <extensions-list
            v-if="$browserApi"
            :extensions="installedExtensions"
            show-controls
        ></extensions-list>
        <b-alert v-else show variant="warning">
            Browser extension was not found.
        </b-alert>
    </b-container>    
</template>

<script src="../js/installed.js"></script>
