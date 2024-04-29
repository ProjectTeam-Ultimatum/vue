<template>
    <div class="travel-cards-container">
      <div
        class="travel-card"
        v-for="card in cards"
        :key="card.id"
        :style="{ backgroundImage: 'url(' + card.imageUrl + ')' }"
        @click="goTo(card.link)"
      >
        <div class="card-content">
          <h3 v-html="card.title"></h3>
          <p>{{ card.description }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        cards: [
          {
            id: 1,
            title: '제목 1',
            description: '설명 1',
            imageUrl: require('@/assets/images/mybn01.jpg'),
            link: '#'
          },
          {
            id: 2,
            title: '제목 2',
            description: '설명 2',
            imageUrl: require('@/assets/images/mybn02.jpg'),
            link: '#'
          },
          {
            id: 3,
            title: '제목 3',
            description: '설명 3',
            imageUrl: require('@/assets/images/mybn03.jpg'),
            link: '#'
          },
          {
            id: 4,
            title: '제목 4',
            description: '설명 4',
            imageUrl: require('@/assets/images/mybn04.jpg'),
            link: '#'
          }
          // 다른 카드 객체들을 여기에 추가할 수 있습니다.
        ]
      };
    },
    methods: {
      goTo(url) {
        window.location.href = url;
      }
    }
  };
  </script>
  
  <style scoped>
  .travel-cards-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    width: 305px;
    height: 375px;
  }
  
  .travel-card {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    width: 328px;
    cursor: pointer;
    color: white;
  }
  
  .card-content {
    background: rgba(0, 0, 0, 0.5); /* 반투명 배경 */
    padding: 20px;
  }
  
  h3 {
    margin: 0;
  }
  </style>