<template>
    <div>
        <h1>카카오 맵 보기</h1>
        <div id="map" style="width:160px;height:160px;"></div>
        <h1>ㅎㅇ</h1>
    </div>
</template>
<style scoped>

</style>
<script>
export default {
    name: "KakaoMap",
    data() {
        return{
            map:null,
            placeLatitude: 0,
            placeLongitude: 0,
        };
    },
    setup() {},
    created() {},
    mounted() {
        if (window.kakao && window.kakao.maps) {
            //카카오 객체가 있고, 카카오 맵을 그릴 준비가 되어있다면 맵 실행
            this.loadMap();
        } else {
            //없다면 카카오 스크립트 추가 후 맵 실행
            this.loadScript();
        }
    },
    methods: {
        loadScript() {
            const script = document.createElement("script");
            script.src=
            //&autoload=false api를 로드한 후 맵을 그리는 함수가 실행되도록 구현
            "//dapi.kakao.com/v2/maps/sdk.js?appkey=652bc7bf611ac245081578c73084c7df&autoload=false";
            // 스크립트 로드가 끝나면 지도를 실행 될 준비가 되어 있다면 지도가 실행되도록 구현
            script.onload = () => window.kakao.maps.load(this.loadMap); 

            document.head.appendChild(script); // html>head 안에 스크립트 소스를 추가
        },
        loadMap() {
            //지도를 담을 DOM 영역
            const container = document.getElementById("map");
            const options = {
                // 지도를 생성할 때 필요한 기본 옵션
                center: new window.kakao.maps.LatLng(33.50611873726319, 126.51317667644368), //지도의 중심좌표
                level: 3, // 지도의 레벨(확대, 축소 정도)
            };
            this.map = new window.kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
            this.loadMaker()
        },
        loadMaker() {
            // 마커 표시 위치
            const markerPosition = new window.kakao.maps.LatLng(33.50611873726319,126.51317667644368)

            // 마커 생성
            const marker = new window.kakao.maps.Marker({
                position: markerPosition
            })

            // 마커가 지도 위에 표시되도록 설정
            marker.setMap(this.map)
        },
        async fetchPlaceDetails() {
            if (!this.recommendPlaceId) {
                console.error("recommendPlaceId가 정의되지 않았습니다!");
                return;
            }
            try {
                let response = await this.$axios.get(`/api/recommend/listplace/${this.recommendPlaceId}`);
                if (response.data) {
                    const data = response.data;
                    // 데이터 가공
                    this.placeLatitude = data.recommendPlaceLatitude;
                    this.placeLongitude = data.recommendPlaceLongitude;
                }
            } catch (error) {
                console.error('관광지 세부 정보를 가져오는 중 에러 발생:', error);
            }
        },
    },
};
</script>