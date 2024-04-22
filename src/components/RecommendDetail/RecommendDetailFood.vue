<template>
    <div id="container-wrap">
        <!-- 헤더 크기만큼 패딩 -->
        <div class="divider" ></div>
        <div id="container-wrap" class="div-cont">
            <div id="contents">
                <div id="subleft-cont">
                    <div id="div_profile">
                        <div :key="i" v-for="(food, i) in recommendListDetailFood">
                            <div class="cont-main"  >
                                <div >
                                    <img :src="food.recommendFoodImgPath || 'default-image-url'" alt="Review Image">
                                </div>
                                <div class="card-content">
                                    <div class="card-title-wrap">
                                        <div class="card-title">{{ food.recommendFoodTitle }}</div>
                                        <div class="card-subtitle">{{ food.recommendFoodIntroduction }}</div>
                                        <div>평점</div>
                                        <!-- <div>
                                            <span class="status" :class="getStatusClass(food.recommendFoodClosetime)">
                                                {{ getStatusMessage(food.recommendFoodClosetime) }}
                                            </span>
                                        </div> -->
                                    </div>
                                    <div class="card-option-blue">{{ food.recommendFoodAddress }}</div>
                                    <div class="card-option-blue">{{ food.recommendFoodPhoneNo }}</div>
                                    <div class="card-option-blue">{{ food.recommendFoodTag }}</div>
                                    <div class="card-option">{{ food.recommendFoodTag }}</div>
                                </div>
                            </div>
                            <div class="cont-sub">
                                    <h6>영업시간</h6>
                                    <ul>
                                        <li>월요일
                                            <p>{{ food.recommendFoodOpentime }}</p>
                                            <p>{{ food.recommendFoodClosetime}}</p>
                                        </li>
                                        <li>화요일
                                            <p>{{ food.recommendFoodOpentime }}</p>
                                            <p>{{ food.recommendFoodClosetime}}</p>
                                        </li>
                                        <li>수요일
                                            <p>{{ food.recommendFoodOpentime }}</p>
                                            <p>{{ food.recommendFoodClosetime}}</p>
                                        </li>
                                        <li>목요일
                                            <p>{{ food.recommendFoodOpentime }}</p>
                                            <p>{{ food.recommendFoodClosetime}}</p>
                                        </li>
                                        <li>금요일
                                            <p>{{ food.recommendFoodOpentime }}</p>
                                            <p>{{ food.recommendFoodClosetime}}</p>
                                        </li>
                                        <li>토요일
                                            <p>{{ food.recommendFoodOpentime }}</p>
                                            <p>{{ food.recommendFoodClosetime }}</p>
                                        </li>
                                        <li>일요일
                                            <p>{{ recommendFoodOpentime }}</p>
                                            <p>{{recommendFoodClosetime}}</p>
                                        </li>
                                       
                                    </ul>

                                <div>
                                    <h6>우진해장국 정보</h6>
                                    <div class="card-option">{{ food.recommendFoodAllTag }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="cont-reply">
                            <h6>방문자 평가</h6>
                            <button>리뷰 쓰기</button>
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
export default {
  name: 'RecommendListDetailFood',
  props: {
    recommendFoodId: {  // Prop 'recommendFoodId'
      type: String,
      required: true
    }
  },
  data() {
    return {
      recommendListDetailFood: [],
    };
  },
  methods: {
    async fetchFoodDetails() {
        if (!this.recommendFoodId) {
            console.error("recommendFoodId is undefined!");
            return;
        }
        try {
            let response = await this.$axios.get(`/api/recommend/listfood/${this.recommendFoodId}`);
            console.log("응답 recommendFoodId:", response.data.recommendFoodId);  // 데이터 로그 출력
            this.recommendListDetailFood = [response.data];  // 객체를 배열에 담아서 저장
            console.log("this.recommendListDetailFood",  this.recommendListDetailFood);
        } catch (error) {
            console.error('Error fetching food details:', error);
        }
    },
    
  },
  mounted() {
    this.fetchFoodDetails();
  }
}
</script>

<style scoped>
.divider {
  padding-top: 70px;
}
@import "@/assets/recommendDetail_style.css";
</style>