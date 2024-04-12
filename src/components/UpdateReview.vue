<template>
  <div class="modal" v-if="isModalEditing">
    <div class="modal-body">
      <h2>리뷰 수정</h2>
      <form @submit.prevent="submitForm" class="review-form">
        <div class="form-group">
          <label for="title">제목</label>
          <input
            id="title"
            type="text"
            v-model="editableReview.reviewTitle"
            class="form-control-title"
          />
          <select
            id="location"
            v-model="editableReview.reviewLocation"
            class="form-control-location"
          >
            <option value="">전체 지역</option>
            <option value="제주 북부">제주 북부</option>
            <option value="제주 남부">제주 남부</option>
            <option value="제주 동부">제주 동부</option>
            <option value="제주 서부">제주 서부</option>
          </select>
        </div>
        <div class="form-group">
          <label for="subtitle">부제목</label>
          <input
            id="subtitle"
            type="text"
            v-model="editableReview.reviewSubtitle"
            class="form-control"
          />
          <!--tiptap3 Editor-->
          <editor-content :editor="editor" />
        </div>
        <div class="form-group">
          <label for="content">내용</label>
          <textarea
            id="content"
            v-model="editableReview.reviewContent"
            class="form-control-textarea"
          ></textarea>
        </div>
        <div class="form-group">
          <label for="newImages">이미지 업로드</label>
          <input
            id="newImages"
            type="file"
            @change="handleFiles"
            multiple
            class="form-control"
          />
        </div>
        <div class="image-preview-container">
          <div
            v-for="(image, index) in editableReview.reviewImages"
            :key="image.reviewImageId || 'new-' + index"
            class="image-preview"
          >
            <span class="image-name">{{ newReviewImages }}</span>
            <span class="image-name">{{ image.imageName }}</span>

            <button
              type="button"
              @click="removeImage(index)"
              class="btn-remove"
            >
              삭제
            </button>
          </div>
        </div>
        <div class="form-actions">
          <button
            type="button"
            @click="$emit('cancel')"
            class="btn btn-secondary"
          >
            취 소
          </button>
          <button type="submit" class="btn btn-primary">저 장</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { EditorContent, Editor } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
/* eslint-disable */
export default {
  name: "UpdateReview",
  component: {
    EditorContent,
  },
  props: {
    isModalEditing: {
      type: Boolean,
      required: true,
    },
    review: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editableReview: {
        reviewTitle: this.review.reviewTitle,
        reviewSubtitle: this.review.reviewSubtitle,
        reviewLocation: this.reviewLocation,
        reviewImages: this.review.reviewImages,
      },
      newReviewImages: [], // 새로 업로드할 이미지들을 저장할 배열
      editor: null,
    };
  },
  mounted() {
    this.editor = new Editor({
      content: this.review.reviewContent,
      extensions: [StarterKit],
    });
  },
  beforeUnmount() {
    this.editor.destroy();
  },
  methods: {
    submitForm() {
      this.updateReview();
    },
    handleFiles(event) {
      // 새로 선택된 파일들을 배열로 변환
      const files = Array.from(event.target.files);
      // 새 이미지 파일들을 newReviewImages 배열에 저장하고, 표시를 위해 이미지 이름과 함께 객체를 만듭니다.
      const newImagesData = files.map((file) => ({
        imageName: file.name,
        file: file, // 파일 데이터
        isNew: true, // 새로운 이미지임을 표시
      }));

      // 현재 리뷰 이미지 배열에 새 이미지 데이터를 추가
      this.editableReview.reviewImages.push(...newImagesData);
    },

    removeImage(index) {
      // 새 이미지를 newReviewImages 배열에서 제거합니다.
      // 이 경우에는 서버에 이미지 데이터가 없으므로 클라이언트 측 배열에서만 제거하면 됩니다.
      const newImageIndex = this.editableReview.reviewImages.findIndex(
        (image) => image.isNew
      );
      if (newImageIndex !== -1) {
        this.editableReview.reviewImages.splice(newImageIndex, 1);
      }
      this.editableReview.reviewImages.splice(index, 1);
    },

    async updateReview() {
      const formData = new FormData();
      formData.append("reviewTitle", this.editableReview.reviewTitle);
      formData.append("reviewSubtitle", this.editableReview.reviewSubtitle);
      formData.append("reviewContent", this.editor.getHTML());
      formData.append("reviewLocation", this.editableReview.reviewLocation);

      // 새로운 이미지와 기존 이미지를 formData에 추가하는 코드
      this.editableReview.reviewImages.forEach((image) => {
        if (image.isNew) {
          // 새로운 이미지 파일 추가
          formData.append("images", image.file);
        }
      });
      // FormData 내용 검사
      for (var pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }

      try {
        const response = await this.$axios.put(
          `/api/reviews/${this.review.reviewId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        this.$emit("update", response.data); // 수정된 리뷰 데이터를 이벤트로 전달
        this.$emit("close");
      } catch (error) {
        console.error("업데이트 실패 : ", error);
      }
    },
  },
};
</script>
<style scoped>
@import "../assets/review_modal_update.css";
</style>
