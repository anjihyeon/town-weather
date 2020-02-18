import Vue from "vue";
import App from "./App";
import axios from "axios"; // add
import BootstrapVue from "bootstrap-vue";
import VueResource from "vue-resource";
import feather from "vue-icon";

Vue.use(feather, "v-icon");
Vue.use(VueResource);
Vue.use(BootstrapVue);
Vue.prototype.$axios = axios; // add
Vue.config.productionTip = true;
Vue.http.headers.common["Access-Control-Request-Method"] = "*";

new Vue({
  el: "#app",
  render: h => h(App)
});
