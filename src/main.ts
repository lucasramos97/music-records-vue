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

app.mount('#app');
