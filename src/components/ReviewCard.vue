<template>
  <div class="review-card">
    <div class="review-image">
      <!-- 이미지 경로를 :src 바인딩을 통해 설정 -->
      <img :src="require(`@/assets/${review.image}`)" alt="Review Image" />

    </div>
    <div class="review-content">
      <h3>{{ review.title }}</h3>
      <p>{{ review.body }}</p>
      <div class="review-footer">
        <span class="likes" @click="incrementLikes">❤️ {{ likes }}</span>
        <span class="comment" ><i class="fa-regular fa-comment comment-icon"></i> {{ review.comment }}</span>
        <span class="date">{{ review.date }}</span>
        <span class="author">by {{ review.author }}</span>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

export default {
  name: 'ReviewCard',
  props: {
    review: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      likes: 250 // 좋아요 수를 0으로 초기화
    };
  },
  methods: {
    incrementLikes() {
      this.likes += 1; // 클릭할 때마다 좋아요 수를 1 증가
    }
  }
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
