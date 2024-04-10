<template>
  <div class="modal" v-if="isVisible">
    <div class="modal-content">
      <div class="review-title">
        [{{ review.reviewLocation }}] {{ review.reviewTitle }}

        <div class="subtitle">{{ review.reviewSubtitle }}</div>
      </div>
      <div v-for="(image, index) in review.reviewImages" :key="index">
        <img class="images" :src="image.imageUri" alt="Review Image" />
      </div>

      <div>{{ review.reviewContent }}</div>
      <div v-for="(reply, index) in review.replies" :key="index">
        <div>{{ reply.reviewReplyId }}</div>
      </div>

      <!-- 닫기 버튼-->
      <button @click="$emit('close')">닫기</button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

export default {
  props: {
    review: {
      type: Object,
      required: true,
    },
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  watch: {
    isVisible(newValue) {
      if (newValue) {
        document.body.style.overflow = "hidden"; // 모달이 열릴 때 스크롤 비활성화
      } else {
        document.body.style.overflow = ""; // 모달이 닫힐 때 원래 스크롤 상태로 복구
      }
    },
  },
  // 모달 컴포넌트가 제거될 때도 스크롤을 복구합니다.
  beforeUnmount() {
    document.body.style.overflow = "";
  },
};
</script>

<style scoped>
@import "../assets/reviewboard_style.css";

.modal {
  position: fixed; /* 화면에 고정 */
  top: 50%; /* 상단에서 50% 위치 */
  left: 50%; /* 좌측에서 50% 위치 */
  transform: translate(
    -50%,
    -50%
  ); /* 정중앙 정렬을 위해 자기 크기의 반만큼 이동 */
  width: 50%; /* 모달의 너비 */
  background-color: white; /* 배경색 */
  padding: 20px; /* 안쪽 여백 */
  border-radius: 10px; /* 테두리 둥글기 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  z-index: 1000; /* 다른 요소들 위에 나타나도록 z-index 설정 */
}

.modal-content {
  display: flex;
  flex-direction: column;
  background: white;
  padding: 20px;
  border-radius: 5px;
  max-width: 600px; /* 최대 너비 설정 */
  max-height: 80vh; /* 뷰포트 높이의 80%만큼의 최대 높이 */
  overflow-y: auto;
  justify-content: center;
  align-items: center;
}
.images {
  width: 100%;
  height: auto;
}
.modal-content .review-title,
.modal-content .subtitle,
.modal-content .review-content {
  text-align: center; /* 텍스트를 중앙에 정렬 */
}
</style>