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
        <div>
          <div>
            <div class="scheduletitle1">여행 기간 설정</div>
            <div class="scheduletitle2">*최대 5일까지 설정 가능합니다*</div>
          </div>
          <div class="calendar">
            <div class="month-container">
              <nav>
                <h3>
                </h3>
                <div class="navs">
                  <span class="monthbutton1" @click="prevMonth"><font-awesome-icon icon="fa-solid fa-chevron-left" /></span>
                  <span class="yearmonth">{{ cal.yearText }}년 {{ cal.monthText }}월</span>
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
                  @click="handleDateClick(date)"
                  :class="{
                    'today': cal.isToday(date),
                    'today-not-selected': cal.isToday(date) && !isSelected(date),
                    'next-month': cal.isOutOfBoundCurrentMonth(date),
                    'saturday-cell': date.weekOffset === 6,
                    'sunday-cell': date.weekOffset === 0,
                    'hide-date': cal.isOutOfBoundCurrentMonth(date),
                    'past-date': cal.isPastDate(date),
                    'in-range': isDateInRange(date),
                    'selected': isSelected(date),
                    'hover-selected': isHoverSelected(date),
                    'hover-in-range': isHoverInRange(date),
                  }"
                >
                    <span class="date">{{ date.date }}</span>
                  </div>
                </div>
              </section>
            </div>
            <div class="month-container">
              <nav>
                <span class="yearmonth">{{ cal.nextYearText }}년 {{ cal.nextMonthText }}월</span>
                <span class="monthbutton2" @click="nextMonth"><font-awesome-icon icon="fa-solid fa-chevron-right" /></span>
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
                      @click="handleDateClick(date)"
                      :class="{
                        'today': nextCal.isToday(date),
                        'today-not-selected': nextCal.isToday(date) && !isSelected(date),
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
                    >
                    <span class="date">{{ date.date }}</span>
                  </div>
                </div>
              </section>
              <div style="display:flex; justify-content:right;">
                <button class="nextbutton" @click="currentStep = 2">다음</button>
              </div>
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
          <div class="plantimetitle">{{ formattedSelectedDates }}&nbsp;
            <span @click="currentStep = 1" style="font-size: 25px; cursor: pointer;"><font-awesome-icon icon="fa-solid fa-calendar-days" /></span>
          </div>
          <div class="time-settings">
            <div v-for="(daytime, index) in formattedDateRange" :key="index" class="day-container">
              <span class="date-title1">{{ 'day' + (index + 1) }}</span>&nbsp;&nbsp;
              <span class="date-title2">{{ simpleday(daytime.dateFormatted.split('/')[0]) }}</span>
              <div class="time-range">
                <div class="time-setting">
                  <div :for="'startTime' + index">시작</div>
                  <input type="time" :id="'startTime' + index"
                    :value="displayedTimes[index].startTime"
                    @input="handleTimeChange($event, index, 'startTime')">
                </div>
                <div class="time-setting">
                  <div :for="'finishTime' + index">종료</div>
                  <input type="time" :id="'finishTime' + index"
                    :value="displayedTimes[index].finishTime"
                    @input="handleTimeChange($event, index, 'finishTime')">
                </div>
                <div class="simpletime">{{ displayedTimes[index].startTime }} ~ {{ displayedTimes[index].finishTime }} ({{ calculateDuration(displayedTimes[index].startTime, displayedTimes[index].finishTime) }})</div>
              </div>
            </div>
          </div>
        </div>
        <button class="nextbutton" style="margin-top:117px; margin-left:858px;" @click="currentStep = 3">다음</button>
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
                <div>
                  <div class="item-title">{{ item.title }}</div>
                  <div class="item-description">{{ item.address }}</div>
                </div>
                <button
                  v-if="item.selected"
                  @click="removeItem(findIndexInSelectedItems(item))"
                  class="selected-button">
                  <font-awesome-icon icon="fa-solid fa-check" />
                </button>
                <button
                  v-else
                  @click="addToSelected(item)"
                  class="add-button">
                  +
                </button>
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
              <div class="item-group">
                <div>
                  <div class="item-title">{{ hotel.title }}</div>
                  <div class="item-description">{{ hotel.address }}</div>
                </div>
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
        <button @click="submitPlan">일정 저장</button>
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
      displayedTimes: [],
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
      planDays: [],
      planId: null,
    };
  },
  created() {
      this.fetchData();
      this.fetchHotels();
      this.initializeDisplayTimes();
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
            dateFormatted: `${formattedDate}/${weekDay}`,
            startTime: '10:00',
            finishTime: '22:00',
          });
          currentDate.setDate(currentDate.getDate() + 1);
          dayCounter++;
        }
        return dates;
      }
      return [];
    },
    totalScheduledHours() {
      if (!this.daystime.length) return 0;
      return this.daystime.reduce((total, { startTime, finishTime }) => {
        const start = this.parseTime(startTime);
        const end = this.parseTime(finishTime);
        if (!start || !end) return total; // parseTime에서 null이 반환된 경우 무시
        const duration = (end - start) / (3600 * 1000);
        return total + duration;
      }, 0);
    },
    formattedTotalScheduledHours() {
      const totalHours = this.totalScheduledHours;
      if (isNaN(totalHours) || totalHours === 0) {
        return "0시간 0분"; // NaN이나 0시간 처리
      }
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
    formattedDateRange: {
      deep: true,
      immediate: true,
      handler(newVal) {
        this.displayedTimes = newVal.map(day => ({
          startTime: day.startTime,
          finishTime: day.finishTime
        }));
      }
    },
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
        '축제/행사': 'event',
        '숙박': 'hotel'
      }[categoryName] || categoryName;
    },
    formatToLocalTime(time) {
      const [hours, minutes] = time.split(':').map(Number);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
    },
    formatDateToISO(dateString) {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    },
    simpleday(dateString) {
      const [year, month, day] = dateString.split('-');
      const date = new Date(year, month - 1, day);
      const weekDay = date.toLocaleDateString('ko-KR', { weekday: 'short' }).replace('.', '');
      return `${parseInt(month)}.${parseInt(day)}/${weekDay}`;
    },
    initializeDisplayTimes() {
      this.displayedTimes = this.formattedDateRange.map(day => ({
        startTime: day.startTime,
        finishTime: day.finishTime
      }));
    },
    handleTimeChange(event, index, type) {
    const newTime = event.target.value;
    
    // Directly assign new values to properties
    this.displayedTimes[index][type] = newTime;

    // Update daystime accordingly
    if (type === 'startTime') {
      this.daystime[index].startTime = this.formatDateToISOTime(newTime);
    } else if (type === 'finishTime') {
      this.daystime[index].finishTime = this.formatDateToISOTime(newTime);
    }

    // Recalculate the display duration if both times are present
    const startTime = this.displayedTimes[index].startTime;
    const finishTime = this.displayedTimes[index].finishTime;
    if (startTime && finishTime) {
      this.displayedTimes[index].displayDuration = this.calculateDuration(startTime, finishTime);
    }

    // Force update to ensure reactivity
    this.displayedTimes = [...this.displayedTimes];
    this.daystime = [...this.daystime];
  },
    updateDisplayTimes() {
      this.displayedTimes = this.displayedTimes.map((day, index) => ({
        ...day,
        displayDuration: this.calculateDuration(this.formattedDateRange[index].startTime, this.formattedDateRange[index].finishTime)
      }));
    },
    saveHotel(planDayId, hotel) {
      const hotelData = {
        planDayId: planDayId, // 저장된 planId 사용
        recommendHotelId: hotel.recommendHotelId,
      };

      axios.post('http://localhost:8080/api/plans/hotel/add', hotelData)
        .then(response => {
          console.log("호텔 저장 성공:", response.data);
        })
        .catch(error => {
          console.error("호텔 저장 실패", error);
          alert('호텔 저장에 실패했습니다: ' + error.message);
        });
    },
    formatDateToISOTime(time) {
      // Ensure the time is in HH:mm format, then convert it to HH:mm:ss for backend compatibility
      const [hours, minutes] = time.split(':').map(Number);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
    },
    submitDates() {
      if (this.daystime.length === 0) {
        alert("시간 설정이 완료되지 않았습니다.");
        return;
      }

      const planDaysFormatted = this.daystime.map(day => ({
        date: day.date,
        startTime: this.formatToLocalTime(day.startTime),
        finishTime: this.formatToLocalTime(day.finishTime)
      }));

      // 여기에 selectedItems와 selectedHotels 정보를 추가합니다.
      const planRequest = {
        memberId: '회원ID',
        planStartDay: this.formatDateOnly(this.selectedDates[0]),
        planEndDay: this.formatDateOnly(this.selectedDates[this.selectedDates.length - 1]),
        planTitle: '여행 일정',
        planDays: planDaysFormatted,
        items: this.selectedItems,
        hotels: this.selectedHotels
      };

      axios.post('http://localhost:8080/api/plans/create', planRequest)
      .then(response => {
        if (response.data && response.data.planId) {
          const planId = response.data.planId;
          this.planId = planId;
          console.log("Plan created successfully with ID:", planId);
        } else {
          console.error("Plan ID not found in the response");
          alert("일정 생성 응답에서 ID를 찾을 수 없습니다.");
        }
      })
      .catch(error => {
        console.error("일정 저장 실패", error);
        alert('일정 저장에 실패했습니다: ' + error.message);
      });
    },
    submitPlan() {
      const planRequest = {
        memberId: '회원ID',
        planStartDay: this.formatDateOnly(this.selectedDates[0]),
        planEndDay: this.formatDateOnly(this.selectedDates[this.selectedDates.length - 1]),
        planTitle: '여행 일정',
        planDays: this.daystime.map(day => ({
          date: this.formatDateOnly(day.date),
          startTime: this.formatToLocalTime(day.startTime),
          finishTime: this.formatToLocalTime(day.finishTime)
        })),
        planFoods: this.selectedItems.filter(item => item.category === 'food').map(item => ({
          recommendFoodId: item.recommendFoodId,
          stayTime: this.formatToLocalTime(item.durationHours + ':' + item.durationMinutes)
        })),
        planPlaces: this.selectedItems.filter(item => item.category === 'place').map(item => ({
          recommendPlaceId: item.recommendPlaceId,
          stayTime: this.formatToLocalTime(item.durationHours + ':' + item.durationMinutes)
        })),
        planEvents: this.selectedItems.filter(item => item.category === 'event').map(item => ({
          recommendEventId: item.recommendEventId,
          stayTime: this.formatToLocalTime(item.durationHours + ':' + item.durationMinutes)
        })),
        planHotels: this.selectedHotels.map(hotel => ({
          recommendHotelId: hotel.recommendHotelId,
          planDayId: hotel.planDayId  // 주의: planDayId 는 해당 호텔 예약에 해당하는 날짜에 매핑되어야 함
        }))
      };

      axios.post('http://localhost:8080/api/plans/create', planRequest)
      .then(response => {
        this.planId = response.data.planId;
        console.log("Plan created successfully with ID:", this.planId);
      })
      .catch(error => {
        console.error("Failed to save the plan", error);
        alert('Failed to save the plan: ' + error.message);
      });
    },
    updateDaystime() {
      this.daystime = this.formattedDateRange.map((day, index) => {
        const date = day.dateFormatted.split('/')[0];
        const startTime = this.formatDateToISOTime(day.startTime);
        const finishTime = this.formatDateToISOTime(day.finishTime);
        const duration = this.calculateDuration(startTime, finishTime);

        // displayedTimes 배열 업데이트
        this.updateDisplayedTime(index, startTime, finishTime, duration);

        return {
          date: date,
          startTime: startTime,
          finishTime: finishTime
        };
      });
      console.log("Updated daystime:", this.daystime);
    },
    updateDisplayedTime(index, startTime, finishTime, duration) {
      if (!this.displayedTimes[index]) {
        this.displayedTimes[index] = { startTime, finishTime, displayDuration: '' };
      }
      this.displayedTimes[index].startTime = startTime;
      this.displayedTimes[index].finishTime = finishTime;
      this.displayedTimes[index].displayDuration = `${duration}시간`;
    },
    formatToISODateTime(date, time) {
      if (!time) return null;
      
      // 시간이 'HH:MM' 형식인지 검사합니다.
      const [hours, minutes] = time.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) {
        console.error('Invalid time format:', time);
        return null;
      }

      // 날짜 객체 생성
      const dateTime = new Date(date);
      dateTime.setHours(hours, minutes, 0);
      
      // ISO 8601 형식으로 변환
      return dateTime.toISOString();
    },
    formatDateOnly(date) {
      const d = new Date(date);
      return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
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
      console.log(`Adding item in category: ${item.category}, Path: ${categoryPath}, ID: ${recommendId}`); // 로그 추가

      const planData = {
        plan: { id: this.planId },
        recommendFoodId: recommendId,
        recommendPlaceId: recommendId,
        recommendEventId: recommendId,
        recommendHotelId: recommendId,
        stayTime: this.formatStayTime(item.durationHours, item.durationMinutes)
      };

      const apiUrl = `http://localhost:8080/api/plans/${categoryPath}/add`;
      console.log(`Sending data to ${apiUrl}:`, planData); // 데이터 로깅

      axios.post(apiUrl, planData)
        .then(res => {
          console.log(`${item.category} 저장 성공`, res);
        })
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

    trimAddress(address) {
        if (!address) return ""; // address가 null 또는 undefined인 경우 빈 문자열 반환
        return address.length > 18 ? `${address.substring(0, 16)}...` : address;
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
              selected: false,
              recommendFoodId: item[`${categoryKey}Id`],
              recommendEventId: item[`${categoryKey}Id`],
              recommendPlaceId: item[`${categoryKey}Id`],
              title: this.trimTitle(item[`${categoryKey}Title`]), // title을 trimTitle로 처리
              address: this.trimAddress(item[`${categoryKey}Address`]), // address를 trimAddress로 처리
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
            this.hotels = response.data.content.map(hotel => ({
              recommendHotelId: hotel.recommendHotelId,
              title: this.trimTitle(hotel.recommendHotelTitle),
              address: this.trimAddress(hotel.recommendHotelAddress),
              imgPath: hotel.recommendHotelImgPath,
              category: 'hotel'
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
        'event': 'recommendEventId',
        'hotel': 'recommendHotelId'
      }[category];
    },
    addToSelected(item) {
      const recommendIdKey = this.getIdFieldNameByCategory(item.category);
      if (!this.selectedItems.some(selected => selected[recommendIdKey] === item[recommendIdKey])) {
        item.selected = true;
        const newItemDuration = (parseFloat(item.durationHours) || 0) + (parseFloat(item.durationMinutes) || 0) / 60;
        const currentTotalDuration = parseFloat(this.calculateTotalItemDuration());
        const scheduledHours = parseFloat(this.totalScheduledHours);

        console.log(`New Item Duration: ${newItemDuration}, Current Total: ${currentTotalDuration}, Scheduled: ${scheduledHours}`);

        if (currentTotalDuration + newItemDuration <= scheduledHours) {
          this.selectedItems.push({
            ...item,
            order: this.selectedItems.length + 1,
            durationHours: item.durationHours || 2, // 기본값이 2시간이지만 item에 설정된 값이 있으면 그 값을 사용
            durationMinutes: item.durationMinutes || 0
          });
          this.updateTotalItemHours();
        } else {
          const currentHours = Math.floor(currentTotalDuration);
          const currentMinutes = Math.round((currentTotalDuration - currentHours) * 60);
          const scheduledMinutes = Math.round((scheduledHours - Math.floor(scheduledHours)) * 60);
          alert(`총 아이템 시간이 예정된 일정 시간을 초과합니다. (현재: ${currentHours}시간 ${currentMinutes}분, 예정: ${Math.floor(scheduledHours)}시간 ${scheduledMinutes}분)`);
        }
      }
      this.items = [...this.items];
    },
    findIndexInSelectedItems(item) {
      const recommendIdKey = this.getIdFieldNameByCategory(item.category);
      return this.selectedItems.findIndex(selected => selected[recommendIdKey] === item[recommendIdKey]);
    },
    calculateTotalItemDuration() {
      const total = this.selectedItems.reduce((sum, item) => {
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
      const timePart = timeString.split('T')[1] ? timeString.split('T')[1].substring(0, 5) : timeString;
      const [hours, minutes] = timePart.split(':').map(Number);

      if (isNaN(hours) || isNaN(minutes)) {
        console.error('Invalid time format:', timeString);
        return null;
      }

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
      const selectedItem = this.selectedItems[index];
      const recommendIdKey = this.getIdFieldNameByCategory(selectedItem.category);
      const foundIndex = this.items.findIndex(i => i[recommendIdKey] === selectedItem[recommendIdKey]);
      if (foundIndex !== -1) {
        this.items[foundIndex].selected = false;
      }
      this.selectedItems.splice(index, 1);
      this.selectedItems.forEach((item, idx) => {
        item.order = idx + 1;
      });
      this.itemCount = this.selectedItems.length;
      this.updateTotalItemHours();
      this.items = [...this.items];
    },
    calculateDuration(startTime, finishTime) {
      const start = new Date(`1970-01-01T${startTime}`);
      const finish = new Date(`1970-01-01T${finishTime}`);
      const diff = finish - start; // 밀리초 단위 차이
      const hours = Math.floor(diff / 3600000); // 시간으로 변환
      const minutes = Math.round((diff % 3600000) / 60000); // 남은 밀리초를 분으로 변환

      let duration = "";
      if (hours > 0) duration += `${hours}시간 `;
      if (minutes > 0) duration += `${minutes}분`;
      if (duration === "") return "0시간"; // 시간과 분이 모두 0인 경우

      return duration.trim();
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
          planId: this.planId,
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
  background-image: url('~@/assets/images/map.jpg');
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 1000px;
  height: 700px;
  border-radius: 10px;
  padding: 20px;
}

.schedulecontainer > div {
  flex: 1;
}

.schedulecontainer .stepkey {
  width: 100%;
  display: flex;
  justify-content: center;
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
  display:flex;
  justify-content: center;
  margin-top:20px;
  margin-bottom:10px;
  font-size: 25px;
}

.scheduletitle2 {
  display:flex;
  justify-content: center;
  color:grey;
  margin-bottom:40px;
}

.yearmonth{
  margin-top: 50px;
  font-size:30px;
}

.monthbutton1, .monthbutton2{
  position:absolute;
  font-size:22px;
  color: rgb(163, 163, 163);
  cursor: pointer;
}

.monthbutton1{
  margin: 10px -140px;
}

.monthbutton2{
  margin: 10px 130px;
}

$border-color: #efefef;
.calendar {
  display: flex;
  justify-content: center; // 가운데 정렬
  margin-top:-50px;
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
        margin-top: 30px;
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
          cursor: pointer;

          &.today {
            .date {
              background-color: #93b3c9;
              width: 50px;
              height: 50px;
              color: #ffffff;
              border-radius: 10px;
              margin: 4px 6px;
            }
          }
          &.selected {
            .date {
              background-color: #739db9 !important;
              width: 50px;
              height: 50px;
              color: #ffffff;
              border-radius: 10px;
              margin: 4px 6px;
            }
          }
          &.hover-selected {
            .date {
              background-color: #afcfe4 !important;
              width: 50px;
              height: 50px;
              color: #ffffff;
              border-radius: 10px;
              margin: 4px 6px;
            }
          }
          &.in-range {
            .date {
              background-color: #afcfe4;
              width: 50px;
              height: 50px;
              color: #ffffff;
              border-radius: 10px;
              margin: 4px 6px;
            }
          }
          .date {
            margin: 15px 16px;
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

.today-not-selected .date {
  background-color: white;
  color: #000000;
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

.plantimetitle {
  text-align: center;
  width: 100%;
  font-size: 22px;
  margin-top: 25px;
}

.time-settings {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-top:50px;
  .day-container {
    margin: 10px;
    border: none;
    .date-title1 {
      font-size: 23px;
      font-weight: bold;
      color:#007bff;

    }
    .date-title2 {
      font-size: 23px;
      color:#707070;
    }
    .time-range {
      display: flex;
      margin-top:50px;
      flex-direction: column;
      .time-setting {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
        div {
          margin-right: 10px;
          font-weight: 600;
          font-size: 20px;
        }
        input[type="time"] {
          border: none;
          margin-top:70px;
          font-weight: 700;
          color: #666666;
          font-size: 20px;
        }
      }
    }
  }
}

.simpletime{
  margin-top:50px;
  font-weight: 500;
  font-size:20px;
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

.nextbutton{
  background-color: rgb(102, 102, 211);
  color:white;
  font-size:23px;
  width: 100px;
  height: 45px;
  border-radius: 7px;
  border:none;
  cursor: pointer;
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
  color: #5b59bd;
  font-size: 24px;
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

.item-image {
  width: 70px;
  height: 70px;
  object-fit: cover;
  margin-right: 10px;
  border-radius: 7px;
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

.item-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.item-description {
    flex-grow: 1;
    font-size: 12px;
    color: #666;
    text-align: left;
}

.item-title {
    font-size: 14px;
    font-weight: bold;
    flex-shrink: 0;
    text-align: left;
}

.item-group .add-button {
    width:30px;
    height: 30px;
    font-size:18px;
    margin-top: 25px;
    margin-right:10px;
    background-color:rgb(192, 192, 192);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.item-group .selected-button,
.hotel-group button {
    width:30px;
    height: 30px;
    margin-top: 25px;
    margin-right:10px;
    background-color: #4795e9;
    color: white;
    border: none;
    border-radius: 6px;
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

.hotel-image {
  width: 70px;
  height: 70px;
  object-fit: cover;
  margin-right: 10px;
  border-radius: 7px;
}

::-webkit-scrollbar {
  width: 7px;
  height: 10px;
  margin-right: 20px;
}

::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background-color: #bebebe;
  border-radius: 5px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
}
</style>