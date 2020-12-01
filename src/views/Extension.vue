<template>
    <b-container>
        <b-row v-if="extension">
            <b-col cols="auto">
                <b-img
                    :src="extension.icon || '/images/plugin.png'"
                    class="extension-icon"
                    left
                    width="32px"
                    height="32px"
                />
            </b-col>
            <b-col>
                <b-row>
                    <b-col align-self="start">
                        <b-row>
                            <b-col>
                                <h3>{{ extension.name }}</h3>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col>
                                <p>
                                    by
                                    <router-link :to="getProfileLink(extension.creator)">{{
                    extension.creator.username
                  }}</router-link>
                                </p>
                            </b-col>
                        </b-row>
                    </b-col>
                    <b-col
                        align-self="start"
                        cols="auto"
                    >
                        <b-button variant="success">Install</b-button>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-row align-h="end"> </b-row>
                        <b-row
                            align-content="start"
                            align-h="start"
                        >
                            <b-col cols="12">
                                <p>{{ extension.description }}</p>
                            </b-col>
                        </b-row>
                        <b-row
                            align-content="start"
                            align-h="start"
                        >
                            <b-col cols="auto">
                                <h6>Extension Homepage</h6>
                                <a :href="extension.url">{{ extension.url }}</a>
                            </b-col>
                        </b-row>
                        <b-row v-if="extension.screenshots.length > 0">
                            <b-col>
                                <screenshot-carousel :screenshots="screenshots" />
                            </b-col>
                        </b-row>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <h4>{{ $t('User Reviews') }} </h4>
                <div class="comment-holder">
                    <comment
                        v-for="comment of comments"
                        :key="comment.id"
                        :comment="comment"
                    />
                </div>
            </b-col>
            <b-col>
                <div
                    v-if="user"
                    v-html="form_html"
                    id="commentFormContainer"
                />
                <!-- If user == null, the user is not signed in. -->
                <div v-else>
                    <i18n
                        tag="p"
                        path="comment-login-prompt.text"
                        for="comment-login-prompt.link"
                    >
                        <template v-slot:link>
                            <a href="/login">{{ $t('comment-login-prompt.link') }}</a>
                        </template>
                    </i18n>
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<style lang="scss" scoped>
.extension-icon {
    margin: 10px;
}
</style>

<script src="../js/extension.js"></script>