<template>
  <section class="review-board">
    <ReviewCard v-for="review in reviews" :key="review.id" :review="review" />
  </section>
</template>

<script>
import ReviewCard from '../components/ReviewCard.vue'
/* eslint-disable */

export default {
  name: "ReviewBoard",
  components: {
    ReviewCard
  },
  data() {
    return {
      reviews: [
        {
          id: 1,
        
          title: "멋진 풍경과 함게한 제주도 여행",
          image: "hanra.jpeg",
          likes: 200,
          comments: 3,
          body: "제주도의 아름다운 풍경과 맛있는 음식을 즐길 수 있는 여행이었습니다. 강추해요!",
          author: "김여행",
          date: "2024-04-01",
        
        },
        {
          id: 2,
          title: "가족과 함께한 행복한 시간",
          image: "logo.png",
          likes: 4,
          comments: 10,
          body: "가족들과 함께한 제주도 여행은 정말 특별하고 의미 있는 시간이었습니다.",
          author: "이가족",
          date: "2024-03-28",
        },
      ], //후기 데이터 가져오는 로직
    };
  },
  //created, mounted같은 생명주기 훅을 사용하여 후기 데이터를 가져오기
};
</script>
