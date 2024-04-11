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
          <textarea v-model="title" placeholder="맛집 이름을 입력해주세요."></textarea>
        </div>
        <div class="image-area">
          <div class="iw-file-input">
            사진을 업로드 해주세요
          </div>
        </div>
        <div class="location-info-area">
    <font-awesome-icon icon="fa-solid fa-pen" />
    <Input
    placeholder="위치 정보 직접 입력하기"
    :value="addressCopy"
    @input="updateAddress"
  />
  </div>
  <div class="rate-area">
    <FormRating :value="parseInt(grade)" @update:grade="grade = $event" />
      </div>
        <div class="review-area">
          <textarea
              ref="textarea"
              placeholder="후기를 입력해주세요."
              v-model="review"
          ></textarea>
        </div>
        <div class="bottom-btn-area">
      <Button class="save-btn" @click="saveReview">
          저장
      </Button>
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
    latCopy: 0.0
  };
},
mounted() {
  // EventBus를 통해 mapClick 이벤트를 수신하는 리스너를 등록합니다.
  EventBus.$on('mapClick', ({ address, lon, lat }) => { 
  this.addressCopy = address;
  this.lonCopy = lon;
  this.latCopy = lat;
});
},
methods: {
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
      latCopy: this.latCopy
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
.side-bar-wrapper {
  display: flex;
  color: #fff;

  > .resizable-side-bar {
    > .side-bar {
      background-color: rgba(0, 0, 0, 0.5);
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 10px;

      > .title-area {
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

      > .image-area {
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

      > .location-info-area {
        padding: 10px;

        input, input::placeholder, input:focus {
          font-size: 1rem;
          color: #fff;
          box-shadow: none;
          background: none;
          border: none;
        }
      }

      > .rate-area {
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

      > .review-area {
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

  > .side-bar-active-btn {
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
> .bottom-btn-area {
  text-align: right;
  padding-right: 10px;

  > .save-btn {
      color: #fff;
      font-weight: bold;
        background-color: #ee9e06;
  }
}
</style>