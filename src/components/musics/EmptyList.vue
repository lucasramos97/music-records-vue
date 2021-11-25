<template>
  <Toast />
  <Dialog
    header="Empty List"
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '500px' }"
  >
    <div class="p-fluid p-formgrid p-grid">
      <div class="p-field p-col-12">
        <i class="pi pi-exclamation-triangle p-mr-3"></i>
        <span>Do you really want to delete all deleted musics?</span>
      </div>

      <div class="p-field p-col-12 p-md-3">
        <Button
          label="Yes"
          @click="actionEmptyList()"
          :disabled="spinLoader"
          class="p-button-primary"
          icon="pi pi-check"
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

import MusicService from '@/services/MusicService';
import Messages from '@/utils/Messages';

const musicService = new MusicService();

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    onSuccess: {
      type: Function,
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
  data() {
    return {
      spinLoader: false,
    };
  },
  methods: {
    actionEmptyList() {
      this.spinLoader = true;
      musicService
        .emptyList()
        .then((res) => {
          this.$toast.add({
            severity: 'success',
            summary: 'Successfully',
            detail: Messages.getEmptyListSuccessfully(res.data),
            life: 3000,
          });
          this.onSuccess();
          this.$emit('update:visible', false);
        })
        .catch((err: AxiosError) =>
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: err.response?.data.message,
            life: 3000,
          })
        )
        .finally(() => {
          this.spinLoader = false;
        });
    },
  },
});
</script>
