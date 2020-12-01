<template>
    <b-container>
        <b-row v-if="profile">
            <b-col>
                <h2>{{ profile.username }}</h2>
                <b-img :src="profile.avatar" />
                <i18n
                    tag="p"
                    path="views.profile.avatar-managed"
                >
                    <template v-slot:link>
                        <a href="https://secure.gravatar.com/">Gravatar</a>
                    </template>
                </i18n>
                <b-row v-if="extensions.length > 0">
                    <b-col>
                        <h3>{{ 
                              $t(`views.profile.has-authored`, {
                                  username: profile.username 
                              }) 
                            }}
                        </h3>
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