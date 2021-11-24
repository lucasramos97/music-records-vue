<template>
  <Dialog
    header="Create User"
    v-model:visible="visible"
    :style="{ width: '450px' }"
    :modal="true"
    @hide="onHide()"
  >
    <div class="p-fluid p-formgrid p-grid">
      <div class="p-field p-col-12">
        <label for="username">Username</label>
        <InputText
          id="username"
          type="text"
          v-model.trim="user.username"
          :autofocus="true"
          aria-describedby="username-help"
          :class="submitted && !user.username ? 'p-invalid' : ''"
        />
        <small
          id="username-help"
          v-if="submitted && !user.username"
          class="p-error"
        >
          Username is required!
        </small>
      </div>

      <div class="p-field p-col-12">
        <label for="email">E-mail</label>
        <InputText
          id="email"
          type="text"
          v-model.trim="user.email"
          aria-describedby="email-help"
          :class="submitted && !user.email ? 'p-invalid' : ''"
        />
        <small id="email-help" v-if="submitted && !user.email" class="p-error">
          E-mail is required!
        </small>
      </div>

      <div class="p-field p-col-12">
        <label for="password">Password</label>
        <Password
          id="password"
          v-model.trim="user.password"
          :toggleMask="true"
          aria-describedby="password-help"
          :class="submitted && !user.password ? 'p-invalid' : ''"
        />
        <small
          id="password-help"
          v-if="submitted && !user.password"
          class="p-error"
        >
          Password is required!
        </small>
      </div>

      <div class="p-field p-col-12 p-md-3">
        <Button
          label="Save"
          @click="actionCreateUser()"
          :disabled="spinLoader"
          class="p-button-success"
          icon="pi pi-save"
        />
      </div>

      <div class="p-field p-col-12 p-md-3">
        <div v-if="spinLoader" class="spin-loader" />
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { AxiosError } from 'axios';

import { IUser } from '@/interfaces/all';
import UserService from '@/services/UserService';
import StringUtils from '@/utils/StringUtils';
import Messages from '@/utils/Messages';

const userService = new UserService();

export default defineComponent({
  props: {
    visible: Boolean,
  },
  emits: ['update:visible'],
  setup(props, { emit }) {
    let visible = computed({
      get: () => props.visible,
      set: (value) => emit('update:visible', value),
    });

    return {
      visible,
    };
  },
  data() {
    return {
      user: {
        username: '',
        email: '',
        password: '',
      } as IUser,
      submitted: false,
      spinLoader: false,
    };
  },
  methods: {
    onHide() {
      this.user = {
        username: '',
        email: '',
        password: '',
      };
      this.submitted = false;
      this.spinLoader = false;
      this.$emit('update:visible', false);
    },

    validUser(): boolean {
      const allRequiredFields = Boolean(
        this.user.username && this.user.email && this.user.password
      );
      if (!allRequiredFields) {
        return false;
      }

      if (!StringUtils.validEmail(this.user.email)) {
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

    actionCreateUser() {
      if (this.validUser()) {
        this.spinLoader = true;
        userService
          .create(this.user)
          .then(() => {
            this.$toast.add({
              severity: 'success',
              summary: 'Successfully',
              detail: Messages.USER_SUCCESSFULLY_CREATE,
              life: 3000,
            });
            this.onHide();
          })
          .catch((err: AxiosError) =>
            this.$toast
              .add({
                severity: 'error',
                summary: 'Error',
                detail: err.response?.data.message,
                life: 3000,
              })
              .finally(() => {
                this.submitted = false;
                this.spinLoader = false;
              })
          );
      } else {
        this.submitted = true;
      }
    },
  },
});
</script>
