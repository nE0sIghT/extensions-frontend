<template>
  <div id="sweettooth" clsss='gnome-body'>
    <header class="gnome-header">
        <b-navbar class='p-0' toggleable="md" type="dark" fixed="top">
            <b-container fluid='md'>
                <b-navbar-brand to="/" title="$t('GNOME Shell Extensions')" class="gnome-navbar-brand mr-auto"><img src="/images/gnome-extensions.svg" alt="$t('GNOME Shell Extensions')" /></b-navbar-brand>

                <b-navbar-toggle target="search-wrapper">
                    <template v-slot:default>
                        <b-icon icon='search'></b-icon>
                    </template>
                </b-navbar-toggle>

                <b-nav-text class='d-flex d-md-none menu-icon' @click="toggleUserMenu()">
                    <img class='avatar' :src="avatar(user.avatar)" />
                </b-nav-text>

                <b-nav-item v-if="n_unreviewed_extensions" href='/review'>{{ n_unreviewed_extensions }}</b-nav-item>

                <b-navbar-toggle target="navbar-wrapper" class='mr-2 order-md-10'>
                    <template v-slot:default>
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar top-bar"></span>
                        <span class="icon-bar middle-bar"></span>
                        <span class="icon-bar bottom-bar"></span>
                    </template>
                </b-navbar-toggle>

                <b-collapse id="search-wrapper" class='order-md-8' is-nav>
                    <b-navbar-nav>
                        <b-nav-form right>
                            <b-input-group size="sm">
                                <b-input-group-prepend is-text>
                                    <b-icon icon="search"></b-icon>
                                </b-input-group-prepend>
                                <b-form-input type="search" :placeholder="$t('Search extensions')"></b-form-input>
                            </b-input-group>
                        </b-nav-form>
                    </b-navbar-nav>
                </b-collapse>

                <b-navbar-nav class='order-md-9 user-dropdown-wrapper'>
                    <b-nav-item-dropdown id='userDropdownMenu' ref='userDropdownMenu' right no-caret>
                        <template v-if="user.is_authenticated" v-slot:button-content>
                            <img class='avatar d-md-inline' :src="avatar(user.avatar)" />
                        </template>
                        <template v-else v-slot:button-content>
                            <span class="d-none d-md-inline dropdown-toggle">{{ $t("Log in") }}</span>
                        </template>
                        <div v-if="user.is_authenticated" class="row">
                            <b-dropdown-item :href="`/profile/${user.id}`">{{ $t('User Profile') }}</b-dropdown-item>
                            <b-dropdown-item href="/settings">{{ $t('User Settings') }}</b-dropdown-item>
                            <b-dropdown-item href="/logout">{{ $t('Log out') }}</b-dropdown-item>
                        </div>
                        <b-dropdown-form v-else class='login_popup_form px-0'>
                            <span v-html="backend_forms.login_popup_form"></span>
                            <b-form-group>
                                <b-button variant="primary" block @click.stop="onLogin">{{ $t('Log in') }}</b-button>
                            </b-form-group>
                            <b-form-group>
                                <router-link to="/reset-password">{{ $t('Forgot your password?') }}</router-link>
                            </b-form-group>
                            <b-dropdown-divider></b-dropdown-divider>
                            <p>{{ $t("Don't have an account?") }}</p>
                            <b-form-group>
                                <b-button to="/register" variant="success" block>{{ $t('Register') }}</b-button>
                            </b-form-group>
                        </b-dropdown-form>
                    </b-nav-item-dropdown>
                </b-navbar-nav>

                <b-collapse id="navbar-wrapper" class='order-md-1' is-nav>
                    <b-navbar-nav>
                        <b-nav-item v-for="page in navigationMenu" :key="page.path" :to="page.path">{{ $t(page.name) }}</b-nav-item>
                    </b-navbar-nav>
                </b-collapse>

                <b-navbar-nav v-if='0' right>
                    <li id="userDropdownMenu" class="dropdown">
                    {% spaceless %}
                    {% if request.user.is_authenticated %}
                        <a href="{% url 'auth-profile' user=request.user.username %}" class="dropdown-toggle hidden-md avatar" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><img src="{% gravatar_url request request.user.email %}"></a>
                    {% else %}
                        <a href="{% url 'auth-login' %}" class="dropdown-toggle hidden-md" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{% trans "Log in" %} <span class="caret"></span></a>
                    {% endif %}
                    {% endspaceless %}
                        <ul class="dropdown-menu login_popup_form">
                            <li>
                                {% include "usermenu.html" %}
                            </li>
                        </ul>
                    </li>
                </b-navbar-nav>
            </b-container>
        </b-navbar>
    </header>

    <div class="clearfix"></div>

    <div id="container" class="container gnome-content">
        <div class="col-sm-12">
            <!--
            <div id="message_container">
                <p v-for="message in messages" :key="message.id" :class="message.tags" class="message">{{ message.text }}</p>

                {% block extra-messages %}
                {% endblock %}
            </div>
            -->
            <router-view/>
        </div>
    </div>

    <div class="clearfix"></div>

    <div id="footer">
        <div class="container">
            <div class="row">
                <div class="col-sm-12">
                    <div class="links col-xs-12 col-sm-9">
                        <div class="menu-footer-container">
                            <ul id="menu-footer" class="menu">
                                <li id="menu-item-1048" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-1048"><a href="//www.gnome.org">The GNOME Project</a>
                                    <ul class="sub-menu">
                                        <li><a href="//www.gnome.org/about/">About Us</a></li>
                                        <li><a href="//www.gnome.org/get-involved/">Get Involved</a></li>
                                        <li><a href="//www.gnome.org/support-gnome/">Support GNOME</a></li>
                                        <li><a href="//www.gnome.org/merchandise/">Merchandise</a></li>
                                        <li><a href="//www.gnome.org/contact/">Contact Us</a></li>
                                        <li><a href="//www.gnome.org/privacy/">Privacy</a></li>
                                        <li><a href="//www.gnome.org/foundation/">The GNOME Foundation</a></li>
                                    </ul>
                                </li>
                                <li id="menu-item-1047" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-1047"><a href="#" onclick="return false;">Resources</a>
                                    <ul class="sub-menu">
                                        <li><a href="//developer.gnome.org">Developer Center</a></li>
                                        <li><a href="//help.gnome.org">Documentation</a></li>
                                        <li><a href="//wiki.gnome.org">Wiki</a></li>
                                        <li><a href="//mail.gnome.org/mailman/listinfo">Mailing Lists</a></li>
                                        <li><a href="//wiki.gnome.org/Community/GettingInTouch/IRC">IRC Channels</a></li>
                                        <li><a href="//gitlab.gnome.org/">Bug Tracker</a></li>
                                        <li><a href="//gitlab.gnome.org/">Development Code</a></li>
                                    </ul>
                                </li>
                                <li id="menu-item-1046" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-1046"><a href="//www.gnome.org/news">News</a>
                                    <ul class="sub-menu">
                                        <li><a href="//www.gnome.org/press/">Press Releases</a></li>
                                        <li><a href="//www.gnome.org/start/stable">Latest Release</a></li>
                                        <li><a href="//planet.gnome.org">Planet GNOME</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- footnotes -->
        <div class="container">
            <div class="row">
                <div class="col-sm-12">
                    <div id="footnotes" class="col-sm-9">
                        &copy; <strong class="gnome_logo">The GNOME Project</strong><br>
                        <small>Free to share and remix: <a href="https://creativecommons.org/licenses/by/3.0/">Creative Commons CC-BY</a>. Optimised for standards. Hosted by <a href="https://www.redhat.com/">Red Hat</a>. Powered by <a href="https://www.djangoproject.com">Django</a>, <a href="https://vuejs.org">Vue.js</a> and <a href="https://gitlab.gnome.org/Infrastructure/extensions-web">SweetTooth</a></small>
                    </div>
                </div>
            </div>
        </div>
        <div class="clear"></div>
    </div>
  </div>
</template>

<script src="./js/sweettooth.js"></script>
<style lang="scss">
    $carousel-control-icon-width:        20px;
    $carousel-control-color:             '#000';
    @import './css/bootstrap.scss';
</style>
<style lang="scss" src='./css/sweettooth.scss'></style>
