<template>
  <div v-for="review in reviews" :key="review.id" class="review-card">
    <!-- Review Image -->
    <div
      v-if="review.reviewImages && review.reviewImages.length > 0"
      class="review-image"
    >
      <!-- 첫 번째 이미지의 경로를 바인딩 -->
      <img :src="review.reviewImages[0].filePath" alt="Review Image" />
    </div>
    <div class="review-content">
      <h3>{{ review.reviewTitle }}</h3>
      <p>{{ review.reviewSubtitle }}</p>
      <div class="review-footer">
        <span class="likes" @click="incrementLikes"
          >❤️ {{ review.reviewLikes }}</span
        >
        <span class="comment"
          ><i class="fa-regular fa-comment comment-icon"></i>
          {{ review.comment }}</span
        >
        <!-- <span class="date">{{ review.reg_date | formatDate }}</span> -->
        <span class="author">by auther</span>
      </div>
    </div>
  </div>
  <button v-for="n in totalPages" :key="n" @click="changePage(n - 1)">
    {{ n }}
  </button>
</template>

<script>
/* eslint-disable */

export default {
  name: "ReviewBoard",
  components: {},
  data() {
    return {
      reviews: [], // 복수형으로 변경하여 여러 후기 데이터를 담을 수 있도록 함
      page: 0,
      totalPages: 10,
    };
  },
  //created, mounted같은 생명주기 훅을 사용하여 후기 데이터를 가져오기
  methods: {
    fetchData() {
      const params = {
        page: this.page,
        size: 6,
        sort: "reviewId,desc", //정렬방식
      };
      this.$axios
        .get("http://localhost:8080/api/reviews", { params })
        .then((response) => {
          //성공적으로 데이터를 받아온 경우
          console.log("데이터요청 성공 : " + response.data);
          this.reviews = response.data.content;
          this.totalPage = response.data.totalPages;
        })
        .catch((error) => {
          //요청중 에러
          console.error("에러났어요 : " + error);
        });
    },
    changePage(page) {
      this.page = page;
      this.fetchData();
    },
  },
  mounted() {
    this.fetchData(); //컴포넌트가 마운트 될 때 데이터를 가져옴
  },
};
</script>

<style scoped>
.review-card {
  display: flex; /* Flexbox 레이아웃 적용 */
  border: 1px solid #eee;
  border-radius: 15px;
  overflow: hidden; /* 컨테이너 밖으로 내용물이 넘치지 않도록 설정 */
  margin: 10px auto;
  width: 100%; /* 카드의 너비를 부모 컨테이너에 맞춤 */
  max-width: 1000px; /* 최대 너비 설정 */
  height: 280px; /* 카드의 높이 고정 */
}

.review-image {
  flex: 1.3; /* 이미지 영역과 콘텐츠 영역이 비율에 따라 공간을 나눔 */
  background-size: cover;
  background-position: center;
}

.review-content {
  flex: 2; /* 콘텐츠 영역이 이미지 영역보다 크게 설정 */
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.review-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.review-footer {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.rating,
.author,
.date {
  font-size: 0.9em;
}
.likes {
  cursor: pointer;
  user-select: none; /* 텍스트 선택 방지 */
}
.comment-icon {
  transform: scaleX(-1); /* 아이콘을 수평으로 뒤집음 */
}
</style>

