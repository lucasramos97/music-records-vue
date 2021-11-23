<template>
  <h1>{{ name }}</h1>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      name: 'Hello Friend!',
    };
  },
});
</script>
