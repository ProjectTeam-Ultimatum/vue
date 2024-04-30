<template>
  <div>
  <!-- 기존 메인 이미지-->
  <!-- <div class="full-screen-background">
  </div> -->
  <div>
    <SlideMainImg class="main-vis" />
  </div>
  <!-- 영역 나누기 -->
  <!-- <div class="divider"></div> -->
  <!-- 1st 여행 스타일 추천 -->
  <div class="recommend-style">
    <h3 class="mb-3 main-title-txt">여행스타일 추천</h3>
    <div class="main-travel-style">
      <div class="main-travel-style-txt" > 
        <div v-if="isValidStyle" style="font-size: 22px;">
          <font-awesome-icon :icon="['fas', 'suitcase-rolling']" style="color:#68C7FF" />
          당신의 여행스타일은
          <strong style="color: #68C7FF">
            "{{ getMbtiNickname() }}"</strong
          >입니다.
        </div>
      </div>
    </div>
    <RecommendBanner/>
  </div>
  <!-- 2nd 여행 메이트 찾기 -->
  <div class="chat" style="background-color: #F1F8FF;">
    <div class="recommand-card" style="width:2000px;">
      <div :class="['card horizontal_card', { 'is-hovering': hoverActive }]">
          <div class="card_content">

            <div class="card_front">

                <div class="left_section">
                   같은 여행 스타일의 <br/> 친구들과 <br/><span style="color:#3ba7ff; font-weight:bold; font-size:30px;"> 만나보세요!</span>
                </div>
                <div class="right_section">
                  <img :src="require('@/assets/images/surfing1.jpg')" alt="Report" style="width: 350px; height: 350px; margin-left: 10px;
                   border-top-right-radius: 7px; border-bottom-right-radius: 5px;">
                </div>

            </div>

            <div class="card_back">

                <div class="left_section">
                   간편하게<br/> 나만의 최적화된<br/>
                   <span style="color:#3ba7ff; font-weight:bold; font-size:30px; letter-spacing : -2px;">메이트 찾기<br/></span>
                </div>
                <div class="right_section">
                  <img :src="require('@/assets/images/chat02.jpg')" alt="Report" style="width: 350px; height: 350px; margin-left: 10px;
                   border-top-right-radius: 7px; border-bottom-right-radius: 5px;">
                </div>


            </div>

          </div>
      </div>

      <div class="right-banner">
        <div class="right-header-wrap">
          <p class="right-banner-header" style="letter-spacing : -2px;">나에게 딱 맞는 메이트 찾기</p>
          <div>
            <router-link to="/chatting">
              <div class="fancy_text" 
                  @mouseover="hoverActive = true" 
                  @mouseleave="hoverActive = false">
                  <span><font-awesome-icon :icon="['far', 'comment-dots']" /></span>채팅 하기
              </div>
            </router-link> 
          </div>
        </div>
        <ul class="right-banner-list">
          <li><em>🏕 한라산 등반 크루 모집ㅣ</em> 5월 연휴에 한라산 등반 하실 분😎</li>
          <li><em>🍺 여행하면서 낮술 하실 분ㅣ</em> 😍소주 맥주 막걸리 와인 모두 가능</li>
          <li><em>🏃‍♂️올레길 4코스 함께해요ㅣ</em> 😝제일 길다는 4코스. 함께 하실 분~~ </li>
          <li><em>🍚같이 밥먹을 사람ㅣ</em> 👩🧑혼자 여행옴. 같이 밥 먹어요 </li>
        </ul>

      </div>

    </div>
  </div>
  <!-- 3rd 나만의 여행 코스 -->
  <div class="my-travel-course">
    <h3 class="mb-3 main-title-txt">나만의 여행 코스</h3>
    <MyCourse />
  </div>
  <!-- 4th 여행 코스 추천 -->
  <CarouselBanner />
  <!-- 여행 후기 게시판 -->
  <div class="travel-course">
    <h3 class="mb-3 main-title-txt">여행 후기 모음</h3>
    <LatestReviews />
  </div>
  <!-- 제주도민 평가단 모집 -->
  <div class="travel-course">
    <h3 class="mb-3 main-title-txt">제주도민 평가단 모집</h3>
    <div class="recommand-card">

      <div class="taste-review-banner">
          <div class="banner-content">
              <p>내가 가는곳이 핫 플레이스!(꾸며야함)</p>
              <button class="btn-join">지금 신청하기</button>
          </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import LatestReviews from "../components/Review/LatestReviews.vue";
import SlideMainImg from "../components/MainPage/SlideMainImg.vue";
import CarouselBanner from "../components/MainPage/CarouselBanner.vue";
import MyCourse from "../components/MainPage/MyCourse.vue";
import RecommendBanner from "../components/MainPage/RecommendBanner.vue";
// @ is an alias to /src
/* eslint-disable */
export default {
  name: "MainPage",
  components: { 
    LatestReviews,
    SlideMainImg,
    SlideMainImg,
    CarouselBanner,
    MyCourse,
    RecommendBanner
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
      },
      hoverActive: false, // hover 상태를 추적하는 데이터
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

/* chat 스타일 */
/* 공통 스타일 */
.card {
  position:relative;
  width: 150px;
  height: 350px;
  margin: 20px;
  perspective: 900px;
  border: 10px;
  margin-right: 60px;
} 
.card .card_content {
  position: absolute;
  width: 100%;
  height: 100%;
  /* box-shadow: 0 0 15px rgba(0, 0, 0, 0.1); */
  border-radius: 10px; transition: transform 1s;
  transform-style: preserve-3d;
} 

.left_section,
.right_section {
    flex: 1; /* 두 섹션이 동일한 너비를 갖도록 설정합니다 */
    letter-spacing : -2px;
}

.left_section{
  padding-left: 10px;
  padding-right: 10px;
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
  background: #3ba7ff3a;
  border-radius: 10px;
  font-size: 20px;
  color: #3ba7ff;
  text-align: center;
  backface-visibility: hidden;
} 

.card .card_back {
  background: #ffd23f38;
  color: #3ba7ff;
} 

/* 가로로 뒤집히는 카드 */
.horizontal_card:hover .card_content {
  transform: rotateY(180deg);
} 

.horizontal_card .card_back {
  transform: rotateY(180deg);
} 

.horizontal_card.is-hovering .card_content {
  transform: rotateY(180deg);
}

.right-banner{
  display: flex;
  flex-direction: column; /* 자식 요소들을 세로로 배치 */
  text-align: start;
  padding-top: 20px;
}

.right-banner-header{
  font-size:1.8em;
  font-weight: bold;
  padding-top: 30px;
  padding-bottom: 20px;
}

.right-banner-subtitle{
  font-size:22px;
  font-weight: 400;
  margin-bottom: 15px;
}

.fancy_text {
    font-size: 19px; /* 텍스트 크기 */
    color: #ffffff; /* 텍스트 색상 */
    background: linear-gradient(45deg, #abd9ff, #3ba7ff); /* 배경 그라디언트 */
    padding: 10px 20px; /* 내부 여백 */
    border-radius: 8px; /* 둥근 테두리 */
    text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.4); /* 텍스트 그림자 */
    font-weight: bold; /* 글자 굵기 */
    display: inline-block; /* 올바른 패딩과 배경을 위해 */
    transition: all 0.3s ease; /* 부드러운 전환 효과 */
    width: 145px;
    height: 45px;
}

.fancy_text:hover {
    transform: scale(1.1); /* 마우스 오버 시 텍스트 확대 */
    cursor: pointer; /* 마우스 커서 모양 변경 */
    background: linear-gradient(45deg, #ffd772, #fdc12a); /* 배경 그라디언트 */
}

.taste-review-banner {
    background-image: url('@/assets/images/orange.jpg'); /* 배경 이미지 설정 */
    background-size: cover; /* 배경 이미지를 배너 크기에 맞게 조정 */
    text-align: center; /* 텍스트 중앙 정렬 */
    color: white; /* 텍스트 색상 */
    padding: 50px 20px; /* 상하, 좌우 패딩 설정 */
    width: 100%;
}

.banner-content {
    max-width: 600px; /* 최대 너비 설정 */
    margin: 0 auto; /* 가운데 정렬 */
    background: rgba(0, 0, 0, 0.5); /* 반투명 배경 추가 */
    padding: 20px; /* 내부 여백 */
    border-radius: 10px; /* 테두리 둥글게 */
}

.banner-content h1 {
    margin-bottom: 20px; /* 제목과 내용 사이의 여백 */
    font-size: 36px; /* 제목 글자 크기 */
}

.banner-content p {
    font-size: 18px; /* 본문 글자 크기 */
    margin-bottom: 30px; /* 본문과 버튼 사이의 여백 */
}

.btn-join {
    font-size: 20px; /* 버튼 글자 크기 */
    padding: 10px 20px; /* 버튼 패딩 */
    background-color: #f76c6c; /* 버튼 배경 색상 */
    color: white; /* 버튼 글자 색상 */
    border: none; /* 테두리 제거 */
    border-radius: 5px; /* 버튼 테두리 둥글게 */
    cursor: pointer; /* 마우스 오버 시 커서 변경 */
    transition: background-color 0.3s; /* 색상 변화 애니메이션 */
}

.btn-join:hover {
    background-color: #fa8072; /* 마우스 오버 시 버튼 색상 변경 */
}

/* chat */

.right-header-wrap{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.right-banner-list {
  list-style: none; 
  padding: 0;
  margin: 0; 
}

.right-banner-list li {
  padding: 10px;
  margin-bottom: 10px; /* Adds space between list items */
  font-size: 1.2em; /* Sets the font size smaller than the default */
  line-height: 1.5; /* Sets the line height for readability */
  letter-spacing : -2px;
  border-bottom: 1px solid #e1e1e1;
}

.right-banner-list li em {
  font-style: normal; /* Overrides the default italic style of <em> */
  font-weight: bold; /* Makes the text bold */
  color: #0D6EFD; /* Sets the color of the text; replace with the actual color you want */
}

</style>
