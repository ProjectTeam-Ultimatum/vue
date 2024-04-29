<template>
    <div>
        <div id="map" style="width:160px;height:160px;"></div>
    </div>
</template>
<style scoped>

</style>
<script>``
export default {
    name: "KakaoMap",
    data() {
        return{
            map:null,
        };
    },
    props: {
        latitude: Number,
        longitude: Number
    },
    watch: {
        // 위도 또는 경도가 변경되면 마커 업데이트
        latitude(newLat, oldLat) {
            if(newLat !== oldLat) {
                this.loadMaker();
            }
        },
        longitude(newLng, oldLng) {
            if(newLng !== oldLng) {
                this.loadMaker();
            }
        }
    },
    setup() {},
    created() {},
    mounted() {
        this.initMap();

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
            script.onload = () => window.kakao.maps.load(this.initMap); 

            document.head.appendChild(script); // html>head 안에 스크립트 소스를 추가
        },
        
        initMap() {
            if (!this.map && window.kakao && window.kakao.maps) {
                const container = document.getElementById("map");
                const options = {
                    center: new window.kakao.maps.LatLng(this.latitude || 33.50611873726319, this.longitude || 126.51317667644368),
                    level: 3,
                };
                this.map = new window.kakao.maps.Map(container, options);
            }
            this.loadMaker();
        },
        loadMaker() {
            if (!this.map) return;
            const markerPosition = new window.kakao.maps.LatLng(this.latitude, this.longitude);
            const marker = new window.kakao.maps.Marker({
                position: markerPosition
            });
            marker.setMap(this.map);
        },

    },
};
</script>