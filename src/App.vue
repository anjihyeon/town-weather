<template>
  <div id="app">
    <weatherHeader></weatherHeader>
    <weatherValue></weatherValue>
  </div>
</template>
<script>
import weatherHeader from "./weatherHeader.vue";
import weatherValue from "./weatherValue.vue";

export default {
  components: {
    weatherHeader: weatherHeader,
    weatherValue: weatherValue
  }
};
</script>

<style>
@font-face {
  font-family: "MapoGoldenPier";
  src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/MapoGoldenPierA.woff")
    format("woff");
  font-weight: normal;
  font-style: normal;
}
#app {
  width: 330px;
  height: 550px;
  background-color: #64b3f4;
  border-radius: 10px 10px 10px 10px / 10px 10px 10px 10px;
  box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
  background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1));
}
body {
  text-align: center;
  background: #c2e59c; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to left,
    #64b3f4,
    #c2e59c
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to left,
    #64b3f4,
    #c2e59c
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
input {
  border-style: groove;
  width: 200px;
}
button {
  border-style: groove;
}
.shadow {
  box-shadow: 5px 10px 10px rgba(0, 0, 0, 0.03);
}
</style>
