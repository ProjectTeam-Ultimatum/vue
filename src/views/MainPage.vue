<template>
  <div class="full-screen-background">
    <div class="centered-text">
      반갑습니다~<br />
      당신의 여행스타일은 ???{{}} 입니다.
    </div>
  </div>
  <div class="divider" />
  <div class="recommend-style">
    <h2 class="mb-3">여행스타일 추천</h2>
    <div class="recommand-card"></div>
  </div>
  <div class="divider" />
  <div class="chat">
    <h2 class="mb-3">채팅 소개 영역</h2>
    <div class="recommand-card">
      <router-link to="/chatting"> 나의 메이트 찾기 </router-link> |
      <router-link to="/chatting"> 나의 메이트 찾기 </router-link>
    </div>
  </div>
  <div class="divider" />
  <div class="my-travel-course">
    <h2 class="mb-3">나만의 여행 코스</h2>
    <div class="recommand-card"></div>
  </div>
  <div class="divider" />
  <div class="travel-course">
    <h2 class="mb-3">코스 안내 배너</h2>
    <div class="recommand-card"></div>
  </div>
  <div class="divider" />
  <div class="travel-course">
    <h2 class="mb-3">여행 후기 게시판</h2>
    <div class="latestReview-cards">
      <div
        v-for="(review, index) in latestReviews"
        :key="index"
        class="latestReview-card"
      >
        <div class="latestReview-image">
          <img
            :src="
              review.reviewImages.length > 0
                ? review.reviewImages[0].imageUri
                : 'default-image-url'
            "
            alt="ReviewImage"
          />
        </div>
        <h5>{{ review.reviewTitle }}</h5>
        <div class="latestReview-content" v-html="review.reviewContent"></div>
      </div>
      <router-link class="more-reviews" to="/reviews">
        여행 후기 더보기</router-link
      >
    </div>
  </div>
  <div class="divider" />
</template>

<script>
// @ is an alias to /src
/* eslint-disable */
export default {
  name: "MainPage",
  components: {},
  data() {
    return {
      allReviews: [],
      latestReviews: [],
    };
  },
  created() {
    this.fetchAllReviews();
  },
  methods: {
    async fetchAllReviews() {
      try {
        const response = await this.$axios.get("/api/reviews");
        this.allReviews = response.data.content;
        this.latestReviews = this.allReviews.slice(0, 4); //전체리뷰에서 최신 3개 선택
      } catch (error) {
        if (error.response && error.response.data) {
          //백엔드에서 보낸 에러메시지 표시
          alert(`${error.response.data.message}`);
          console.error(error.response.data.message);
        } else {
          console.error("에러났어요 : " + error);
        }
      }
    },
  },
};
</script>
<style scoped>
.full-screen-background {
  background-image: url("https://ultimatum0807.s3.ap-northeast-2.amazonaws.com/uploads/high-angle-shot-rock-formations-water-pukerua-bay-new-zealand.jpg");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh; /* 뷰포트 높이를 100%로 설정하여 전체 화면을 채웁니다 */
  width: 100%;
  display: flex; /* Flexbox를 사용하여 자식 요소를 중앙에 위치시킵니다 */
  align-items: center; /* 세로 방향 중앙 정렬 */
  text-align: start; /* 텍스트 중앙 정렬 */
}

.centered-text {
  font-size: 100px;
  font-weight: bold;
  margin-left: 100px;
  color: white; /* 텍스트 색상 */
  font-size: 2rem; /* 폰트 크기 */
  max-width: 80%; /* 최대 너비 설정 */
  padding: 20px; /* 패딩 */
  background-color: rgba(0, 0, 0, 0.4); /* 반투명 검은색 배경으로 가독성 증가 */
}
.divider {
  padding: 30px;
}
.recommend-style,
.chat,
.travel-course,
.my-travel-course {
  display: flex;
  background-color: #f3f3f3;
  padding: 50px;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
}
.recommand-card {
  width: 100%; /* 카드의 너비를 화면 전체로 설정 */
  display: flex;
  justify-content: center; /* 내부 요소를 가로축 중앙에 배치 */
}
.latestReview-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* 카드 사이의 간격 */
}

.latestReview-card {
  flex: 1;
  min-width: 15%; /* 최소 너비 */
  background-color: #fff;
  border-radius: 10px; /* 모서리 둥글게 */
  overflow: hidden; /* 내용이 넘칠 경우 숨김 */
  margin: 10px;
  padding: 20px;
}
.latestReview-image img {
  cursor: pointer;
  width: 100%;
  height: 100%;
  object-fit: cover;
  margin-bottom: 30px;
}

.latestReview-content {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.more-reviews {
  display: block;
  text-align: center;
  justify-content: center;
  margin-top: 20px;
  text-decoration: none;
  /* 더보기 링크 스타일 */
}
</style>
