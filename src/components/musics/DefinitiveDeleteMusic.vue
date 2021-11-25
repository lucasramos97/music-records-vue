<template>
  <Toast />
  <Dialog
    header="Definitive Delete Music"
    v-model:visible="visible"
    :modal="true"
    @show="onShow()"
    :style="{ width: '500px' }"
  >
    <div class="p-fluid p-formgrid p-grid">
      <div class="p-field p-col-12">
        <i class="pi pi-exclamation-triangle p-mr-3"></i>
        <span>
          Are you sure you want to definitely delete music
          <b>{{ music.artist }} - {{ music.title }}</b
          >?
        </span>
      </div>

      <div class="p-field p-col-12 p-md-3">
        <Button
          label="Yes"
          @click="actionDefinitiveDelete()"
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
import MusicFactory from '@/utils/MusicFactory';

export default defineComponent({
  props: {
    musicProp: {
      type: Object as PropType<IMusic>,
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
    let musicService = new MusicService();
    let visible = computed({
      get: () => props.visible,
      set: (value) => emit('update:visible', value),
    });

    return {
      musicService,
      visible,
    };
  },
  data() {
    return {
      music: MusicFactory.createDefaultMusic(),
      spinLoader: false,
    };
  },
  methods: {
    onShow() {
      this.music = this.musicProp;
    },

    actionDefinitiveDelete() {
      this.spinLoader = true;
      this.musicService
        .definitiveDelete(this.music.id)
        .then(() => {
          this.$toast.add({
            severity: 'success',
            summary: 'Successfully',
            detail: Messages.MUSIC_DEFINITELY_DELETED_SUCCESSFULLY,
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
