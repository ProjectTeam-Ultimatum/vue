<template>
  <div class="side-bar-wrapper">
    <VueResizable
        class="resizable-side-bar"
        :width="500"
        :min-width="500"
        :max-width="Infinity"
        :active="['r']"
        v-if="isVisibleSideBar"
    >
      <div class="side-bar">

        <div class="title-area">
          <input placeholder="장소 이름" v-model="title"  :readonly="true"/>
          <p>
          <span class="category">카테고리: {{ category }}</span>
          </p>
        </div>
        
        <div class="image-area">
          <div class="iw-file-input">
            <img :src="image" alt="Uploaded Image" v-if="image"/>
          </div>
        </div>

        <div class="location-info-area">
    <font-awesome-icon icon="fa-solid fa-pen" />
    <Input
    placeholder="주소"
    :value="addressCopy"
    @input="updateAddress"
    :readonly="true"
  />
  </div>

  <!-- <di>
    <input placeholder="category" :value="category">
  </di> -->

  <p>
    <span class="tag-label">태그: {{ mapTag }}</span>
    <span class="budget-label">가격: {{ budget }}</span>
  </p>

  <div class="rate-area">
    <!-- <FormRating :value="parseInt(grade)" @update:grade="grade = $event" /> -->
    <FormRating :grade="grade" :readOnly="true"/>
      </div>

        <div class="review-area">
          <div>
            <div>
          <span ref="span" class="review-span" placeholder="내용">{{ review }}</span>
          </div>
          </div>
        </div>

        <!-- <div class="bottom-btn-area">
      <Button class="save-btn" @click="saveReview">
          저장
      </Button>
  </div> -->
  


      </div>
    </VueResizable>
        <Button
      class="side-bar-active-btn"
      size="sm"
      @click="showSideBar">
    <font-awesome-icon :icon="isVisibleSideBar ? 'fa-solid fa-arrow-left' : 'fa-solid fa-arrow-right'" />
  </Button>
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
  showSideBar() {
    this.isVisibleSideBar = !this.isVisibleSideBar;
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
   .resizable-side-bar {
     .side-bar {
      background-color: rgba(0, 0, 0, 0.5);
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 10px;
      .title-area {
        padding: 20px;
        margin-left: 32px;
        input, input::placeholder, input:focus {
          font-size: 1rem;
          color: #fff;
          box-shadow: none;
          background: none;
          border: none;
          width: 300px; /* 너비 설정 */
          height: 90px;
          
        }
      }
       .image-area {
        padding: 0 10px;
        > .iw-file-input {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1.3rem;
          border: 5px dashed rgb(255, 255, 255, 0.5);
          border-radius: 10px;
          height: 250px;
          background-color: rgb(255, 255, 255, 0.5);
        }
      }
       .location-info-area {
        padding: 10px;
        input, input::placeholder, input:focus {
          font-size: 1rem;
          color: #fff;
          box-shadow: none;
          background: none;
          border: none;
          width: 450px;
        }
      }
       .rate-area {
        padding: 0 20px;
        text-align: center;
        output {
          font-size: 2rem;
          color: #ffdd00;
          background: none;
          border: none;
          box-shadow: none;
        }
      }
       .review-area {
        padding: 20px 10px;
        textarea, textarea::placeholder {
          min-height: 300px;
          resize: none;
          color: #fff;
          background: none;
          border: none;
          box-shadow: none;
          width: 400px;
        }
        /* width */
        ::-webkit-scrollbar {
          width: 10px;
        }
        /* Track */
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        /* Handle */
        ::-webkit-scrollbar-thumb {
          background: #888;
        }
        /* Handle on hover */
        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      }
    }
  }
   .side-bar-active-btn {
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #000000;
    padding: 0;
    border: none;
    border-radius: unset;
    color: #fff;
    opacity: 0.5;
    width: 40px;
    height: 40px;
  }
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

</style>