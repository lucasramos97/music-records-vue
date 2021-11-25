import { createApp } from 'vue';

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';

import Toast from 'primevue/toast';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputMask from 'primevue/inputmask';
import InputNumber from 'primevue/inputnumber';
import RadioButton from 'primevue/radiobutton';

import Tooltip from 'primevue/tooltip';

import router from './router';
import App from './App.vue';

const app = createApp(App);

app.use(PrimeVue);
app.use(ToastService);
app.use(router);

app.component('Toast', Toast);
app.component('InputText', InputText);
app.component('Password', Password);
app.component('Button', Button);
app.component('Dialog', Dialog);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('InputMask', InputMask);
app.component('InputNumber', InputNumber);
app.component('RadioButton', RadioButton);

app.directive('tooltip', Tooltip);

app.mount('#app');
