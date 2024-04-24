<template>
  <div class="login-container">
    <button class="login-trigger" @click="showModal = true; currentView = 'login'">로그인</button>
    <button class="logout-button" @click="logout" v-if="isAuthenticated">로그아웃</button>

    <!-- 모달 창 -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="login-modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h1 class="modal-title">{{ currentView === 'login' ? '로그인' : '회원가입' }}</h1>

        <!-- 로그인 폼 -->
        <form v-if="currentView === 'login'" @submit.prevent="login" class="login-form">
          <!-- 로그인 필드 -->
          <div class="form-group">
            <label for="email">이메일</label>
            <input type="text" id="username" v-model="username" placeholder="이메일" required>
          </div>
          <div class="form-group">
            <label for="password">비밀번호</label>
            <div class="password-container">
              <input :type="passwordFieldType" id="password" v-model="password" placeholder="비밀번호" required>
              <span class="password-toggle-icon" @click="togglePasswordVisibility">&#128065;</span>
            </div>
            <div>
              <p style="font-size: 12px;">비밀번호를 잊으셨나요?</p>
            </div>
          </div>
          <button type="submit" class="submit-button">로그인</button>
          <p>OR</p>
          <button class="google-signin">카카오 계정으로 로그인하기</button>
          <p class="signup-prompt">아직 회원이 아니신가요? <a @click="switchView('signup')">회원가입 하기</a></p>
        </form>

        <!-- 회원가입 폼 -->
        <form v-else @submit.prevent="register" class="signup-form">
          <div class="form-group">
            <label for="name">이름</label>
            <input type="text" id="name" v-model="name" required>
          </div>
          <div class="form-group">
            <label for="email">이메일</label>
            <input type="email" id="email" v-model="email" required>
          </div>
          <div class="form-group">
            <label for="password">비밀번호</label>
            <input type="password" id="password" v-model="password" required>
          </div>
          <div class="form-group">
            <label for="age">나이</label>
            <input type="number" id="age" v-model="age" required>
          </div>
          <div class="form-group">
            <label for="gender">성별</label>
            <select id="gender" v-model="gender" required>
              <option value="M">남성</option>
              <option value="F">여성</option>
            </select>
          </div>
          <div class="form-group">
            <label for="address">주소</label>
            <input type="text" id="address" v-model="address" required>
          </div>
          <button type="submit" class="submit-button">회원가입</button>
        </form>
      </div>
    </div>
  </div>
</template>


<script>

export default {
  data() {
    return {
      username: '',
      password: '',
      showModal: false,
      currentView: 'login', // 현재 보여줄 뷰
      passwordFieldType: 'password',
      showSignupModal: false, // 회원가입 모달을 관리할 새로운 데이터 속성
      name: '',
      email: '',
      age: null,
      gender: '',
      address: ''
    };
  },
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem('Authorization');
    }
  },
  methods: {
    login() {
      const data = {
        memberEmail: this.username,
        memberPassword: this.password
      };
      this.$axios.post('/login', data)  // this.$axios로 변경
        .then(response => {
          const jwtToken = response.headers['authorization'] || response.headers['Authorization'];
          if (jwtToken) {
            localStorage.setItem('Authorization', jwtToken);
            this.showModal = false; // 모달 닫기
            this.$router.push('/'); // 홈으로 리디렉트
          } else {
            alert('JWT 토큰을 받지 못했습니다.');
          }
        })
        .catch(error => {
          console.error('Login error:', error);
          alert('로그인 실패: ' + error.message);
        });
    },

    logout() {
      // 로컬 스토리지에서 토큰 제거
      localStorage.removeItem('Authorization');
      // 로그아웃 성공 메시지 표시 후 페이지 새로 고침
      alert('로그아웃 되었습니다.');
      location.reload(); // 페이지 새로고침
    },
    togglePasswordVisibility() {
      this.passwordFieldType =
        this.passwordFieldType === 'password' ? 'text' : 'password';
    },
    switchToSignup() {
      this.showModal = false; // 로그인 모달 닫기
      this.showSignupModal = true; // 회원가입 모달 열기
    },
    register() {
      const data = {
        memberName: this.name,
        memberEmail: this.email,
        memberPassword: this.password,
        memberAge: this.age,
        memberGender: this.gender,
        memberAddress: this.address
      };

      // 여기에서 axios 대신 this.$axios를 사용합니다.
    this.$axios.post('http://localhost:8080/api/v1/join', data)
        .then(response => {
          alert(response.data); // 성공 메시지 출력
          this.closeModal(); // 모달 창 닫기
          this.$router.push('/login'); // 로그인 페이지로 이동
        })
        .catch(error => {
          console.error('Registration failed:', error);
          alert('회원가입 실패: ' + error.response.data);
      });
    },
    switchView(view) {
     this.currentView = view; // 현재 뷰 전환
    },
    closeModal() {
      this.showModal = false;
      this.currentView = 'login'; // 모달을 닫을 때 로그인 뷰로 리셋
    },
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
}

.login-trigger, .logout-button, .google-signin {
  width: 100%;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  margin-top: 10px;
  cursor: pointer;
  font-size: 16px;
}

.login-trigger {
  background-color: #68C7FF; /* Blue */
  color: white;
}

.logout-button {
  background-color: #f44336; /* Red */
  color: white;
}

.google-signin {
  background-color: #f9e000; /* Google Red */
  color: white;
  width: 70%;
  margin-bottom: 10px;
  padding: 15px 20px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  position: relative;
}

.close {
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
  font-size: 24px;
}

.modal-title {
  font-size: 24px;
  margin-bottom: 20px;
  margin-top: 70px;
}

.login-form {
  display: flex;
  flex-direction: column;
  align-items: center; /* 모든 자식 요소를 중앙 정렬 */
  width: 400px;
  height: 500px;
}

.signup-form {
  display: flex;
  flex-direction: column;
  align-items: center; /* 모든 자식 요소를 중앙 정렬 */
  width: 400px;
  height: 550px;
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 요소들을 컨테이너의 왼쪽 가장자리에 정렬합니다. */
  margin-bottom: 10px;
  width: 80%;
}

.form-group label {
  margin-bottom: 5px; /* 라벨과 입력 필드 사이에 약간의 간격을 추가 */
  width: 100px;
  text-align: start;
}

.form-group input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: calc(100% - 22px); /* Adjust for padding */
  margin-bottom: 10px;
}

.password-container {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
}


.password-toggle-icon {
  cursor: pointer;
  position: absolute; /* 컨테이너 내에서 절대 위치를 사용 */
  right: 30px; /* 오른쪽 끝에서 10px의 간격을 둠 */
  bottom: 20px;
}

.submit-button {
  background-color: #68C7FF;
  color: white;
  padding: 15px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 70%;
  margin-bottom: 10px;
  margin-top: 20px;
}

.signup-prompt {
  text-align: center;
  margin-top: 40px;
  width: 80%;
}

.signup-prompt a {
  color: #008CBA;
  cursor: pointer;
}

</style>
