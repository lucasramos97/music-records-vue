<template>
  <Toast />
  <Dialog
    header="Restore Musics"
    v-model:visible="visible"
    :modal="true"
    @show="onShow()"
    :style="{ width: '500px' }"
  >
    <div class="p-fluid p-formgrid p-grid">
      <div class="p-field p-col-12">
        <i class="pi pi-exclamation-triangle p-mr-3"></i>
        <span>Do you really want to restore the musics:</span>
        <li v-for="music in musics" class="p-m-2">
          {{ music.artist }} - {{ music.title }}
        </li>
      </div>

      <div class="p-field p-col-12 p-md-3">
        <Button
          label="Yes"
          @click="actionRestoreMusics()"
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
import { computed, defineComponent, PropType } from 'vue';
import { AxiosError } from 'axios';

import { IMusic } from '@/interfaces/all';
import MusicService from '@/services/MusicService';
import Messages from '@/utils/Messages';

const musicService = new MusicService();

export default defineComponent({
  props: {
    musicsProp: {
      type: Object as PropType<IMusic[]>,
      required: true,
    },
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
      musics: [] as IMusic[],
      spinLoader: false,
    };
  },
  methods: {
    onShow() {
      this.musics = this.musicsProp;
    },

    actionRestoreMusics() {
      this.spinLoader = true;
      musicService
        .restoreMusics(this.musics)
        .then((res) => {
          this.$toast.add({
            severity: 'success',
            summary: 'Successfully',
            detail: Messages.getRestoredMusicsSuccessfully(res.data),
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
