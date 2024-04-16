<template>
  <div class="main-map" ref="map">
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
import OlIcon from 'ol/style/Icon.js';

import markerImage from '@/assets/images/jjang.png';

import OlLineString from 'ol/geom/LineString';
import { Stroke } from 'ol/style';

const EPSG_3857 = 'EPSG:3857';
export default {
  name: 'MainMap',
  data() {
    return {
      olMap: undefined,
      address: '',
      iconsSource: undefined,
      locations: [],
      vectorSource: undefined,
      title: '',
      grade: 0,
      review: '',
      category: ''
    }
  },
  mounted() {
    this.vectorSource = new OlVectorSource();
    this.fetchLocations();
    const vectorSource = new OlVectorSource(EPSG_3857);
    const vectorLayer = new OlVectorLayer({
    source: vectorSource
 })
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
  const [lon, lat] = toLonLat(e.coordinate);
  const addressInfo = await this.getAddress(lon, lat);
  if (addressInfo) {
    const displayAddress = this.getUiAddress(addressInfo.data.display_name);
    const point = fromLonLat([lon, lat]);
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
    } else {
      // Optionally update the feature if needed
      feature.setGeometry(new OlPoint(point));  // Update geometry or other properties
    }
    // Emit data only if the feature is newly added or needs to be updated
    EventBus.$emit('mapClick', {
      title: this.title,
      address: displayAddress,
      grade: this.grade,
      review: this.review,
      lonCopy: lon,
      latCopy: lat,
      image: this.image,
      category: this.category
    });
  } else {
    console.error('Failed to fetch address information');
  }
});
this.olMap.on('click', async (e) => {
            this.vectorSource.clear();
            geocoder.getSource().clear();
            const [lon, lat] = toLonLat(e.coordinate)
            const point = this.coordi4326To3857([lon, lat]);
            const feature = new OlFeature({
                geometry: new OlPoint(point)
            })
            feature.setStyle(new OlStyle({
                image: new OlIcon({
                    scale: 0.7,
                    src: '//cdn.rawgit.com/jonataswalker/map-utils/master/images/marker.png'
                })
            }))
                this.vectorSource.addFeature(feature);
        })
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
methods: {
  clearLocationData() {
    // UI에 표시된 정보 초기화
    this.title = '';
    this.addressCopy = '';
    this.grade = null;
    this.review = '';
    this.image = '';
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
    const response = await axios.get('http://localhost:8081/api/map/listMap');
    this.locations = response.data; // 응답 데이터를 locations 배열에 저장
    this.addMapIcons(); // 가져온 위치 정보를 기반으로 지도에 아이콘을 추가
    } catch (error) {
    console.error('Error fetching locations:', error);
    }
    console.log('Received locations:', this.locations);
  },
  
  getAddress (lon, lat) {
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
  });
  if (coordinates.length > 1) {
      const lineFeature = new OlFeature({
        geometry: new OlLineString(coordinates)
      });

      lineFeature.setStyle(new OlStyle({
        stroke: new Stroke({
          color: '#ffcc33',
          width: 2
        })
      }));

      vectorSource.addFeature(lineFeature);
    }

  this.olMap.on('click', (evt) => {
      const feature = this.olMap.forEachFeatureAtPixel(evt.pixel, (feature) => {
        return feature;
      });
      if (feature) {
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
    this.category = data.category;
    // 이외에 필요한 UI 업데이트 로직
  }
  }
  
}
</script>
<style>
.main-map {
  width: 100%;
  height: 100%;
  position: relative; /* 부모 요소를 기준으로 위치를 설정하기 위해 필요합니다. */
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
</style>