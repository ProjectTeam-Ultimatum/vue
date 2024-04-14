<template>
    <div>
        <div class="card-wrap">
        <!-- <div v-for="list in recommendList" :key="list.id"> -->
        <div :key="i" v-for="( place, i) in recommendListPlace">
          <div class="card">
          <div class="card-image">
            <img :src="
                place.recommendImageUrl.length > 0
                    ? place.recommendImageUrl[0].recommendImageUrl
                    : 'default-image-url'
                "
                alt="Review Image"
            />
              <div class="score">{{ place.recommendPlaceStar }}</div>
          </div>
          <div class="card-content">
              <div class="card-title">{{ place.recommendPlaceTitle }}</div>
              <div class="card-description">{{ place.recommendPlaceContent }}</div>
              <div class="stat" @click="toggleLike">
                <font-awesome-icon
                  class="like-icon"
                  :icon="isLiked ? 'heart' : ['far', 'heart']"
                />
                <span class="stat-label">좋아요</span>
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
    data(){
        return{
          recommendListPlace: [], // 복수형으로 변경하여 여러 후기 데이터를 담을 수 있도록 함
            loading: false, // 로딩 상태를 나타내는 데이터 추가
            isLiked: false, 
        };
    },
    //created, mounted
    methods: {
          toggleLike() {
          this.isLiked = !this.isLiked;
        },
        //api axios 요청
        fetchData() {
        this.loading = true; // 데이터 요청 시작 시 로딩 상태 활성화
        this.$axios
            .get("http://localhost:8080/api/recommend/place")
            .then((response) => {
            //성공적으로 데이터를 받아온 경우
            console.log("데이터요청 성공 : " + response.data);
            console.log("데이터요청 성공 : " + response.data.content);
            this.recommendListPlace = response.data.content;
            })
            .catch((error) => {
            //요청중 에러
            console.error("에러났어요 : " + error);
            });
        }
  },
    mounted() {
        this.fetchData(); //컴포넌트가 마운트 될 때 데이터를 가져옴
    }
  };
  </script>
  
  <style scoped>
  @import "../assets/recommendList_style.css";
  </style>