// eslint-disable-next-line
/* eslint-disable */

<template>
  <div>
      <div class="recomemnd_info">
        <div class="info_contents">
          <div>
            <h4 style="font-weight: 900;">제주도 음식점 리스트</h4>
            <span style="font-weight: 900;">음식점 추천 태그</span>
          </div>
          <div class="tag-wrap">
              <button type="button" class="btn btn-outline-primary"
                  :class="{ 'active': selectedTag === '' }"
                  @click="selectTag('')">전체</button>
              <button type="button" class="btn btn-outline-primary"
                  :class="{ 'active': selectedTag === '한식' }"
                  @click="selectTag('한식')">한식</button>
              <button type="button" class="btn btn-outline-primary"
                  :class="{ 'active': selectedTag === '중식' }"
                  @click="selectTag('중식')">중식</button>
              <button type="button" class="btn btn-outline-primary"
                  :class="{ 'active': selectedTag === '일식' }"
                  @click="selectTag('일식')">일식</button>
              <button type="button" class="btn btn-outline-primary"
                  :class="{ 'active': selectedTag === '양식' }"
                  @click="selectTag('양식')">양식</button>
              <button type="button" class="btn btn-outline-primary"
                  :class="{ 'active': selectedTag === '분식' }"
                  @click="selectTag('분식')">분식</button>
              <button type="button" class="btn btn-outline-primary"
                  :class="{ 'active': selectedTag === '카페' }"
                  @click="selectTag('카페')">카페</button>
              <button type="button" class="btn btn-outline-primary"
              :class="{ 'active': selectedTag === '디저트' }"
              @click="selectTag('디저트')">디저트</button>
              <button type="button" class="btn btn-outline-primary"
              :class="{ 'active': selectedTag === '혼저옵서개' }"
              @click="selectTag('혼저옵서개')">혼저옵서개</button>
              <button type="button" class="btn btn-outline-primary"
              :class="{ 'active': selectedTag === '반려동물동반입장' }"
              @click="selectTag('반려동물동반입장')">반려동물동반입장</button>    
          </div>
        </div>
        <div>
          <img alt="map" src="../assets/map.png" style="width:160px">
        </div>
      </div>
      <div class="content_list">
        <div style="width: 820px; margin: 16px auto; text-align:left;">
            <span class="headline2" >추천 맛집</span>
            <span style="margin-left: 5px;">제주랑 고객님들이 엄선한 맛집 입니다</span>
        </div>
        <div class="card-wrap">
        <!-- <div v-for="list in recommendList" :key="list.id"> -->
          <div :key="i" v-for="(food, i) in filteredFoods">
            <div class="card">
              <div class="card-image">
                <img :src="food.recommendFoodImgPath || 'default-image-url'" alt="Review Image">
                <!-- <div class="score">{{ food.recommendFoodStar }}</div> -->
              </div>
              <div class="card-content">
                <div class="card-title-wrap">
                  <div class="card-title">{{ food.recommendFoodTitle }}</div>
                  <!-- 영업시간 -->
                  <div class="card-info">
                    <span class="status" :class="getStatusClass(food.recommendFoodClosetime)">
                        {{ getStatusMessage(food.recommendFoodClosetime) }}
                    </span>
                  </div>
                </div>
                <div class="card-option-blue">{{ food.recommendFoodRegion }}</div>
                <div class="card-subtitle">{{ food.recommendFoodIntroduction }}</div>
                <div class="card-option">{{ food.recommendFoodTag }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PaginationComponent
          :total-pages="totalPages"
          :current-page="page"
          :current-tag="selectedTag"
          @changePage="gotoPage"
        />
  </div>
</template>

<script>
/* eslint-disable */
import PaginationComponent from './PaginationComponent.vue';

export default {
  name: 'RecommendListFood',
  components: {
    PaginationComponent
  },
  props:{
    region: {
      type: String,
      default: ''
    }
  },
  data(){
    return {
      loading: false,
      selectedRegion: '',
      recommendListFood: [],
      page: 1,
      totalPages: 0,
      selectedTag: '',  // 기본값 all
    };
  },
  computed: {
  filteredFoods() {
    // '전체' 태그가 선택되면 모든 데이터를 반환
    if (this.selectedTag === '') {
      return this.recommendListFood;
    }
    // 그렇지 않으면 선택된 태그에 해당하는 데이터만 필터링하여 반환
      return this.recommendListFood.filter(food => {
      return (!this.region || food.recommendFoodRegion === this.region) &&
               (!this.selectedTag || this.selectedTag === '' || food.recommendFoodTag.includes(this.selectedTag));
      });
    }
  },
  //created, mounted
  methods: {
    gotoPage(pageNumber) {
      this.page = pageNumber;
      this.selectedTag = tag; // 현재 페이지와 태그 업데이트
      this.fetchData();
    },
      //api axios 요청
    fetchData() {
      this.loading = true; // 데이터 요청 시작 시 로딩 상태 활성화
      const params = {
      page: this.page - 1,  // Ensure page is zero-indexed if backend expects it
      size: 12,
      sort: "recommendFoodId,desc",
      region: this.selectedRegion.trim(),
      tag: this.selectedTag // 태그 정보도 파라미터로 추가
    };

  // Axios 요청에 params 적용
  this.$axios.get("http://localhost:8080/api/recommend/listfood", { params })
  .then((response) => {
      this.recommendListFood = response.data.content;
      this.totalPages = response.data.totalPages;  // Set total pages from response
      this.selectedTag = response.data.selectTag;
      this.loading = false;
      // 성공적으로 데이터를 받아온 경우
      console.log("데이터요청 성공1 : ", response.data);
      console.log("데이터요청 성공2 : ", response.data.content);
      console.log("데이터요청 성공3 : {} ", response.data.selectTag);
      this.recommendListFood = response.data.content.map(item => {
          // 각 항목의 태그를 처리
          const tags = item.recommendFoodTag.split(',');
          if (tags.length > 3) {
              // 태그가 3개 이상인 경우, 처음 3개만 선택
              item.recommendFoodTag = tags.slice(0, 3).join(', ');
          }
          // recommendFoodTag의 길이가 6을 초과하는 경우, 줄임 처리
          if (item.recommendFoodTag.length > 14) {
              item.recommendFoodTag = item.recommendFoodTag.slice(0, 14) + '.';
          }
          // 음식점 소개가 24글자 이상인 경우, 줄임말 처리
          if (item.recommendFoodIntroduction.length > 30) {
              item.recommendFoodIntroduction = item.recommendFoodIntroduction.substring(0, 30) + '...';
          }
          // 음식점 이름 줄이기 
          if (item.recommendFoodTitle.length > 6) {
            item.recommendFoodTitle = item.recommendFoodTitle.substring(0, 6) + '.';
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
      this.page = 1;  // 태그를 변경할 때 페이지를 1로 리셋
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

mounted() {
      this.fetchData(); //컴포넌트가 마운트 될 때 데이터를 가져옴
  },
};
</script>

<style scoped>
@import "../assets/recommendList_style.css";
</style>
