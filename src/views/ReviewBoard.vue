<template>
  <p class="main-text">여행 <span class="highlight">후기</span> 게시판</p>
  <p class="sub-text">
    당신의 여행이 더욱 특별해질 수 있게 여행기록을 공유하세요
  </p>
  <!-- 검색창 -->
  <input type="text" v-model="searchQuery" placeholder="검색어를 입력하세요" />
  <!-- 검색 버튼 -->
  <button @click="performSearch">검색</button>
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
            <div class="review-title">
              [{{ review.reviewLocation }}] {{ review.reviewTitle }}
            </div>
            <div class="subtitle">{{ review.reviewSubtitle }}</div>
            <div>{{ truncate(review.reviewContent, 50) }}</div>
          </div>
          <div class="review-footer">
            <div class="footer-container">
              <span class="likes" @click="incrementLikes(review)">
                <font-awesome-icon
                  :icon="['fas', 'heart']"
                  size="lg"
                  style="color: #e00b0b"
                />
                {{ review.reviewLike }}
              </span>
              <font-awesome-icon
                :icon="['far', 'comment']"
                size="lg"
                flip="horizontal"
              />
              <span class="comment">. {{ review.replyCount }}</span>
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
      searchQuery: "",
    };
  },
  computed: {
    filteredReviews() {
      // 검색 쿼리와 선택된 지역에 따라 리뷰를 필터링
      let result = this.allReviews;

      if (this.selectedRegion) {
        result = result.filter(
          (review) => review.reviewLocation === this.selectedRegion
        );
      }

      if (this.searchQuery) {
        const searchLowerCase = this.searchQuery.toLowerCase();
        result = result.filter(
          (review) =>
            review.reviewTitle.toLowerCase().includes(searchLowerCase) ||
            review.reviewSubtitle.toLowerCase().includes(searchLowerCase) ||
            review.reviewContent.toLowerCase().includes(searchLowerCase)
        );
      }

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
        const response = await this.$axios.get("/api/reviews", { params });
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
          `/api/reviews/${review.reviewId}`,
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

<style scoped>
@import "../assets/reviewboard_style.css";
</style>