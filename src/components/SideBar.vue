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
          <textarea v-model="title" placeholder="메모장" ></textarea>
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
    
  />
  </div>

  <!-- <di>
    <input placeholder="category" :value="category">
  </di> -->
  <div class="dropdown">
  <a class="btn btn-secondary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
    {{ course || '코스 보기'  }}
  </a>
  <ul class="dropdown-menu">
      <li><a class="dropdown-item" href="#" @click="selectCourse('A')">A코스</a></li>
      <li><a class="dropdown-item" href="#" @click="selectCourse('B')">B코스</a></li>
      <li><a class="dropdown-item" href="#" @click="selectCourse('C')">C코스</a></li>
      <li><a class="dropdown-item" href="#" @click="selectCourse('D')">D코스</a></li>
  </ul>
</div>
<div class="dropdown">
  <a class="btn btn-secondary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
    {{ category || '장소 보기'  }}
  </a>
  <ul class="dropdown-menu">
      <li><a class="dropdown-item" href="#" @click="selectCategory('놀거리')">놀거리</a></li>
      <li><a class="dropdown-item" href="#" @click="selectCategory('숙소')">숙소</a></li>
      <li><a class="dropdown-item" href="#" @click="selectCategory('음식')">음식점</a></li>
      <li><a class="dropdown-item" href="#" @click="selectCategory('축제')">축제</a></li>
  </ul>
</div>

  <div class="rate-area">
    <FormRating :value="parseInt(grade)" @update:grade="grade = $event" />
    <FormRating :grade="grade" :readOnly="true"/>
      </div>
        <div class="review-area">
          <textarea
              ref="textarea"
              placeholder="메모장"
              v-model="review" 
              
          ></textarea>
        </div>
        <div class="bottom-btn-area">
      <Button class="save-btn" @click="saveReview">
          저장
      </Button>
  </div>
  <div>
    <h1 @click="showModal = true">예산하기</h1>
    <!-- 모달 컴포넌트 -->
    <div v-if="showModal" class="budget-modal">
      <div class="budget-modal-content">

        <h2>1일차</h2>
        <p>{{ calculateBudget }}</p>

        <h2>2일차</h2>
        <p>{{ calculateBudget }}</p>

        <h2>3일차</h2>
        <p>{{ calculateBudget }}</p>

        <button @click="showModal = false">닫기</button>
      </div>
    </div>
  </div>
      </div>
    </VueResizable>
        <Button
      class="side-bar-active-btn"
      size="sm"
      @click="showSideBar"
  >
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
    category: null,
    showModal: false,
    date: '',
    budget: 0,
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
        this.category = data.category || '';
        this.course = data.course || '';
        console.log("course: ", data.course);
    });
},
methods: {
  // calculateBudget() {
  //   let totalBudget = 0; // 합산할 예산을 저장할 변수를 초기화합니다.
    
  //   if (this.course === 'A코스') {
  //     this.dates.forEach((day) => {
  //       if (day.course === 'A') { // 현재 '일차'가 'A코스'에 해당하는지 확인합니다.
  //         totalBudget += day.budget; // 'A코스'에 해당하는 예산을 합산합니다.
  //       }
  //     });
  //   }
  //   else if (this.course === 'B코스') {
  //     this.dates.forEach((day) => {
  //       if (day.course === 'B') {
  //         totalBudget += day.budget;
  //       }
  //     });
  //   }
  //   else if (this.course === 'C코스') {
  //     this.dates.forEach((day) => {
  //       if (day.course === 'C') {
  //         totalBudget += day.budget;
  //       }
  //     });
  //   }

  //   return totalBudget; // 계산된 총 예산을 반환합니다.
  // },
  selectCourse(course) {
    this.course = course; // 사용자가 선택한 코스를 저장
    EventBus.$emit('courseClick', course);
  },
  selectCategory(category) {
    this.category = category; // 사용자가 선택한 코스를 저장
    EventBus.$emit('categoryClick', category);
  },
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
  saveReview() {
    try{
    this.$axios.post('http://localhost:8081/api/map/saveMap', {
      title: this.title,
      addressCopy: this.addressCopy,
      grade: this.grade,
      review: this.review,
      lonCopy: this.lonCopy,
      latCopy: this.latCopy,
      image: this.image,
      category: this.category,
      course: this.course
    }).then(response => {
      console.log('저장 성공:', response);
    })
  }catch(error){
    console.error("저장하기 에러" + error);
  }
  } 
},
}
</script>
<style lang="scss" scoped>
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
        padding: 20px 10px;
        input, input::placeholder, input:focus {
          font-size: 2rem;
          font-weight: bold;
          color: #fff;
          box-shadow: none;
          background: none;
          border: none;
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