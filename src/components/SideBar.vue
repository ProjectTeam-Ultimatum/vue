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
          <textarea v-model="recommend_place_title" placeholder="맛집 이름을 입력해주세요."></textarea>
        </div>

        <div class="image-area">
          <div class="iw-file-input">
            <img :src="recommend_place_img_path" alt="Uploaded Image" v-if="recommend_place_img_path"/>
          </div>
        </div>

        <div class="location-info-area">
    <font-awesome-icon icon="fa-solid fa-pen" />
    <Input
    placeholder="위치 정보 직접 입력하기"
    :value="recommend_place_address"
    @input="updateAddress"
  />
  </div>
  <div class="dropdown">
  <a class="btn btn-secondary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
    장소 정하기
  </a>

  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="#" @click="placecategory">놀거리</a></li>
    <li><a class="dropdown-item" href="#" @click="hotelcategory">숙소</a></li>
    <li><a class="dropdown-item" href="#" @click="foodcategory">음식</a></li>
    <li><a class="dropdown-item" href="#" @click="eventcategory">축제</a></li>
  </ul>
</div>
  <div class="rate-area">
    <FormRating :value="parseInt(recommend_place_star)" @update:recommend_place_star="recommend_place_star = $event" />
    <FormRating :recommend_place_star="recommend_place_star" :readOnly="true"/>
      </div>
        <div class="review-area">
          <textarea
              ref="textarea"
              placeholder="후기를 입력해주세요."
              v-model="recommend_place_introduction"
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
    recommend_place_address: '', // 초기화를 제거합니다.
    recommend_place_title: '',
    recommend_place_star: 0,
    recommend_place_introduction: '',
    recommend_place_longitude: 0.0,
    recommend_place_latitude: 0.0,
    recommend_place_img_path: '',
    placecategory: '',
    hotelcategory: '',
    foodcategory: '',
    eventcategory: ''
  };
},
mounted() {
    EventBus.$on('mapClick', (data) => {
        this.recommend_place_title = data.recommend_place_title || '';
        this.recommend_place_address = data.recommend_place_address || '';
        this.recommend_place_star = data.recommend_place_star || 0;
        this.recommend_place_introduction = data.recommend_place_introduction || '';
        this.recommend_place_longitude = data.lon;
        this.recommend_place_latitude = data.lat;
        this.recommend_place_img_path = data.recommend_place_img_path || ''; // 이미지 데이터를 처리
        console.log("grade: ", data.recommend_place_star);
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
  saveReview() {
    try{
    this.$axios.post('http://localhost:8081/api/map/saveMap', {
      recommend_place_title: this.recommend_place_title,
      recommend_place_address: this.recommend_place_address,
      recommend_place_star: this.recommend_place_star,
      recommend_place_introduction: this.recommend_place_introduction,
      recommend_place_longitude: this.recommend_place_longitude,
      recommend_place_latitude: this.recommend_place_latitude,
      recommend_place_img_path: this.recommend_place_img_path
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