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
                  <input type="time" :id="'startTime' + index" v-model="daytime.startTime" @change="updateDaystime">
                </div>
                <div class="time-setting">
                  <label :for="'endTime' + index">종료</label>
                  <input type="time" :id="'endTime' + index" v-model="daytime.endTime" @change="updateDaystime">
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
          const formattedDate = this.formatDate(currentDate); // YYYY-MM-DD 형식으로 반환되는지 확인
          const weekDay = currentDate.toLocaleDateString('ko-KR', { weekday: 'short' }).replace('.', '');
          dates.push({
            dayNumber: dayCounter,
            dateFormatted: `${formattedDate}/${weekDay}`, // '/' 대신 '-'를 사용하던 부분을 수정
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
      if (!this.daystime.length) return 0;  // daystime 배열이 비어있으면 0을 반환

      return this.daystime.reduce((total, { startTime, endTime }) => {
        const start = this.parseTime(startTime);
        const end = this.parseTime(endTime);
        if (isNaN(start) || isNaN(end)) {
          console.error('Invalid date time found', { startTime, endTime });
          return total;
        }
        const duration = (end - start) / (3600 * 1000); // 밀리초 단위로 나누어 시간 단위로 변환
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

        const maxDate = new Date(this.selectedDates[0]);
        maxDate.setDate(maxDate.getDate() + 4); // 시작 날짜에서 4일을 더함 (총 5일)

        if (newDate >= firstSelectedDate && newDate <= maxDate) {
          this.selectedDates.push(formattedDate);
        } else {
          alert('최대 5일까지만 선택할 수 있습니다.');
        }
      }
      this.updateDaystime();
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
      return {
        '음식점': 'food',
        '관광지': 'place',
        '축제/행사': 'event'
      }[categoryName] || categoryName;
    },
    formatToLocalTime(time) {
      if (!time) return null;
      const [hours, minutes] = time.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) {
        console.error('Invalid time format:', time);
        return null;
      }
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
    },
    formatDateToISO(dateString) {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    },
    submitDates() {
      if (this.daystime.length === 0) {
        alert("시간 설정이 완료되지 않았습니다.");
        return;
      }

      const planRequest = {
        memberId: '회원ID',
        planStartDay: this.formatDateOnly(this.selectedDates[0]),
        planEndDay: this.formatDateOnly(this.selectedDates[this.selectedDates.length - 1]),
        planTitle: '여행 일정',
        planDays: this.daystime
      };

      axios.post('http://localhost:8080/api/plans/create', planRequest)
        .then(response => {
          const planId = response.data.planId;
          this.selectedItems.forEach(item => this.saveItem(planId, item));
        })
        .catch(error => {
          console.error("일정 저장 실패", error);
          alert('일정 저장에 실패했습니다: ' + error.message);
        });
    },
    validateAndSubmitPlan() {
      // planDays의 데이터 검증
      const isValidPlanDays = this.daystime.every(day => day.startTime && day.endTime);
      if (!isValidPlanDays) {
        alert("모든 일정의 시작 시간과 종료 시간을 입력해주세요.");
        return;
      }

      // 서버에 데이터 전송
      this.submitDates();
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
    formatDateOnly(date) {
      const d = new Date(date);
      return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
    },
    formatToISOTime(date, time) {
      try {
        const [hours, minutes] = time.split(':').map(Number);
        const dateParts = date.split('-').map(Number);
        if (dateParts.length !== 3 || hours === undefined || minutes === undefined) {
          console.error('Invalid date or time format', {date, time});
          return null;
        }
        const year = dateParts[0];
        const month = dateParts[1] - 1; // JavaScript의 Date는 0부터 시작하는 월을 사용합니다.
        const day = dateParts[2];
        const dateTime = new Date(year, month, day, hours, minutes);
        if (isNaN(dateTime.getTime())) {
          throw new Error('Invalid date or time provided');
        }
        return dateTime.toISOString().slice(11, 19); // "HH:mm:ss" 형식으로 변환
      } catch (error) {
        console.error('Error formatting date and time:', error);
        return null; // 오류 발생 시 null 반환
      }
    },
    formatStayTime(hours, minutes) {
      let hoursFormatted = hours.toString().padStart(2, '0');
      let minutesFormatted = minutes.toString().padStart(2, '0');

      return `${hoursFormatted}:${minutesFormatted}:00`;
    },
    savePlan(planRequest) {
      axios.post('http://localhost:8080/api/plans/create', planRequest)
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
      const categoryPath = this.getCategoryPath(item.category);
      const recommendIdKey = this.getIdFieldNameByCategory(item.category);
      const recommendId = item[recommendIdKey]; 

      const planData = {
        planId: planId,
        recommendFoodId: recommendId,
        recommendPlaceId: recommendId,
        recommendEventId: recommendId,
        stayTime: this.formatStayTime(item.durationHours, item.durationMinutes)
      };

      const apiUrl = `http://localhost:8080/api/plans/${categoryPath}/add`;

      axios.post(apiUrl, planData)
        .then(res => console.log(`${item.category} 저장 성공`, res))
        .catch(err => {
          console.error(`${item.category} 저장 오류`, err);
          alert(`저장 오류: ${item.category} - ${err.message}`);
          if (err.response) {
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
      this.daystime = this.formattedDateRange.map(day => {
        // 날짜 형식: "YYYY-MM-DD"
        const date = day.dateFormatted.split('/')[0];
        return {
          date: date,
          startTime: this.formatToDateTime(date, day.startTime),
          endTime: this.formatToDateTime(date, day.endTime)
        };
      });
      console.log("Updated daystime:", this.daystime);
    },
    trimAddress(address) {
        if (!address) return ""; // address가 null 또는 undefined인 경우 빈 문자열 반환
        return address.length > 16 ? `${address.substring(0, 14)}...` : address;
    },
    trimTitle(title) {
      return title.length > 24 ? `${title.substring(0, 20)}...` : title;
    },
    fetchData() {
      let baseUrl = 'http://localhost:8080/api/recommend/';
      let categoryPath = this.selectedCategory === 'all' ? 'listall' : `list${this.selectedCategory}`;
      let url = `${baseUrl}${categoryPath}`;

      axios.get(url)
        .then(response => {
          this.items = response.data.content.map(item => {
            const categoryKey = this.getCategoryKey(item);
            return {
              recommendFoodId: item[`${categoryKey}Id`],
              recommendEventId: item[`${categoryKey}Id`],
              recommendPlaceId: item[`${categoryKey}Id`],
              title: item[`${categoryKey}Title`],
              address: item[`${categoryKey}Address`],
              imgPath: item[`${categoryKey}ImgPath`],
              category: categoryKey.replace('recommend', '').toLowerCase()
            };
          });
        })
        .catch(error => console.error('Error fetching data:', error));
    },
    getCategoryKey(item) {
      if (item.recommendFoodId) return 'recommendFood';
      if (item.recommendPlaceId) return 'recommendPlace';
      if (item.recommendEventId) return 'recommendEvent';
      return null;
    },
    searchData() {
        let baseUrl;
        if (this.selectedCategory === 'all') {
            baseUrl = `http://localhost:8080/api/recommend/search/all`;
        } else {
            baseUrl = `http://localhost:8080/api/recommend/search/${this.selectedCategory}`;
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
      axios.get('http://localhost:8080/api/recommend/listhotel')
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
      let baseUrl = 'http://localhost:8080/api/recommend/search/hotel';
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
    getIdFieldNameByCategory(category) {
      return {
        'food': 'recommendFoodId',
        'place': 'recommendPlaceId',
        'event': 'recommendEventId'
      }[category];
    },
    addToSelected(item) {
      const recommendIdKey = this.getIdFieldNameByCategory(item.category);
      if (!this.selectedItems.some(selected => selected[recommendIdKey] === item[recommendIdKey])) {
        // 숫자가 아닌 값은 0으로 처리
        const newItemDuration = (parseFloat(item.durationHours) || 0) + (parseFloat(item.durationMinutes) || 0) / 60;
        const currentTotalDuration = parseFloat(this.calculateTotalItemDuration());
        const scheduledHours = parseFloat(this.totalScheduledHours);

        console.log(`New Item Duration: ${newItemDuration}, Current Total: ${currentTotalDuration}, Scheduled: ${scheduledHours}`);

        if (currentTotalDuration + newItemDuration <= scheduledHours) {
          this.selectedItems.push({
            ...item,
            order: this.selectedItems.length + 1,
            durationHours: 2,
            durationMinutes: 0,
          });
          this.updateTotalItemHours();
        } else {
          const currentHours = Math.floor(currentTotalDuration);
          const currentMinutes = Math.round((currentTotalDuration - currentHours) * 60);
          const scheduledMinutes = Math.round((scheduledHours - Math.floor(scheduledHours)) * 60);
          alert(`총 아이템 시간이 예정된 일정 시간을 초과합니다. (현재: ${currentHours}시간 ${currentMinutes}분, 예정: ${Math.floor(scheduledHours)}시간 ${scheduledMinutes}분)`);
        }
      }
    },
    calculateTotalItemDuration() {
      const total = this.selectedItems.reduce((sum, item) => {
        // 숫자 변환 실패 시 0으로 처리
        return sum + (parseFloat(item.durationHours) || 0) + (parseFloat(item.durationMinutes) || 0) / 60;
      }, 0);
      const hours = Math.floor(total);
      const minutes = Math.round((total - hours) * 60);
      return `${hours}시간 ${minutes}분`;
    },
    updateTotalItemHours() {
      let totalMinutes = this.selectedItems.reduce((sum, item) => sum + item.durationHours * 60 + item.durationMinutes, 0);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      this.totalItemHours = `${hours}시간 ${minutes.toString().padStart(2, '0')}분`;
      this.itemCount = this.selectedItems.length;  // 항목 수 업데이트
    },
    parseTime(timeString) {
      if (!timeString) {
        console.error('parseTime was called with a null or undefined time string');
        return new Date();
      }
      
      const parts = timeString.split(':');
      if (parts.length < 2) {
        console.error('Invalid time string:', timeString);
        return new Date();
      }

      const [hours, minutes] = parts.map(Number);
      const time = new Date();
      time.setHours(hours, minutes, 0, 0);
      return time;
    },
    formatToDateTime(date, time) {
      const [year, month, day] = date.split('-').map(Number);
      const [hours, minutes] = time.split(':').map(Number);
      const dateTime = new Date(year, month - 1, day, hours, minutes);
      return `${dateTime.getFullYear()}-${(dateTime.getMonth() + 1).toString().padStart(2, '0')}-${dateTime.getDate().toString().padStart(2, '0')}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
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