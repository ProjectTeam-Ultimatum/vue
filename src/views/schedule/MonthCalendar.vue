<template>
  <div class="schedulebackimg">
    <div class="schedulecontainer">
      <div v-if="currentStep === 1" class="STEP01">
        <div class="stepkey">
          <div>
            <div class="stepOn">&nbsp;&nbsp;STEP 1</div>
            <div class="stepOn1">날짜 확인</div>
          </div>
          <div>
            <div class="stepOff">&nbsp;&nbsp;STEP 2</div>
            <div class="stepOff1">장소 선택</div>
          </div>
          <div>
            <div class="stepOff">&nbsp;&nbsp;STEP 3</div>
            <div class="stepOff1">숙소 선택</div>
          </div>
        </div>
        <div class="calendar-plan">
          <div>
            <div class="scheduletitle1">여행 기간 설정</div>
            <div class="scheduletitle2">*최대 5일까지 설정 가능합니다*</div>
          </div>
          <div class="calendar">
            <!-- 현재 달 -->
            <div class="month-container">
              <nav>
                <h3>
                  <button @click="prevMonth">&lt;</button>
                  <span class="yearmonth">{{ cal.yearText }}년 {{ cal.monthText }}월</span>
                </h3>
                <div class="navs">
                </div>
              </nav>
              <section class="dow">
              <div
                v-for="(day, index) in days"
                :key="day"
                class="day"
                :class="{ 'sunday': index === 0, 'saturday': index === 6 }"
              >
                {{ day }}
              </div>
              </section>
              <section class="month-body">
                <div v-for="week in cal.getWeeks()" :key="week" class="week">
                  <div
                      v-for="date in week.days()"
                      :key="date"
                      class="cell"
                      @mouseover="onMouseover(date)"
                      :class="{
                        'today': cal.isToday(date),
                        'saturday-cell': date.weekOffset === 6,
                        'sunday-cell': date.weekOffset === 0,
                        'hide-date': cal.isOutOfBoundCurrentMonth(date),
                        'past-date': cal.isPastDate(date),
                        'in-range': isDateInRange(date),
                        'selected': isSelected(date),
                        'hover-selected': isHoverSelected(date),
                        'hover-in-range': isHoverInRange(date)
                      }"
                      @click="handleDateClick(date)"
                    >
                    <span class="date">{{ date.date }}</span>
                  </div>
                </div>
              </section>
            </div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
            <!-- 다음 달 -->
            <div class="month-container">
              <nav>
                <h3>
                  <span class="yearmonth">{{ cal.nextYearText }}년 {{ cal.nextMonthText }}월</span>
                  <button style="margin-left:85px;" @click="nextMonth">&gt;</button>
                </h3>
              </nav>
              <section class="dow">
                <div v-for="day in days" :key="day" class="day">{{ day }}</div>
              </section>
              <section class="month-body">
                <div v-for="week in cal.getNextMonthWeeks()" :key="week" class="week">
                  <div
                    v-for="date in week.days()"
                    :key="date"                                             
                    class="cell"
                    @mouseover="onMouseover(date)"
                      :class="{
                        'today': nextCal.isToday(date),
                        'next-month': cal.nextContainsDate(date),
                        'saturday-cell': date.weekOffset === 6,
                        'sunday-cell': date.weekOffset === 0,
                        'hide-date': cal.isOutOfBoundNextMonth(date),
                        'past-date': cal.isPastDate(date),
                        'in-range': isDateInRange(date),
                        'selected': isSelected(date),
                        'hover-selected': isHoverSelected(date),
                        'hover-in-range': isHoverInRange(date)
                      }"
                      @click="handleDateClick(date)"
                    >
                    <span class="date">{{ date.date }}</span>
                  </div>
                </div>
              </section>
              <button @click="currentStep = 2">다음</button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="currentStep === 2">
        <div class="stepkey">
          <div>
            <div class="stepOn">&nbsp;&nbsp;STEP 1</div>
            <div class="stepOn1">날짜 확인</div>
          </div>
          <div>
            <div class="stepOff">&nbsp;&nbsp;STEP 2</div>
            <div class="stepOff1">장소 선택</div>
          </div>
          <div>
            <div class="stepOff">&nbsp;&nbsp;STEP 3</div>
            <div class="stepOff1">숙소 선택</div>
          </div>
        </div>
        <div class="plantime">
          <div class="plantimetitle">{{ formattedSelectedDates }}
            <button>일정</button>
          </div>
          <div class="plandaytime"></div>
          <div class="time-settings">
            <div v-for="(daytime, index) in formattedDateRange" :key="index" class="day-container">
              <div class="date-title">{{ 'day' + daytime.dayNumber + ' ' + daytime.dateFormatted }}</div>
              <div class="time-range">
                <div class="time-setting">
                  <label :for="'startTime' + index">시작</label>
                  <input type="time" :id="'startTime' + index" v-model="daytime.startTime" @change="updateTotalScheduledHours">
                </div>
                <div class="time-setting">
                  <label :for="'endTime' + index">종료</label>
                  <input type="time" :id="'endTime' + index" v-model="daytime.endTime" @change="updateTotalScheduledHours">
                </div>
              </div>
            </div>
          </div>
          <button @click="currentStep = 3">다음</button>
        </div>
      </div>
      <div v-if="currentStep === 3" class="STEP02">
        <div class="stepkey">
          <div>
            <div class="stepOff">&nbsp;&nbsp;STEP 1</div>
            <div class="stepOff1">날짜 확인</div>
          </div>
          <div>
            <div class="stepOn">&nbsp;&nbsp;STEP 2</div>
            <div class="stepOn1">장소 선택</div>
          </div>
          <div>
            <div class="stepOff">&nbsp;&nbsp;STEP 3</div>
            <div class="stepOff1">숙소 선택</div>
          </div>
        </div>
        <div style="margin-left:-680px; color:grey">{{ formattedSelectedDates }}</div>
        <div class="selector">
          <div class="category-selector">
            <select v-model="selectedCategory" @change="fetchData">
              <option value="all">전체</option>
              <option value="place">관광지</option>
              <option value="food">음식점</option>
              <option value="event">축제</option>
            </select>
          </div>
          <div class="search-container">
            <input
              type="text"
              v-model="searchQuery"
              @keyup.enter="searchData"
              placeholder="장소명 검색"
              class="search-input"
            />
            <button @click="searchData" class="search-button">
              <i class="material-icons">search</i>
            </button>
          </div>
          <div>
            {{ itemCount }}개
            <br>
            {{ totalItemHours }}시간 / {{ formattedTotalScheduledHours  }}
          </div>
        </div>
        <div class="place-container">
          <div class="list-container">
            <div v-for="item in items" :key="item.title" class="list-item">
                <img :src="item.imgPath" :alt="item.title" class="item-image" @error="handleImageError"/>
                <div class="item-group">
                    <div class="item-title">{{ item.title }}</div>
                    <div class="item-description">{{ item.address }}</div>
                    <button @click="addToSelected(item, item.category)">+</button>
                </div>
            </div>
          </div>
          <div class="selected-items">
            <div v-for="(selected, index) in selectedItems" :key="selected.title" class="selected-item">
              <span>{{ selected.order }}.</span>
              <img :src="selected.imgPath" :alt="selected.title" class="selected-image" @error="handleImageError"/>
              <div>
                <div class="selected-title">{{ selected.title }}</div>
                <div class="selected-description">{{ selected.address }}</div>
                <div class="time-adjustment">머무는 시간 
                  <input type="number" v-model.number="selected.durationHours" @change="updateTotalItemHours" min="0" max="12"/>
                  시간
                  <input type="number" v-model.number="selected.durationMinutes" @change="updateTotalItemHours" min="0" max="59"/>
                  분
                </div>
                <button @click="removeItem(index)">X</button>
              </div>
            </div>
          </div>
        </div>
        <button @click="currentStep = 4">다음</button>
      </div>
      <div v-if="currentStep === 4" class="STEP03">
        <div class="stepkey">
          <div>
            <div class="stepOff">&nbsp;&nbsp;STEP 1</div>
            <div class="stepOff1">날짜 확인</div>
          </div>
          <div>
            <div class="stepOff">&nbsp;&nbsp;STEP 2</div>
            <div class="stepOff1">장소 선택</div>
          </div>
          <div>
            <div class="stepOn">&nbsp;&nbsp;STEP 3</div>
            <div class="stepOn1">숙소 선택</div>
          </div>
        </div>
        <div class="STEP3-container">
          <div class="STEP3-search">
            <input
              type="text"
              v-model="hotelSearchQuery"
              @keyup.enter="searchDatahotel"
              placeholder="숙소명 검색"
              class="hotel-search-input"
            />
            <button @click="searchDatahotel" class="search-button">
              <i class="material-icons">search</i>
            </button>
          </div>
          <div>
            {{ selectedHotelsMessage }}
          </div>
        </div>
        <div class="place-container">
          <div class="hotels-list">
            <div v-for="hotel in hotels" :key="hotel.id" class="hotel-item">
              <img :src="hotel.imgPath" :alt="hotel.title" class="hotel-image" @error="handleImageError" />
              <div class="hotel-group">
                <div class="item-title">{{ hotel.title }}</div>
                <div class="item-description">{{ hotel.address }}</div>
                <button @click="addToSelectedhotel(hotel)">+</button>
              </div>
            </div>
          </div>
          <div class="selected-items">
            <div v-for="(selected, index) in selectedHotels" :key="selected.title" class="selected-item">
              <span>{{ selected.order }}.</span>
              <img :src="selected.imgPath" :alt="selected.title" class="selected-image" @error="handleImageError"/>
              <div>
                <div class="selected-title">{{ selected.title }}</div>
                <div class="selected-description">{{ selected.address }}</div>
                <div>{{ selected.checkIn }} ~ {{ selected.checkOut }}</div>
                <button @click="removeHotelFromSelection(index)">X</button>
              </div>
            </div>
          </div>
        </div>
        <button @click="submitDates">일정 저장</button>
      </div>
    </div>
  </div>
</template>

<script>
import { Calendar } from './calendar.js';
import 'material-icons/iconfont/material-icons.css'; //npm install material-icons --save
import axios from 'axios';


export default {
  data() {
    return {
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth() + 1,
      selectedDates: [],
      hoveredDate: null,
      daystime: [],
      currentStep: 1,
      items: [],
      selectedCategory: 'all',
      searchQuery: '',
      loading: false,
      selectedItems: [],
      totalItemHours: 0,
      itemCount: 0,
      hotelSearchQuery: '',
      hotels: [],
      selectedHotels:[],
    };
  },
  created() {
      this.fetchData();
      this.fetchHotels();
  },
  computed: {
    cal() {
      return Calendar.fromYm(this.currentYear, this.currentMonth);
    },
    nextCal() {
      let nextYear = this.currentYear;
      let nextMonth = this.currentMonth + 1;
      if (nextMonth > 12) {
        nextYear++;
        nextMonth = 1;
      }
      return Calendar.fromYm(nextYear, nextMonth);
    },
    days() {
      return ['일', '월', '화', '수', '목', '금', '토'];
    },
    formattedSelectedDates() {
      if (this.selectedDates.length === 2) {
        return this.formatDateWithWeekday(this.selectedDates[0]) + ' ~ ' + this.formatDateWithWeekday(this.selectedDates[1]);
      }
      return '';
    },
    formattedDateRange() {
      if (this.selectedDates.length === 2) {
        const startDate = new Date(this.selectedDates[0]);
        const endDate = new Date(this.selectedDates[1]);
        let currentDate = new Date(startDate);
        let dayCounter = 1;
        const dates = [];

        while (currentDate <= endDate) {
          const formattedDate = this.formatDate(currentDate);
          const weekDay = currentDate.toLocaleDateString('ko-KR', { weekday: 'short' }).replace('.', '');
          dates.push({
            dayNumber: dayCounter,
            dateFormatted: `${formattedDate.substring(5).replace('-', '.')}/${weekDay}`,
            startTime: '10:00',
            endTime: '22:00',
          });
          currentDate.setDate(currentDate.getDate() + 1);
          dayCounter++;
        }
        
        return dates;
      }
      return [];
    },
    totalScheduledHours() {
      return this.daystime.reduce((total, { startTime, endTime }) => {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const duration = (end - start) / (3600 * 1000);
        return total + duration;
      }, 0);
    },
    formattedTotalScheduledHours() {
      const totalHours = this.totalScheduledHours;
      const hours = Math.floor(totalHours);
      const minutes = Math.round((totalHours - hours) * 60);
      return `${hours}시간 ${minutes}분`;
    },
    selectedHotelsMessage() {
      if (this.selectedDates.length === 2) {
        const startDate = new Date(this.selectedDates[0]);
        const endDate = new Date(this.selectedDates[1]);
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        const maxSelection = diffDays;

        return `${this.selectedHotels.length}일/${maxSelection}일`;
      }
      return "0/0"; // 기본값은 0/0으로 설정
    },
  },
  watch: {
      selectedDates: {
      immediate: true,
      handler() {
        this.updateDaystime();
      },
    },
  },
  calculateWidth() {
    return (length) => {
      return `calc(1000px / ${length})`;
    };
  },
  methods: {
    updateMonth(increment) {
      this.currentMonth += increment;
      if (this.currentMonth < 1) {
        this.currentYear--;
        this.currentMonth = 12;
      } else if (this.currentMonth > 12) {
        this.currentYear++;
        this.currentMonth = 1;
      }
    },
    prevMonth() {
      this.updateMonth(-1);
    },
    nextMonth() {
      this.updateMonth(1);
    },
    formatDate(date) {
      if (!(date instanceof Date)) {
        date = new Date(date);
      }
      const month = `${date.getMonth() + 1}`.padStart(2, '0');
      const day = `${date.getDate()}`.padStart(2, '0');
      return `${date.getFullYear()}-${month}-${day}`;
    },
    handleDateClick(date) {
      if (!this.isTodayOrFuture(date)) return;

      const formattedDate = this.formatDate(date.value);
      if (this.selectedDates.length === 0 || this.selectedDates.length === 2) {
        this.selectedDates = [formattedDate];
      } else if (this.selectedDates.length === 1) {
        const firstSelectedDate = new Date(this.selectedDates[0]);
        const newDate = new Date(formattedDate);
        if (newDate >= firstSelectedDate) {
          this.selectedDates.push(formattedDate);
        } else {
          this.selectedDates.unshift(formattedDate);
        }
      }
      this.updateDaystime();  // 여기서 updateDaystime을 명시적으로 호출합니다.
      console.log("선택된 날짜 업데이트 후:", this.selectedDates);
    },
    onMouseover(date) {
      this.hoveredDate = this.formatDate(date.value);
    },
    isTodayOrFuture(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date.value >= today;
    },
    isSelected(date) {
      const formattedDate = this.formatDate(date.value);
      return this.selectedDates.includes(formattedDate);
    },
    isDateInRange(date) {
      if (this.selectedDates.length < 2) return false;
      const startDate = new Date(this.selectedDates[0]);
      const endDate = new Date(this.selectedDates[1]);
      return date.value >= startDate && date.value <= endDate;
    },
    isHoverSelected(date) {
      if (!this.hoveredDate || this.selectedDates.length !== 1) return false;
      const hoverDate = new Date(this.hoveredDate);
      const selectedDate = new Date(this.selectedDates[0]);
      return date.value > selectedDate && date.value <= hoverDate;
    },
    isHoverInRange(date) {
      return this.isHoverSelected(date);
    },
    getCategoryPath(categoryName) {
      const categoryMap = {
        "음식점": "food",
        "관광지": "place",
        "축제/행사": "event"
      };
      return categoryMap[categoryName] || categoryName;
    },
    submitDates() {
      if (this.daystime.length === 0) {
        alert("시간 설정이 완료되지 않았습니다.");
        return;
      }
      this.savePlan(this.createPlanRequest());
      this.$router.push('/scheduleMap');
    },
    createPlanRequest() {
      return {
        memberId: '회원ID',
        planStartDay: this.selectedDates[0],
        planEndDay: this.selectedDates[this.selectedDates.length - 1],
        planTitle: '여행 일정',
        planDays: this.daystime
      };
    },
    formatStayTime(hours, minutes) {
      // 현재 날짜에 시간과 분을 설정하여 ISO8601 문자열로 반환
      const dateTime = new Date();
      dateTime.setHours(hours, minutes, 0);
      return dateTime.toISOString(); // 'YYYY-MM-DDTHH:MM:SS' 형식
    },
    savePlan(planRequest) {
      axios.post('http://localhost:8081/api/plans/create', planRequest)
        .then(response => {
          this.saveSelectedItems(response.data.planId);
        })
        .catch(error => {
          console.error("일정 저장 실패", error);
          alert('일정 저장에 실패했습니다: ' + error.message);
        });
    },
    saveSelectedItems(planId) {
      this.selectedItems.forEach(item => this.saveItem(planId, item));
    },
    saveItem(planId, item) {
      // 항목별 ID와 stayTime을 설정
      const planData = {
        planId: planId,
        recommendId: item.id, // 이는 각 항목의 ID, 예: recommend_food_id
        stayTime: this.formatStayTime(item.durationHours, item.durationMinutes) // LocalDateTime 형식으로 변환
      };

      // 각 카테고리에 맞는 API 경로를 가져옴
      const categoryPath = this.getCategoryPath(item.category);
      const apiUrl = `http://localhost:8081/api/plans/${categoryPath}/add`;

      // POST 요청으로 서버에 데이터 전송
      axios.post(apiUrl, planData)
        .then(res => console.log(`${item.category} 저장 성공`, res))
        .catch(err => {
          console.error(`${item.category} 저장 오류`, err);
          alert(`저장 오류: ${item.category} - ${err.message}`);
          if (err.response) {
            // 에러 응답 상세 정보 로깅
            console.log('에러 응답:', err.response.data);
          }
        });
    },
    formatDateWithWeekday(dateString) {
      const date = new Date(dateString);
      const options = { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' };
      const formattedDate = date.toLocaleDateString('ko-KR', options);
      return formattedDate.replace(/(\d{4})\.(\d{2})\.(\d{2})\.(\w+)/, '$1.$2.$3($4)');
    },
    generateDateRange(startDate, endDate) {
    let currentDate = new Date(startDate);
    const dates = [];
    let dayCounter = 1;

      while (currentDate <= new Date(endDate)) {
        const formattedDate = this.formatDate(currentDate);
        const weekDay = currentDate.toLocaleDateString('ko-KR', { weekday: 'short' }).replace('.', '');
        dates.push(`day${dayCounter} ${formattedDate.substring(5).replace('-', '.')}/${weekDay}`);
        currentDate.setDate(currentDate.getDate() + 1);
        dayCounter++;
      }

      return dates.join(', ');
    },
    updateDaystime() {
      this.daystime = this.formattedDateRange.map(day => ({
        date: `${this.currentYear}-${day.dateFormatted.substring(0, 5).replace('.', '-')}`,
        startTime: this.formatToDateTime(`${this.currentYear}-${day.dateFormatted.substring(0, 5).replace('.', '-')}`, day.startTime),
        endTime: this.formatToDateTime(`${this.currentYear}-${day.dateFormatted.substring(0, 5).replace('.', '-')}`, day.endTime)
      }));
      console.log("daystime updated:", this.daystime);
    },
    trimAddress(address) {
        if (!address) return ""; // address가 null 또는 undefined인 경우 빈 문자열 반환
        return address.length > 16 ? `${address.substring(0, 14)}...` : address;
    },
    trimTitle(title) {
      return title.length > 24 ? `${title.substring(0, 20)}...` : title;
    },
    fetchData() {
      let baseUrl = 'http://localhost:8081/api/recommend/';
      let categoryPath = this.selectedCategory === 'all' ? 'listall' : `list${this.selectedCategory}`;
      let url = `${baseUrl}${categoryPath}`;

      let params = new URLSearchParams();
      if (this.searchQuery) {
        params.append('search', this.searchQuery);
      }
      url += params.toString() ? `?${params.toString()}` : '';

      axios.get(url)
        .then(response => {
          this.items = response.data.content.map(item => ({
            title: this.trimTitle(item.recommendFoodTitle || item.recommendPlaceTitle || item.recommendEventTitle),
            address: this.trimAddress(item.recommendPlaceAddress || item.recommendFoodAddress || item.recommendEventAddress),
            imgPath: item.recommendFoodImgPath || item.recommendPlaceImgPath || item.recommendEventImgPath,
            category: item.recommendFoodCategory || item.recommendPlaceCategory || item.recommendEventCategory,
          }));
        })
        .catch(error => console.error('Error fetching data:', error));
    },
    searchData() {
        let baseUrl;
        if (this.selectedCategory === 'all') {
            baseUrl = `http://localhost:8081/api/recommend/search/all`;
        } else {
            baseUrl = `http://localhost:8081/api/recommend/search/${this.selectedCategory}`;
        }
        const params = new URLSearchParams({ title: this.searchQuery }).toString();
        axios.get(`${baseUrl}?${params}`)
            .then(response => {
                console.log(response.data);  // 데이터 구조 확인을 위한 로그
                this.items = response.data.map(item => ({
                    title: this.trimTitle(item.title || item.recommendPlaceTitle || item.recommendFoodTitle || item.recommendEventTitle),
                    address: this.trimAddress(item.address || item.recommendPlaceAddress || item.recommendFoodAddress || item.recommendEventAddress),
                    imgPath: item.imgPath || item.recommendPlaceImgPath || item.recommendFoodImgPath || item.recommendEventImgPath
                }));
            })
            .catch(error => console.error('Search error:', error));
    },
    fetchHotels() {
      axios.get('http://localhost:8081/api/recommend/listhotel')
      .then(response => {
          this.hotels = response.data.content.map(hotels => ({
            title: this.trimTitle(hotels.recommendHotelTitle),
            address: this.trimAddress(hotels.recommendHotelAddress),
            imgPath: hotels.recommendHotelImgPath
          }));
        })
        .catch(error => {
          console.error('Error fetching hotels:', error);
        });
    },
    searchDatahotel() {
      let baseUrl = 'http://localhost:8081/api/recommend/search/hotel';
      const params = new URLSearchParams({ title: this.hotelSearchQuery }).toString();
      axios.get(`${baseUrl}?${params}`)
        .then(response => {
            console.log(response.data);  // 데이터 구조 확인을 위한 로그
            this.hotels = response.data.map(hotels => ({
                title: this.trimTitle(hotels.recommendHotelTitle),
                address: this.trimAddress(hotels.recommendHotelAddress),
                imgPath: hotels.recommendHotelImgPath
            }));
        })
        .catch(error => {
          console.error('Hotel search error:', error);
        });
    },
    addToSelected(item, category) {
      if (!this.selectedItems.find(selected => selected.title === item.title)) {
        this.selectedItems.push({
          ...item,
          category: category, // category를 여기서 설정합니다.
          order: this.selectedItems.length + 1,
          durationHours: 2,
          durationMinutes: 0
        });
        this.itemCount = this.selectedItems.length;
        this.updateTotalItemHours();
      }
    },
    updateTotalItemHours() {
      let totalMinutes = this.selectedItems.reduce((sum, item) => {
        return sum + item.durationHours * 60 + item.durationMinutes;
      }, 0);

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      this.totalItemHours = `${hours}시간 ${minutes.toString().padStart(2, '0')}분`;
    },
    calculateTotalScheduledHours() {
      if (!this.daystime || this.daystime.length === 0) {
        return 0;
      }

      let totalHours = 0;
      this.daystime.forEach(daytime => {
        const startTime = this.parseTime(daytime.startTime);
        const endTime = this.parseTime(daytime.endTime);
        const duration = (endTime - startTime) / (1000 * 60 * 60); // 시간으로 변환
        totalHours += duration;
      });

      return totalHours;
    },
    parseTime(timeString) {
      const [hours, minutes] = timeString.split(':');
      const time = new Date();
      time.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      return time;
    },
    formatToDateTime(date, time) {
      const [hours, minutes] = time.split(':');
      const formattedDate = new Date(date);
      formattedDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      return formattedDate.toISOString().slice(0, 19); // "YYYY-MM-DDTHH:mm:ss" 형식으로 변환
    },
    removeItem(index) {
      this.selectedItems.splice(index, 1);
      this.selectedItems.forEach((item, idx) => {
        item.order = idx + 1;
      });
      this.itemCount = this.selectedItems.length;
      this.updateTotalItemHours();
    },
    addHoursToItem(item, startTime, endTime) {
      const duration = this.calculateDuration(startTime, endTime);
      this.totalItemHours += duration;
      item.duration = duration;
    },
    calculateDuration(startTime, endTime) {
      const start = new Date('2024-01-01 ' + startTime);
      const end = new Date('2024-01-01 ' + endTime);
      return (end - start) / (1000 * 60 * 60);
    },
    formatStayDate(date) {
      const month = `${date.getMonth() + 1}`.padStart(2, '0');
      const day = `${date.getDate()}`.padStart(2, '0');
      const weekday = date.toLocaleDateString('ko-KR', { weekday: 'short' }).replace('.', '');
      return `${month}.${day}(${weekday})`;
    },
    addToSelectedhotel(hotel) {
      const startDate = new Date(this.selectedDates[0]);
      const endDate = new Date(this.selectedDates[1]);
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (this.selectedHotels.length < diffDays) {
        const checkInDate = new Date(startDate);
        checkInDate.setDate(checkInDate.getDate() + this.selectedHotels.length);
        const checkOutDate = new Date(checkInDate);
        checkOutDate.setDate(checkOutDate.getDate() + 1);

        this.selectedHotels.push({
          ...hotel,
          order: this.selectedHotels.length + 1,
          checkIn: this.formatStayDate(checkInDate),
          checkOut: this.formatStayDate(checkOutDate),
        });
        alert(`호텔이 선택되었습니다. (${this.selectedHotels.length}/${diffDays}개 선택됨)`);
      } else {
        alert(`최대 ${diffDays}개의 호텔을 선택할 수 있습니다.`);
      }
    },
    removeHotelFromSelection(index) {
      this.selectedHotels.splice(index, 1);
      this.selectedHotels.forEach((hotel, idx) => {
        const newCheckInDate = new Date(this.selectedDates[0]);
        newCheckInDate.setDate(newCheckInDate.getDate() + idx);
        const newCheckOutDate = new Date(newCheckInDate);
        newCheckOutDate.setDate(newCheckOutDate.getDate() + 1);

        hotel.order = idx + 1;
        hotel.checkIn = this.formatStayDate(newCheckInDate);
        hotel.checkOut = this.formatStayDate(newCheckOutDate);
      });
      alert('호텔 선택이 취소되었습니다.');
    },
  },
};
</script>


<style lang="scss" scoped>
.schedulebackimg {
  background-image: url('~@/assets/map.jpg');
  background-size: cover;
  background-position: center;
  margin: -8px -8px;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.schedulecontainer {
  background-color: white;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column; /* 세로 정렬 */
  align-items: center; /* 가운데 정렬 */
  justify-content: space-between;
  width: 1000px;
  height: 700px;
  border-radius: 10px;
  padding: 20px;
}

.schedulecontainer > div {
  flex: 1;
}

.schedulecontainer .stepkey {
  width: 100%; /* 너비를 컨테이너의 너비와 같게 설정 */
  display: flex;
  justify-content: center; /* 가로 방향 중앙 정렬 */
}

.stepOn {
color:rgb(99, 145, 197);
font-size:30px;
margin-left: 100px; /* 왼쪽 내부 여백 */
margin-right: 100px; /* 오른쪽 내부 여백 */
}

.stepOff {
color: #999;
font-size:30px;
margin-left: 100px; /* 왼쪽 내부 여백 */
margin-right: 100px; /* 오른쪽 내부 여백 */
}

.stepOn1{
  color:rgb(99, 145, 197);
  font-size:19px;
}

.stepOff1 {
  color: #999;
  font-size:19px;
}

.scheduletitle1 {
  position: absolute;
  margin: 10px 400px;
  font-size: 25px;

}

.scheduletitle2 {
  position: absolute;
  color:grey;
  margin: 40px 370px;
}

.yearmonth{
  font-size:30px;
  margin-left:150px;
}

$border-color: #efefef;
.calendar {
  display: flex;
  position: absolute;
  justify-content: center; // 가운데 정렬
  align-items: flex-start; // 상단에 정렬
  width: 80%; // 전체 너비의 80%를 사용
  margin-top: 70px;
  margin-left: -15px;
  max-width: 1024px; // 최대 너비를 제한
}
.month-container {
  display: flex; // flex item 설정
  flex-direction: column; // 세로로 배치
  width: 50%; // 너비를 50%로 설정하여 화면의 절반을 차지
  nav {
    h3 {
      margin: 0;
    }
  }
  section {
    &.dow {
      display: flex;

      .day {
        margin-top:30px;
        flex: 1 1 calc(100% / 7);
        width: calc(100% / 7);
        padding: 12px;
        text-align: center;
        font-size: 21px;
      }
    }
    &.month-body {
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      .week {
        display: flex;
        flex-direction: row;
        flex: 1 1 auto;
        height: calc(100% / 6);

        .cell {
          flex: 1 1 calc(100% / 7);
          width: calc(100% / 7);
          position: relative;
          &.today {
            .date {
              background-color: #93b3c9;
              width:50px;
              height: 50px;
              color: #ffffff;
              border-radius: 10px;
              margin: 4px 6px;
            }
          }
          .date {
            margin:15px 16px;
            font-size: 19px;
            display: flex;
            width: 28px;
            height: 28px;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
  }
}

.saturday-cell .date {
  color: #0064bb;
}

.sunday-cell .date {
  color: #ff002f;
}
.hide-date {
  visibility: hidden;
}

.month-body .cell.past-date .date {
  background-color: transparent;
  color: #ccc;
}

.month-body .cell.selected .date {
  background-color: orange !important; /* 첫 번째 선택된 날짜 */
}

.month-body .cell.hover-selected .date {
  background-color: orange !important; /* 마우스 오버된 날짜 */
}

.month-body .cell.in-range .date {
  background-color: yellow; /* 선택된 날짜 범위 */
}

.month-body .cell.hover-in-range .date {
  background-color: yellow; /* 마우스 오버된 날짜 범위 */
}

.plantime {
  position: absolute;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column; /* 세로 정렬 */
  align-items: center; /* 가운데 정렬 */
  margin-top: 100px;
  justify-content: space-between;
}

.plantime > div{
  flex: 1;
}

.plantime .plantimetitle {
  text-align: center;
  width: 100%;
  font-size: 22px;
}

.plantimetitle button {
  margin-left: 10px;
}

.plantime .plandaytime {
  width: calc(1000px / n);
  text-align: center;
  font-size: 25px;
}

.time-settings {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .day-container {
    margin: 10px;
    border: 1px solid #ddd;
    padding: 10px;
    .date-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .time-range {
      display: flex;
      flex-direction: column;
      .time-setting {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
        label {
          margin-right: 5px;
        }
        input[type="time"] {
          border: 1px solid #ccc;
          padding: 5px;
          border-radius: 4px;
        }
      }
    }
  }
}

.selector{
  display : flex;
}

.category-selector select {
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-top: 10px;
}

.search-container {
  display: flex;
  padding: 5px;
  width: 260px;
  height: 23px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.search-input {
  flex-grow: 1;
  padding: 8px;
  border: none; /* 기본 테두리 제거 */
  outline: none; /* 선택 시 외곽선 제거 */
}

.search-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center; /* 버튼 내 아이콘 세로 중앙 정렬 */
  justify-content: center; /* 버튼 내 아이콘 가로 중앙 정렬 */
}

.search-button i {
  color: #5b59bd; /* 아이콘 색상 */
  font-size: 24px; /* 아이콘 크기 */
}

.place-container {
  display: flex;
}

.list-container {
  height: 530px;
  width: 360px;
  overflow-y: auto;
  margin-top: 20px;
}

.list-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.item-group{
  flex-direction: column;
  text-align: left;
}

.item-image {
  width: 70px;
  height: 70px;
  object-fit: cover;
  margin-right: 10px;
  border-radius: 7px;
}

.item-title {
  font-size: 14px;
  font-weight: bold;
}

.item-description {
  font-size: 12px;
  color: #666;
}

.selected-items {
  height: 530px;
  width: 630px;
  overflow-y: auto;
  margin-top: 20px;
  margin-left: 20px;
}

.selected-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    height: 70px;
    padding: 10px;
    background-color: #f8f8f8;
    border: 1px solid #ddd;
    border-radius: 5px;
    text-align: left;
}

.selected-image {
    width: 45px;
    height: 45px;
    margin-right: 10px;
    object-fit: cover;
    border-radius: 50%;
}

.selected-title {
    font-size: 14px;
    font-weight: bold;
}

.selected-description {
    font-size: 12px;
    color: #666;
    margin-top: 5px;
}

.item-group button,
.hotel-group button {
    padding: 5px 10px;
    margin-top: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.item-group button:hover {
    background-color: #0056b3;
}

.STEP3-search {
  display: flex;
  padding: 5px;
  width: 350px;
  height: 23px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.hotel-search-input {
  flex-grow: 1;
  padding: 8px;
  border: none;
  outline: none;
}

.hotels-list{
  height: 530px;
  width: 360px;
  overflow-y: auto;
  margin-top: 20px;
}

.hotel-item{
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.hotel-group{
  flex-direction: column;
  text-align: left;
}

.hotel-image {
  width: 70px;
  height: 70px;
  object-fit: cover;
  margin-right: 10px;
  border-radius: 7px;
}
</style>