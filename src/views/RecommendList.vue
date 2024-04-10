<template>
  <section>
    <div>
      <button @click="setActiveSection('all')">전체</button>
      <button @click="setActiveSection('place')">가볼만한 곳</button>
      <button @click="setActiveSection('food')">맛집</button>
      <button @click="setActiveSection('hotel')">숙소</button>
    </div>
    <!-- 각 컴포넌트는 activeSection이 해당 섹션을 가리키거나 'all'일 때만 표시됩니다.
    각 섹션을 표시하는 컴포넌트에는 v-if나 v-show를 사용하여 
    activeSection의 값에 따라 표시 여부를 결정합니다 -->
    <RecommendListPlace v-if="activeSection === 'place' || activeSection === 'all'" />
    <RecommendListFood v-if="activeSection === 'food' || activeSection === 'all'" />
    <RecommendListHotel v-if="activeSection === 'hotel' || activeSection === 'all'" />
  </section>
</template>

<script>
import RecommendListFood from '../components/RecommendListFood.vue'
import RecommendListHotel from '../components/RecommendListHotel.vue'
import RecommendListPlace from '../components/RecommendListPlace.vue'

export default {
components: {
  RecommendListFood,
  RecommendListHotel,
  RecommendListPlace
},
data() {
  return {
    //  현재 활성화된 섹션 관리
    // 'all'로 초기화하여 처음에는 모든 섹션을 표시합니다.
    activeSection: 'all'
  };
},
methods: {
  setActiveSection(section) {
    this.activeSection = section;
  }
}
}
</script>