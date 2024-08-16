<template>
  <div class="order-page">
    <img src="@/assets/logo.jpg" alt="蜜雪冰城" class="logo" />
    <h1>蜜雪冰城 在线自助下单 蜜雪冰城自助下单系统</h1>
    <p v-if="latitude && longitude">
      Latitude: {{ latitude }}, Longitude: {{ longitude }}
    </p>
    <a-row justify="center" class="nav-buttons">
      <a-button type="primary" @click="navigateTo('query')">卡密购买</a-button>
      <a-button type="primary" @click="navigateTo('join')">加入群聊</a-button>
    </a-row>

    <a-tabs v-model:activeKey="activeTab">
      <a-tab-pane key="order" tab="下单">
        <!-- 下单表单 -->
        <a-form :model="form">
          <div class="wrap">
            <div class="formWrap">
              <a-form-item>
                <a-input v-model:value="form.orderId" placeholder="请输入订单号" />
              </a-form-item>
              <a-form-item>
                <a-input v-model:value="form.province" placeholder="请输入省份" />
              </a-form-item>
              <a-form-item>
                <a-input v-model:value="form.city" placeholder="请输入地区" />
              </a-form-item>
              <a-form-item>
                <a-button type="primary" @click="fetchStores">获取店铺</a-button>
              </a-form-item>
              <a-form-item>
                <a-select placeholder="选择店铺">
                  <a-select-option v-for="(store, index) in stores" :key="index" :value="store">{{store}}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item>
                <a-select placeholder="选择产品">
                  <a-select-option value="product1">产品1</a-select-option>
                  <a-select-option value="product2">产品2</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item>
                <a-select placeholder="选择数量">
                  <a-select-option value="1">1</a-select-option>
                  <a-select-option value="2">2</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item>
                <a-button type="primary" @click="submitOrder">下单</a-button>
              </a-form-item>
            </div>
            <div class="mapWrap">
              <MapContainer @listenGeo = "listenGeoCallback"/>
            </div>
          </div>
        </a-form>
      </a-tab-pane>
      <a-tab-pane key="query" tab="查询">
        <!-- 查询页面的内容 -->
        <QueryPage />
      </a-tab-pane>
      <a-tab-pane key="image" tab="取餐图片">
        <!-- 取餐图片页面的内容 -->
        <div>
          <a-button type="primary" @click="getImg">查询</a-button>
        </div>
        <a-image :src="srcUrl" />
      </a-tab-pane>
    </a-tabs>

    <div class="warning">
      <p>⚠️ 使用说明！！必读 必读 必读</p>
      <p>1. 自动获取位置，如果不准确请手动输入地区。</p>
      <p>2. 请先选好您的店铺、饮品。</p>
      <p>3. 下单成功请保存好下单信息，丢失不负责。</p>
      <p>4. 出现问题后不承担选好后再下单！售后请联系客服。</p>
      <p>5. 点击“一键生成下单”按钮，...</p>
    </div>
  </div>
</template>

<script>
import MapContainer from "../views/plugins/MapContainer.vue";
import QueryPage from "../views/QueryPage.vue";
import cityJson from '../public/city.json'
import axios from 'axios';

export default {
  components: {
    MapContainer,
    QueryPage,
  },
  data() {
    return {
      activeTab: "order",
      srcUrl: "",
      form: {
        orderId: "",
        province: "",
        provinceArr: [],
        cityArr: [],
        regionArr: [],
        store: "",
        product: "",
        quantity: "",
      },
      latitude: null,
      longitude: null,
      stores: []
    };
  },
  methods: {
          // 获取店铺逻辑
    async fetchStores() {
        const url = 'https://restapi.amap.com/v5/place/around';
        const params = {
            key: '1378bc4448153d4852ef8815b90f15d8',
            keywords: '蜜雪冰城',
            location: this.longitude + "," + this.latitude,
            sortrule: 'distance',
            radius: 5000,
        };

        try {
            const response = await axios.get(url, { params });
            console.log("Fetching stores...");
            console.log(response.data);
            let pois = response.data.pois;
            this.stores = pois.map(poi => poi.name + "\n" + poi.address)
            console.log(this.stores);
        } catch (error) {
            console.error("Error fetching stores:", error);
        }
    },
    submitOrder() {
      // 下单逻辑
      console.log("Submitting order...");
    },
    navigateTo(tab) {
      this.activeTab = tab;
      this.$router.push(`/${tab}`);
    },
    getImg() {
      this.srcUrl =
        "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png";
    },
    handleProvinceCityData() {
      console.log(cityJson);
      this.provinceArr = cityJson;
      console.log(this.provinceArr.length);
      console.log(cityJson.length);
    },
    listenGeoCallback(latitudeAndLongitude) {
      this.latitude = latitudeAndLongitude.lat;
      this.longitude = latitudeAndLongitude.lng;
      this.fetchStores();
    }

  },
  mounted() { 
    this.handleProvinceCityData();
  },
};
</script>

<style scoped>
#mapContainer {
  width: 100%;
  height: 500px;
}

.order-page {
  text-align: center;
}

.logo {
  width: auto;

  height: 300px;
}

h1 {
  font-size: 24px;
  color: #ff4d4f;
  margin-bottom: 20px;
}

.nav-buttons {
  margin-bottom: 20px;
}

.warning {
  background-color: #ff4d4f;
  color: white;
  padding: 15px;
  border-radius: 5px;
  margin-top: 20px;
}

.wrap {
  width: 100%;
  display: flex;
  justify-content: space-around;
}

.formWrap {
  width: 55%;
}

.mapWrap {
  width: 40%;
  margin-left: 20px;
}
</style>
