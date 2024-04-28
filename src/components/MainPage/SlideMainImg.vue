<template>
    <div id="carouselExampleCaptions" class="carousel slide">
  <div class="carousel-indicators">
    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
  </div>
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img src="@/assets/images/main02.jpg" class="d-block w-100" alt="...">
      <div class="swiper-slide">
        <div class="tit_wrap">
            <h1>
                <p><strong>같이</strong> 하는 여행</p>
                <p><strong>함께</strong> 하는 여행</p>
            </h1>
            <h6>
                <p>여행 장소와 날짜부터 1:1 채팅까지</p>
                <p>나와 꼭 맞는 여행 친구 찾기</p>
            </h6>
            <!-- <a href="" tabindex="-1">자세히 보기</a> -->
        </div>
      </div>
    </div>
    <div class="carousel-item">
      <img src="@/assets/images/main01.jpg" class="d-block w-100" alt="...">
      <div class="carousel-caption d-none d-md-block">np
        <h5>Second slide label</h5>
        <p>Some representative placeholder content for the second slide.</p>
      </div>
    </div>
    <div class="carousel-item">
      <img src="@/assets/images/main03.jpg" class="d-block w-100" alt="...">
      <div class="carousel-caption d-none d-md-block">
        <h5>Third slide label</h5>
        <p>Some representative placeholder content for the third slide.</p>
      </div>
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>
</template>