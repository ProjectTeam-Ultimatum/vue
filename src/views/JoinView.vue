<template>
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
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        name: '',
        email: '',
        password: '',
        age: null,
        gender: '',
        address: ''
      };
    },
    methods: {
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
  