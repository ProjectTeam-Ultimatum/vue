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

const EPSG_3857 = 'EPSG:3857';


export default {
  name: 'MainMap',
  data() {
    return {
      olMap: undefined,
      address: '',
      iconsSource: undefined,
      locations: []
    }
  },
  mounted() {
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
    center: fromLonLat([127.1388684, 37.4449168]), // 경기도 성남
    zoom: 11
  })
});
EventBus.$on('getLocationsFromDB', (locations) => {
      this.locations = locations;
      this.addMapIcons(); // 가져온 위치 정보를 기반으로 지도에 아이콘을 추가합니다.
    });
this.olMap.on('click', async (e) => {
  await this.addUiAddress(e.coordinate);
  await addUiAddress.call(this); // 화살표 함수를 사용하여 this 컨텍스트를 유지합니다.
    drawMapIcon();
    console.log(toLonLat(e.coordinate));
    async function addUiAddress() {
    const lonLatArr = toLonLat(e.coordinate);
    const lon = lonLatArr[0];
    const lat = lonLatArr[1];
    const addressInfo = await this.getAddress(lon, lat) // this 컨텍스트를 유지하기 위해 call(this)를 사용합니다.
    this.setUiAddress(addressInfo.data.display_name);
    this.getAddress(lon, lat).then((addressInfo) => {
    EventBus.$emit('mapClick',{address: addressInfo.data.display_name.split(', ').reverse().join(' '), lon: lon, lat: lat});
    console.log("lon------" + lonLatArr[0])
    console.log("lat------" + lonLatArr[1])
    });
  }
  function drawMapIcon() {
        vectorSource.clear();
        geocoder.getSource().clear();
        const feature = new OlFeature({
            geometry: new OlPoint(e.coordinate)
        })
        feature.setStyle(new OlStyle({
            image: new OlIcon({
                scale: 0.7,
                src: '//cdn.rawgit.com/jonataswalker/map-utils/master/images/marker.png'
            })
        }))
        vectorSource.addFeature(feature);    
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
},
methods: {
  async addUiAddress(coordinate) {
      const lonLatArr = toLonLat(coordinate);
      const lon = lonLatArr[0];
      const lat = lonLatArr[1];
      const addressInfo = await this.getAddress(lon, lat);
      this.setUiAddress(addressInfo.data.display_name);
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

  // DB에서 가져온 각 위치 정보에 대해 아이콘을 추가합니다.
  this.locations.forEach(location => {
    const feature = new OlFeature({
      geometry: new OlPoint(fromLonLat([location.longitude, location.latitude]))
    });
    feature.setStyle(new OlStyle({
      image: new OlIcon({
        scale: 0.7,
        src: '//cdn.rawgit.com/jonataswalker/map-utils/master/images/marker.png'
      })
    }));

    vectorSource.addFeature(feature);
  });
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