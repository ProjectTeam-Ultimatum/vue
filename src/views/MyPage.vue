<template>
  <div>
    <div class="divider" />
    <div class="info-container">
      <div class="member">
        <div class="mypage-maintext">마이 페이지</div>
        <div class="mypage-content-row">
          <div class="member-image">
            <div class="file-upload-wrapper">
              <div class="image-upload-preview" v-if="profileImageSrc">
                <img :src="profileImageSrc" class="profile-image" />

                <!-- 이모티콘은 적절한 아이콘으로 교체 가능 -->
              </div>
              <div v-else class="image-upload-placeholder"></div>
              <input
                type="file"
                id="profileImage"
                ref="profileImage"
                @change="handleFileChange"
                style="display: none"
              />
            </div>
          </div>
          <div class="member-content">
            <div class="info-group">
              <label for="email">이메일</label>
              <div class="member-info" id="name">{{ memberDetails.email }}</div>
            </div>
            <div class="info-group">
              <label for="name">이 름</label>
              <div class="member-info" id="name">
                {{ memberDetails.userName }}
              </div>
            </div>
            <div
              v-if="currentPassword !== null && currentPassword !== ''"
              class="info-group"
            >
              <label for="pw">비밀번호</label>
              <div class="member-info">
                <div @click="openPwModal" type="button" id="pw" class="pw">
                  비밀번호 변경
                </div>
              </div>
            </div>
            <PasswordChangeModal
              :memberDetails="memberDetails"
              :isChangingPw="isPwModalVisible"
              @close="closePwModal"
            />
            <div class="info-group">
              <label for="age">나 이</label>
              <div class="member-info" id="age">{{ memberDetails.age }}</div>
            </div>
            <div class="info-group">
              <label for="gender">성 별</label>
              <div class="member-info" id="gender">
                {{
                  memberDetails.gender === "F"
                    ? "여"
                    : memberDetails.gender === "M"
                    ? "남"
                    : "정보 없음"
                }}
              </div>
            </div>
            <div class="info-group">
              <label for="address">주 소</label>
              <div class="member-info" id="address">
                {{ memberDetails.address }}
              </div>
            </div>
            <div class="info-group">
              <label for="findByAnswer">가고싶은 여행지는?</label>
              <div class="member-info" id="findByAnswer">
                {{ memberDetails.findByAnswer }}
              </div>
            </div>
            <div class="info-group">
              <label for="style">여행 스타일</label>
              <div class="member-info" id="style">
                {{ memberDetails.memberStyle }}
              </div>
              <div @click="goToStyle" class="goToStyle">여행 스타일 변경</div>
            </div>
          </div>
        </div>
        <div class="buttons">
          <button type="button" class="goToModify" @click="goToModifyPage">
            내 정보 수정하러 가기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PasswordChangeModal from "../components/ChangePw.vue";
export default {
  components: {
    PasswordChangeModal,
  },
  data() {
    return {
      memberDetails: [],
      profileImageSrc: null,
      profileImageFile: null,
      isPwModalVisible: false,
    };
  },

  mounted() {
    this.fetchUserDetail();
  },
  methods: {
    goToStyle() {
      this.$router.push("/travel");
    },
    goToModifyPage() {
      this.$router.push("/modify-member");
    },
    openPwModal() {
      this.isPwModalVisible = true;
    },
    closePwModal() {
      this.isPwModalVisible = false;
    },
    async fetchUserDetail() {
      try {
        const response = await this.$axios.get("/api/v1/user/info/detail");

        this.memberDetails = response.data;
        this.profileImageSrc = response.data.images;

        console.log("멤버 디테일 : ", response.data); // API 응답 로깅
      } catch (error) {
        console.error("로그인해주세요 : ", error);
        this.$store.commit("auth/SET_AUTHENTICATED", false);
        this.isAuthenticated = false; // 에러 발생 시 인증 상태 업데이트
      }
    },
    triggerFileInput() {
      console.log("File input triggered");
      this.$refs.profileImage.click();
    },
    handleFileChange() {
      const file = this.$refs.profileImage.files[0];
      if (file) {
        // 데이터 URL을 읽어 이미지 미리보기를 설정합니다.
        const reader = new FileReader();
        reader.onload = (e) => {
          this.profileImageSrc = e.target.result; // 미리보기 이미지를 데이터 URL로 설정
        };
        reader.readAsDataURL(file);
        // 파일 객체를 저장합니다.
        this.profileImageFile = file;
      }
    },
  },
};
</script>

<style scoped>
@import "@/assets/css/login_style.css";
@import "@/assets/css/mypage.css";
</style>