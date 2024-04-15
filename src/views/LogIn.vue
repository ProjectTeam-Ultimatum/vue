<template>
  <div class="login-container">
    <!-- 트리거 버튼 -->
    <button class="login-trigger" @click="showModal = true">로그인</button>

    <!-- 로그아웃 버튼 -->
    <button class="logout-button" @click="logout" v-if="isAuthenticated">로그아웃</button>

    <div v-if="showSignupModal" class="modal-overlay" @click.self="showSignupModal = false">
        <div class="signup-container">
        <h1>회원가입</h1>
        <form @submit.prevent="register">
          <div>
            <label for="name">이름:</label>
            <input type="text" id="name" v-model="name" required>
          </div>
          <div>
            <label for="email">이메일:</label>
            <input type="email" id="email" v-model="email" required>
          </div>
          <div>
            <label for="password">비밀번호:</label>
            <input type="password" id="password" v-model="password" required>
          </div>
          <div>
            <label for="age">나이:</label>
            <input type="number" id="age" v-model="age" required>
          </div>
          <div>
            <label for="gender">성별:</label>
            <select v-model="gender" required>
              <option value="M">남성</option>
              <option value="F">여성</option>
            </select>
          </div>
          <div>
            <label for="address">주소:</label>
            <input type="text" id="address" v-model="address" required>
          </div>
          <button type="submit">회원가입</button>
        </form>
      </div>
    </div>

    <!-- 모달 창 -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content">
        <span class="close" @click="showModal = false">&times;</span>
        <h1 class="modal-title">로그인</h1>
        <form @submit.prevent="login" class="login-form">
          <div class="form-group">
            <input type="text" id="username" v-model="username" placeholder="이메일" required>
          </div>
           <div class="form-group">
            <input :type="passwordFieldType" id="password" v-model="password" placeholder="비밀번호" required>
            <span class="password-toggle-icon" @click="togglePasswordVisibility">&#128065;
            </span>
          </div>
          <button type="submit" class="submit-button">로그인</button>
          <button class="google-signin">카카오 계정으로 로그인하기</button>
          <p class="signup-prompt">아직 회원이 아니신가요? <a @click="switchToSignup">회원가입 하기</a></p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      showModal: false,
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
      axios.post('/login', data)
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
    // 사용자를 로그인 페이지로 리디렉션
    this.$router.push('/login');
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
  
        axios.post('/api/v1/join', data)
          .then(response => {
            alert(response.data); // 성공 메시지 출력
            this.$router.push('/login'); // 로그인 페이지로 이동
          })
          .catch(error => {
            console.error('Registration failed:', error);
            alert('회원가입 실패: ' + error.response.data);
          });
      }
  }
}
</script>

<style>
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

.modal-content {
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
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

.form-group input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: calc(100% - 22px); /* Adjust for padding */
}

.password-toggle-icon {
  position: absolute;
  right: 30px;
  top: 145px;
  cursor: pointer;
}

.submit-button {
  background-color: #68C7FF;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.signup-prompt {
  text-align: center;
  margin-top: 20px;
}

.signup-prompt a {
  color: #008CBA;
}
.signup-container {
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: white;
  padding: 20px;
  border-radius: 5px;
  position: relative;
}

.signup-container input,
.signup-container select,
.signup-container button {
  padding: 10px;
  margin-bottom: 15px; /* 간격 조정 */
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 90%; /* 전체 너비 */
}

.signup-container button {
  background-color: #68C7FF; /* 로그인 버튼과 동일한 색상 */
  color: white;
  cursor: pointer;
}
</style>
