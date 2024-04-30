<template>
    <ul class="recommend-card-list">
      <li class="recommend-card" v-for="item in recommendItems" :key="item.id">
        <span class="best">BEST</span>
        <div class="img_scale">
          <div class="img_wrap" :style="{ backgroundImage: 'url(' + item.imageUrl + ')' }"></div>
        </div>
        <div class="recommend-info">
          <em>{{ item.duration }}</em>
          <div class="recommend-info-contents">
            <strong>{{ item.title }}</strong>
            <span class="recommend-info-txt">{{ item.content }}</span>
            <span class="recommend-info-location"><font-awesome-icon :icon="['fas', 'location-dot']" style="color:#3ba7ff;" />{{ item.location }}</span>
          </div>
        </div>
      </li>
    </ul>
  </template>
  
  <script>
  export default {
    data() {
      return {
        recommendItems: [
          {
            id: 1,
            imageUrl:  require('@/assets/images/img01.jpg'),
            duration: '구경할 곳',
            title: '여행이 있는 주말',
            content: '매월 마지막 주말은 일상에서 벗어나 여행을 떠나보세요',
            location: '서귀포시'
          },
          {
            id: 2,
            imageUrl:  require('@/assets/images/img02.jpg'),
            duration: '가볼만한 곳',
            title: '생활 관광',
            content: '현지인다움과 지역다움을 체험할 수 있는 지역관광법을 소개합니다',
            location: '성산읍'
          },
          {
            id: 3,
            imageUrl:  require('@/assets/images/img04.jpg'),
            duration: '쉬어갈 곳',
            title: '반려동물 동반 여행',
            content: '반려 동물과 함께 할 수 있는 여행지를 소개합니다',
            location: '제주시'
          },
        ]
      };
    },
  };
  </script>
  
  <style scoped>
  @import "@/assets/css/mainpage_style.css";
  </style>
  