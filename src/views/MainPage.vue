<template>
  <div class="full-screen-background">
    <div v-if="isValidStyle" class="centered-text">
      반갑습니다~<br />
      당신의 여행스타일은<span style="color: #F7C347;"> {{ getMbtiNickname() }} </span>입니다.
    </div>
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
// @ is an alias to /src
/* eslint-disable */
export default {
  name: "MainPage",
  components: { LatestReviews },
  
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
.full-screen-background {
  background-image: url("https://ultimatum0807.s3.ap-northeast-2.amazonaws.com/uploads/high-angle-shot-rock-formations-water-pukerua-bay-new-zealand.jpg");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh; /* 뷰포트 높이를 100%로 설정하여 전체 화면을 채웁니다 */
  width: 100%;
  display: flex; /* Flexbox를 사용하여 자식 요소를 중앙에 위치시킵니다 */
  align-items: center; /* 세로 방향 중앙 정렬 */
  text-align: start; /* 텍스트 중앙 정렬 */
}

.centered-text {
  font-size: 100px;
  font-weight: bold;
  margin-left: 100px;
  color: white; /* 텍스트 색상 */
  font-size: 2rem; /* 폰트 크기 */
  max-width: 80%; /* 최대 너비 설정 */
  padding: 20px; /* 패딩 */
  background-color: rgba(0, 0, 0, 0.4); /* 반투명 검은색 배경으로 가독성 증가 */
}
.divider {
  padding: 30px;
}
.recommend-style,
.chat,
.travel-course,
.my-travel-course {
  display: flex;
  background-color: #f3f3f3;
  padding: 50px;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
}
.recommand-card {
  width: 100%; /* 카드의 너비를 화면 전체로 설정 */
  display: flex;
  justify-content: center; /* 내부 요소를 가로축 중앙에 배치 */
}
</style>
