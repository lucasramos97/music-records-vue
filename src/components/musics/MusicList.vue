<template>
  <Toast />
  <LoggedUser />
  <h1>Music List</h1>
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
    <template #empty> No musics found. </template>
  </DataTable>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { AxiosError } from 'axios';

import LoggedUser from '@/components/utils/LoggedUser.vue';

import { ILazyParams, IMusic } from '@/interfaces/all';
import MusicService from '@/services/MusicService';
import NumberUtils from '@/utils/NumberUtils';
import StringUtils from '@/utils/StringUtils';

const musicService = new MusicService();

export default defineComponent({
  data() {
    return {
      loading: false,
      totalRecords: 0,
      musics: [] as IMusic[],
      lazyParams: {} as ILazyParams,
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
  },
  components: {
    LoggedUser,
  },
});
</script>
