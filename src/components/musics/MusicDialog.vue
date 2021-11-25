<template>
  <Toast />
  <Dialog
    :header="title"
    v-model:visible="visible"
    :modal="true"
    @show="onShow()"
    @hide="onHide()"
    :style="{ width: '500px' }"
  >
    <div class="p-fluid p-formgrid p-grid">
      <div class="p-field p-col-12">
        <label for="title">Title</label>
        <InputText
          id="title"
          type="text"
          v-model.trim="music.title"
          :autofocus="true"
          aria-describedby="title-help"
          :class="submitted && !music.title ? 'p-invalid' : ''"
        />
        <small id="title-help" v-if="submitted && !music.title" class="p-error">
          Title is required!
        </small>
      </div>

      <div class="p-field p-col-12">
        <label for="artist">Artist</label>
        <InputText
          id="artist"
          type="text"
          v-model.trim="music.artist"
          aria-describedby="artist-help"
          :class="submitted && !music.artist ? 'p-invalid' : ''"
        />
        <small
          id="artist-help"
          v-if="submitted && !music.artist"
          class="p-error"
        >
          Artist is required!
        </small>
      </div>

      <div class="p-field p-col-12 p-md-6">
        <label for="releaseDate">Release Date</label>
        <InputMask
          id="releaseDate"
          v-model="music.release_date"
          mask="99/99/9999"
          aria-describedby="releaseDate-help"
          :class="submitted && !music.release_date ? 'p-invalid' : ''"
        />
        <small
          id="releaseDate-help"
          v-if="submitted && !music.release_date"
          class="p-error"
        >
          Release Date is required!
        </small>
      </div>

      <div class="p-field p-col-12 p-md-6">
        <label for="duration">Duration</label>
        <InputMask
          id="duration"
          v-model="music.duration"
          mask="99:99"
          aria-describedby="duration-help"
          :class="submitted && !music.duration ? 'p-invalid' : ''"
        />
        <small
          id="duration-help"
          v-if="submitted && !music.duration"
          class="p-error"
        >
          Duration is required!
        </small>
      </div>

      <div class="p-field p-col-12 p-md-6">
        <label for="numberViews">Number Views</label>
        <InputNumber id="numberViews" v-model="music.number_views" />
      </div>

      <div class="p-field p-col-12 p-md-6">
        <label>Is Feat?</label>
        <div class="p-field-radiobutton" style="margin-top: 8px">
          <RadioButton
            id="yes"
            name="feat"
            :value="true"
            v-model="music.feat"
          />
          <label for="yes">Yes</label>
          <RadioButton
            id="no"
            name="feat"
            :value="false"
            v-model="music.feat"
            style="margin-left: 15px"
          />
          <label for="no">No</label>
        </div>
      </div>

      <div class="p-field p-col-12 p-md-3">
        <Button
          label="Save"
          @click="actionSave()"
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
import { computed, defineComponent, PropType } from 'vue';
import { AxiosError } from 'axios';

import { IMusic } from '@/interfaces/all';
import MusicService from '@/services/MusicService';
import MusicFactory from '@/utils/MusicFactory';
import DateUtils from '@/utils/DateUtils';
import Messages from '@/utils/Messages';

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
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
      submitted: false,
      spinLoader: false,
    };
  },
  methods: {
    onShow() {
      this.music = this.musicProp;
    },

    onHide() {
      this.submitted = false;
      this.spinLoader = false;
      this.$emit('update:visible', false);
    },

    validMusic(): boolean {
      const allRequiredFields = Boolean(
        this.music.title &&
          this.music.artist &&
          this.music.release_date &&
          this.music.duration
      );

      if (!allRequiredFields) {
        return false;
      }

      const releaseDate = DateUtils.createReleaseDate(this.music.release_date);
      if (Number.isNaN(releaseDate.getDate())) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: Messages.getInvalidDate(this.music.release_date),
          life: 3000,
        });

        return false;
      }

      if (releaseDate > new Date()) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: Messages.RELEASE_DATE_CANNOT_BE_FUTURE,
          life: 3000,
        });

        return false;
      }

      const duration = DateUtils.createDuration(this.music.duration);
      if (Number.isNaN(duration.getDate())) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: Messages.getInvalidTime(this.music.duration),
          life: 3000,
        });

        return false;
      }

      return true;
    },

    saveMusic() {
      const submittedMusic = MusicFactory.createSubmittedMusic(this.music);
      this.musicService
        .save(submittedMusic)
        .then(() => {
          this.$toast.add({
            severity: 'success',
            summary: 'Successfully',
            detail: Messages.MUSIC_SUCCESSFULLY_ADDED,
            life: 3000,
          });
          this.music = MusicFactory.createDefaultMusic();
          this.onSuccess();
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
          this.submitted = false;
          this.spinLoader = false;
        });
    },

    editMusic() {
      const submittedMusic = MusicFactory.createSubmittedMusic(this.music);
      this.musicService
        .update(submittedMusic)
        .then(() => {
          this.$toast.add({
            severity: 'success',
            summary: 'Successfully',
            detail: Messages.MUSIC_SUCCESSFULLY_EDITED,
            life: 3000,
          });
          this.onSuccess();
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
          this.submitted = false;
          this.spinLoader = false;
        });
    },

    actionSave() {
      if (this.validMusic()) {
        this.spinLoader = true;
        if (this.music.id) {
          this.editMusic();
        } else {
          this.saveMusic();
        }
      } else {
        this.submitted = true;
      }
    },
  },
});
</script>
