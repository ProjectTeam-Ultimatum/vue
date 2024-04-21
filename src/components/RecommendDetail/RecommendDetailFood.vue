<template>
    <div id="container-wrap">
        <div id="container-wrap" class="div-cont">
            <div id="contents">
                <div id="subleft-cont">
                    <div id="div_profile">
                        <div :key="i" v-for="(food, i) in recommendListDetailFood">
                            <div class="cont-main"  >
                                <div >
                                    <img :src="food.recommendFoodImgPath || 'default-image-url'" alt="Review Image">
                                </div>
                                <div class="detail-content">
                                    <div class="detail-title-wrap">
                                        <h4>{{ food.recommendFoodTitle }}</h4>
                                        <div class="detail-subtitle">{{ food.recommendFoodIntroduction }}</div>
                                        <div>평점</div>
                                        <!-- 영엉상태 -->
                                        <div>
                                            <span class="status" :class="getStatusClass(food.recommendFoodClosetime)">
                                                {{ getStatusMessage(food.recommendFoodClosetime) }}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="detail-option">{{ food.recommendFoodAddress }}</div>
                                    <div class="detail-option">{{ food.recommendFoodPhoneNo }}</div>
                                    <div class="detail-option">{{ food.recommendFoodTag }}</div>
                                </div>
                            </div>
                            <div class="cont-sub">
                                <div class="cont-time">
                                    <h6>영업시간</h6>
                                    <ul>
                                        <li>월요일
                                            <span>{{ food.recommendFoodOpentime }}</span>
                                            <span>{{ food.recommendFoodClosetime}}</span>
                                        </li>
                                        <li>화요일
                                            <span>{{ food.recommendFoodOpentime }}</span>
                                            <span>{{ food.recommendFoodClosetime}}</span>
                                        </li>
                                        <li>수요일
                                            <span>{{ food.recommendFoodOpentime }}</span>
                                            <span>{{ food.recommendFoodClosetime}}</span>
                                        </li>
                                        <li>목요일
                                            <span>{{ food.recommendFoodOpentime }}</span>
                                            <span>{{ food.recommendFoodClosetime}}</span>
                                        </li>
                                        <li>금요일
                                            <span>{{ food.recommendFoodOpentime }}</span>
                                            <span>{{ food.recommendFoodClosetime}}</span>
                                        </li>
                                        <li>토요일
                                            <span>{{ food.recommendFoodOpentime }}</span>
                                            <span>{{ food.recommendFoodClosetime }}</span>
                                        </li>
                                        <li>일요일
                                            <span>{{ food.recommendFoodOpentime }}</span>
                                            <span>{{ food.recommendFoodClosetime }}</span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h6>{{ food.recommendFoodTitle }} 정보</h6>
                                    <div>{{ food.recommendFoodAllTag }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="cont-reply">
                            <h6>방문자 평가</h6>
                             <!-- 버튼 클릭 이벤트에 food.id 전달 -->
                             <button @click="createModal(recommendFoodId)" style="font-size: 12px; cursor: pointer">평점쓰기</button>
                             <!-- food.recommendFoodId를 activeFoodId로 설정하여 전달 -->
                            <CreateModal
                                v-if="replyModalCreate"
                                :replyModalCreate="replyModalCreate"
                                :recommendFoodId="activeFoodId" 
                                @close="closeModal" />
                            </div>
                    </div>
                </div>
                <div id="subright-cont">
                    <div class="mini-map">
                        <div>
                            <img alt="map" src="@/assets/map.png" style="width:160px">
                        </div>
                    </div>
                    <div class="recommend-list">
                        <h6>주변 추천 맛집</h6>
                        <ul>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import CreateModal from './CreateModal.vue';

export default {
  name: 'RecommendListDetailFood',
  data() {
    return {
      recommendListDetailFood: [],
      replyModalCreate: false,
      activeFoodId: null  // 활성화된 음식 ID 저장, 모달 전달
    };
  },
  components: {
    CreateModal
  },
  props: {
    recommendFoodId: {  // 외부에서 전달받는 ID prop
      type: Number,
      required: true
    }
  },
  methods: {
    async fetchFoodDetails() {
        if (!this.recommendFoodId) {
            console.error("recommendFoodId is undefined!");
            return;
        }
        try {
            let response = await this.$axios.get(`/api/recommend/listfood/${this.recommendFoodId}`);
            if (response.data) {
                const data = response.data;
                data.recommendFoodTag = data.recommendFoodTag.split(',').slice(0, 8).join(', ');
                data.recommendFoodAllTag = data.recommendFoodAllTag.split(',').slice(0, 16).join(', ');
                this.recommendListDetailFood = [data];
                this.replyModalCreate = false;
            }

            console.log("Loaded food details:", this.recommendListDetailFood);
        } catch (error) {
            console.error('Error fetching food details:', error);
        }
    }, //fetchFoodDetails
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
    createModal(recommendFoodId) {
      // 모달을 생성하는 로직
      console.log("createModal 생성");
      console.log("모달 생성, ID:", recommendFoodId); // 로그 추가하여 ID 확인
      // activeFoodId 설정으로 모달에 ID 전달
      this.activeFoodId = recommendFoodId; // 모달 생성 ID
      this.replyModalCreate = true;
      console.log("createModal 생성:", this.replyModalCreate);
    }, //createModal
    closeModal() {
      // 모달을 닫는 로직
      console.log("createModal 닫기");
      this.replyModalCreate = false;
      this.activeFoodId = null;  // 모달 닫을 때 ID 초기화
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
    this.fetchFoodDetails();
  }
}
</script>

<style scoped>
@import "@/assets/recommendDetail_style.css";
</style>