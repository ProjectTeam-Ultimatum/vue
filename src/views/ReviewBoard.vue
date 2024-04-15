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
      ], //후기 데이터 가져오는 로직
    };
  },
  //created, mounted같은 생명주기 훅을 사용하여 후기 데이터를 가져오기
};
</script>
