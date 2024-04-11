<template>
  <div class="modal" v-if="isVisible">
    <div class="cl-bt" @click="$emit('close')">
      <font-awesome-icon :icon="['fas', 'xmark']" size="2xl" />
    </div>
    <div class="modal-content">
      <div class="review-title">
        [{{ review.reviewLocation }}] {{ review.reviewTitle }}
      </div>
      <div class="subtitle">{{ review.reviewSubtitle }}</div>
      <div class="review-footer-modal">
        <div class="footer-container-modal">
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
        <div class="footer-container-modal">
          <span class="date">{{ formatDate(review.reg_date) }}</span>
          <span class="author">by auther</span>
        </div>
      </div>

      <div class="slider-container">
        <div class="click" @click="prevImage">
          <font-awesome-icon :icon="['fas', 'chevron-left']" size="2xl" />
        </div>
        <img :src="currentImageUrl" alt="Images" />
        <div class="click" @click="nextImage">
          <font-awesome-icon :icon="['fas', 'chevron-right']" size="2xl" />
        </div>
      </div>

      <div class="review-content">{{ review.reviewContent }}</div>

      <div
        class="replies"
        v-for="(reply, index) in review.replies"
        :key="index"
      >
        <div class="replies-header">
          <div class="replyer">{{ reply.reviewReplyer }}</div>
          <div class="reply-date">{{ formatDate(reply.reg_date) }}</div>
        </div>
        <div class="reply-content">
          <div>{{ reply.reviewReplyContent }}</div>
        </div>
      </div>

      <!-- 닫기 버튼-->
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
  data() {
    return {
      currentImageIndex: 0,
    };
  },
  computed: {
    currentImageUrl() {
      if (
        this.review &&
        this.review.reviewImages &&
        this.currentImageIndex < this.review.reviewImages.length
      ) {
        return this.review.reviewImages[this.currentImageIndex].imageUri;
      }
      return "default-image-url"; // 혹은 기본 이미지의 URL
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

  methods: {
    nextImage() {
      if (this.currentImageIndex < this.review.reviewImages.length - 1) {
        this.currentImageIndex++;
      }
    },
    prevImage() {
      if (this.currentImageIndex > 0) {
        this.currentImageIndex--;
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
  },
};
</script>

<style scoped>
@import "../assets/reviewboard_style.css";
@import "../assets/review_modal.css";
</style>