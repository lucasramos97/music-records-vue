<template>
  <div class="user">
    <span class="user-name">{{ username }}</span>
    <span>{{ email }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import AuthenticationService from '@/services/AuthenticationService';

const authenticationService = new AuthenticationService();

export default defineComponent({
  data() {
    return {
      username: '' as string | null,
      email: '' as string | null,
    };
  },
  mounted() {
    this.username = authenticationService.getUsername();
    this.email = authenticationService.getEmail();
  },
});
</script>
