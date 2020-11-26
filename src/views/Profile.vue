<template>
  <b-container>
    <b-row v-if="profile">
      <b-col>
        <h2>{{ profile.username }}</h2>
        <b-img :src="profile.avatar" />
        <!-- TODO: Allow this string to be translated -->
        <p>
          Your avatar is managed through
          <a href="https://secure.gravatar.com/">Gravatar</a>
        </p>
        <b-row v-if="extensions.length > 0">
          <b-col>
            <!-- TODO: Allow this string to be translated -->
            <h3>{{ `${profile.username} has authored` }}</h3>
            <extensions-list :extensions="extensions">
            </extensions-list>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<style lang="scss" scoped>
.profile-icon {
  margin: 10px;
}
</style>

<script src="../js/profile.js"></script>