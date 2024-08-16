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

  getGeoLoc() {
    state.geolocation.getCurrentPosition((status, result) => {
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
        methods.getGeoLoc();
      });
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
  <div id="container" class="hidden"></div>
</template>

<style scoped>
#container {
  width: 300px;
  height: 300px;
}
.hidden {
  display: none;
}
</style>
