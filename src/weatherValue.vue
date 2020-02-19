<template>
  <div>
    <span type="button" id="btn" @click="getLocation">
      <img src="./icon/gps.png" width="50px" height="50px" />
    </span>

    <VueperSlides
      class="no-shadow"
      fixed-height="440px"
      :arrows="false"
      bullets-outside
      :slide-content-outside="contentPosition"
    >
      <!--동네예보api-->
      <VueperSlide
        :key="1"
        style="width: 330px; height:
      550px;"
      >
        <template v-slot:content>
          <div class="vueperslide__content-wrapper">
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
                <img src="./icon/dntks.png" width="50px" height="50px" />
                {{ R06 }}
                <img src="./icon/rkdtnfid.png" width="50px" height="50px" />
                {{ REH }}
                <img src="./icon/vndthr.png" width="50px" height="50px" />
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
      // weatherData: weatherData,
      sliderNum: 2,
      position: null,
      x: 0.0,
      y: 0.0,
      // address: null,
      info: null,
      info2: null,
      T1H: null, //(초단기실황) 1시간 기온 C
      RN1: null, //(초단기실황) 1시간 강수량 mm
      R06: null, //(동네예보)6시간 강수량 mm
      T3H: null, //(동네예보)3시간 기온 C
      TMN: null, //(동네예보)아침 최저기온 C
      TMX: null, //(동네예보)낮 최고기온 C
      REH: null, //습도 %
      PTY: null, //강수형태 코드값 없음(0)/비(1)/비/눈(2)/눈(3)/소나기(4)
      SKY: null, //하늘상태 코드값 맑음(1)/구름많음(3)/흐림(4)
      WSD: null, //풍속 m/s
      //초단기예보
      T1H2: null, //1시간 기온 C
      RN12: null, //1시간 강수량 mm
      REH2: null, //습도2 %
      SKY2: null, // 하늘상태2
      PTY2: null, //강수상태2
      WSD2: null //풍속2 m/s
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
          //초단기 실황
          var url1 =
            "http://apis.data.go.kr/1360000/VilageFcstInfoService/getUltraSrtNcst?serviceKey=Td3kPWtrJnZxn1TkpcPhyrZj%2BdB%2FpRl1AKuvGw1mUHS63Lp4Dga90IvSn8SEsax%2F9QvvBmXfCE5TfOaaw0lCMA%3D%3D&numOfRows=10&pageNo=1&dataType=JSON&base_date=" +
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
              if (self.info.response["body"].items.item[i].category === "R06") {
                self.R06 =
                  self.info.response.body.items.item[i].fcstValue + "mm";
              }
              if (self.info.response["body"].items.item[i].category === "PTY") {
                self.PTY = self.info.response["body"].items.item[i].fcstValue;
                // console.log(self.PTY);
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
              if (self.info.response["body"].items.item[i].category === "WSD") {
                self.WSD =
                  self.info.response["body"].items.item[i].fcstValue + "m/s";
              }
            }
          });
          //초단기예보
          // var url2 =
          //   "http://apis.data.go.kr/1360000/VilageFcstInfoService/getUltraSrtFcst?serviceKey=Td3kPWtrJnZxn1TkpcPhyrZj%2BdB%2FpRl1AKuvGw1mUHS63Lp4Dga90IvSn8SEsax%2F9QvvBmXfCE5TfOaaw0lCMA%3D%3D&numOfRows=10&pageNo=1&dataType=JSON&base_date=" +
          //   moment().format("YYYYMMDD") +
          //   "&base_time=" +
          //   moment().format("hhmm") +
          //   "&nx=" +
          //   self.x +
          //   "&ny=" +
          //   self.y;
          // var api_url2 = url2;
          // axios.get(api_url2).then(result2 => {
          //   self.info2 = JSON.parse(JSON.stringify(result2.data));
          //   console.log(self.info2);
          //   //weatherData test
          //   var numOfRows2 = self.info2.response["body"].numOfRows;
          //   console.log(numOfRows2);

          //   for (var i = 1; i < numOfRows2; i++) {
          //     if (self.info.response["body"].items.item[i].category === "RN1") {
          //       self.RN12 =
          //         self.info.response.body.items.item[i].fcstValue + "mm";
          //     }
          //     if (
          //       self.info2.response["body"].items.item[i].category === "T1H"
          //     ) {
          //       self.T1H2 =
          //         self.info2.response.body.items.item[i].fcstValue + "ºC";
          //     }
          //     if (
          //       self.info2.response["body"].items.item[i].category === "SKY2"
          //     ) {
          //       self.SKY2 = self.info2.response["body"].items.item[i].fcstValue;
          //       console.log(self.SKY2);
          //     }
          //     if (
          //       self.info2.response["body"].items.item[i].category === "REH2"
          //     ) {
          //       self.REH2 =
          //         self.info2.response["body"].items.item[i].fcstValue + "%";
          //     }
          //     if (
          //       self.info2.response["body"].items.item[i].category === "PTY2"
          //     ) {
          //       self.PTY2 = self.info2.response["body"].items.item[i].fcstValue;
          //     }
          //     if (
          //       self.info2.response["body"].items.item[i].category === "SKY"
          //     ) {
          //       self.SKY2 = self.info2.response["body"].items.item[i].fcstValue;
          //       console.log(self.SKY);
          //     }
          //     if (
          //       self.info2.response["body"].items.item[i].category === "WSD2"
          //     ) {
          //       self.WSD2 =
          //         self.info2.response["body"].items.item[i].fcstValue + "m/s";
          //     }
          //   }
          // });
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
.vueperslides--fixed-height {
  height: 550px;
}
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
