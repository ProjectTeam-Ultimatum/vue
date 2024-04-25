<template>
  <!-- 프로필 이미지와 이름 입력 구역 (단계 1) -->
  <div class="signup-group">
    <div style="padding-top: 30px">
      <h5 style="padding-bottom: 30px">이름과 프로필사진을 등록해주세요</h5>
    </div>
    <div class="file-upload-container">
      <!-- 프로필 이미지 업로드 구역 -->
      <div class="file-upload-wrapper">
        <div class="image-upload-preview" v-if="profileImageSrc">
          <img :src="profileImageSrc" class="profile-image" />
          <button
            type="button"
            class="image-edit-button"
            @click="triggerFileInput"
          >
            &#9998;
          </button>
          <!-- 이모티콘은 적절한 아이콘으로 교체 가능 -->
        </div>
        <div v-else class="image-upload-placeholder">
          <button @click="triggerFileInput" class="file-upload-button"></button>
        </div>
        <input
          type="file"
          id="profileImage"
          ref="profileImage"
          @change="handleFileChange"
          style="display: none"
        />
      </div>
    </div>
    <div class="signup-group-name" style="margin-top: 40px">
      <img src="@/assets/images/name.png" class="input-icon" alt="Icon" />
      <!-- 이미지 아이콘 -->
      <input
        type="text"
        id="name"
        v-model="name"
        required
        placeholder="이름"
        class="input-field"
      />
      <select id="gender" v-model="gender" required>
        <option value="M">남성</option>
        <option value="F">여성</option>
      </select>
    </div>
    <div class="signup-name">
      <p>반드시 실명을 입력해주세요.</p>
    </div>
    <button @click="nextStep" class="next-button">다음</button>
  </div>

  <div style="margin-top: 20px">
    <div class="signup-group-name">
      <img src="@/assets/images/email.png" class="input-icon" alt="Icon" />
      <!-- 이미지 아이콘 -->
      <input
        type="email"
        id="email"
        v-model="email"
        required
        placeholder="이메일"
        class="input-field"
      />
    </div>
    <div class="input-group" style="padding-bottom: 13px">
      <img src="@/assets/images/password.png" class="input-icon" alt="Icon" />
      <!-- 비밀번호 이미지 아이콘 -->
      <input
        type="password"
        id="password"
        v-model="password"
        required
        placeholder="비밀번호"
        class="input-field"
      />
    </div>
    <div class="input-group" style="padding-bottom: 13px">
      <img
        src="@/assets/images/passwordCheck.png"
        class="input-icon"
        alt="Icon"
      />
      <!-- 비밀번호 확인 이미지 아이콘 -->
      <input
        type="password"
        id="password-confirm"
        v-model="passwordConfirm"
        required
        placeholder="비밀번호 확인"
        class="input-field"
        :class="{
          'is-valid': passwordMatch,
          'is-invalid': !passwordMatch,
        }"
      />
      <span v-if="passwordMatch" class="icon is-small is-right">
        <font-awesome-icon icon="fa-solid fa-check" style="color: #65b7f3" />
      </span>
      <span v-else class="icon is-small is-right">
        <font-awesome-icon icon="fa-solid fa-xmark" style="color: #f7c347" />
      </span>
    </div>
    <div class="signup-group-name">
      <img src="@/assets/images/age.png" class="input-icon" alt="Icon" />
      <!-- 나이 이미지 아이콘 -->
      <input
        type="number"
        id="age"
        v-model="age"
        required
        placeholder="   나이"
        class="input-field"
      />
    </div>

    <div>
      <div class="signup-group-name">
        <img src="@/assets/images/location.png" class="input-icon" alt="Icon" />
        <input
          type="text"
          placeholder="    우편번호"
          class="input-field"
          v-model="zonecode"
          readonly
        />
        <button
          id="postcode"
          type="button"
          @click="openPostcode"
          class="icon-button"
        >
          <font-awesome-icon icon="search" style="color: #65b7f3" />
        </button>
      </div>

      <div class="signup-group-name" style="padding-left: 40px">
        <input
          type="text"
          v-model="roadAddress"
          placeholder="주소"
          class="input-field"
          readonly
        />
      </div>

      <div class="signup-group-name" style="padding-left: 40px">
        <input
          type="text"
          v-model="detailAddress"
          placeholder="상세주소"
          class="input-field"
          @blur="saveAddress"
          ref="detailAddress"
        />
      </div>
      <div style="padding-left: 10px; font-weight: bold">
        <span style="font-weight: bold; color: #68c7ff">Q. </span> 당신의 가장
        좋아하는 여행지는 어디인가요?
      </div>
      <div style="padding-left: 40px">
        <input
          type="text"
          v-model="answer"
          placeholder="질문에 대한 답을 적어주세요"
          class="input-field"
          ref="answer"
        />
      </div>
    </div>
    <button type="submit" class="signup-button">회원가입</button>
  </div>
</template>
<script>
export default {
  /* eslint-disable */
  components: {},
  data() {
    return {
      kakaoUserinfo: null,
      memberName: "",
      memberEmail: "",
      memberAge: null,
      memberGender: "",
      memberAddress: "",
      memberFindPasswordAnswer: "",
      files: null,
    };
  },
  mounted() {
    // this.socialRegister();
    //컴포넌트가 마운트될 때 카카오 사용자 정보를 가져오는 메서드 호출
    this.fetchKakaoUserInfo();
  },
  methods: {
    async fetchKakaoUserInfo() {
      try {
        const response = await $axios.get("api/v1/kakao/userinfo");
        this.kakaoUserinfo = response.data;
        console.log("카카오 사용자 정보 : ", this.kakaoUserinfo);
      } catch (error) {
        console.error("카카오 사용자 정보를 가져오는 중 에러발생", error);
      }
    },
    socialRegister() {
      //URL에서 인증 코드 추출
      const authCode = this.$route.query.code;

      //추가 회원 정보와 함께 백엔드로 요청
      const formData = new FormData();
      formData("code", authCode);
      formData("memberAge", this.memberAge);
      formData("memberGender", this.memberGender);
      formData("memberAddress", this.memberAddress);
      formData("memberFindPasswordAnswer", this.memberFindPasswordAnswer);
      formData("files", this.files);

      //회원가입요청보내기
      this.$axios
        .post("/api/v1/signup-with-kakao", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
          alert(
            "소셜로그인 회원가입 실패: " +
              (error.response.data.message || "오류가 발생했습니다.")
          );
        });
    },
  },
};
</script>
<style scoped>
@import "@/assets/css/login_style.css";
</style>