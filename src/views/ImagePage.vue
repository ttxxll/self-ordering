<template>
  <div class="image-page">
    <img src="@/assets/logo.jpg" alt="蜜雪冰城" class="logo" />
    <h1>取餐图片</h1>
    <a-upload>
      <a-button icon="upload">上传图片</a-button>
    </a-upload>
    <div class="images" v-if="images.length">
      <a-card
        v-for="image in images"
        :key="image"
        :cover="`path_to_images/${image}`"
      >
        <a-card-meta title="图片名称" description="图片描述" />
      </a-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      images: []
    }
  },
  methods: {
    fetchImages() {
      // 模拟获取图片
      this.images = ["image1.jpg", "image2.jpg"];
    }
  },
  mounted() {
    this.fetchImages();
  }
}
</script>

<style scoped>
.image-page {
  text-align: center;
}

.logo {
  width: 100%;
  height: 150px;
}

h1 {
  font-size: 24px;
  color: #ff4d4f;
  margin-bottom: 20px;
}

.images {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.images a-card {
  margin: 10px;
  width: 200px;
}
</style>
