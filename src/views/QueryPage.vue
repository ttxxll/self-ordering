<template>
  <div class="query-page">
    <a-input v-model:value="orderId" placeholder="请输入订单号" />
    <a-button type="primary" @click="queryOrder">查询</a-button>
    <!-- <div class="result" v-if="result">
      {{ result }}
    </div> -->
    <a-textarea v-if="result" v-model:value="result" placeholder="Place input" :rows="4" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      orderId: '',
      result: true
    }
  },
  methods: {
    queryOrder() {
      // 查询订单逻辑
      this.result = "查询结果显示在这里";
    }
  }
}
</script>

<style scoped>
.query-page {
  text-align: center;
}

.logo {
  width: 100%;
  height: auto;
}

h1 {
  font-size: 24px;
  color: #ff4d4f;
  margin-bottom: 20px;
}

.result {
  margin-top: 20px;
  font-size: 18px;
}
</style>
