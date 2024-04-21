<template>
    <div class="reply-modal-overlay">
      <div class="reply-modal"  v-if="replyModalCreate">
        <div class="reply-modal-body">
          <!-- <span class="close" @click="closeModal">&times;</span> -->
          <h2>우진해장국을 방문하셨나요? :)</h2>
        </div>
        <div class="modal-body">
          <div class="modal-image">
            <!-- <img src="path_to_your_image.jpg" alt="우진해장국" style="width:100%; max-height:200px; object-fit:cover;"> -->
          </div>
          <div class="star-rating">
            <span
              v-for="star in 5"
              :key="star"
              class="star"
              :class="{ filled: star <= rating }"
              @click="setRating(star)"
            >
              ★
            </span>
          </div>
          <div class="feedback-buttons">
            <button
              v-for="option in feedbackOptions"
              :key="option"
              :class="{ 'feedback-button-selected': feedbacks.includes(option) }"
              class="feedback-button"
              @click="toggleFeedback(option)"
            >
              {{ option }}
            </button>
          </div>
        </div>
        <div class="modal-footer">
            <button class="action-button cancel" @click="close">취소</button>
          <button class="action-button confirm" @click="submitFeedback">제출</button>
        </div>
      </div>
    </div>
  </template>

<script>
export default {
  data() {
    return {
      rating: 0,
      feedbacks: [],
      feedbackOptions: [
        '음식이 맛있어요',
        '재료가 신선해요',
        '양이 많아요',
        '단지 맛에 치우쳐요',
        '가성비가 좋아요',
        '또 가고 싶어요'
      ]
    };
  },
  props: {
    // replyModalCreate: {
    //   type: Boolean,
    //   required: true,
    // },
    replyModalCreate: Boolean
},
  methods: {
    setRating(star) {
      this.rating = star;
    },
    toggleFeedback(option) {
      const index = this.feedbacks.indexOf(option);
      if (index === -1) {
        this.feedbacks.push(option);
      } else {
        this.feedbacks.splice(index, 1);
      }
    },
    close(){
      // 이벤트를 발생시켜 부모 컴포넌트에게 모달을 닫으라고 알립니다.
      this.$emit('close');
    },
    submitFeedback() {
      // 사용자가 제출 버튼을 눌렀을 때 실행될 로직을 여기에 작성하세요.
      // 예를 들어, this.feedbacks 배열을 서버로 전송할 수 있습니다.
      console.log('Submitted feedbacks:', this.feedbacks);
      this.closeModal(); // 피드백을 제출한 후 모달을 닫습니다.
    }
}
};
</script>

<style scoped>
@import "@/assets/createModal_style.css";
</style>
