<template>
  <swiper
    :slidesPerView="3"
    :spaceBetween="50"
    :autoplay="{ delay: 2500, disableOnInteraction: false }"
    :loop="true"
  >
    <swiper-slide><img src="@/assets/images/bn01.jpg" alt="First slide"></swiper-slide>
    <swiper-slide><img src="@/assets/images/bn02.jpg" alt="Second slide"></swiper-slide>
    <swiper-slide><img src="@/assets/images/bn03.jpg" alt="Third slide"></swiper-slide>
  </swiper>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';

// Swiper 설정 내에서 Autoplay 기능을 활성화
export default {
  components: {
    Swiper,
    SwiperSlide
  }
}
</script>
<style scoped>
.swiper{
  height: 300px;
}
</style>