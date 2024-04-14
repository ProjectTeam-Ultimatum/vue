<template>
  <div class="modal" v-if="isModalVisible">
    <!-- 조회 모달창 -->

    <div class="head-bts">
      <div class="cl-bt" @click="$emit('close')" style="color: #6e6e6e">
        <font-awesome-icon :icon="['fas', 'xmark']" size="2xl" />
      </div>
      <div class="update-delete">
        <div class="update-button" @click="editReview">
          <span style="font-size: 12px"> 수정 </span
          ><font-awesome-icon :icon="['far', 'pen-to-square']" size="xl" />
        </div>

        <div class="delete-button" @click="deleteReview(review.reviewId)">
          <span style="font-size: 12px"> 삭제 </span
          ><font-awesome-icon :icon="['far', 'trash-can']" size="xl" />
        </div>
      </div>
    </div>

    <div class="modal-content">
      <div class="board-name">여행 후기 게시판 ></div>
      <div class="review-title1">
        [{{ review.reviewLocation }}] {{ review.reviewTitle }}
      </div>
      <div class="subtitle1">{{ review.reviewSubtitle }}</div>
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
          <span class="comment"> {{ review.replyCount }}</span>
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

      <div class="review-content1" v-html="review.reviewContent" />
      <!-- 댓글 -->
      <div
        class="replies"
        v-for="(reply, index) in review.replies"
        :key="index"
      >
        <div class="replies-header">
          <div class="replyer">{{ reply.reviewReplyer }}</div>
          <div class="reply-date">{{ formatDate(reply.reg_date) }}</div>
        </div>
        <div class="reply">
          <div v-if="!reply.isEditing" class="reply-main">
            <div class="reply-content">{{ reply.reviewReplyContent }}</div>
            <div class="reply-control">
              <div class="reply-update" @click="editReply(reply.reviewReplyId)">
                수정
              </div>
              <div
                class="reply-delete"
                @click="deleteReply(reply.reviewReplyId)"
              >
                삭제
              </div>
            </div>
          </div>
          <div v-else class="reply-main">
            <input
              class="reply-content-input"
              v-model="reply.editingContent"
              @keyup.enter="updateReply(reply)"
            />
            <div class="reply-control">
              <button class="reply-update-save" @click="updateReply(reply)">
                저장
              </button>
              <button
                class="reply-update-cancel"
                @click="reply.isEditing = false"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="new-reply">
      <input
        class="reply-writer"
        v-model="reviewReplyer"
        placeholder="닉네임을 입력하세요"
      />
      <input
        class="reply-writing"
        v-model="reviewReplyContent"
        @keyup.enter="postReply"
        placeholder="댓글을 입력해주세요.."
      />
      <button @click="postReply">등 록</button>
    </div>
  </div>
</template>

<script>
import UpdateReview from "./UpdateReview.vue";
/* eslint-disable */

export default {
  components: {
    UpdateReview,
  },
  props: {
    review: {
      type: Object,
      required: true,
    },
    isModalVisible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      currentImageIndex: 0,
      selectedReview: null, //선택된 리뷰 ID
      reviewReplyContent: "", //댓글 내용
      reviewReplyer: "",
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
    isModalVisible(newValue) {
      if (newValue) {
        document.body.style.overflow = "hidden"; // 모달이 열릴 때 스크롤 비활성화
      } else {
        document.body.style.overflow = ""; // 모달이 닫힐 때 원래 스크롤 상태로 복구
      }
    },
  },

  methods: {
    //댓글작성 메소드
    async postReply() {
      if (!this.reviewReplyContent.trim() && !this.reviewReplyer.trim()) {
        alert("댓글 내용을 입력하세요");
        return;
      }
      try {
        const response = await this.$axios.post(
          `/api/reviews/${this.review.reviewId}/reply`,
          {
            reviewReplyer: this.reviewReplyer,
            reviewReplyContent: this.reviewReplyContent,
          }
        );
        alert("댓글이 등록되었습니다.");
        this.reviewReplyer = "";
        this.reviewReplyContent = "";
        //부모컴포넌트에 review객체를 보내고 새로고침 요청
        this.$emit("refresh-modal", this.review);
      } catch (error) {
        console.error("댓글 작성 실패 : ", error);
      }
    },

    editReview() {
      //부모컴포넌트에 edit 이벤트를 발생 시키고 현재 리뷰 id를 전달
      this.$emit("edit", this.review.reviewId);
    },

    async deleteReview(reviewId) {
      if (confirm("게시글을 정말 삭제하시겠습니까?")) {
        try {
          await this.$axios.delete(`/api/reviews/${reviewId}`);
          alert("게시글이 삭제 되었습니다.");
          this.$emit("close");
          this.$emit("deleted");
        } catch (error) {
          console.error("리뷰 삭제에 실패하였습니다: ", error);
        }
      }
    },
    editReply(replyId) {
      // 댓글 ID를 사용하여 현재 댓글 객체를 찾습니다.
      const reply = this.review.replies.find(
        (r) => r.reviewReplyId === replyId
      );

      // 댓글 객체를 찾았다면 수정 상태로 전환합니다.
      if (reply) {
        // 다른 댓글들의 수정 상태를 해제합니다.
        this.review.replies.forEach((r) => {
          r.isEditing = false;
        });

        // 현재 댓글의 편집 상태를 true로 설정하고, 현재 내용을 복사합니다.
        reply.isEditing = true;
        reply.editingContent = reply.reviewReplyContent;
      } else {
        console.error("해당하는 댓글을 찾을 수 없습니다.");
      }
    },

    async updateReply(reply) {
      try {
        await this.$axios.put(`/api/reviews/${reply.reviewReplyId}/reply`, {
          reviewReplyContent: reply.editingContent,
        });
        reply.reviewReplyContent = reply.editingContent;
        reply.isEditing = false;
        alert("댓글이 수정되었습니다.");
      } catch (error) {
        console.error("댓글 수정에 실패하였습니다: ", error);
      }
    },
    async deleteReply(replyId) {
      if (confirm("댓글을 정말 삭제하시겠습니까?")) {
        try {
          await this.$axios.delete(`/api/reviews/${replyId}/reply`);
          alert("댓글이 삭제되었습니다.");
          this.$emit("refresh-modal", this.review);
        } catch (error) {
          console.error("댓글 삭제에 실패하였습니다: ", error);
        }
      }
    },

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