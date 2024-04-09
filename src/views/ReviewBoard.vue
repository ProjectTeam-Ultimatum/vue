<template>
  <h1 class="main-text">여행 <span class="highlight">후기</span> 게시판</h1>
  <h4 class="sub-text">
    당신의 여행이 더욱 특별해질 수 있게 여행기록을 공유하세요
  </h4>
  <div class="container">
    <div class="region-list">
      <div
        class="region-item"
        :class="{ active: selectedRegion === '' }"
        @click="selectRegion('')"
      >
        전체 지역
      </div>
      <div
        class="region-item"
        :class="{ active: selectedRegion === '제주 북부' }"
        @click="selectRegion('제주 북부')"
      >
        제주 북부
      </div>
      <div
        class="region-item"
        :class="{ active: selectedRegion === '제주 남부' }"
        @click="selectRegion('제주 남부')"
      >
        제주 남부
      </div>
      <div
        class="region-item"
        :class="{ active: selectedRegion === '제주 동부' }"
        @click="selectRegion('제주 동부')"
      >
        제주 동부
      </div>
      <div
        class="region-item"
        :class="{ active: selectedRegion === '제주 서부' }"
        @click="selectRegion('제주 서부')"
      >
        제주 서부
      </div>
    </div>

    <div class="reviews">
      <div
        v-for="review in filteredReviews"
        :key="review.id"
        class="review-card"
      >
        <!-- Review Image -->
        <div class="review-image">
          <img
            :src="
              review.reviewImages.length > 0
                ? review.reviewImages[0].imageUri
                : 'default-image-url'
            "
            alt="Review Image"
          />
        </div>
        <div class="review-content">
          <div class="card-main">
            <h2>[{{ review.reviewLocation }}] {{ review.reviewTitle }}</h2>
            <h4>{{ review.reviewSubtitle }}</h4>
            <p>{{ truncate(review.reviewContent, 50) }}</p>
          </div>
          <div class="review-footer">
            <div class="footer-container">
              <span class="likes" @click="incrementLikes(review)"
                >❤️ {{ review.reviewLike }}</span
              >
              <span class="comment"
                ><i class="fa-regular fa-comment comment-icon"></i> 📨
                {{ review.replyCount }}</span
              >
            </div>
            <div class="footer-container">
              <span class="date">{{ formatDate(review.reg_date) }}</span>
              <span class="author">by auther</span>
            </div>
          </div>
        </div>
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
      allReviews: [], // 복수형으로 변경하여 여러 후기 데이터를 담을 수 있도록 함
      page: 0,
      totalPages: 10,
      selectedRegion: "", //기본값 전체로 설정
    };
  },
  computed: {
    filteredReviews() {
      //선택된 지역에 따라 리뷰를 필터링
      console.log(this.selectedResion); //필터링 전 선택지역확인
      const result = !this.selectedRegion
        ? this.allReviews
        : this.allReviews.filter(
            (review) => review.reviewLocation === this.selectedRegion
          );
      console.log(result); //필터링 결과 확인
      return result;
    },
  },

  //created, mounted같은 생명주기 훅을 사용하여 후기 데이터를 가져오기
  methods: {
    async fetchData() {
      try {
        const params = {
          page: this.page,
          size: 6,
          sort: "reviewId,desc", //정렬방식
        };
        if (this.selectedRegion) {
          params.reviewLocation = this.selectedRegion.trim();
        }
        const response = await this.$axios.get(
          "http://localhost:8080/api/reviews",
          { params }
        );
        //성공적으로 데이터를 받아온 경우
        console.log("데이터요청 성공 : " + response.data);
        console.log(this.allReviews);
        this.allReviews = response.data.content;
        this.totalPages = response.data.totalPages;
      } catch (error) {
        console.error("에러났어요 : " + error);
      }
    },
    truncate(str, num) {
      if (str.length > num) {
        return str.slice(0, num) + "...";
      } else {
        return str;
      }
    },
    async incrementLikes(review) {
      // 좋아요를 증가시키는 로직
      review.reviewLike += 1;
      try {
        // 백엔드 서버에 변경사항을 전달
        await this.$axios.post(
          `http://localhost:8080/api/reviews/${review.reviewId}`,
          {
            reviewLike: review.reviewLike,
          },
          console.log(review)
        );
        // 필요하다면 응답 처리
      } catch (error) {
        console.error("좋아요 업데이트 중 에러 발생: " + error);
      }
    },
    // 날짜를 인자로 받아서 원하는 형태의 문자열로 변환하여 반환
    formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    changePage(page) {
      this.page = page;
      this.fetchData();
    },
    selectRegion(region) {
      this.selectedRegion = region;
      this.fetchData;
    },
  },

  mounted() {
    this.fetchData(); //컴포넌트가 마운트 될 때 데이터를 가져옴
  },
};
</script>

<style>
.main-text {
  margin-top: 20px;
}
.highlight {
  color: #ffc83b;
  font-style: bold;
  font-size: 38px;
}
.container {
  display: flex; /* 기본적으로 가로 방향 */
  flex-direction: row; /* 기본적으로 가로 방향 */
  align-items: flex-start; /* 컨텐츠를 상단에 정렬 */
  gap: 0px; /* 컬럼사이 간격 */
  padding: 0;
  justify-content: center;
}

.region-list {
  margin-top: 20px;
  flex: 1; /*sidebar 가 차지할 공간 */
  flex-direction: column;
}
.region-item {
  padding: 28px;
  cursor: pointer;
  font-size: 24px;
}
.region-item.active {
  font-weight: bold;
  font-size: 28px;
  color: #1275d6;
}
.reviews {
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-left: -100px;
}
.review-card {
  display: flex; /* Flexbox 레이아웃 적용 */
  border: 1px solid #eee;
  border-radius: 15px;
  overflow: hidden; /* 컨테이너 밖으로 내용물이 넘치지 않도록 설정 */
  margin: 10px auto;
  width: 100%; /* 카드의 너비를 부모 컨테이너에 맞춤 */
  max-width: 860px; /* 최대 너비 설정 */
  height: 260px; /* 카드의 높이 고정 */
}

.review-image {
  flex: 1.9; /* 이미지 영역과 콘텐츠 영역이 비율에 따라 공간을 나눔 */
  background-size: cover;
  background-position: center;
}

.review-content {
  flex: 2; /* 콘텐츠 영역이 이미지 영역보다 크게 설정 */
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  margin-right: 20px;
}
.card-main {
  padding: 20px;
  text-align: left;
}

.review-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.review-footer {
  margin: 10px;
  display: flex;
  justify-content: space-between;
}
.footer-container {
}

.rating,
.author,
.date {
  font-size: 0.9em;
  margin-right: 15px;
}
.likes {
  cursor: pointer;
  user-select: none; /* 텍스트 선택 방지 */
  margin-left: 15px;
  margin-right: 15px;
}
.comment-icon {
  transform: scaleX(-1); /* 아이콘을 수평으로 뒤집음 */
}
</style>

