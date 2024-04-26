<template>
  <div class="containor">
  <div class="courseButton">
        <button type="button" @click="coursebutton('A')"> A 코스 </button>
        <button type="button" @click="coursebutton('B')"> B 코스 </button>
        <button type="button" @click="coursebutton('C')"> C 코스 </button>
        <button type="button" @click="coursebutton('D')"> D 코스 </button>
        <button type="button" @click="coursebutton('E')"> E 코스 </button>
        <button type="button" @click="coursebutton('F')"> F 코스 </button>
        <button type="button" @click="coursebutton('G')"> G 코스 </button>
        <button type="button" @click="coursebutton('H')"> H 코스 </button>
        <button type="button" @click="coursebutton('I')"> I 코스 </button>
        <button type="button" @click="coursebutton('J')"> J 코스 </button>
        <div class="budgetButton">
          <button type="button" @click="showModal = true">코스마다 예산보기</button>
        </div>
  </div>

  <div class="map-container">
  <div class="main-map" ref="map">
    <div class="map-text">
  <div class="line-container">
  <div class="line"></div>
  <span class="description">1일차</span>
</div>
<div class="line-container">
  <div class="line2"></div>
  <span class="description">2일차</span>
</div>
<div class="line-container">
  <div class="line3"></div>
  <span class="description">3일차</span>
</div>
<div class="line-container">
  <div class="line4"></div>
  <span class="description">4일차</span>
</div>
</div>
  </div>
</div>


<div class="line5"></div>


  <div>
    <div v-if="showModal" class="budget-modal">
      <div class="budget-modal-content">
    <div v-for="(total, day) in budgetSummary" :key="day">
      <p>{{ day }}코스의 총 예산: {{ total }}원</p>
    </div>
        <button @click="showModal = false">닫기</button>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import OlLayerTile from 'ol/layer/Tile.js';
import OlView from 'ol/View.js';
import OlMap from 'ol/Map.js';
import OSM from 'ol/source/OSM';
import {fromLonLat} from 'ol/proj.js'
import {defaults} from 'ol/control.js';
import {toLonLat} from 'ol/proj.js'
import axios from 'axios'
import { EventBus } from '@/EventBus';
import Geocoder from 'ol-geocoder'
import OlVectorSource from 'ol/source/Vector.js'
import OlVectorLayer from 'ol/layer/Vector.js'
import OlFeature from 'ol/Feature.js';
import OlPoint from 'ol/geom/Point.js';
import OlStyle from 'ol/style/Style.js';
import {Fill, Stroke, Text} from 'ol/style';
import OlIcon from 'ol/style/Icon.js';

import markerImage from '@/assets/images/jjang.png';

import OlLineString from 'ol/geom/LineString';



export default {
  name: 'MainMap',
  data() {
    return {
      olMap: undefined,
      address: '',
      iconsSource: undefined,
      locations: [],
      title: '',
      grade: 0,
      review: '',
      mapTag: '#',
      course: '',
      budget: 0,
      category: '',
      lastFeature: undefined,
      lastClickedFeature: undefined,
      dates: [],
      budgetSummary: {},
      showModal: false,
    }
  },
  mounted() {
    this.initializeMap();
    this.fetchBudgets();
    EventBus.$on('courseClick', (course) => {
    this.course = course;
    this.updateMapIcons();  // 코스에 맞는 아이콘을 다시 불러옵니다.
  });
},

methods: {
  fetchBudgets() {
    this.$axios.get('http://localhost:8080/api/map/listMap')
      .then(response => {
        // response.data 형태가 [{ date: '1일차', budget: 111 }, ...]라고 가정
        this.dates = response.data;
        this.calculateTotalBudgets();  // 데이터를 받아온 후 총 예산을 계산
      })
      .catch(error => {
        console.error('Error fetching budgets:', error);
      });
  },

  calculateTotalBudgets() {
  const budgetSummary = {};

  // 코스별로 예산을 저장할 객체 초기화
  budgetSummary['A'] = {};
  budgetSummary['B'] = {};
  budgetSummary['C'] = {};
  budgetSummary['D'] = {};
  budgetSummary['E'] = {};
  budgetSummary['F'] = {};
  budgetSummary['G'] = {};
  budgetSummary['H'] = {};
  budgetSummary['I'] = {};
  budgetSummary['J'] = {};
  // 추가적인 코스가 있다면 여기에 더합니다.

  this.dates.forEach((date) => {
    const course = date.course; // 코스 구분값 (예: 'A', 'B', 'C')
    const day = date.date; // 날짜 구분값 (예: '1일차')
    const budget = date.budget; // 예산

    // 코스별 예산 집계
    if (!budgetSummary[course][day]) {
      budgetSummary[course][day] = 0;
    }
    budgetSummary[course][day] += budget;
  });

  console.log(budgetSummary);
  // 이제 budgetSummary 객체에는 각 코스별, 각 날짜별 예산 합산이 저장되어 있음
  this.budgetSummary = budgetSummary; // 리액티브하게 데이터 업데이트
},

  coursebutton(course) {
    this.course = course; // 사용자가 선택한 코스를 저장
    EventBus.$emit('courseClick', course);
  },
  groupAndDrawLines() {
    const groupedByDate = {};
    // 현재 코스에 해당하는 위치 데이터만 날짜별로 그룹화
    this.locations.forEach(location => {
      if (location.course === this.course) {
        if (!groupedByDate[location.date]) {
          groupedByDate[location.date] = [];
        }
        groupedByDate[location.date].push(fromLonLat([location.lonCopy, location.latCopy]));
      }
    });

    // 각 그룹에 대해 선을 그립니다
    Object.keys(groupedByDate).forEach(date => {
      const coordinates = groupedByDate[date];
      if (coordinates.length > 1) {
        const lineFeature = new OlFeature({
          geometry: new OlLineString(coordinates)
        });
        const lineColor = this.getColorForDay(date);
        lineFeature.setStyle(new OlStyle({
          stroke: new Stroke({
            color: lineColor,
            width: 2
          })
        }));
        this.vectorSource.addFeature(lineFeature);
      }
    });
  },
  



  getColorForDay(date) {
    switch (date) {
      case '1일차':
        return '#ff8686'; // 빨간색
      case '2일차':
        return '#a9ffa9'; // 초록색
      case '3일차':
        return '#98c5ff'; // 파란색
      case '4일차':
        return '#ffa0ff';
      default:
        return '#FFFFFF'; // 기본 색상
    }
  },
  updateMapIcons() {
    this.vectorSource.clear();  // 기존 벡터 소스 클리어 (마커와 선 모두 제거됩니다)

    // 새로운 코스에 해당하는 마커들만 추가
    this.locations.forEach(location => {
      if (location.course === this.course) {
        const point = fromLonLat([location.lonCopy, location.latCopy]);
        const feature = new OlFeature({
          geometry: new OlPoint(point),
          id: location.id
        });

        feature.setStyle(new OlStyle({
          image: new OlIcon({
            scale: 0.05,
            src: markerImage 
          }),

        text: new Text({
        text: String(location.id), // 위치 순서를 문자열로 변환
        font: '14px Calibri,sans-serif',
        offsetY: -25,
        fill: new Fill({
          color: '#ff0000'
        }),
        stroke: new Stroke({
          color: '#ffffff',
          width: 3
        }),
        
      })
        }));

        feature.set('data', location);
        this.vectorSource.addFeature(feature);

        feature.on('click', () => this.onMarkerClick(feature));
      }
    });
    this.groupAndDrawLines();
  },

  onMarkerClick(clickedFeature) {

  if (this.lastClickedFeature) {
    this.lastClickedFeature.setStyle(new OlStyle({
      image: new OlIcon({
        scale: 0.05,
        src: markerImage
      })
    }));
  }

  const clickedStyle = new OlStyle({
    image: new OlIcon({
      scale: 0.07,
      src: markerImage
    }),
    zIndex: 1000 
  });

  clickedFeature.setStyle(clickedStyle);
  this.lastClickedFeature = clickedFeature;
},

  initializeMap() {
    this.vectorSource = new OlVectorSource();
 
    this.fetchLocations();
    const vectorLayer = new OlVectorLayer({
      source: this.vectorSource
    });
    this.olMap = new OlMap({
      target: this.$refs.map,
      controls: defaults({
      attribution: false,
      zoom: false,
      rotate: false,
    }),
  
  layers: [
    new OlLayerTile({
      source: new OSM()
    }),
    vectorLayer
  ],
  view: new OlView({
    center: fromLonLat([126.52919839098948, 33.361753442616674]), // 경기도 성남
    zoom: 11
  })
});
this.olMap.on('click', async (e) => {
  geocoder.getSource().clear();
  this.clearLocationData();

  if (this.lastFeature) {
    this.vectorSource.removeFeature(this.lastFeature);
    this.lastFeature = null;
  }

  const [lon, lat] = toLonLat(e.coordinate);
  const addressInfo = await this.getAddress(lon, lat);
  console.log(addressInfo)
  if (addressInfo) {
    const displayAddress = this.getUiAddress(addressInfo.data.display_name);
    const point = fromLonLat([lon, lat]);
    console.log(lon , lat)
    const featureId = `feature-${lon}-${lat}`;  // Example of generating a unique feature ID
    let feature = this.vectorSource.getFeatureById(featureId);
    if (!feature) {
      feature = new OlFeature({
        geometry: new OlPoint(point),
        id: featureId
      });
      feature.setStyle(new OlStyle({
        image: new OlIcon({
          scale: 0.7,
          src: '//cdn.rawgit.com/jonataswalker/map-utils/master/images/marker.png'
        })
      }));
      this.vectorSource.addFeature(feature);
      this.lastFeature = feature;
    } else {
      feature.setGeometry(new OlPoint(point));
      this.lastFeature = feature;
    }
  
    EventBus.$emit('mapClick', {
      title: this.title,
      address: displayAddress,
      grade: this.grade,
      review: this.review,
      lonCopy: lon,
      latCopy: lat,
      image: this.image,
      mapTag: this.mapTag,
      course: this.course,
      budget: this.budget,
      category: this.category,
    });
  } else {
    console.error('Failed to fetch address information');
  }
});

  const geocoder = new Geocoder('nominatim', {
    provider: 'osm',
    lang: 'kr',
    placeholder: '주소 검색',
    limit: 5, // 자동 완성 결과 최대 개수
    autoComplete: true,
    keepOpen: true
  });
    this.olMap.addControl(geocoder);
    geocoder.on('addresschosen', (evt) => {
      this.setUiAddress(evt.address.details.name);
  });
      this.olMap.once('rendercomplete', () => {
      this.fetchLocations(); // 지도 렌더링이 완료된 후에 위치 데이터를 가져오고 마커를 추가합니다.
  });
  },

  clearLocationData() {
    // UI에 표시된 정보 초기화
    this.title = '';
    this.addressCopy = '';
    this.grade = null;
    this.review = '';
    this.image = '';
    this.mapTag = '';
    this.course = '';
    this.budget = null;
    this.category = '';
  },

  coordi4326To3857([lon, lat]) {
      // 좌표 변환 로직 구현
      const x = lon * 20037508.34 / 180;
      let y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
      y = y * 20037508.34 / 180;
      return [x, y];
    },

  getUiAddress(str) {
      return str.split(', ').reverse().join(' ');
    },

  async addUiAddress(coordinate) {
      const lonLatArr = toLonLat(coordinate);
      const lon = lonLatArr[0];
      const lat = lonLatArr[1];
      const addressInfo = await this.getAddress(lon, lat);
      EventBus.$emit('mapClick', addressInfo.data.display_name.split(', ').reverse().join(' '));
      this.drawMapIcon(coordinate);
    },

  drawMapIcon(coordinate) {
    const vectorSource = this.olMap.getLayers().item(1).getSource(); // Get vector source from the second layer
    vectorSource.clear();
    const feature = new OlFeature({
    geometry: new OlPoint(coordinate)
  });
      feature.setStyle(
      new OlStyle({
        image: new OlIcon({
        scale: 0.7,
        src: '//cdn.rawgit.com/jonataswalker/map-utils/master/images/marker.png'
      })
    })
  );
      vectorSource.addFeature(feature);
  },
  async fetchLocations() {
    try {
      const response = await axios.get('http://localhost:8080/api/map/listMap');
        this.locations = response.data; // 응답 데이터를 locations 배열에 저장
        this.addMapIcons(); // 가져온 위치 정보를 기반으로 지도에 아이콘을 추가
    } catch (error) {
        console.error('Error fetching locations:', error);
    }
        console.log('Received locations:', this.locations);
  },
  
  getAddress (lon, lat) {.0
    return axios.get(
        'https://nominatim.openstreetmap.org/reverse',
        {
          params: {
            format: 'json', 
            lon: lon,
            lat: lat
          }
        })
  },

  setUiAddress(str) {
    this.address = str.split(', ').reverse().join(' ');
  },

  addMapIcons() {
    const vectorLayer = this.olMap.getLayers().item(1); // 두 번째 레이어 가져오기
    const vectorSource = vectorLayer.getSource();
    const coordinates = [];

  // DB에서 가져온 각 위치 정보에 대해 아이콘을 추가합니다.
  this.locations.forEach(location => {
    if (location.course === this.course){
      const point = fromLonLat([location.lonCopy, location.latCopy]);
       coordinates.push(point);

      const feature = new OlFeature({
       geometry: new OlPoint(fromLonLat([location.lonCopy, location.latCopy]))
        ,id: location.id
    });

  feature.setStyle(new OlStyle({
    image: new OlIcon({
    scale: 0.05,
    src: markerImage 
  })

  }));

  feature.set('data', location);
  vectorSource.addFeature(feature);
  }});

  this.olMap.on('click', (evt) => {
    const feature = this.olMap.forEachFeatureAtPixel(evt.pixel, (feature) => {
      return feature;
    });
    if (feature) {
      this.onMarkerClick(feature);
      const data = feature.get('data');
    if (data) {
      this.displayLocationData(data);
    }
  }});
},

  displayLocationData(data) {
    // DB에서 가져온 데이터를 UI에 표시
    this.title = data.title;
    this.addressCopy = data.address;
    this.grade = data.grade;
    this.review = data.review;
    this.image = data.image;
    this.mapTag = data.mapTag;
    this.course = data.course;
    this.budget = data.budget;
    this.category = data.category;
    // 이외에 필요한 UI 업데이트 로직
  }

  }
}
</script>
<style>

.containor{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.main-map {
  width: 1200px;
  height: 600px;
}
.ol-geocoder {
  position: absolute;
  top: 10px; /* 원하는 수직 위치 조정 */
  right: 10px; /* 원하는 수평 위치 조정 */
  padding: 10px;
}
.ol-geocoder button {
  display: none;
}
.ol-geocoder input::placeholder {
  color: white;
  opacity: 0.7;
}
.ol-geocoder input,
.ol-geocoder ul {
  border-style: none;
  width: 200px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  border-color: unset;
  padding: 0 5px;
  color: white;
}
.ol-geocoder ul {
  margin-top: 5px;
  padding: 0;
  list-style: none;
}
.ol-geocoder ul li:hover {
  background-color: rgba(0, 0, 0, 0.3);
}
.ol-geocoder ul li {
  padding: 5px 10px;
  font-size: 13px;
}
.ol-geocoder ul li a {
  text-decoration: none;
}
.ol-geocoder ul li a .gcd-road {
  color: white;
}
.courseButton {
    display: flex;
    justify-content: center; /* 내부 요소를 가로축 중앙에 배치 */
    flex-wrap: wrap; /* 요소가 너무 많으면 다음 줄로 넘김 */
    margin-top: 30px;
}

.courseButton button {
    margin: 5px; /* 버튼 주변에 약간의 여백 추가 */
    margin-bottom: 20px;
    padding: 10px 20px; /* 버튼 내부 패딩으로 크기 조정 */
    background-color: #00A4CC; /* 밝은 파란색 배경 */
    color: white; /* 텍스트 색상 */
    border: none; /* 테두리 제거 */
    border-radius: 20px; /* 둥근 모서리 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 그림자 추가 */
    cursor: pointer; /* 마우스 오버 시 커서 변경 */
    transition: background-color 0.3s, box-shadow 0.3s; /* 부드러운 색상 및 그림자 전환 효과 */

}

.courseButton button:hover {
    background-color: #008ABF; /* 마우스 오버 시 색상 변경 */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); /* 마우스 오버 시 그림자 강조 */
}

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
  background-image: url('@/assets/images/blackpig.jpg');
}

.line-container {
  display: flex; /* flexbox를 사용하여 요소를 가로로 정렬 */
  align-items: center; /* 선과 텍스트를 중앙 정렬 */
}

.line {
  width: 100px; /* 선의 너비를 컨테이너의 100%로 설정 */
  height: 5px; /* 선의 높이 설정 */
  background-color: #ff8686; /* 선의 색상 설정 (예: 빨간색) */
  margin-right: 10px; /* 선과 설명 사이의 여백 설정 */
}
.line2 {
  width: 100px; /* 선의 너비를 컨테이너의 100%로 설정 */
  height: 5px; /* 선의 높이 설정 */
  background-color: #a9ffa9; /* 선의 색상 설정 (예: 빨간색) */
  margin-right: 10px; /* 선과 설명 사이의 여백 설정 */
}
.line3 {
  width: 100px; /* 선의 너비를 컨테이너의 100%로 설정 */
  height: 5px; /* 선의 높이 설정 */
  background-color: #98c5ff; /* 선의 색상 설정 (예: 빨간색) */
  margin-right: 10px; /* 선과 설명 사이의 여백 설정 */
}
.line4 {
  width: 100px; /* 선의 너비를 컨테이너의 100%로 설정 */
  height: 5px; /* 선의 높이 설정 */
  background-color: #ffa0ff; /* 선의 색상 설정 (예: 빨간색) */
  margin-right: 10px; /* 선과 설명 사이의 여백 설정 */
}

.line5 {
  width: 1200px; /* 선의 너비를 컨테이너의 100%로 설정 */
  height: 1px; /* 선의 높이 설정 */
  background-color: #c4c4c4; /* 선의 색상 설정 (예: 빨간색) */
  margin-top: 30px; /* 선과 설명 사이의 여백 설정 */
  margin-bottom: 30px; /* 선과 설명 사이의 여백 설정 */
}

.description {
  font-size: 16px; /* 설명의 폰트 크기 설정 */
}

.map-container {
  position: relative; /* 상대 위치 설정 */
  width: 1200px;
  height: 600px;
}
.map-text {
  position: absolute;
  top: 10px;
  left: 10px;
  color: white;
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0.2); /* 반투명 배경 */
  padding: 5px;
  border-radius: 5px;
  z-index: 100;
}
</style>