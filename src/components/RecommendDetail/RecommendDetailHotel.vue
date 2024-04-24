<template>
    <div id="container-wrap">
        <div id="container-wrap" class="div-cont">
            <div id="contents">
              <div :key="i" v-for="(hotel, i) in recommendListDetailHotel">
                <div id="subleft-cont">
                    <div id="div_profile">
                            <div class="cont-main"  >
                                <div >
                                    <img :src="hotel.recommendHotelImgPath || 'default-image-url'" alt="Review Image">
                                </div>
                                <div class="detail-content">
                                    <div class="detail-title-wrap">
                                        <h4>{{ hotel.recommendHotelTitle }}</h4>
                                        <div class="detail-subtitle">{{ hotel.recommendHotelIntroduction }}</div>
                                        <div>평점</div>
                                        <!-- 영업상태 -->
                                        <div>
                                            <span class="status" :class="getStatusClass(hotel.recommendHotelClosetime)">
                                                {{ getStatusMessage(hotel.recommendHotelClosetime) }}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="detail-option">{{ hotel.recommendHotelAddress }}</div>
                                    <div class="detail-option">{{ hotel.recommendHotelPhoneNo }}</div>
                                    <div class="detail-option">{{ hotel.recommendHotelTag }}</div>
                                </div>
                            </div>
                            <div class="cont-sub">
                                <div class="cont-time">
                                    <h6>영업시간</h6>
                                    <ul>
                                        <li v-for="day in ['월', '화', '수', '목', '금', '토', '일']" :key="day">
                                        {{ day }}요일: <span>{{ hotel.recommendHotelOpentime }}</span> - <span>{{ hotel.recommendHotelClosetime }}</span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h6>{{ hotel.recommendHotelTitle }} 정보</h6>
                                    <div>{{ hotel.recommendHotelAllTag }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="cont-reply">
                            <h6>방문자 평가</h6>
                             <!-- 버튼 클릭 이벤트에 Hotel.id 전달 -->
                             <button @click="createModal(recommendHotelId)" style="font-size: 12px; cursor: pointer">평점쓰기</button>
                             <!-- Hotel.recommendHotelId를 activeHotelId로 설정하여 전달 -->
                            <CreateModalHotel
                                v-if="replyModalCreate"
                                :replyModalCreate="replyModalCreate"
                                :recommendHotelId="activeHotelId" 
                                :type="currentType"
                                @close="closeModal" />
                            </div>
                    </div>
                <div id="subright-cont">
                    <div class="mini-map">
                        <div>
                            <img alt="map" src="@/assets/map.png" style="width:160px">
                        </div>
                    </div>
                    <div class="recommend-list">
                        <h6>{{ hotel.recommendHotelRegion }} 추전 맛집</h6>
                        <div>
                        <ul>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                        </div>
                    </div>
                </div>
              </div>
            </div>
  
        </div>
    </div>
  </template>
  
  <script>
  import CreateModalHotel from './CreateModalHotel.vue';
  
  export default {
  name: 'RecommendListDetailHotel',
  data() {
    return {
      recommendListDetailHotel: [],
      replyModalCreate: false,
      activeHotelId: null,  // 활성화된 음식 ID 저장, 모달 전달
      currentType: 'hotel',
      //isLoading: true,  // 로딩 상태 추가
    };
  },
  components: {
    CreateModalHotel
  },
  props: {
    recommendHotelId: {  // 외부에서 전달받는 ID prop
      type: Number,
      required: true
    }
  },
  methods: {
    async fetchHotelDetails() {
      //this.isLoading = true;  // 데이터 로딩 시작
        if (!this.recommendHotelId) {
            console.error("recommendHotelId is undefined!");
            //this.isLoading = false;
            return;
        }
        try {
            let response = await this.$axios.get(`/api/recommend/listhotel/${this.recommendHotelId}`);
            if (response.data) {
                const data = response.data;
                data.recommendHotelTag = data.recommendHotelTag ? data.recommendHotelTag.split(',').slice(0, 8).join(', ') : '';
                data.recommendHotelAllTag = data.recommendHotelAllTag ? data.recommendHotelAllTag.split(',').slice(0, 16).join(', ') : '';
                this.recommendListDetailHotel = [data];
                this.replyModalCreate = false;
            }
            console.log("로딩 된 상세페이지 정보:", this.recommendListDetailHotel);
        } catch (error) {
            console.error('Error fetching Hotel details:', error);
        }
    }, //fetchHotelDetails
    isOperating(closeTime) {  //영업중, 영업마감
      if (!closeTime) return '휴무일'; // 휴무일 처리
      
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const [closeHours, closeMinutes] = closeTime.split(':').map(Number);
  
      if (currentHours < closeHours || (currentHours === closeHours && currentMinutes < closeMinutes)) {
        return '영업중';
      } else {
        return '영업마감';
      }
    }, //isOperating
    createModal(recommendHotelId) {
      // 모달을 생성하는 로직
      console.log("createModalHotel 생성");
      //console.log("모달 생성, ID:", recommendHotelId); // 로그 추가하여 ID 확인
      // activeHotelId 설정으로 모달에 ID 전달
      this.activeHotelId = recommendHotelId; // 모달 생성 ID
      console.log("모달에 전달될 ID:", this.activeHotelId);  // 모달에 전달될 ID가 올바르게 설정되었는지 확인
      this.replyModalCreate = true;
      console.log("createModalHotel 생성:", this.replyModalCreate);
    }, //createModal
    closeModal() {
      // 모달을 닫는 로직
      console.log("createModal 닫기");
      this.replyModalCreate = false;
      this.activeHotelId = null;  // 모달 닫을 때 ID 초기화
    },
    getStatusClass(closeTime) {
      const status = this.isOperating(closeTime);
      return {
        'card-opentime': status === '영업중',  // '영업중'에 해당하는 CSS 클래스
        'card-closetime': status === '영업마감' // '영업마감'에 해당하는 CSS 클래스
      };
    }, //getStatusClass
    getStatusMessage(closeTime) {
      return this.isOperating(closeTime);
    }, //getStatusMessage
    },
    mounted() {
      this.fetchHotelDetails();
    }
  }
  </script>
  
  <style scoped>
  @import "@/assets/recommendDetail_style.css";
  </style>