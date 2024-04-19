<template>
  <div class="full-screen-background" />
  <div class="divider"></div>
  <div class="recommend-style">
    <h2>여행스타일 추천</h2>
    <div class="recommand-card"></div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "MainPage",
  components: {},
};
</script>
<style>
.full-screen-background {
  background-image: url("https://ultimatum0807.s3.ap-northeast-2.amazonaws.com/uploads/high-angle-shot-rock-formations-water-pukerua-bay-new-zealand.jpg"); /* 배경 이미지 URL */
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh; /* 뷰포트 높이를 100%로 설정하여 전체 화면을 채웁니다 */
  width: 100%;
}
.divider {
  padding: 50px;
}
</style>