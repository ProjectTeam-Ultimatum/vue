<template>
  <nav :class="{ 'main-page': isMainPage, 'dark-text': isScrolled }">
    <router-link class="main-logo" to="/">제주랑</router-link>
    <div class="nav-links">
      <router-link to="/chatting"> 메이트 찾기</router-link>
      <router-link to="/budget">예산 짜기</router-link>
      <router-link to="/reviews"> 여행후기 </router-link>
    </div>
    <div class="login" style="cursor: pointer">
      <div v-if="!isAuthenticated" @click="showLoginModal">
        <!-- <font-awesome-icon :icon="['far', 'circle-user']" size="lg" /> -->
        로그인
      </div>
      <div v-else @click="logout">
        <!-- <font-awesome-icon
          :icon="['fas', 'arrow-right-from-bracket']"
          size="lg"
        /> -->
        로그아웃
      </div>
    </div>
    <login-modal
      v-if="showModal"
      @close="showModal = false"
      @login-success="handleLoginSuccess"
    />
  </nav>
  <router-view />
</template>

<script>
import LoginModal from "./components/LogIn.vue";
export default {
  name: "App",
  components: {
    LoginModal,
  },
  data() {
    return {
      showModal: false,
      isAuthenticated: !!localStorage.getItem("Authorization"),
      isScrolled: false,
    };
  },
  computed: {
    isMainPage() {
      return this.$route.path === "/";
    },
  },
  methods: {
    showLoginModal() {
      this.showModal = true;
    },
    logout() {
      // 로컬 스토리지에서 토큰 제거
      localStorage.removeItem("Authorization");
      this.isAuthenticated = false;
      // 로그아웃 성공 메시지 표시 후 페이지 새로 고침
      alert("로그아웃 되었습니다.");
      this.$router.push("/");
    },

    handleLoginSuccess() {
      //상태를 업데이트 하거나 필요한 ui 변경을 수행합니다.
      this.isAuthenticated = true;
      this.showModal = false;
      //사용자를 홈페이지로 리다이랙션
      this.$router.push("/");
    },
  },
  mounted() {
    window.addEventListener("scroll", () => {
      this.isScrolled = window.scrollY > 50; //스크롤 위치가 50px 이상이면 색상 변경
    });
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.main-page #app {
  background-image: url("./assets/images/navbar-img.png"); /* 전체 페이지 배경 이미지 설정 */
  background-size: cover; /* 배경 이미지 꽉 차게 */
  background-position: center center; /* 배경 이미지 중앙 정렬 */
}
.app:not(.main-page) {
  background: none;
}

nav {
  display: flex;
  justify-content: center;
  padding: 25px;
  background-color: transparent; /* 기본 배경색 */
  position: fixed;
  width: 100vw;
  top: 0;
  left: 0;
  transition: background-color 0.3s;
  background-size: cover;
  z-index: 1000;
}

.nav-links {
  display: flex;
  gap: 70px;
}

.main-logo {
  font-size: 25px;
  color: #000000;
  position: absolute;
  left: 50px;
}
nav.scrolled,
nav:not(.main-page) {
  background-color: white;
}
.nav-links,
.main-logo,
.login {
  transition: color 0.3s;
}
nav.scrolled,
nav:not(.main-page) {
  background-color: white;
}

nav.main-page .nav-links a,
nav.main-page .main-logo,
nav.main-page .login {
  color: white;
}

nav.scrolled .nav-links a,
nav.scrolled .main-logo,
nav.scrolled .login,
nav:not(.main-page) .nav-links a,
nav:not(.main-page) .main-logo,
nav:not(.main-page) .login,
.dark-text .nav-links a,
.dark-text .main-logo,
.dark-text .login {
  color: black;
}

nav a {
  font-size: 23px;
  font-weight: bold;
  text-decoration: none;
  color: #000000;
}

nav a.router-link-exact-active {
  font-size: 25px;
  color: #ffc83b;
}

.login {
  text-align: right;
  position: absolute;
  right: 30px;
  font-size: 18px;
  cursor: pointer;
}
</style>