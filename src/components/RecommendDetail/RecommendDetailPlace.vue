<template>
  <div id="container-wrap">
      <div id="container-wrap" class="div-cont">
          <div id="contents">
            <div :key="i" v-for="(place, i) in recommendListDetailPlace">
              <div id="subleft-cont">
                  <div id="div_profile">
                          <div class="cont-main"  >
                              <div >
                                  <img :src="place.recommendPlaceImgPath || 'default-image-url'" alt="Review Image">
                              </div>
                              <div class="detail-content">
                                  <div class="detail-title-wrap">
                                      <h4>{{ place.recommendPlaceTitle }}</h4>
                                      <div class="detail-subtitle">{{ place.recommendPlaceIntroduction }}</div>
                                      <div>평점</div>
                                      <!-- 영업상태 -->
                                      <div>
                                          <span class="status" :class="getStatusClass(place.recommendPlaceClosetime)">
                                              {{ getStatusMessage(place.recommendPlaceClosetime) }}
                                          </span>
                                      </div>
                                  </div>
                                  <div class="detail-option">{{ place.recommendPlaceAddress }}</div>
                                  <div class="detail-option">{{ place.recommendPlacePhoneNo }}</div>
                                  <div class="detail-option">{{ place.recommendPlaceTag }}</div>
                              </div>
                          </div>
                          <div class="cont-sub">
                              <div class="cont-time">
                                  <h6>영업시간</h6>
                                  <ul>
                                      <li v-for="day in ['월', '화', '수', '목', '금', '토', '일']" :key="day">
                                      {{ day }}요일: <span>{{ place.recommendPlaceOpentime }}</span> - <span>{{ place.recommendPlaceClosetime }}</span>
                                      </li>
                                  </ul>
                              </div>
                              <div>
                                  <h6>{{ place.recommendPlaceTitle }} 정보</h6>
                                  <div>{{ place.recommendPlaceAllTag }}</div>
                              </div>
                          </div>
                      </div>
                      <div class="cont-reply">
                          <h6>방문자 평가</h6>
                           <!-- 버튼 클릭 이벤트에 Place.id 전달 -->
                           <button @click="createModal(recommendPlaceId)" style="font-size: 12px; cursor: pointer">평점쓰기</button>
                           <!-- Place.recommendPlaceId를 activePlaceId로 설정하여 전달 -->
                          <CreateModalPlace
                              v-if="replyModalCreate"
                              :replyModalCreate="replyModalCreate"
                              :recommendPlaceId="activePlaceId" 
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
                  <!-- recommendListplaceRegion 표시 -->
                  <div class="recommend-list">
                      <h6 style="text-align: left;">
                        <span>{{ place.recommendPlaceRegion }}</span>
                        주변
                        <span>{{ place.recommendPlaceCategory }}</span>
                      </h6>
                      <div>
                      <ul>
                        <li v-for="(place, index) in recommendListPlaceRegion" :key="index" class="recommend-item">
                          <div class="recommend-info">
                            <div class="recommend-name-region">
                              <span class="recommend-name">{{ place.recommendPlaceTitle }}</span>
                              <span class="recommend-region"><span></span>{{ place.recommendPlaceRegion }}</span>
                            </div>
                            <div class="recommend-details">
                              <span class="recommend-tag">{{ place.recommendPlaceTag }}</span>
                              <img class="recommend-photo" :src="place.recommendPlaceImgPath || 'default-image-url'" alt="관광지 사진">
                            </div>
                          </div>
                        </li>
                      </ul>
                      </div>
                  </div> <!-- recommend-list -->
              </div>
            </div>
          </div>

      </div>
  </div>
</template>

<script>
import CreateModalPlace from './CreateModalPlace.vue';

export default {
name: 'RecommendListDetailPlace',
data() {
  return {
    recommendListDetailPlace: [],
    replyModalCreate: false,
    activePlaceId: null,  // 활성화된 음식 ID 저장, 모달 전달
    currentType: 'place',
    placeRegion: '', //주변 지역 정보
    recommendListPlaceRegion: []
  };
},
components: {
  CreateModalPlace
},
props: {
  recommendPlaceId: {  // 외부에서 전달받는 ID prop
    type: Number,
    required: true
  }
},
methods: {
  async fetchPlaceDetails() {
      if (!this.recommendPlaceId) {
          console.error("recommendPlaceId가 정의되지 않았습니다!");
          return;
      }
      try {
          let response = await this.$axios.get(`/api/recommend/listplace/${this.recommendPlaceId}`);
          if (response.data) {
              const data = response.data;
              // 데이터 가공
              data.recommendPlaceTag = data.recommendPlaceTag ? data.recommendPlaceTag.split(',').slice(0, 8).join(', ') : '';
              data.recommendPlaceAllTag = data.recommendPlaceAllTag ? data.recommendPlaceAllTag.split(',').slice(0, 16).join(', ') : '';
              this.recommendListDetailPlace = [data];
              this.placeRegion = data.recommendPlaceRegion;
              this.replyModalCreate = false;
              // fetchRegionData 호출
              this.fetchRegionData();
          }
          console.log("로딩 된 지역 정보:", this.placeRegion);
          console.log("로딩 된 상세페이지 정보:", this.recommendListDetailPlace);
      } catch (error) {
          console.error('관광지 세부 정보를 가져오는 중 에러 발생:', error);
      }
  }, //fetchPlaceDetails
  async fetchRegionData() {
  try {
    const params = {
      page: 0,
      size: 3, // 최대 3개의 항목만 가져옴
      sort: "recommendPlaceRegion,desc",
      region: this.placeRegion
    };
    const response = await this.$axios.get("/api/recommend/listplace", { params });
    if (response.data.content.length === 0) {
      console.error('No data returned for the page:', this.currentPage);
      this.recommendListPlaceRegion = [];
      this.totalPages = 0;
    } else {
      // 최대 3개의 항목만 추출하여 저장
      this.recommendListPlaceRegion = response.data.content.slice(0, 3).map(item => {
        // recommendPlaceTag를 최대 3개까지만 추출
        const tags = item.recommendPlaceTag ? item.recommendPlaceTag.split(',').slice(0, 2).join(', ') : '';
        return { ...item, recommendPlaceTag: tags };
      });
      console.log("로딩된 지역 정보:", this.recommendListPlaceRegion);
    }
  } catch (error) {
    console.error("에러 발생:", error);
  }
}, //fetchRegionData

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
  createModal(recommendPlaceId) {
    // 모달을 생성하는 로직
    console.log("createModalPlace 생성");
    //console.log("모달 생성, ID:", recommendPlaceId); // 로그 추가하여 ID 확인
    // activePlaceId 설정으로 모달에 ID 전달
    this.activePlaceId = recommendPlaceId; // 모달 생성 ID
    console.log("모달에 전달될 ID:", this.activePlaceId);  // 모달에 전달될 ID가 올바르게 설정되었는지 확인
    this.replyModalCreate = true;
    console.log("createModalPlace 생성:", this.replyModalCreate);
  }, //createModal
  closeModal() {
    // 모달을 닫는 로직
    console.log("createModal 닫기");
    this.replyModalCreate = false;
    this.activePlaceId = null;  // 모달 닫을 때 ID 초기화
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
    this.fetchPlaceDetails();
  },
  compute: { //기존 데이터를 바탕으로 새로운 데이터 값을 생성할 때
    //this.placeRegion 로딩 된 지역정보에 맞춰서 api요청
  }
}
</script>

<style scoped>
@import "@/assets/recommendDetail_style.css";
</style>