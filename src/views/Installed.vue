<template>
    <b-container b-fluid='md'>
        <browser-api>
            <local-extensions-list
                :extensions="installedExtensions"
                controls
            ></local-extensions-list>
            <div slot="fallback">
                TODO: No plugin
            </div>
        </browser-api>
    </b-container>
</template>

<script src="../js/installed.js"></script>
