<template>
  <Dialog
    header="Logout"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '500px' }"
  >
    <div class="p-fluid p-formgrid p-grid">
      <div class="p-field p-col-12">
        <i class="pi pi-exclamation-triangle p-mr-3"></i>
        <span>Are you sure you want to log out?</span>
      </div>

      <div class="p-field p-col-12 p-md-3">
        <Button
          label="Yes"
          @click="actionLogout()"
          class="p-button-primary"
          icon="pi pi-check"
        />
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import AuthenticationService from '@/services/AuthenticationService';

const authenticationService = new AuthenticationService();

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
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
  methods: {
    actionLogout() {
      authenticationService.logout();
      this.$emit('update:visible', false);
      this.$router.push('/login');
    },
  },
});
</script>
