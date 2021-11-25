<template>
  <Toast />
  <div class="container">
    <div class="box">
      <h1>Login</h1>

      <div class="p-fluid p-formgrid p-grid">
        <div
          class="p-field p-col-11"
          style="margin-left: 1rem; margin-top: 1rem"
        >
          <label for="email">E-mail</label>
          <InputText
            id="email"
            type="text"
            v-model.trim="login.email"
            :autofocus="true"
            aria-describedby="email-help"
            :class="submitted && !login.email ? 'p-invalid' : ''"
          />
          <small
            id="email-help"
            v-if="submitted && !login.email"
            class="p-error"
          >
            E-mail is required!
          </small>
        </div>

        <div class="p-field p-col-11" style="margin-left: 1rem">
          <label for="password">Password</label>
          <Password
            id="password"
            v-model.trim="login.password"
            :toggleMask="true"
            :feedback="false"
            aria-describedby="password-help"
            :class="submitted && !login.password ? 'p-invalid' : ''"
          />
          <small
            id="password-help"
            v-if="submitted && !login.password"
            class="p-error"
          >
            Password is required!
          </small>
        </div>

        <div className="p-field p-col-11" style="margin-left: 1rem">
          <a href="#" @click="openCreateUser()" class="link">
            Don't have a user yet?
          </a>
        </div>

        <div class="p-field p-col-4 p-md-4" style="margin-left: 1rem">
          <Button
            label="Login"
            @click="actionLogin()"
            :disabled="spinLoader"
            class="p-button-primary"
            icon="pi pi-sign-in"
            iconPos="right"
          />
        </div>

        <div class="p-field p-col-12 p-md-3">
          <div v-if="spinLoader" class="spin-loader" />
        </div>
      </div>
    </div>
  </div>

  <CreateUser v-model:visible="visibleCreateUser" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { AxiosError } from 'axios';

import CreateUser from './CreateUser.vue';

import { ILogin } from '@/interfaces/all';
import AuthenticationService from '@/services/AuthenticationService';
import UserService from '@/services/UserService';
import Messages from '@/utils/Messages';
import StringUtils from '@/utils/StringUtils';

export default defineComponent({
  setup() {
    let authenticationService = new AuthenticationService();
    let userService = new UserService();
    let visibleCreateUser = ref(false);

    return {
      authenticationService,
      userService,
      visibleCreateUser,
    };
  },
  data() {
    return {
      login: {
        email: '',
        password: '',
      } as ILogin,
      submitted: false,
      spinLoader: false,
    };
  },
  methods: {
    openCreateUser() {
      this.visibleCreateUser = true;
    },

    validLogin(): boolean {
      const allRequiredFields = Boolean(
        this.login.email && this.login.password
      );
      if (!allRequiredFields) {
        return false;
      }

      if (!StringUtils.validEmail(this.login.email)) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: Messages.EMAIL_INVALID,
          life: 3000,
        });

        return false;
      }

      return true;
    },

    actionLogin() {
      if (this.validLogin()) {
        this.spinLoader = true;
        this.userService
          .login(this.login)
          .then((res) => {
            this.authenticationService.setUser(res.data);
            this.$router.push('/musics');
          })
          .catch((err: AxiosError) => {
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: err.response?.data.message,
              life: 3000,
            });
            this.submitted = false;
            this.spinLoader = false;
          });
      } else {
        this.submitted = true;
      }
    },
  },
  components: {
    CreateUser,
  },
});
</script>
