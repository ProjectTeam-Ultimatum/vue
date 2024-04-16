<template>
  <div class="update-modal" v-if="isModalEditing">
    <div class="modal-body">
      <h2>게시글 수정</h2>
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
            <option value="전체 지역">전체 지역</option>
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
            <span class="image-name">✓ {{ image.imageName }} </span>

            <div
              class="btn-remove"
              @click="
                image.isNew
                  ? removeNewImage(index)
                  : removeExistingImage(index, image.reviewImageId)
              "
              style="color: #6e6e6e"
            >
              <font-awesome-icon :icon="['fas', 'xmark']" />
            </div>
          </div>
        </div>
        <div class="form-group">
          <!--tiptap3 Editor-->
          <link
            href="https://cdn.jsdelivr.net/npm/remixicon@2.2.0/fonts/remixicon.css"
            rel="stylesheet"
          />

          <AppTextEditor v-model="content" :max-limit="500" />
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

<script >
import AppTextEditor from "./AppTextEditor";

/* eslint-disable */

export default {
  name: "UpdateReview",
  components: { AppTextEditor },
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
        reviewLocation: this.reviewLocation || "제주 전체",
        reviewImages: this.review.reviewImages,
        reviewContent: this.review.reviewContent,
      },
      newReviewImages: [], // 새로 업로드할 이미지들을 저장할 배열
      content: this.review.reviewContent,
      deleteImageIds: [],
    };
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

    removeNewImage(index) {
      // 새 이미지를 배열에서 제거합니다.
      this.editableReview.reviewImages.splice(index, 1);
    },
    removeExistingImage(index, imageId) {
      // 기존 이미지 ID를 삭제 목록 배열에 추가
      this.deleteImageIds.push(imageId);
      // 이미지 미리보기 배열에서 해당 이미지 객체 제거
      this.editableReview.reviewImages.splice(index, 1);
    },

    async updateReview() {
      const formData = new FormData();
      formData.append("reviewTitle", this.editableReview.reviewTitle);
      formData.append("reviewSubtitle", this.editableReview.reviewSubtitle);
      formData.append("reviewLocation", this.editableReview.reviewLocation);
      formData.append("reviewContent", this.content);

      // 새로운 이미지와 기존 이미지를 formData에 추가하는 코드
      this.editableReview.reviewImages.forEach((image) => {
        if (image.isNew) {
          // 새로운 이미지 파일 추가
          formData.append("newImages", image.file);
        }
      });
      this.deleteImageIds.forEach((id) => {
        formData.append("deleteImages", id);
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

        this.$emit("close");
      } catch (error) {
        console.error("업데이트 실패 : ", error);
      }
    },
  },
};
</script>
<style>
@import "@/assets/css/review_modal_update.css";
</style>
