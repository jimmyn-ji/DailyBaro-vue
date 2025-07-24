<script setup>
</script>

<template>
  <div id="app" class="global-bg">
    <router-view></router-view>
  </div>
</template>

<style scoped>
.global-bg {
  min-height: 100vh;
  background: url('./static/imgs/back.png') no-repeat center center fixed;
  background-size: cover;
}
.el-input {
  width: 180px;
}
:deep(.el-input__wrapper) {
  border: none;
}
</style>
