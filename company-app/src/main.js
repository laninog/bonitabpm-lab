import Vue from 'vue'
import App from './App.vue'

import {appStore} from './store/store';

new Vue({
    el: '#app',
    store: appStore,
    render: h => h(App)
});
