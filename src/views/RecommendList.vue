<template>
  <section>
    <div>
    <span>지금 보고 있는 지역은
      <!-- selectedRegion에 바인딩하기 위해 v-model -->
      <select v-model="selectedRegion">
        <option value="제주시">제주시</option>
        <option value="서귀포시">서귀포시</option>
        <option value="성산읍">성산읍</option>
      </select>
      입니다.
    </span>
  </div>
    <div>
      <button @click="setActiveSection('all')">전체</button>
      <button @click="setActiveSection('place')">가볼만한 곳</button>
      <button @click="setActiveSection('food')">맛집</button>
      <!-- RecommendListFood에 selectedRegion prop으로 전달 -->
      <button @click="setActiveSection('listfood')">전체맛집</button>
      <button @click="setActiveSection('hotel')">숙소</button>
    </div>
    <!-- 각 컴포넌트는 activeSection이 해당 섹션을 가리키거나 'all'일 때만 표시됩니다.
    각 섹션을 표시하는 컴포넌트에는 v-if나 v-show를 사용하여 
    activeSection의 값에 따라 표시 여부를 결정합니다 -->
    <RecommendPlace v-if="activeSection === 'place' || activeSection === 'all'" />
    <RecommendFood v-if="activeSection === 'food' || activeSection === 'all'" />
    <RecommendListFood v-if="activeSection === 'listfood' || activeSection === 'all'" :region="selectedRegion"/>
    <RecommendHotel v-if="activeSection === 'hotel' || activeSection === 'all'" />

  </section>
</template>

<script>
import RecommendFood from '../components/RecommendFood.vue';
import RecommendListFood from '../components/RecommendListFood.vue';
import RecommendHotel from '../components/RecommendHotel.vue';
import RecommendPlace from '../components/RecommendPlace.vue';

export default {
  components: {
    RecommendFood,
    RecommendListFood,
    RecommendHotel,
    RecommendPlace
  },
  data() {
    return {
      activeSection: 'all',
      selectedRegion: '' // 초기값을 설정합니다.
    };
  },
  methods: {
    setActiveSection(section) {
      this.activeSection = section;
    }
  },
  watch: {
    selectedRegion(newVal) {
      console.log('선택된 지역: ' + newVal); // 새로운 값이 할당될 때마다 콘솔에 출력
    }
  }
}
</script>