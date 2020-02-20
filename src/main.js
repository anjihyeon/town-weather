import Vue from "vue";
import App from "./App";
import axios from "axios"; // add
import vueresource from "vue-resource";

Vue.use(vueresource);
Vue.use(axios);
// Vue.http.headers.common["Access-Control-Request-Method"] = "*";

new Vue({
  el: "#app",
  render: h => h(App)
});
