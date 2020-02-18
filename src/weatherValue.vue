<template>
  <div>
    <span type="button" id="btn" @click="getLocation">
      <img src="./icon/gps.png" width="50px" height="50px" />
    </span>
    <div id="div2">
      <!--구름형태:1(맑음)-->
      <img v-if="PTY==='0' && SKY==='1'" src="./icon/sun.png" width="150px" height="150px" />
      <!--구름형태:3(구름많음)-->
      <img v-else-if="PTY==='0' && SKY==='3'" src="./icon/cloudy.png" width="150px" height="150px" />
      <!--구름형태:4(흐림)-->
      <img
        v-else-if="PTY==='0' && SKY==='4'"
        src="./icon/cloudy-3.png"
        width="150px"
        height="150px"
      />
      <!--강수형태:1(비)-->
      <img v-else-if="PTY==='1'" src="./icon/rainy.png" width="150px" height="150px" />
      <!--강수형태:2(비/눈)-->
      <img v-else-if="PTY==='2'" src="./icon/snowy.png" width="150px" height="150px" />
      <!--강수형태:3(눈)-->
      <img v-else-if="PTY==='3'" src="./icon/snowy-1.png" width="150px" height="150px" />
      <!--강수형태:4(소나기)-->
      <img v-else-if="PTY==='4'" src="./icon/rainy-1.png" width="150px" height="150px" />
      <!-- {{ "아침최저기온 : " + TMN }} {{ "낮최고기온 : " + TMX }} -->
    </div>
    <div id="rldhs">{{ T3H }}</div>
    <!-- <div id="div1"></div> -->
    <div id="div3">
      <section>
        <img src="./icon/dntks.png" width="50px" height="50px" />
        {{ POP }}
        <img src="./icon/rkdtnfid.png" width="50px" height="50px" />
        {{ REH }}
        <img src="./icon/vndthr.png" width="50px" height="50px" />
        {{ VEC }}
      </section>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import axios from "axios";
// import weatherData from "./assets/weatherData.json";

export default {
  data() {
    return {
      // weatherData: weatherData,
      position: null,
      x: 0.0,
      y: 0.0,
      // address: null,
      info: null,
      POP: null, //강수활률 %
      PTY: null, //강수형태 코드값 없음(0)/비(1)/비/눈(2)/눈(3)/소나기(4)
      REH: null, //습도 %
      SKY: null, //하늘상태 코드값 맑음(1)/구름많음(3)/흐림(4)
      T3H: null, //3시간 기온 C
      TMN: 0.0, //아침최저기온 C
      TMX: 0.0, //낮 최고기온 C
      VEC: null //풍향  m/s
    };
  },
  methods: {
    getLocation: function() {
      if (navigator.geolocation) {
        var self = this;
        console.log("위치값을 받음");
        navigator.geolocation.getCurrentPosition(function(position) {
          self.position = position.coords;
          self.x = position.coords.latitude;
          self.y = position.coords.longitude;
          self.x = parseFloat(self.x).toFixed(0);
          self.y = parseFloat(self.y).toFixed(0);
          console.log(self.x + " " + self.y);
          //리버스 지오코딩api
          // var url1 =
          //   "http://apis.vworld.kr/coord2new.do?x=" +
          //   self.x +
          //   "&y=" +
          //   self.y +
          //   "&output=xml&epsg=epsg:4326&apiKey=0770FD5D-CDD0-34DF-A0BF-83B8BBD6B916	";
          // axios.get(url1).then(res => {
          //   self.address = res.data;

          //   console.log(self.address);
          // });
          var url2 =
            "http://apis.data.go.kr/1360000/VilageFcstInfoService/getVilageFcst?serviceKey=Td3kPWtrJnZxn1TkpcPhyrZj%2BdB%2FpRl1AKuvGw1mUHS63Lp4Dga90IvSn8SEsax%2F9QvvBmXfCE5TfOaaw0lCMA%3D%3D&numOfRows=14&pageNo=1&dataType=JSON&base_date=" +
            moment().format("YYYYMMDD") +
            "&base_time=" +
            moment().format("hhmm") +
            "&nx=" +
            self.x +
            "&ny=" +
            self.y;
          var api_url = url2;

          axios.get(api_url).then(result => {
            self.info = JSON.parse(JSON.stringify(result.data));
            console.log(self.info);
            //weatherData test
            var numOfRows = self.info.response["body"].numOfRows;
            console.log(numOfRows);

            for (var i = 1; i < numOfRows; i++) {
              if (self.info.response["body"].items.item[i].category === "POP") {
                self.POP =
                  self.info.response.body.items.item[i].fcstValue + "%";
              }
              if (self.info.response["body"].items.item[i].category === "PTY") {
                self.PTY = self.info.response["body"].items.item[i].fcstValue;
                console.log(self.PTY);
              }
              if (self.info.response["body"].items.item[i].category === "REH") {
                self.REH =
                  self.info.response["body"].items.item[i].fcstValue + "%";
              }
              if (self.info.response["body"].items.item[i].category === "T3H") {
                self.T3H =
                  self.info.response["body"].items.item[i].fcstValue + "ºC";
              }
              if (self.info.response["body"].items.item[i].category === "SKY") {
                self.SKY = self.info.response["body"].items.item[i].fcstValue;
                console.log(self.SKY);
              }
              if (self.info.response["body"].items.item[i].category === "TMN") {
                self.TMN =
                  self.info.response["body"].items.item[i].fcstValue + "ºC";
              }
              if (self.info.response["body"].items.item[i].category === "TMX") {
                self.TMX =
                  self.info.response["body"].items.item[i].fcstValue + "ºC";
              }
              if (self.info.response["body"].items.item[i].category === "VEC") {
                var VEC2 = self.info.response["body"].items.item[i].fcstValue;
                VEC2 = (VEC2 + 22.5 * 0.5) % 22.5;
                console.log(VEC2);

                VEC2 = parseFloat(VEC2).toFixed(0);
                self.VEC = VEC2 + "m/s";
              }
            }
          });
        });
      } else {
        console.log("위치값을 받지 못함.");
        return;
      }
    }
  }
};
</script>

<style scoped>
#btn {
  padding: 0px 0px 0px 265px;
}
#div3 {
  font-size: 25px;
  color: white;
  margin: 10px;
}
#div2 {
  height: 100%;
  width: 100%;
  font-size: 30px;
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-top: 50px;
}
#div1 {
  margin: 20px;
  height: 3px;
  width: 87%;
  background-color: white;
}
#rldhs {
  font-size: 40px;
  color: white;
}
img {
  margin: 3px;
}
section {
  width: 100%;
  padding-top: 130px;

  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}
</style>
