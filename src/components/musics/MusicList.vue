<template>
  <Toast />
  <LoggedUser />
  <h1>Music List</h1>
  <div class="table-top-buttons">
    <Button
      label="Add"
      @click="openAdd()"
      class="p-button-primary"
      icon="pi pi-plus"
    />
  </div>
  <DataTable
    :value="musics"
    :lazy="true"
    :paginator="true"
    :rows="lazyParams.rows"
    :totalRecords="totalRecords"
    :loading="loading"
    @page="onPage($event)"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} musics"
    responsiveLayout="scroll"
  >
    <Column field="title" header="Title" />
    <Column field="artist" header="Artist" />
    <Column field="release_date" header="Release Date">
      <template #body="slotProps">
        {{ formatReleaseDate(slotProps.data.release_date) }}
      </template>
    </Column>
    <Column field="duration" header="Duration">
      <template #body="slotProps">
        {{ formatDuration(slotProps.data.duration) }}
      </template>
    </Column>
    <Column field="number_views" header="Number Views">
      <template #body="slotProps">
        {{ formatNumberViews(slotProps.data.number_views) }}
      </template>
    </Column>
    <Column field="feat" header="Feat">
      <template #body="slotProps">
        {{ formatFeat(slotProps.data.feat) }}
      </template>
    </Column>
    <Column header="Edit" :exportable="false">
      <template #body="slotProps">
        <Button
          @click="openEdit(slotProps.data)"
          v-tooltip.left="'Edit Music'"
          class="p-button-rounded p-button-primary"
          icon="pi pi-pencil"
        />
      </template>
    </Column>
    <Column header="Delete" :exportable="false">
      <template #body="slotProps">
        <Button
          @click="openDelete(slotProps.data)"
          v-tooltip.left="'Delete Music'"
          class="p-button-rounded p-button-danger"
          icon="pi pi-trash"
        />
      </template>
    </Column>
    <template #empty> No musics found. </template>
  </DataTable>

  <MusicDialog
    :title="titleMusicDialog"
    :musicProp="music"
    :onSuccess="loadMusics"
    v-model:visible="visibleMusicDialog"
  />

  <DeleteMusic
    :musicProp="musicToDelete"
    :onSuccess="loadMusics"
    v-model:visible="visibleDeleteMusic"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { AxiosError } from 'axios';

import LoggedUser from '@/components/utils/LoggedUser.vue';
import MusicDialog from './MusicDialog.vue';
import DeleteMusic from './DeleteMusic.vue';

import { ILazyParams, IMusic } from '@/interfaces/all';
import MusicService from '@/services/MusicService';
import MusicFactory from '@/utils/MusicFactory';
import NumberUtils from '@/utils/NumberUtils';
import StringUtils from '@/utils/StringUtils';

const musicService = new MusicService();

export default defineComponent({
  setup() {
    let visibleMusicDialog = ref(false);
    let visibleDeleteMusic = ref(false);

    return {
      visibleMusicDialog,
      visibleDeleteMusic,
    };
  },
  data() {
    return {
      loading: false,
      musics: [] as IMusic[],
      totalRecords: 0,
      lazyParams: {} as ILazyParams,
      titleMusicDialog: '',
      music: MusicFactory.createDefaultMusic(),
      musicToDelete: MusicFactory.createDefaultMusic(),
    };
  },
  mounted() {
    this.loading = true;
    this.lazyParams = {
      page: 0,
      rows: 5,
    };
    this.loadMusics();
  },
  methods: {
    openAdd() {
      this.titleMusicDialog = 'Add Music';
      this.music = MusicFactory.createDefaultMusic();
      this.visibleMusicDialog = true;
    },

    loadMusics() {
      this.loading = true;
      setTimeout(() => {
        musicService
          .getAll(this.lazyParams.page + 1, this.lazyParams.rows)
          .then((res) => {
            this.musics = res.data.content;
            this.totalRecords = res.data.total;
            this.loading = false;
          })
          .catch((err: AxiosError) => {
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: err.response?.data.message,
              life: 3000,
            });
          });
      }, 1000);
    },

    onPage(event: ILazyParams) {
      this.lazyParams = event;
      this.loadMusics();
    },

    formatReleaseDate(releaseDate: string): string {
      return StringUtils.displayReleaseDate(releaseDate);
    },

    formatDuration(duration: string): string {
      return StringUtils.displayDuration(duration);
    },

    formatNumberViews(numberViews: number): string {
      return NumberUtils.displayNumberViews(numberViews);
    },

    formatFeat(feat: boolean): string {
      return feat ? 'Yes' : 'No';
    },

    openEdit(music: IMusic) {
      this.titleMusicDialog = 'Edit Music';
      this.music = MusicFactory.createEditMusic(music);
      this.visibleMusicDialog = true;
    },

    openDelete(music: IMusic) {
      this.musicToDelete = music;
      this.visibleDeleteMusic = true;
    },
  },
  components: {
    LoggedUser,
    MusicDialog,
    DeleteMusic,
  },
});
</script>
