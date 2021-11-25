<template>
  <Dialog
    header="Session Expired"
    v-model:visible="visible"
    :modal="true"
    @show="onShow()"
    @hide="onHide()"
    :style="{ width: '500px' }"
  >
    <div class="p-fluid p-formgrid p-grid">
      <div class="p-field p-col-12">
        <i class="pi pi-info-circle p-mr-3"></i>
        <span>Your session has expired, login again!</span>
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import AuthenticationService from '@/services/AuthenticationService';

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:visible'],
  setup(props, { emit }) {
    let authenticationService = new AuthenticationService();
    let visible = computed({
      get: () => props.visible,
      set: (value) => emit('update:visible', value),
    });

    return {
      authenticationService,
      visible,
    };
  },
  methods: {
    onShow() {
      this.authenticationService.logout();
    },

    onHide() {
      this.$emit('update:visible', false);
      this.$router.push('/login');
    },
  },
});
</script>
