<template>
  <div class="container">
    <VueResizable
        class="left-area"
        :max-width="Infinity"
        :active="['r']"
        v-if="isVisibleSideBar">
        <!-- <div class="bottom-btn-area">
          <Button class="save-btn" @click="saveReview">
            저장
          </Button>
        </div> -->

        <!-- 장소 카드 -->
      <div class="card-container">
        <div class="card-header">
          <h2><input placeholder="장소 이름" v-model="title"  :readonly="true"/></h2>
          <p><Input placeholder="주소" :value="addressCopy" @input="updateAddress" :readonly="true" /> <span class="category">카테고리: {{ category }}</span></p>
        </div>

        <div class="card-body">
          <div class="image-gallery">
            <div class="image-area">
              <div class="iw-file-input">
                <img :src="image" alt="Uploaded Image" v-if="image"/>
              </div>
            </div>
          </div>
          <div class="tags">
            <span class="tag-label">태그: {{ mapTag }}</span>
            <span class="budget-label">가격: {{ budget }}</span>
          </div>
      
          <div class="rate-area">
            <FormRating :grade="grade" :readOnly="true"/>
          </div>
        </div>


        <div class="card-footer">
          <span ref="span" class="review-span" placeholder="내용">{{ review }}</span>
        </div>
      </div>

    </VueResizable>

    <div class="right-area">
      <div class="icon-group">
        <div class="icon-circle">
          <img src="@/assets/images/location.png" alt="Calendar Icon"/>
        </div>
        <div class="icon-text">
          <p>일정</p>
          <p>담기예약</p>
        </div>
      </div>

      <div class="icon-group">
        <div class="icon-circle">
          <img src="@/assets/images/location.png" alt="People Icon"/>
        </div>
        <div class="icon-text">
          <p>일정</p>
          <p>담기예약</p>
        </div>
      </div>

      <div>
        <p>안녕</p>
      </div>
    </div>


  </div>

</template>
<script>
import VueResizable from 'vue-resizable';
import { EventBus } from '@/EventBus'; // EventBus를 가져옵니다.
import FormRating from './FormRating';
export default {
name: 'SideBar',
components: {
  VueResizable,
  FormRating
},
props: {
  address: String,
  value: String // MainMap 컴포넌트에서 전달된 주소 데이터
},
data() {
  return {
    isVisibleSideBar: true,
    addressCopy: '', // 초기화를 제거합니다.
    title: '',
    grade: 0,
    review: '',
    lonCopy: 0.0,
    latCopy: 0.0,
    image: '',
    mapTag: '#',
    date: '',
    budget: 0,
    dates: [],
    budgetSummary: {},
    category: '',
  };
},
mounted() {
    EventBus.$on('mapClick', (data) => {
        this.title = data.title || '';
        this.addressCopy = data.address || '';
        this.grade = data.grade || 0;
        this.review = data.review || '';
        this.lonCopy = data.lonCopy;
        this.latCopy = data.latCopy;
        this.image = data.image || '';
        this.mapTag = data.mapTag || '';
        this.course = data.course || '';
        this.budget = data.budget || 0;
        this.category = data.category || '';
    });
},
methods: {
  onChangeFiles(e) {
    this.fileList.push(...e.target.files);
    console.log(this.fileList);
  },
  
  updateAddress(event) {
    this.$emit('update:address', event.target.value);
  },
  // saveReview() {
  //   try{
  //   this.$axios.post('http://localhost:8081/api/map/saveMap', {
  //     title: this.title,
  //     addressCopy: this.addressCopy,
  //     grade: this.grade,
  //     review: this.review,
  //     lonCopy: this.lonCopy,
  //     latCopy: this.latCopy,
  //     image: this.image,
  //     category: this.category,
  //     course: this.course
  //   }).then(response => {
  //     console.log('저장 성공:', response);
  //   })
  // }catch(error){
  //   console.error("저장하기 에러" + error);
  // }
  // } 
},
}
</script>
<style lang="scss" scoped>

.container {
  display: flex;
  justify-content: flex-start; /* 자식 요소들을 컨테이너의 시작 부분에서 정렬 */
  align-items: stretch; /* 자식 요소들이 컨테이너를 꽉 채우도록 늘림 */
  /* flex-direction: column; 제거 또는 아래로 변경 */
  flex-direction: row; /* 자식 요소들을 가로로 나란히 배치 */
  max-width: 1200px;
}

.left-area {
  flex: 1;
}

.right-area {
  width: 600px;
  display: flex;
  flex-direction: row; /* 자식 요소들을 가로로 나열 */
  justify-content: space-around; /* 아이콘 그룹들 사이의 공간을 균등하게 분배 */
  align-items: center; /* 아이콘 그룹들을 세로 중앙 정렬 */
  flex-wrap: wrap; /* 필요하다면 아이템들을 다음 줄로 넘김 */
  /* flex: 0.8은 .right-area의 부모가 flex일 때만 필요합니다. */
}



.review-span {
  display: block; /* span을 블록 레벨 요소처럼 보이게 함 */
  white-space: pre-wrap; /* 공백과 줄바꿈을 유지 */
  overflow-wrap: break-word; /* 긴 단어가 넘치지 않도록 줄바꿈 */
  margin: 10px 0; /* 위아래 마진 추가 */
  padding: 10px; /* 패딩 추가 */
  border: 1px solid #ccc; /* 테두리 추가 */
  border-radius: 4px; /* 둥근 테두리 모양 */
  
  color: #ffffff; /* 글자색 */
  min-height: 100px; /* 최소 높이 */
  width: 100%; /* 너비 */
}

.tag-label {
  margin-left: 90px;
  margin-right: 70px; /* 오른쪽에 20px의 공간을 추가 */
}

.budget-label {
  
  margin-left: 80px; /* 왼쪽에 20px의 공간을 추가 */
}
.budget-modal{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.budget-modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 700px;
  height: 700px;
  text-align: center;
  background-image: url('@/assets/images/blackpig.jpg');
}
/* 입력된 태그 표시 스타일 */
// .tag {
//   background-color: #ffffff;
//   color: #007BFF;
//   border-radius: 16px;
//   border: solid 1px #007BFF;
//   padding: 5px 10px;
//   display: inline-flex;
//   align-items: center;
//   margin-right: 10px;
// }
.side-bar-wrapper {
  display: flex;
  color: #fff;

}
 .bottom-btn-area {
  text-align: right;
  padding-right: 10px;
  > .save-btn {
      color: #fff;
      font-weight: bold;
        background-color: #ee9e06;
  }
}

.card-container {
  width: 100%; /* 또는 원하는 너비 */
  border: 1px solid #ddd; /* 경계선 스타일 */
  border-radius: 8px; /* 모서리 둥글게 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  overflow: hidden; /* 자식 요소들이 테두리 밖으로 넘어가지 않게 함 */
  background-color: #fff; /* 배경색 */
}

.card-header, .card-footer {
  padding: 15px;
  background-color: #f9f9f9; /* 헤더와 푸터의 배경색 */
}

.card-header > h2 {
  margin: 0;
  color: #e53e3e; /* 제목 색상 */
  font-size: 1.5em; /* 제목 크기 */
}

.card-header > p {
  margin: 5px 0 0; /* 상단에 여백, 나머지는 0 */
  color: #666; /* 문단 색상 */
}

.card-body {
  padding: 15px;
}

.image-gallery {
  display: flex;
  justify-content: space-around; /* 이미지 간격 동일하게 */
}

.image-gallery img {
  border-radius: 4px; /* 이미지 모서리 둥글게 */
  width: 100px; /* 이미지 너비 */
  height: auto; /* 이미지 비율 유지 */
  margin: 0 5px; /* 이미지 사이 여백 */
}

.tags {
  margin-top: 10px;
}

.tags span {
  display: inline-block;
  background-color: #eee; /* 태그 배경색 */
  border-radius: 16px; /* 태그 모서리 둥글게 */
  padding: 5px 10px; /* 태그 패딩 */
  margin: 2px; /* 태그 간 여백 */
  font-size: 0.75em; /* 태그 폰트 크기 */
}

.card-footer {
  display: flex;
  justify-content: space-between; /* 푸터 내부 요소 간격 동일하게 */
  align-items: center; /* 푸터 내부 요소 세로 중앙 정렬 */
  padding: 10px 15px;
}

.card-footer button {
  padding: 5px 10px;
  border-radius: 4px; /* 버튼 모서리 둥글게 */
  border: none;
  cursor: pointer; /* 클릭 가능하게 */
}

/* 여기에 필요한 추가 스타일을 계속 추가할 수 있습니다. */

.line5 {
  width: 1200px; /* 선의 너비를 컨테이너의 100%로 설정 */
  height: 1px; /* 선의 높이 설정 */
  background-color: #c4c4c4; /* 선의 색상 설정 (예: 빨간색) */
  margin-top: 30px; /* 선과 설명 사이의 여백 설정 */
  margin-bottom: 30px; /* 선과 설명 사이의 여백 설정 */
}

.icon-group {
  display: flex;

}

.icon-circle {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px; /* 아이콘 원의 크기 */
  height: 80px;
  border-radius: 50%; /* 원형 모양 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  background-color: white; /* 배경색 */
  padding: 10px;
  transition: transform 0.3s ease; /* 마우스 오버 시 효과 */
}

.icon-circle img {
  width: 40px; /* 아이콘 크기 */
  height: auto;
}

.icon-circle:hover {
  transform: translateY(-5px); /* 마우스 오버 시 위로 움직임 */
}

.icon-text {
  display: flex;
  flex-direction: column; /* 텍스트를 위아래로 나열 */
  margin-left: 10px; /* 아이콘과의 간격 설정 */
}

.icon-text p {
  margin: 0; /* 기본 마진 제거 */
  line-height: 1.2; /* 줄 간격 */
  color: #333; /* 텍스트 색상 */
  font-size: 14px; /* 텍스트 크기 */
}

.right-area > div:last-child {
  width: 100%; /* 아이콘 그룹과 같은 너비를 가지게 하려면 */
  text-align: center; /* 텍스트를 중앙으로 정렬 */
  /* 추가적으로 필요한 스타일 */
}

</style>