<template>
  <b-container b-fluid='md'>
    <b-row v-if="recommended.results">
      <b-col>
        <extensions-carousel :extensions='recommended.results'></extensions-carousel>
      </b-col>
    </b-row>

    <extensions-card
      :title="$t('New extensions')"
      to="/search/?new"
      :extensions="recent.results"
      #default="{ extension }">
        <div class='small text-center'>Created {{ extension.created | moment("from", "now") }}</div>
    </extensions-card>

    <extensions-card
      :title="$t('Last updated')"
      to="/search/?updated"
      :extensions="updated.results"
      #default="{ extension }">
        <div class='small text-center'>Updated {{ extension.updated | moment("from", "now") }}</div>
    </extensions-card>

    <extensions-card
      :title="$t('Popular extensions')"
      to="/search/?popular"
      :extensions="popular.results"
      #default="{ extension }">
        <div class='small text-center'>Installs: {{ extension.popularity }}</div>
    </extensions-card>
  </b-container>
</template>

<script src="../js/extensions.js"></script>
