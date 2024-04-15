<template>
    <div class="login-container">
      <h1>로그인</h1>
      <form @submit.prevent="login">
        <div>
          <label for="username">Id:</label>
          <input type="text" id="username" v-model="username" required>
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <div>
          <button type="submit">로그인</button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        username: '',
        password: ''
      };
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
    }
  }
  </script>
  