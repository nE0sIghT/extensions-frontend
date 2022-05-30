<template>
    <b-container b-fluid='md'>
        <extensions-list
            v-if="browserApi"
            :extensions="installedExtensions"
            show-controls
        ></extensions-list>
        <div v-else>
            TODO: No plugin
        </div>
    </b-container>    
</template>

<script src="../js/installed.js"></script>
