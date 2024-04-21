<template>
  <div>
    <!-- 헤더 크기만큼 패딩 -->
    <div class="divider" />
    <RecommendDetailFood />
  </div>
  
    
</template>

<script>
// import RecommendFood from '../components/RecommendFood.vue';
import RecommendDetailFood from '../../components/RecommendDetail/RecommendDetailFood.vue';

export default {
  components: {
    RecommendDetailFood,
  },
  data() {
    return {

    };
  },
  methods: {
   
    },
}
</script>
<style scoped>
.divider {
  padding: 50px;
}
</style>