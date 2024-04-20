<template>
    <div id="container-wrap">
        <div id="container-wrap" class="div-cont">
            <div id="contents">
                <div id="subleft-cont">
                    <div id="div_profile">
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
                                <div>
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
                <div id="subright-cont">
                    <div class="mini-map">
                        <div>
                            <img alt="map" src="@/assets/map.png" style="width:160px">
                        </div>
                    </div>
                    <div class="recommend-list"></div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    name: 'RecommendListDetailFood',
    props: {
        foodId: {
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
        fetchFoodDetails() {
      if (!this.recommendFoodId) {
        console.error("Food ID is undefined!");
        return;
      }
      this.$axios.get(`api/recommend/listfood/${this.recommendFoodId}`)
        .then(response => {
          this.recommendListDetailFood = response.data;
        })
        .catch(error => {
          console.error('Error fetching food details:', error);
        });
    }
    },
    mounted() {
        this.fetchFoodDetails();
    }
}
</script>