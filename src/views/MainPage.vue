<template>
  <!-- 기존 메인 이미지-->
  <!-- <div class="full-screen-background">
  </div> -->
  <div>
    <SlideMainImg class="main-vis" />
  </div>
  <div class="divider" ></div>
        <div v-if="isValidStyle">
          당신의 여행스타일은<span style="color: #F7C347;"> {{ getMbtiNickname() }} </span>입니다.
        </div>
  <div class="recommend-style">
    <h2 class="mb-3">여행스타일 추천</h2>
    <div class="recommand-card"></div>
  </div>
  <div class="divider" ></div>
  <div class="chat">
    <div class="recommand-card">

      <div class="card horizontal_card">
          <div class="card_content">

            <div class="card_front">
                <div class="left_section">
                   동행을 찾는것이<br/>목적지보다 어렵다고<br/> 느껴지나요?
                </div>
                <div class="right_section">
                  <img :src="require('@/assets/images/alone.jpg')" alt="Report" style="width: 400px; height: 350px; margin-left: 10px;
                   border-top-right-radius: 7px; border-bottom-right-radius: 5px;">
                </div>
            </div>

            <div class="card_back">
                <div class="left_section">
                   같은 여행 스타일의 <br/> 친구들과 만나보세요
                </div>
                <div class="right_section">
                  <img :src="require('@/assets/images/alone.jpg')" alt="Report" style="width: 400px; height: 350px; margin-left: 10px;
                   border-top-right-radius: 7px; border-bottom-right-radius: 5px;">
                </div>
            </div>

          </div>
      </div>

      <div class="right-banner">
        <div>
        <h1>나의 여행 메이트</h1>
        </div>
        <div>
          <p>비슷한 여행취향, 완벽한 동행</p>
        </div>
        <div>
          <p>이제 여행 메이트 매칭으로 더 즐거운 여행을 시작하세요.</p>
        </div>
      </div>

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

/* 공통 스타일 */
.card {
  position:relative;
  width: 150px;
  height: 350px;
  margin: 15px;
  perspective: 900px;
  border: 10px;
} 
.card .card_content {
  position: absolute;
  width: 100%;
  height: 100%;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  border-radius: 10px; transition: transform 1s;
  transform-style: preserve-3d;
} 

.left_section,
.right_section {
    flex: 1; /* 두 섹션이 동일한 너비를 갖도록 설정합니다 */
    border-right: 1px solid #ccc; /* 왼쪽 섹션의 오른쪽에 경계선을 추가합니다 */
}

.right_section {
    border-right: none; /* 오른쪽 섹션의 경계선을 제거합니다 */
}

.card:hover .card_content {
  transition: transform 0.5s;
} 

.card .card_front,.card .card_back {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 10px;
  font-size: 30px;
  color: #8ab4f8;
  text-align: center;
  backface-visibility: hidden;
} 

.card .card_back {
  background: #8ab4f8;
  color: #fff;
} 

/* 가로로 뒤집히는 카드 */
.horizontal_card:hover .card_content {
  transform: rotateY(180deg);
} 

.horizontal_card .card_back {
  transform: rotateY(180deg);
} 

.right-banner{
  display: flex;
  flex-direction: column; /* 자식 요소들을 세로로 배치 */
  text-align: start;
  margin-left: 50px;
}
</style>
