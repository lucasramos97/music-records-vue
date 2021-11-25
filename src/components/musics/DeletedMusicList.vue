<template>
  <Toast />
  <LoggedUser />
  <h1>Deleted Music List</h1>
  <div class="table-top-buttons">
    <Button
      label="Restore"
      @click="openRestore()"
      :disabled="selectedMusics.length === 0"
      class="p-button-primary"
      icon="pi pi-refresh"
    />

    <Button
      label="Music List"
      @click="goToMusicList()"
      class="p-button-primary"
      icon="pi pi-arrow-right"
    />
  </div>
  <DataTable
    :value="musics"
    v-model:selection="selectedMusics"
    dataKey="id"
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
    <Column selectionMode="multiple" headerStyle="width: 3em" />
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
    <Column header="Delete" :exportable="false">
      <template #body="slotProps">
        <Button
          @click="openDefinitiveDelete(slotProps.data)"
          v-tooltip.left="'Definitive Delete Music'"
          class="p-button-rounded p-button-danger"
          icon="pi pi-trash"
        />
      </template>
    </Column>
    <template #empty>No musics found.</template>
  </DataTable>

  <RestoreMusics
    :musicsProp="selectedMusics"
    :onSuccess="reloadMusics"
    v-model:visible="visibleRestore"
  />

  <DefinitiveDeleteMusic
    :musicProp="musicToDelete"
    :onSuccess="reloadMusics"
    v-model:visible="visibleDefinitiveDelete"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { AxiosError } from 'axios';

import LoggedUser from '@/components/utils/LoggedUser.vue';
import RestoreMusics from './RestoreMusics.vue';
import DefinitiveDeleteMusic from './DefinitiveDeleteMusic.vue';

import { ILazyParams, IMusic } from '@/interfaces/all';
import MusicService from '@/services/MusicService';
import NumberUtils from '@/utils/NumberUtils';
import StringUtils from '@/utils/StringUtils';
import MusicFactory from '@/utils/MusicFactory';

const musicService = new MusicService();

export default defineComponent({
  setup() {
    let visibleRestore = ref(false);
    let visibleDefinitiveDelete = ref(false);

    return {
      visibleRestore,
      visibleDefinitiveDelete,
    };
  },
  data() {
    return {
      loading: false,
      musics: [] as IMusic[],
      totalRecords: 0,
      lazyParams: {} as ILazyParams,
      selectedMusics: [] as IMusic[],
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
    openRestore() {
      this.visibleRestore = true;
    },

    reloadMusics() {
      this.selectedMusics = [];
      this.loadMusics();
    },

    openDefinitiveDelete(music: IMusic) {
      this.musicToDelete = music;
      this.visibleDefinitiveDelete = true;
    },

    goToMusicList() {
      this.$router.push('/musics');
    },

    loadMusics() {
      this.loading = true;
      setTimeout(() => {
        musicService
          .getAllDeleted(this.lazyParams.page + 1, this.lazyParams.rows)
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
  },
  components: {
    LoggedUser,
    RestoreMusics,
    DefinitiveDeleteMusic,
  },
});
</script>
