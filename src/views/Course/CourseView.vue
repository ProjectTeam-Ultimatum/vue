<template>
    <div id="app">
      <h1>제주랑이 소개하는 추천코스</h1>
    <div class="mainMap">
      <MainMap/>
    </div>
    <div class="sideBar">
      <SideBar class="side-bar"/>
    </div>
    </div>
  </template>
  
  <script>
  import MainMap from '@/components/Course/MainMap'
  import SideBar from '@/components/Course/SideBar'
  
  export default {
    name: 'App',
    components: {
      MainMap,
      SideBar
    }
  }
  </script>
  
  <style scoped>
  #app {
    display: flex; /* Flex 컨테이너로 설정 */
    flex-direction: column; /* 자식 요소들을 세로로 배치 */
    align-items: center; /* 모든 자식 요소들을 가로 축 중앙에 정렬 */
    justify-content: center; /* 모든 자식 요소들을 세로 축 중앙에 정렬 */
    margin-top: 310px; /* 상단 여백 설정 */
    width: 100%; /* 컨테이너 너비 전체 사용 */
    height: 100%;
  }
  
  .mainMap, .sideBar {
    width: 80%; /* mainMap과 sideBar의 너비를 전체의 80%로 설정 */
    margin-bottom: 20px; /* 요소들 사이의 여백 설정 */
  }
  
  .h1 {
    margin-bottom: 20px; /* 제목과 다음 요소 사이의 여백 */
  }
  </style>
  
  