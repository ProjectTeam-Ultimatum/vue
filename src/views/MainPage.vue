<template>
  <!-- 기존 메인 이미지-->
  <!-- <div class="full-screen-background">
    <div v-if="isValidStyle" class="centered-text">
      반갑습니다~<br />
      당신의 여행스타일은<span style="color: #F7C347;"> {{ getMbtiNickname() }} </span>입니다.
    </div>
  </div> -->
  <div>
    <SlideMainImg class="main_vis">
      <!-- <div v-if="isValidStyle" class="centered-text">
        반갑습니다~<br />
        당신의 여행스타일은<span style="color: #F7C347;"> {{ getMbtiNickname() }} </span>입니다.
      </div> -->
    </SlideMainImg>
  </div>
  <div class="divider" ></div>
  <div class="recommend-style">
    <h2 class="mb-3">여행스타일 추천</h2>
    <div class="recommand-card"></div>
  </div>
  <div class="divider" ></div>
  <div class="chat">
    <h2 class="mb-3">채팅 소개 영역</h2>
    <div class="recommand-card">
      <router-link to="/chatting"> 나의 메이트 찾기 </router-link> |
      <router-link to="/chatting"> 나의 메이트 찾기 </router-link>
    </div>
  </div>
  <div class="divider" ></div>
  <div class="my-travel-course">
    <h2 class="mb-3">나만의 여행 코스</h2>
    <div class="recommand-card"></div>
  </div>
  <div class="divider" ></div>
  <div class="travel-course">
    <h2 class="mb-3">코스 안내 배너</h2>
    <div class="recommand-card"></div>
  </div>
  <div class="divider" ></div>
  <div class="travel-course">
    <LatestReviews />
  </div>
  <div class="divider"></div>
</template>

<script>

import LatestReviews from "../components/Review/LatestReviews.vue";
import SlideMainImg from "../components/MainPage/SlideMainImg.vue";
// @ is an alias to /src
/* eslint-disable */
export default {
  name: "MainPage",
  components: { 
    LatestReviews,
    SlideMainImg
  },
  
  data(){
    return {
      memberStyle: '로딩 중...', // 초기값 설정
      mbtiNicknames: { // MBTI 별명 매핑
        "ISFJ": "여행한정 인싸",
        "INFJ": "감성 여행자",
        "INTJ": "효율 계획러",
        "ISTJ": "프로 엑셀러",
        "ISFP": "힐링 여행러",
        "INFP": "로맨틱 여행파",
        "INTP": "한적 스팟러",
        "ISTP": "프로 혼행러",
        "ESFJ": "프로 핫스팟러",
        "ENFJ": "프로 여행러",
        "ENTJ": "효율 로보트",
        "ESTJ": "엑셀 마스터",
        "ESFP": "여행 즉흥론자",
        "ENFP": "여행 무계획러",
        "ENTP": "위기탈출 넘버원",
        "ESTP": "프로 플렉서"
      }
    };
  },

  computed: {
    isValidStyle() {
      // MBTI 스타일 문자열의 유효성 검사를 안전하게 수행
      return Object.prototype.hasOwnProperty.call(this.mbtiNicknames, this.memberStyle);
    }
  },

  mounted() {
    this.fetchUserInfo();
  },

  methods: {
    async fetchUserInfo() {
      try {
        const response = await this.$axios.get("/api/v1/user/info/detail");
        this.$store.commit("auth/SET_USER_NAME", response.data.userName);
        this.$store.commit("auth/SET_USER_IMAGE", response.data.images);
        this.memberStyle = response.data.memberStyle; // 스타일 정보를 로컬 데이터에 저장
        console.log("API response:", response.data); // API 응답 로깅
      } catch (error) {
        console.error("인증된 사용자가 아닙니다. : ", error);
        this.memberStyle = '정보를 불러올 수 없습니다'; // 에러 처리 추가
      }
    },
    getMbtiNickname() {
      return this.mbtiNicknames[this.memberStyle] || '알 수 없는 스타일';
    },
  },
};
</script>
<style scoped>
@import "@/assets/css/mainpage_style.css";
</style>
