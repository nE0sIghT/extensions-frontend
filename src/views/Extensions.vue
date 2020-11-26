<template>
  <b-container b-fluid='md'>
    <b-row v-if="recommended">
      <b-col>
        <extensions-carousel :extensions='recommended.results'></extensions-carousel>
      </b-col>
    </b-row>

    <extensions-row
      v-if="recent"
      :title="$t('New extensions')"
      to="/search/?ordering=-created"
      :extensions="recent.results"
      #default="{ extension }">
        <div class='small text-center'>Created {{ extension.created | moment("from", "now") }}</div>
    </extensions-row>

    <extensions-row
      v-if="updated"
      :title="$t('Last updated')"
      to="/search/?ordering=-updated"
      :extensions="updated.results"
      #default="{ extension }">
        <div class='small text-center'>Updated {{ extension.updated | moment("from", "now") }}</div>
    </extensions-row>

    <extensions-row
      v-if="popular"
      :title="$t('Popular extensions')"
      to="/search/?ordering=-popularity"
      :extensions="popular.results"
      #default="{ extension }">
        <div class='small text-center'>Installs: {{ extension.popularity }}</div>
    </extensions-row>
  </b-container>
</template>

<script src="../js/extensions.js"></script>
