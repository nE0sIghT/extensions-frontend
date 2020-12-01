<template>
  <div id="sweettooth" clsss="gnome-body">
    <header class="gnome-header">
      <b-navbar class="p-0" toggleable="md" type="dark" fixed="top">
        <b-container fluid="md">
          <b-navbar-brand
            to="/"
            title="$t('GNOME Shell Extensions')"
            class="gnome-navbar-brand mr-auto"
            ><img
              src="/images/gnome-extensions.svg"
              alt="$t('GNOME Shell Extensions')"
          /></b-navbar-brand>

          <b-navbar-toggle target="search-wrapper">
            <template v-slot:default>
              <b-icon icon="search"></b-icon>
            </template>
          </b-navbar-toggle>

          <b-nav-text
            class="d-flex d-md-none menu-icon"
            @click="toggleUserMenu()"
          >
            <b-img v-if="user" class="avatar" :src="avatar(user.avatar)" :height="32" :width="32" />
          </b-nav-text>

          <b-nav-item v-if="n_unreviewed_extensions" href="/review">{{
            n_unreviewed_extensions
          }}</b-nav-item>

          <b-navbar-toggle target="navbar-wrapper" class="mr-2 order-md-10">
            <template v-slot:default>
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar top-bar"></span>
              <span class="icon-bar middle-bar"></span>
              <span class="icon-bar bottom-bar"></span>
            </template>
          </b-navbar-toggle>

          <b-collapse id="search-wrapper" class="order-md-8" is-nav>
            <b-navbar-nav>
              <b-nav-form @submit="onSearch" right>
                <b-input-group size="sm">
                  <b-input-group-prepend is-text>
                    <b-icon icon="search"></b-icon>
                  </b-input-group-prepend>
                  <b-form-input
                    v-model="search"
                    type="search"
                    :placeholder="$t('Search extensions…')"
                  ></b-form-input>
                </b-input-group>
              </b-nav-form>
            </b-navbar-nav>
          </b-collapse>

          <b-navbar-nav class="order-md-9 user-dropdown-wrapper">
            <b-nav-item-dropdown
              id="userDropdownMenu"
              ref="userDropdownMenu"
              right
              no-caret
            >
              <template v-if="user" v-slot:button-content>
                <b-img class="avatar" :src="avatar(user.avatar)" :height="32" :width="32" />
              </template>
              <template v-else v-slot:button-content>
                <span class="d-none d-md-inline dropdown-toggle">{{
                  $t("Log in")
                }}</span>
              </template>
              <template v-if="user">
                <!-- Set 'active-class' to avoid the default active styling. -->
                <b-dropdown-item 
                  exact-active-class="no-active-style"
                  active-class="no-active-style"
                  :to="profileLink">{{
                  $t("User Profile")
                }}</b-dropdown-item>
                <b-dropdown-item 
                  exact-active-class="no-active-style"
                  active-class="no-active-style"
                  to="/settings">{{
                  $t("User Settings")
                }}</b-dropdown-item>
                <b-dropdown-item
                  exact-active-class="no-active-style"
                  active-class="no-active-style"
                  @click="logout">{{
                  $t("Log out")
                }}</b-dropdown-item>
              </template>
              <b-dropdown-form v-else class="login_popup_form px-0" ref="loginForm" @submit="onLogin" @reset="onRegister">
                <b-form-group>
                  <b-form-input
                    type="text"
                    name="username"
                    autofocus="autofocus"
                    placeholder="Username or email"
                    class="form-control"
                    required
                    :state="login.username.state"
                    v-model="login.username.text"
                  />
                </b-form-group>
                <b-form-group>
                  <b-form-input
                    type="password"
                    name="password"
                    placeholder="Password"
                    class="form-control"
                    :state="login.password.state"
                    required
                    id="id_password"
                    v-model="login.password.text"
                  />
                  <b-form-invalid-feedback :state="login.password.state">
                    {{ login.password.feedback }}
                  </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group>
                  <b-button type="submit" variant="primary" block>{{
                    $t("Log in")
                  }}</b-button>
                </b-form-group>
                <b-form-group>
                  <router-link to="/reset-password">{{
                    $t("Forgot your password?")
                  }}</router-link>
                </b-form-group>
                <b-dropdown-divider></b-dropdown-divider>
                <p>{{ $t("Don't have an account?") }}</p>
                <b-form-group>
                  <b-button type="reset" variant="success" block>{{
                    $t("Register")
                  }}</b-button>
                </b-form-group>
              </b-dropdown-form>
            </b-nav-item-dropdown>
          </b-navbar-nav>

          <b-collapse id="navbar-wrapper" class="order-md-1" is-nav>
            <b-navbar-nav>
              <b-nav-item to="/">{{ $t('Extensions') }}</b-nav-item>
              <b-nav-item to="/installed/">{{ $t('Installed') }}</b-nav-item>
            </b-navbar-nav>
          </b-collapse>
        </b-container>
      </b-navbar>
    </header>

    <div class="clearfix"></div>

    <b-container id="container" class="gnome-content grow">
      <b-col>
        <!--
            <div id="message_container">
                <p v-for="message in messages" :key="message.id" :class="message.tags" class="message">{{ message.text }}</p>

                {% block extra-messages %}
                {% endblock %}
            </div>
            -->
          <router-view />
        </b-col>
    </b-container>

    <div class="clearfix"></div>

    <div id="footer">
      <b-container>
        <div class="row">
          <b-col class="links" cols="12" sm="9">
              <div class="menu-footer-container">
                <ul id="menu-footer" class="menu">
                  <li
                    id="menu-item-1048"
                    class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-1048"
                  >
                    <a href="//www.gnome.org">The GNOME Project</a>
                    <ul class="sub-menu">
                      <li><a href="//www.gnome.org/about/">About Us</a></li>
                      <li>
                        <a href="//www.gnome.org/get-involved/">Get Involved</a>
                      </li>
                      <li>
                        <a href="//www.gnome.org/support-gnome/"
                          >Support GNOME</a
                        >
                      </li>
                      <li>
                        <a href="//www.gnome.org/merchandise/">Merchandise</a>
                      </li>
                      <li><a href="//www.gnome.org/contact/">Contact Us</a></li>
                      <li><a href="//www.gnome.org/privacy/">Privacy</a></li>
                      <li>
                        <a href="//www.gnome.org/foundation/"
                          >The GNOME Foundation</a
                        >
                      </li>
                    </ul>
                  </li>
                  <li
                    id="menu-item-1047"
                    class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-1047"
                  >
                    <a href="#" onclick="return false;">Resources</a>
                    <ul class="sub-menu">
                      <li>
                        <a href="//developer.gnome.org">Developer Center</a>
                      </li>
                      <li><a href="//help.gnome.org">Documentation</a></li>
                      <li><a href="//wiki.gnome.org">Wiki</a></li>
                      <li>
                        <a href="//mail.gnome.org/mailman/listinfo"
                          >Mailing Lists</a
                        >
                      </li>
                      <li>
                        <a href="//wiki.gnome.org/Community/GettingInTouch/IRC"
                          >IRC Channels</a
                        >
                      </li>
                      <li><a href="//gitlab.gnome.org/">Bug Tracker</a></li>
                      <li>
                        <a href="//gitlab.gnome.org/">Development Code</a>
                      </li>
                    </ul>
                  </li>
                  <li
                    id="menu-item-1046"
                    class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-1046"
                  >
                    <a href="//www.gnome.org/news">News</a>
                    <ul class="sub-menu">
                      <li>
                        <a href="//www.gnome.org/press/">Press Releases</a>
                      </li>
                      <li>
                        <a href="//www.gnome.org/start/stable"
                          >Latest Release</a
                        >
                      </li>
                      <li><a href="//planet.gnome.org">Planet GNOME</a></li>
                    </ul>
                  </li>
                </ul>
              </div>
          </b-col>
        </div>
      </b-container>
      <!-- footnotes -->
      <b-container>
        <b-row>
            <b-col id="footnotes" sm="9">
              &copy; <strong class="gnome_logo">The GNOME Project</strong><br />
              <small>
                Free to share and remix:
                <a href="https://creativecommons.org/licenses/by/3.0/">
                  Creative Commons CC-BY
                </a>. Optimised for standards. Hosted by
                  <a href="https://www.redhat.com/">Red Hat</a>. Powered by
                  <a href="https://www.djangoproject.com">Django</a>,
                  <a href="https://vuejs.org">Vue.js</a> and
                  <a href="https://gitlab.gnome.org/Infrastructure/extensions-web">
                  SweetTooth
                </a>
              </small>
            </b-col>
        </b-row>
      </b-container>
      <div class="clear"></div>
    </div>
  </div>
</template>

<script src="./js/sweettooth.js"></script>
<style lang="scss">
$carousel-control-icon-width: 20px;
$carousel-control-color: "#000";
$custom-switch-width: 2rem;
@import "./css/bootstrap.scss";

// Let the content of the page expand to push the footer down on 'short' pages
#sweettooth {
    display: flex;
    flex-wrap: wrap;
    height: 100vh;

    & > div {
      width: 100%;

      &.grow {
        flex: 1 0 0;
      }
    }
}

</style>
<style lang="scss" src='./css/sweettooth.scss'></style>
