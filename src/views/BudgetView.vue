<template>
  <div>
    <h1 @click="showModal = true">예산하기</h1>
    <!-- 모달 컴포넌트 -->
    <div v-if="showModal" class="budget-modal">
      <div class="budget-modal-content">
        <h2>A코스 예산 계산해보기</h2>
        <p>여기에 예산에 관한 정보를 표시할 수 있습니다.</p>
        <button @click="showModal = false">닫기</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showModal: false, // 모달 창 표시 여부
    }
  }
}
</script>

<style>
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
  background-image: url('../assets/blackpig.jpg');
}
</style>
