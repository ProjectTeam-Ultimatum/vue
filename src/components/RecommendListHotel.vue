<template>
  <div>
    <div>
      <button type="button" class="btn btn-outline-primary"
          :class="{ 'active': selectedTag === '친구' }"
          @click="selectTag('친구')">친구</button>
      <button type="button" class="btn btn-outline-primary"
          :class="{ 'active': selectedTag === '혼자' }"
          @click="selectTag('혼자')">혼자</button>
      <button type="button" class="btn btn-outline-primary"
          :class="{ 'active': selectedTag === '커플' }"
          @click="selectTag('커플')">커플</button>
          <button type="button" class="btn btn-outline-primary"
          :class="{ 'active': selectedTag === '가족' }"
          @click="selectTag('가족')">가족</button>
      <button type="button" class="btn btn-outline-primary"
          :class="{ 'active': selectedTag === '아이' }"
          @click="selectTag('아이')">아이</button>
      <button type="button" class="btn btn-outline-primary"
          :class="{ 'active': selectedTag === '호텔' }"
          @click="selectTag('호텔')">호텔</button>
      <button type="button" class="btn btn-outline-primary"
      :class="{ 'active': selectedTag === '펜션' }"
      @click="selectTag('펜션')">펜션</button>
      <button type="button" class="btn btn-outline-primary"
          :class="{ 'active': selectedTag === '독채' }"
          @click="selectTag('액티비티')">액티비티</button>
      <button type="button" class="btn btn-outline-primary"
      :class="{ 'active': selectedTag === '캠핑장' }"
      @click="selectTag('캠핑장')">캠핑장</button>
      <button type="button" class="btn btn-outline-primary"
      :class="{ 'active': selectedTag === '오션뷰' }"
      @click="selectTag('오션뷰')">오션뷰</button>
      <button type="button" class="btn btn-outline-primary"
      :class="{ 'active': selectedTag === '수영장' }"
      @click="selectTag('수영장')">수영장</button>
      <button type="button" class="btn btn-outline-primary"
      :class="{ 'active': selectedTag === '반려동물동반입장' }"
      @click="selectTag('반려동물동반입장')">반려동물동반입장</button>
      <button type="button" class="btn btn-outline-primary"
      :class="{ 'active': selectedTag === '혼저옵서개' }"
      @click="selectTag('혼저옵서개')">혼저옵서개</button>
          
    </div>
      <div class="card-wrap">
      <!-- <div v-for="list in recommendList" :key="list.id"> -->
        <div :key="i" v-for="(hotel, i) in filteredHotels">
        <div class="card">
          <div class="card-image">
              <img :src="hotel.recommendHotelImgPath || 'default-image-url'" alt="Review Image">

          <div class="score">{{ hotel.recommendHotelStar }}</div>
          </div>
        <div class="card-content">
          <div class="card-title-wrap">
            <div class="card-title">{{ hotel.recommendHotelTitle }}</div>
            <!-- 영업시간 -->
            <div class="card-info">
              <span class="status" :class="getStatusClass(hotel.recommendHotelClosetime)">
                  {{ getStatusMessage(hotel.recommendHotelClosetime) }}
              </span>
            </div>
          </div>
          <div class="card-option-blue">{{ hotel.recommendHotelRegion }}</div>
          <div class="card-subtitle">{{ hotel.recommendHotelIntroduction }}</div>
          <div class="card-option">{{ hotel.recommendHotelTag }}</div>
        </div>
      </div>
      </div>
      </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'RecommendListHotel',
  props:{
    region: {
      type: String,
      default: ''
    }
  },
  data(){
      return{
        recommendListHotel: [], // 복수형으로 변경하여 여러 후기 데이터를 담을 수 있도록 함
          loading: false, // 로딩 상태를 나타내는 데이터 추가
          isLiked: false, 
          selectedTag: null, // 선택된 태그를 추적하기 위한 속성
      };
  },
  //created, mounted
  methods: {
      //api axios 요청
      fetchData() {
  this.loading = true; // 데이터 요청 시작 시 로딩 상태 활성화
  this.$axios
  .get("http://localhost:8080/api/recommend/listhotel")
  .then((response) => {
      // 성공적으로 데이터를 받아온 경우
      console.log("데이터요청 성공1 : ", response.data);
      console.log("데이터요청 성공2 : ", response.data.content);
      this.recommendListHotel = response.data.content.map(item => {
          // 각 항목의 태그를 처리
          const tags = item.recommendHotelTag.split(',');
          if (tags.length > 3) {
              // 태그가 3개 이상인 경우, 처음 3개만 선택
              item.recommendHotelTag = tags.slice(0, 3).join(', ');
          }
          // recommendHotelTag의 길이가 6을 초과하는 경우, 줄임 처리
          if (item.recommendHotelTag.length > 14) {
              item.recommendHotelTag = item.recommendHotelTag.slice(0, 14) + '.';
          }
          // 음식점 소개가 24글자 이상인 경우, 줄임말 처리
          if (item.recommendHotelIntroduction.length > 30) {
              item.recommendHotelIntroduction = item.recommendHotelIntroduction.substring(0, 30) + '...';
          }
          // 음식점 이름 줄이기 
          if (item.recommendHotelTitle.length > 6) {
            item.recommendHotelTitle = item.recommendHotelTitle.substring(0, 6) + '.';
          }
          return item;
      });
      this.loading = false; // 데이터 로딩 완료
  })
  .catch((error) => {
      // 요청 중 에러 발생
      console.error("에러났어요 : " + error);
      this.loading = false; // 에러 발생 시 로딩 상태 비활성화
  });
  },
selectTag(tag) { //태그 필터링
      this.selectedTag = tag; // 선택된 태그 업데이트
      this.fetchData(); // 필요하다면 데이터를 다시 가져옵니다
  },
      //영업중, 영업마감
      isOperating(closeTime) {
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
  },
  getStatusClass(closeTime) {
    const status = this.isOperating(closeTime);
    return {
      open: status === '영업중',
      closed: status === '영업마감',
      holiday: status === '휴무일',
    };
  },
  getStatusMessage(closeTime) {
    return this.isOperating(closeTime);
  }
},
computed: {
  filteredHotels() {
    return this.recommendListHotel.filter(hotel => {
      return (!this.region || hotel.recommendHotelRegion === this.region) &&
             (!this.selectedTag || hotel.recommendHotelTag.includes(this.selectedTag));
    });
  }
},
mounted() {
      this.fetchData(); //컴포넌트가 마운트 될 때 데이터를 가져옴
  },
};
</script>

<style scoped>
@import "../assets/recommendList_style.css";
</style>