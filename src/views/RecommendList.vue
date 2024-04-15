<template>
  <section>
    <div>
    <span>지금 보고 있는 지역은
      <!-- selectedRegion에 바인딩하기 위해 v-model -->
      <select v-model="selectedRegion">
        <option value="">전체</option>
        <option value="제주시">제주시</option>
        <option value="서귀포시">서귀포시</option>
        <option value="성산읍">성산읍</option>
      </select>
      입니다.
    </span>
  </div>
    <div>
      <!-- RecommendListFood에 selectedRegion prop으로 전달 -->
      <button @click="setActiveSection('all')">전체</button>
      <button @click="setActiveSection('listfood')">음식점</button>
      <button @click="setActiveSection('listplace')">관광지</button>
      <button @click="setActiveSection('listhotel')">숙박</button>
      <button @click="setActiveSection('listevent')">축제/행사</button>
    </div>
    <!-- 각 컴포넌트는 activeSection이 해당 섹션을 가리키거나 'all'일 때만 표시됩니다.
    각 섹션을 표시하는 컴포넌트에는 v-if나 v-show를 사용하여 
    activeSection의 값에 따라 표시 여부를 결정합니다 -->
    <RecommendListPlace v-if="activeSection === 'listplace' || activeSection === 'all'" :region="selectedRegion" />
    <!-- <RecommendFood v-if="activeSection === 'food' || activeSection === 'all'" /> -->
    <RecommendListFood v-if="activeSection === 'listfood' || activeSection === 'all'" :region="selectedRegion"/>
    <RecommendListHotel v-if="activeSection === 'listhotel' || activeSection === 'all'" :region="selectedRegion" />
    <RecommendListEvent v-if="activeSection === 'listevent' || activeSection === 'all'" :region="selectedRegion" />

  </section>
</template>

<script>
// import RecommendFood from '../components/RecommendFood.vue';
import RecommendListFood from '../components/RecommendListFood.vue';
import RecommendListHotel from '../components/RecommendListHotel.vue';
import RecommendListPlace from '../components/RecommendListPlace.vue';
import RecommendListEvent from '../components/RecommendListEvent.vue';

export default {
  components: {
    RecommendListFood,
    RecommendListHotel,
    RecommendListPlace,
    RecommendListEvent,
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
    setActiveSection(section) {
  this.activeSection = section;
  if (section === 'all') {
    this.selectedRegion = ''; // "전체" 옵션 선택 시 selectedRegion을 빈 문자열로 설정
  }
}
  }
}
</script>