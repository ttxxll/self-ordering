<script setup>
import { onMounted, onUnmounted } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import { ref } from 'vue'
import { reactive } from 'vue';
import { defineEmits } from 'vue';

const emits = defineEmits(['listenGeo']);

// 地图：ref响应式写法
const map = ref(null);

// 地图定位插件：reactive响应式写法
const state = reactive({
  geolocation: null,
  loading: false, // 定位中
  auto: null, //提示词补全插件
  placeSearch: null,// 地点搜索服务插件
  // 提示词补全配置
  autoOptions : {
    city: 320105, // 建邺
    input: "tipinput"
  },
  latitude: null,
  longitude: null,
})

const methods = {

  getGeoLocSuccess(data) {
    console.log("定位成功", data);
  },

  getGeoLocFailed(data) {
    console.error("定位失败", data);
  },

  getGeoLoc(init) {
    if (!init) {
      console.log(1111);
      state.loading = true;
    }
    state.geolocation.getCurrentPosition((status, result) => {
      if (!init) {
        state.loading = false;
      }
      if (status === 'complete') {
        methods.getGeoLocSuccess(result);
        state.latitude = result.position.lat;
        state.longitude = result.position.lng;
        methods.sendGeoToParent(state.latitude, state.longitude);
      } else {
        methods.getGeoLocFailed(result);
      }
    });
  },

  sendGeoToParent(latitude, longitude) {
     const value = {"lat": latitude, "lng": longitude};
     emits('listenGeo', value);
     console.log(value);
   }
}

onMounted(() => {
  window._AMapSecurityConfig = {
    securityJsCode: "8eb88f2d2e49dbef1d6bec3ff90834ad",
  };
  AMapLoader.load({
    key: "86570a6bee05b8d0e33db59e77a22a48", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
  })
    .then((AMap) => {
      map.value = new AMap.Map("container", {
        zoom: 11, // 初始化地图级别
      });
      AMap.plugin("AMap.Geolocation", () => {
        state.geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认：true
          timeout: 10000, // 设置定位超时时间，默认：无穷大
          offset: [10, 20],  // 定位按钮的停靠位置的偏移量
          zoomToAccuracy: true,  //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          position: 'RB' //  定位按钮的排放位置,  RB表示右下
        })
        methods.getGeoLoc(true);
      });
      AMap.plugin(["AMap.AutoComplete", "AMap.PlaceSearch"], () => {
        state.auto = new AMap.AutoComplete(state.autoOptions);
        state.placeSearch = new AMap.PlaceSearch({
            map: map.value,
            pageSize: 5, // 单页显示结果条数
            pageIndex: 1, // 页码
            city: "320115", // 兴趣点城市
            citylimit: true,  //是否强制限制在设置的城市内搜索
            panel: "panel", // 结果列表将在此容器中进行展示。
            autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        });
        state.auto.on("select", select);
        function select(e) {
          console.log(e.poi.adcode);
          state.placeSearch.setCity(e.poi.adcode);
          state.placeSearch.search(e.poi.name);  //关键字查询查询
        }
      })
    })
    .catch((e) => {
      console.log(e);
    });
});

onUnmounted(() => {
  map.value?.destroy();
});
</script>

<template>
  <div id="container"></div>
  <div id="panel"></div>
  <div id="myPageTop">
    <table>
        <tr>
            <td>
                <label>请输入关键字：</label>
            </td>
        </tr>
        <tr>
            <td>
                <input id="tipinput"/>
            </td>
        </tr>
    </table>
</div>
  <div id="map-geo" @click="methods.getGeoLoc(false)">
    <img src="https://a.amap.com/jsapi/static/image/plugin/waite.png" v-show="loading">
  </div>
</template>

<style scoped>
#container {
  width: 300px;
  height: 300px;
}
#panel {
    position: absolute;
    background-color: white;
    max-height: 90%;
    overflow-y: auto;
    top: 10px;
    right: 10px;
    width: 280px;
}
#map-geo {
  position: relative;
  bottom: 35px;
  left: 310px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  background-image: url(https://a.amap.com/jsapi/static/image/plugin/locate.png);
  background-size: 24px;
  background-repeat: no-repeat;
  background-position: 50%;
  background-color: #fff;
  box-shadow: 0 0 5px silver;
}

#map-geo img {
  height: 24px;
  width: 24px;
  background-color: #fff;
  margin: 4px;
  border-radius: 50%;
  -webkit-animation: rotate 2s linear infinite;
}
</style>
