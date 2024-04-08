<template>
    <div>
        <!-- <div v-for="list in recommendList" :key="list.id"> -->
        <div :key="i" v-for="(list, i) in recommendList">
          <div class="card">
          <div class="card-image">
              <img src="your-image-path.jpg" alt="Restaurant Image">
              <div class="score">{{ list.recommendFoodStar }}</div>
          </div>
          <div class="card-content">
              <div class="card-title">{{ list.recommendFoodTitle }}</div>
              <div class="card-info">
                  <span class="valet-service">{{ list.recommendFoodOpentime }}</span>
              </div>
              <div class="card-description">{{ list.recommendFoodContent }}</div>
              <div class="card-stats">
                  <div class="stat">
                      <span class="stat-count">211</span>
                      <span class="stat-label">Likes</span>
                  </div>
              </div>
          </div>
        </div>
        </div>
    </div>
</template>
  
  <script>
  /* eslint-disable */
  export default {
    name: 'RecommendListCard',
  //   props: {
  //   recommendList: {
  //     type: Array,
  //     default: () => []
  //   }
  // },
    data(){
        return{
          recommendList: [], // 복수형으로 변경하여 여러 후기 데이터를 담을 수 있도록 함
            //page: 0,
            //totalPages: 10,
            //loading: false // 로딩 상태를 나타내는 데이터 추가
        };
    },
    //created, mounted같은 생명주기 훅을 사용하여 후기 데이터를 가져오기
    methods: {
        fetchData() {
        //this.loading = true; // 데이터 요청 시작 시 로딩 상태 활성화
        // const params = {
        //     page: this.page,
        //     size: 2,
        //     sort: "recommendFoodId,desc", //정렬방식
        // };
        this.$axios
            .get("http://localhost:8080/api/recommend/list")
            .then((response) => {
            //성공적으로 데이터를 받아온 경우
            console.log("데이터요청 성공 : " + response.data);
            console.log("데이터요청 성공 : " + response.data.content);
            this.recommendList = response.data.content;
            //this.totalPages = response.data.totalPages;
            })
            .catch((error) => {
            //요청중 에러
            console.error("에러났어요 : " + error);
            });
        },
        // truncate(str, num) {
        // if (str.length > num) {
        //     return str.slice(0, num) + "...";
        // } else {
        //     return str;
        // }
        // },
        // changePage(page) {
        // this.page = page;
        // this.fetchData();
        // },
    },
    mounted() {
        this.fetchData(); //컴포넌트가 마운트 될 때 데이터를 가져옴
    }
  };
  </script>

<style scoped>
@import "../assets/styles.css";
</style>