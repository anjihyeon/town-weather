<template>
  <div>
    <VueperSlides
      class="no-shadow"
      fixed-height="500px"
      :arrows="false"
      bullets-outside
      :slide-content-outside="contentPosition"
    >
      <!--초단기실황api-->
      <VueperSlide
        :key="1"
        style="width: 330px; height:
      550px;"
      >
        <template v-slot:content>
          <div class="vueperslide__content-wrapper">
            <div id="div1">
              <div>{{ address }}</div>
              <span type="button" id="btn" @click="getLocation">
                <img src="./icon/gps.png" width="50px" height="50px" />
              </span>
            </div>
            <div id="div2">
              <!--구름형태:1(맑음)-->
              <img
                v-if="PTY === '0' && SKY === '1'"
                src="./icon/sun.png"
                width="150px"
                height="150px"
              />
              <!--구름형태:3(구름많음)-->
              <img
                v-else-if="PTY === '0' && SKY === '3'"
                src="./icon/cloudy.png"
                width="150px"
                height="150px"
              />
              <!--구름형태:4(흐림)-->
              <img
                v-else-if="PTY === '0' && SKY === '4'"
                src="./icon/cloudy-3.png"
                width="150px"
                height="150px"
              />
              <!--강수형태:1(비)-->
              <img
                v-else-if="PTY === '1'"
                src="./icon/rainy.png"
                width="150px"
                height="150px"
              />
              <!--강수형태:2(비/눈)-->
              <img
                v-else-if="PTY === '2'"
                src="./icon/snowy.png"
                width="150px"
                height="150px"
              />
              <!--강수형태:3(눈)-->
              <img
                v-else-if="PTY === '3'"
                src="./icon/snowy-1.png"
                width="150px"
                height="150px"
              />
              <!--강수형태:4(소나기)-->
              <img
                v-else-if="PTY === '4'"
                src="./icon/rainy-1.png"
                width="150px"
                height="150px"
              />
              <!-- {{ "아침최저기온 : " + TMN }} {{ "낮최고기온 : " + TMX }} -->
            </div>
            <div id="rldhs">{{ T3H }}</div>
            <!-- <div id="div1"></div> -->
            <div id="div3">
              <section>
                <img src="./icon/dntks.png" width="45px" height="45px" />
                {{ R06 }}
                <img src="./icon/rkdtnfid.png" width="45px" height="45px" />
                {{ REH }}
                <img src="./icon/vndthr.png" width="45px" height="45px" />
                {{ WSD }}
              </section>
            </div>
          </div>
        </template>
      </VueperSlide>
      <!--초단기 예보 api-->
      <VueperSlide :key="2" style="width: 330px; height: 440px;">
        <template v-slot:content>
          <div class="vueperslide__content-wrapper"></div>
        </template>
      </VueperSlide>
    </VueperSlides>
  </div>
</template>

<script>
import moment from "moment";
import axios from "axios";
import VueResource from "vue-resource";
import { VueperSlides, VueperSlide } from "vueperslides";
import "vueperslides/dist/vueperslides.css";

// import weatherData from "./assets/weatherData.json";

export default {
  components: {
    VueperSlides,
    VueperSlide
  },
  data() {
    return {
      address: null,
      position: null,
      dust: null,
      tm_location: null,
      tm_x: 0.0,
      tm_y: 0.0,
      x: 0.0,
      y: 0.0,
      // address: null,
      info: null,
      //동네예보 api
      R06: null, // 6시간 강수량 mm
      REH: null, //습도 %
      T3H: null, // 3시간 기온 C
      TMN: null, //아침 최저기온 C
      TMX: null, //낮 최고기온 C
      PTY: null, //강수형태 코드값 없음(0)/비(1)/비/눈(2)/눈(3)/소나기(4)
      SKY: null, //하늘상태 코드값 맑음(1)/구름많음(3)/흐림(4)
      WSD: null //풍속 m/s
    };
  },
  methods: {
    getLocation: function() {
      var self = this;
      if (navigator.geolocation) {
        console.log("위치값을 받음");
        navigator.geolocation.getCurrentPosition(function(position) {
          self.position = position.coords;
          self.x = position.coords.latitude;
          self.y = position.coords.longitude;
          var xn = position.coords.latitude;
          var yn = position.coords.longitude;
          self.x = parseFloat(self.x).toFixed(0);
          self.y = parseFloat(self.y).toFixed(0);
          console.log(self.x + " " + self.y);
          console.log(xn + " " + yn);

          // 좌표->주소 카카오톡 REST API
          var url =
            "https://dapi.kakao.com/v2/local/geo/coord2address.json?x=" +
            yn +
            "&y=" +
            xn +
            "&input_coord=WGS84";
          var appKey = "e210e19417b24807d3716f4e5a0bf4a9";
          var config = {
            headers: {
              Authorization: "KakaoAK " + appKey,
              "Access-Control-Request-Method": "GET"
            }
          };

          self.$http
            .get(url, config)
            .then(res => {
              self.address = res.data;
              console.log(self.address);

              self.address =
                self.address.documents[0].address.region_3depth_name;
              console.log(self.address);
            })
            .catch(error => {
              console.log(error);
            });

          //동네예보 API
          var url1 =
            "http://apis.data.go.kr/1360000/VilageFcstInfoService/getVilageFcst?serviceKey=Td3kPWtrJnZxn1TkpcPhyrZj%2BdB%2FpRl1AKuvGw1mUHS63Lp4Dga90IvSn8SEsax%2F9QvvBmXfCE5TfOaaw0lCMA%3D%3D&numOfRows=14&pageNo=1&dataType=JSON&base_date=" +
            moment().format("YYYYMMDD") +
            "&base_time=" +
            moment().format("hhmm") +
            "&nx=" +
            self.x +
            "&ny=" +
            self.y;
          var api_url = url1;

          axios.get(api_url).then(result => {
            self.info = JSON.parse(JSON.stringify(result.data));
            console.log(self.info);
            //weatherData test
            var numOfRows = self.info.response["body"].numOfRows;
            console.log(numOfRows);

            for (var i = 1; i < numOfRows; i++) {
              if (self.info.response["body"].items.item[i].category === "PTY") {
                self.PTY = self.info.response["body"].items.item[i].fcstValue;
              }
              if (self.info.response["body"].items.item[i].category === "REH") {
                self.REH =
                  self.info.response["body"].items.item[i].fcstValue + "%";
              }

              if (self.info.response["body"].items.item[i].category === "SKY") {
                self.SKY = self.info.response["body"].items.item[i].fcstValue;
                console.log(self.SKY);
              }

              if (self.info.response["body"].items.item[i].category === "T3H") {
                self.T3H =
                  self.info.response["body"].items.item[i].fcstValue + "ºC";
              }
              if (self.info.response["body"].items.item[i].category === "TMN") {
                self.TMN =
                  self.info.response["body"].items.item[i].fcstValue + "ºC";
              }
              if (self.info.response["body"].items.item[i].category === "TMX") {
                self.TMX =
                  self.info.response["body"].items.item[i].fcstValue + "ºC";
              }
              if (self.info.response["body"].items.item[i].category === "R06") {
                self.R06 =
                  self.info.response["body"].items.item[i].fcstValue + "mm";
              }
              if (self.info.response["body"].items.item[i].category === "WSD") {
                self.WSD =
                  self.info.response["body"].items.item[i].fcstValue + "m/s";
              }
            }
          });
          // wgs좌표-> tm좌표 카카오톡 REST API
          var url =
            "https://dapi.kakao.com/v2/local/geo/transcoord.json?x=" +
            yn +
            "&y=" +
            xn +
            "&input_coord=WGS84&output_coord=TM";
          var appKey = "e210e19417b24807d3716f4e5a0bf4a9";
          var config = {
            headers: {
              Authorization: "KakaoAK " + appKey,
              "Access-Control-Request-Method": "GET"
            }
          };

          self.$http
            .get(url, config)
            .then(res => {
              self.tm_location = res.data;
              console.log(self.tm_location);

              self.tm_x = self.tm_location.documents[0].x;
              self.tm_y = self.tm_location.documents[0].y;
              console.log(self.tm_x + " " + self.tm_y);
            })
            .catch(error => {
              console.log(error);
            });
          //tm좌표 미세먼지 API
          var url3 =
            "http://openapi.airkorea.or.kr/openapi/services/rest/MsrstnInfoInqireSvc/getNearbyMsrstnList?tmX=" +
            self.tm_x +
            "&tmY=" +
            self.y +
            "&ServiceKey=JRWTmtB5qI3WJcvA7HrFcBrSWgA6OKvW6HVK5YN1uTvodOeEo2noxhbEsS020kBYMYHDEBWqTFITnB0u88vtnw%3D%3D";
          axios
            .get(url3)
            .then(result => {
              self.dust = result.data;
              console.log(self.dust);
            })
            .catch(error => {
              console.log(error);
            });
        });
      } else {
        console.log("위치값을 받지 못함.");
        return;
      }
    }
  },
  getLocation2: function() {}
};
</script>

<style scoped>
#app2 {
  padding: 30px 0 0 0;
}
.vueperslides--fixed-height {
  height: 550px;
}
#div1 {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  color: white;
  font-size: 25px;
  padding: 0px 0px 0px 150px;
}
#div3 {
  font-size: 25px;
  color: white;
  margin: 10px;
}
#div2 {
  height: 100%;
  width: 100%;
  font-size: 25px;
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-top: 50px;
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
  padding-top: 110px;

  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}
</style>
