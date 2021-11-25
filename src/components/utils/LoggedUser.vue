<template>
  <div class="user">
    <span class="user-name">{{ username }}</span>
    <span>{{ email }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import AuthenticationService from '@/services/AuthenticationService';

export default defineComponent({
  setup() {
    let authenticationService = new AuthenticationService();

    return {
      authenticationService,
    };
  },
  data() {
    return {
      username: '' as string | null,
      email: '' as string | null,
    };
  },
  mounted() {
    this.username = this.authenticationService.getUsername();
    this.email = this.authenticationService.getEmail();
  },
});
</script>
