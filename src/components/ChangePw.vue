<template>
  <div v-if="isChangingPw" class="pw-modal-overlay">
    <div class="pw-modal-content">
      <span class="close" @click.self="$emit('close')">&times;</span>
      <h2 style="margin: 30px">비밀번호 변경</h2>
      <form @submit.prevent="updatePassword" class="update-form">
        <div class="input-group-pw">
          <label for="password">기존 비밀번호</label>
          <input
            type="password"
            id="password"
            v-model="currentPassword"
            class="input-field"
            required
          />
        </div>
        <div class="input-group-pw">
          <label for="password">새 비밀번호</label>
          <input
            type="password"
            id="password"
            v-model="newPassword"
            class="input-field"
            required
          />
        </div>
        <div class="input-group-pw">
          <label for="password">비밀번호 확인</label>
          <input
            type="password"
            class="input-field"
            v-model="confirmPassword"
            :class="{
              'is-valid': passwordMatch,
              'is-invalid': !passwordMatch,
            }"
          />
          <span v-if="passwordMatch" class="icon is-small is-right">
            <font-awesome-icon
              icon="fa-solid fa-check"
              style="color: #65b7f3"
            />
          </span>
          <span v-else class="icon is-small is-right">
            <font-awesome-icon
              icon="fa-solid fa-xmark"
              style="color: #f7c347"
            />
          </span>
        </div>
        <div class="submit-form-pw">
          <button type="submit" class="goToChangePw">비밀번호 변경</button>
          <button @click="$emit('close')" class="cancleChangePw">
            취소하기
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    memberDetails: Object,
    isChangingPw: Boolean,
  },
  data() {
    return {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
  },
  computed: {
    passwordMatch: function () {
      return this.newPassword === this.confirmPassword;
    },
  },
  methods: {
    updatePassword() {
      if (!this.validatePassword()) {
        return; // 비밀번호가 일치하지 않으면 등록 절차 중단
      }
      const formData = new FormData();
      formData.append("currentPassword", this.currentPassword);
      formData.append("newPassword", this.newPassword);

      this.$axios
        .post("/api/v1/user/password", formData)
        .then((response) => {
          console.log("changing password successful", response);
          alert("비밀번호가 변경되었습니다.");
          this.$emit("close");
        })
        .catch((error) => {
          console.error("failed password changing", error);
          alert(
            "비밀번호 변경 실패" +
              (error.response.data.message || "비밀번호 변경 오류 발생")
          );
        });
    },
    validatePassword() {
      if (this.newPassword !== this.confirmPassword) {
        alert("비밀번호가 일치하지 않습니다.");
        return false;
      }
      return true;
    },
  },
};
</script>

<style scoped>
@import "@/assets/css/login_style.css";
.cancleChangePw {
  cursor: pointer;
  background-color: white;
  color: #68c7ff;
  border: 1px solid #68c7ff;
  border-radius: 5px;
  font-size: 18px;
  padding: 15px;
  margin: 8px;
}
.goToChangePw {
  cursor: pointer;
  background-color: #68c7ff;
  color: white;
  border: 1px solid #68c7ff;
  border-radius: 5px;
  font-size: 18px;
  padding: 15px;
  margin: 8px;
}
.submit-form-pw {
  display: flex;
  flex-direction: row;
}
.update-form {
  display: flex;
  flex-direction: column;
  align-items: center; /* 모든 자식 요소를 중앙 정렬 */
  width: 500px;
  height: 300px;
}
.pw-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.pw-modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.input-group-pw {
  display: flex;
  flex-direction: row; /* 가로 방향으로 나란히 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  justify-content: space-between; /* 요소들 사이에 공간을 균등하게 분배 */
  width: 100%; /* 부모 컨테이너의 너비에 맞춤 */
  padding-bottom: 18px;
}
.input-group-pw label {
  flex: 0.2;
}
.input-group-pw input {
  flex: 0.8;
}
</style>
