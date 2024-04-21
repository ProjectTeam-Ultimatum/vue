<template>
  <div class="app-container">
    <div class="divider" ></div>
  <div class="title-container">
  <!-- 타이틀 -->
    <h1>여행 조인 게시판</h1>
    <p class="write-text" @click="showModal = true">
  <font-awesome-icon icon="fa-solid fa-pen-to-square" /> 글쓰기
</p>
  </div>


<!-- 모달창 내용 -->
<div v-if="showModal" class="chat-modal" @click.self="showModal = false">
  <div class="chat-modal-content" @click.stop>
    <h2>채팅방 게시하기<font-awesome-icon icon="fa-solid fa-pen-to-square" /></h2>
    <div class="modal-header">
      <div class="profile-picture">
        <img src="@/assets/images/profile.png" alt="Profile Picture">
      </div>
      <p class="name-input">{{userName}}</p>
      <p class="name-input">{{userAge}} 살</p>
    </div>
    <!-- 제목 입력 부분 -->
    <div class="input-group">
      <label for="title" class="form-label">제목</label>
      <input type="text" id="title" v-model="newChatRoomTitle" placeholder="제목을 입력하세요" class="text-input">
    </div>
    <div class="input-group">
      <div class="input-group">
        <label for="travelStyle" class="form-label">태그</label>
        <input type="text" id="travelStyle" placeholder="원하는 여행 스타일 태그를 입력해주세요" class="text-input">
        <button class="btn-add" @click="addTravelStyle">추가</button>
      </div>
    <!-- 입력된 태그 표시 -->
    <div class="tags">
      <span v-for="(style, index) in travelStyles" :key="index" class="tag">
      {{ style }}
      <button class="remove-tag" @click="removeTravelStyle(index)">x</button>
      </span>
    </div>
  </div>
  <div class="input-group textarea-group">
  <label for="exampleFormControlTextarea1" class="form-label">내용</label>
  <textarea class="form-control" id="exampleFormControlTextarea1" rows="5" v-model="newChatRoomContent"></textarea>
  </div>
  <div class="submit-group">
    <button class="btn-down" @click="showModal = false">닫기</button>
    <button class="btn-submit" @click="submitChatRoom">게시하기</button>
  </div>
  </div>
</div>

  <!-- 서브타이틀 -->
  <p style="text-align: left;">당신의 여행이 더욱 특별해질 수 있게 여행메이트를 찾아보세요.</p>

  <!-- 검색 폼 -->
  <div class="d-flex justify-content-center pb-5 pt-5">
  <input class="form-control me-2" style="flex-grow: 1; max-width: 80%;" type="text" v-model="searchQuery" placeholder="채팅방 이름을 입력해주세요" aria-label="default input example">
  <button type="button" class="btn btn-primary">검색</button>
  </div>

    <!-- 채팅방 목록 -->
    <div class="chatting-background">
      <div class="chatroom-header">
        <!-- 채팅방 목록 가운데 정렬을 위한 래퍼 -->
        <div class="title-wrapper">
        <h2 style="margin-top: 20px;">채팅방 목록</h2>
        </div>
        <div class="filter-text" @click="showFilterModal = true">
          <font-awesome-icon icon="fa-solid fa-sliders" /> 필터
        </div>
      </div>

    <!-- 필터 모달창 내용 -->
    <div v-if="showFilterModal" class="chat-modal" @click.self="showFilterModal = false">
      <div class="chat-modal-content" @click.stop>
        <h2>필터 옵션<font-awesome-icon icon="fa-solid fa-sliders" /></h2>
          <!-- 나이 슬라이더 필터 -->
          <div class="input-group">
            <div for="ageFilter" class="filter-body">
              <span>나이</span>
              <span class="filter-font">{{ ageFilter }}세</span>
            </div>
            <input type="range" id="ageFilter" v-model="ageFilter" min="18" max="50" class="slider">
          </div>

          <!-- 거리 슬라이더 필터 -->
          <div class="input-group">
            <div for="distanceFilter" class="filter-body">
              <span>거리</span>
              <span class="filter-font">{{ distanceFilter }}km 이내</span>
            </div>
            <input type="range" id="distanceFilter" v-model="distanceFilter" min="1" max="100" class="slider">
          </div>

          <!-- 드롭다운 필터 -->
          <div class="input-group">
            <div for="regionSelect" class="filter-body">
              <span>지역</span>
              <select id="regionSelect" v-model="selectedRegion" class="dropdown-select">
              <option value="">선택하세요</option>
              <option value="서울">서울</option>
              <option value="부산">부산</option>
              <!-- 추가 지역 옵션을 여기에 더 추가할 수 있습니다. -->
            </select>
            </div>
          </div>

          <div class="filter-tip">
            <ul>
              <li>거리는 실제 위치를 기준으로 가까운 친구를 보여줘요</li>
              <li>나이는 내 또래 친구들을 찾을수 있어요</li>
            </ul>
          </div>

        <div class="submit-group">
        <button class="btn-down" @click="showFilterModal = false">닫기</button>
        <button class="btn-submit" @click="applyFilters">적용</button>
        </div>
      </div>
    </div>

      <!-- 채팅방 카드 목록 -->
      <div v-for="room in filteredChatRooms" :key="room.chatRoomId" class="card-container">
          <div class="profile-picture">
              <img src="@/assets/images/profile.png" alt="Profile Picture">
              <p class="profile-name">{{ room.creatorName }}</p> <!-- 작성자 이름 -->
              <p class="profile-detail">{{ room.creatorAge }}살</p> <!-- 작성자 나이 -->
          </div>
          <div class="text-content">
              <h3 class="chatroom-name">{{ room.chatRoomName }}</h3>
              <p class="subtitle">{{ room.chatRoomContent }}</p>
              <div class="tag">
                  <span v-for="tag in room.travelStyleTags" :key="tag" class="travel-style-tag">
                      #{{ tag }}
                  </span>
              </div>
              <div class="button-group">
                  <button class="btn-submit" @click="enterChatRoom(room.chatRoomId)">입장</button>
                  <button class="btn-down" @click="deleteChatRoom(room.chatRoomId)">삭제</button>
              </div>
          </div>
      </div>

    </div>

</div>
</template>

<script>
export default {
  data() {
    return {
      chatRooms: [], // 채팅방 목록을 저장할 배열
      newChatRoomName: '',
      showModal: false, // 모달 창 표시 여부
      travelStyles: [], // 사용자가 입력한 여행 스타일 태그를 저장할 배열
      newChatRoomTitle: '',  // 채팅방 제목
      newChatRoomContent: '', // 채팅방 내용
      searchQuery: '', // 사용자의 검색 쿼리를 저장할 새로운 데이터 속성
      showFilterModal: false, // 필터 모달 창 표시 여부
      ageFilter: 25, // 기본 나이 필터 값을 설정
      distanceFilter: 10, // 기본 거리 필터 값을 설정
      regionFilter: [], // 체크된 지역을 담을 배열
      selectedRegion: '', // 선택된 지역을 저장할 데이터 속성
      userName: '',  // 사용자 이름
      userEmail:'',
      userGender:'',
      userAge:'',
    };
  },
  computed: {
    filteredChatRooms() {
      // 검색 쿼리를 소문자로 변환하고, 채팅방 이름도 소문자로 변환하여 비교합니다.
      return this.chatRooms.filter(room =>
        room.chatRoomName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  mounted() {
    this.fetchChatRooms();
    this.fetchUserInfo();
  },
  methods: {
    submitChatRoom() {
        const chatRoomData = {
      chatRoomName: this.newChatRoomTitle,
      chatRoomContent: this.newChatRoomContent,
      travelStyleTags: this.travelStyles
    };
    
    // Axios를 통해 서버에 채팅방 생성 요청
    this.$axios.post('http://localhost:8080/api/v1/chat/create', chatRoomData)
      .then(response => {
        // 성공적으로 응답을 받으면 실행될 코드
        console.log("채팅방 생성 성공:", response.data);
        this.newChatRoomTitle = ''; // 채팅방 이름 입력 필드 초기화
        this.newChatRoomContent = ''; // 채팅방 내용 입력 필드 초기화
        this.travelStyles = []; // 채팅방 태그 목록 초기화
        this.showModal = false; // 모달 창 닫기
        this.fetchChatRooms(); // 채팅방 목록 다시 불러오기
      })
      .catch(error => {
        // 요청에 실패하면 실행될 코드
        console.error("채팅방 생성 실패:", error.response?.data || error.message);
        alert('채팅방 생성에 실패했습니다: ' + (error.response?.data || error.message));
      });
    },
    addTravelStyle() {
    const input = document.getElementById('travelStyle');
    if (input.value.trim() !== '') {
      this.travelStyles.push(input.value);
      input.value = ''; // 입력 필드 초기화
      }
    },
    applyFilters() {
    // 필터 로직을 여기에 구현합니다.
    // 예를 들면, 서버에 필터링된 채팅방 데이터를 요청하는 API 호출 등을 할 수 있습니다.
    console.log('적용된 필터:', this.ageFilter, this.distanceFilter, this.regionFilter);
    this.showFilterModal = false; // 필터 적용 후 모달창 닫기
  },
    removeTravelStyle(index) {
    this.travelStyles.splice(index, 1); // 인덱스를 사용하여 배열에서 태그 삭제
    },
    fetchChatRooms() {
      this.$axios.get('http://localhost:8080/api/v1/chat/list')
        .then(response => {
            console.log("Fetched chat rooms:", response.data);  // 데이터 확인
            this.chatRooms = response.data;
        })
        .catch(error => {
            console.error("채팅방 목록을 불러오는데 실패했습니다:", error);
        });
    },

    createChatRoom() {
      const newChatRoom = {
          chatRoomName: this.newChatRoomTitle, // 채팅방 이름
          chatRoomContent: this.newChatRoomContent, // 채팅방 내용
          travelStyleTags: this.travelStyles // 여행 스타일 태그
      };
      this.$axios.post('http://localhost:8080/api/v1/chat/create', newChatRoom)
      .then(response => {
          console.log("채팅방 생성 성공:", response.data);
          this.resetForm();
      })
      .catch(error => {
          console.error("채팅방 생성 실패:", error.response.data);
      });
    },
    resetForm() {
        this.newChatRoomTitle = '';
        this.newChatRoomContent = '';
        this.travelStyles = [];
        this.showModal = false;
        this.fetchChatRooms();
    },
    deleteChatRoom(roomId) {
      this.$axios.delete(`http://localhost:8080/api/v1/chat/room/${roomId}`)
        .then(() => {
          alert("채팅방이 삭제되었습니다.");
          this.fetchChatRooms(); // 채팅방 목록을 다시 불러옵니다.
        })
        .catch(error => {
          console.error("채팅방 삭제 중 오류가 발생했습니다:", error);
        });
    },
    enterChatRoom(roomId) {
      // Vue Router를 사용하여 해당 채팅방의 상세 페이지로 이동!
      this.$router.push({ name: 'ChatRoom', params: { roomId: roomId } });
    },
    fetchUserInfo() {
      this.$axios.get('http://localhost:8080/api/v1/user/info/detail')
        .then(response => {
          this.userName = response.data.userName;  // "userName" 키에 접근
          this.userEmail = response.data.email;    // "email" 키에 접근
          this.userGender = response.data.gender;  // "gender" 키에 접근
          this.userAge = response.data.age;        // "age" 키에 접근
          this.userAddress = response.data.address;// "address" 키에 접근
        })
        .catch(error => {
          console.error("사용자 정보를 불러오는 중 오류가 발생했습니다:", error);
        });
    },
  }
};
</script>
<style scoped>


/* 전체 페이지에 적용되는 스타일 */
.app-container {
  max-width: 1200px; /* 최대 너비 설정 */
  margin: 0 auto; /* 상하 마진 0, 좌우 마진 자동으로 중앙 정렬 */
  padding: 0 20px; /* 양 옆에 20px의 패딩을 추가하여 내용과 화면 가장자리 사이에 공간을 생성 */
}

.divider {
  padding: 50px;
}


/* 게시판 타이틀 스타일 */
.title-container {
  display: flex;
  justify-content: space-between; /* 좌우 요소를 양 끝으로 정렬 */
  align-items: center; /* 세로 방향으로 중앙 정렬 */
}

/* 채팅방 목록 카드 스타일 전체 컨테이너 */
.card-container {
  background-color:white ;
  display: flex;
  align-items: center; /* 세로 중앙 정렬 */
  margin: 20px;
  padding: 10px;
  border: 1px solid #ccc; 
  border-radius: 8px; 
}

/* 채팅방 목록 카드 프로필이미지가 차지하는 공간 스타일*/
.profile-picture {
  padding: 30px; 
  margin-top: 20px;
  margin-left: 50px;
  margin-right: 50px;
  height: 200px; /* 고정된 높이를 설정합니다. */
  display: flex; /* Flexbox를 사용하여 내용을 중앙 정렬합니다. */
  flex-direction: column; /* 요소들을 세로로 배치합니다. */
  justify-content: center; /* 세로 방향으로 중앙 정렬합니다. */
  align-items: center; /* 가로 방향으로 중앙 정렬합니다. */
  text-align: center; /* 텍스트를 가운데 정렬합니다. */
}

/* 채팅방 목록 카드 프로필이미지 스타일 */
.profile-picture img {
  width: 130px; /* 프로필 이미지 크기 */
  height: 130px; /* 프로필 이미지 크기 */
  border-radius: 50%; /* 원형으로 만들기 */
  margin-right: 20px; /* 텍스트 컨텐츠와의 간격 */
}

/* 채팅방 목록 카드 내용 위치 스타일 */
.text-content {
  flex: 1; /* 텍스트 컨텐츠가 나머지 공간을 채우도록 */
  text-align: left;
}

/* 채팅방 목록 카드 제목 스타일 */
.chatroom-name {
  margin: 30px 0;
  font-size: 25px; /* 제목 크기 */
  font-weight: bold;
}

/* 채팅방 목록 카드 작성자 여행스타일 */
.author-style {
  margin: 20px 0;
  font-size: 16px; /* 작성자 이름 크기 */
}

/* 채팅방 내용 스타일 */
.subtitle {
  margin: 20px 0;
  font-size: 14px; /* 서브타이틀 크기 */
  color: #666; /* 서브타이틀 색상 */
}

/* 채팅방 목록 카드 백그라운드 스타일 */
.chatting-background {
  background-color: #FFC83B;
  padding-bottom: 20px;
}

/* 채팅방 목록 카드 헤더 스타일 */
.chatroom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px; /* 양쪽에 패딩을 추가해줍니다. */
}

/* 채팅방 목록 카드 헤더 텍스트 스타일 */
.title-wrapper {
  flex-grow: 1; /* title-wrapper가 가능한 많은 공간을 차지하도록 합니다. */
  display: flex;
  justify-content: center; /* 가운데 정렬 */
}

/* 글쓰기 버튼 스타일 */
.write-text{
  cursor: pointer;
}

/* 필터 버튼 스타일 */
.filter-text {
  cursor: pointer;
}

/* 채팅방 목록 사용자 이름 스타일 */
.profile-name {
  text-align: center; /* 이름을 중앙 정렬합니다. */
  margin-top: 8px; /* 이미지와 텍스트 사이의 마진을 추가합니다. */
  font-size: 16px; /* 텍스트 사이즈를 조정합니다. */
  color: #333; /* 텍스트 색상을 조정합니다. */
  font-weight: bold;
}

/* 채팅방 목록 사용자 나이 스타일 */
.profile-detail {
  font-size: 13px;
  color:#666;
}

/* 입장, 삭제버튼 스타일 */
.button-group {
  display: flex;
  justify-content: flex-end; /* 오른쪽 정렬 */
  align-items: flex-end; /* 아래 정렬 */
  margin-top: auto; /* 나머지 모든 요소들 위에 위치 */
}

/* 글쓰기 모달창 스타일*/
.chat-modal {
  position: fixed; /* 화면에 고정 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 글쓰기 모달창 전체 스타일 */
.chat-modal-content {
  background-color: #FFF;
  padding: 30px;
  border-radius: 10px;
  width: 700px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* 글쓰기 모달창 헤더(프로필) 스타일 */
.modal-header {
  display: flex;
  align-items: center; /* 중앙 정렬 */
  gap: 20px; /* 요소 사이의 간격 */
}

/* 글쓰기 모달창 헤더(프로필) 이름 스타일 */
.name-input {
  flex-grow: 1; /* 남은 공간을 모두 차지하도록 설정 */
  padding: 10px; /* 입력 필드 내부의 패딩 */
  font-size: 16px; /* 글자 크기 */
  text-align: left;
}

/* 방제목, 방내용 입력폼 스타일*/
.text-input,
.form-control {
  border: 1px solid #CCC;
  border-radius: 4px;
  padding: 10px;
  width: 80%;
}

/* 방제목, 태그 입력 폼 스타일 */
.text-input{
  padding: 8px;
  margin: 4px; /* 필요에 따라 조정 */
}

/* 입력된 태그 표시 스타일 */
.tags {
  padding-left: 40px;
}

/* 입력된 태그 표시 스타일 */
.tag {
  background-color: #ffffff;
  color: #007BFF;
  border-radius: 16px;
  border: solid 1px #007BFF;
  padding: 5px 10px;
  display: inline-flex;
  align-items: center;
  margin-right: 10px;
}

/* 입력된 태그 삭제 버튼 스타일 */
.remove-tag {
  background-color: white;
  border: none;
  color: #FFC83B;
  cursor: pointer;
  margin-left: 10px;
  border-radius: 50%;
  padding: 0 5px;
}

/* 채팅방입장, 게시글 등록 버튼 스타일 */
.btn-submit {
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
}

/* 채팅방삭제, 게시글 닫기 버튼 스타일 */
.btn-down {
  background-color: #ffffff;
  color: #FFC83B;
  border: solid 1px #FFC83B;
  border-radius: 4px;
  padding: 10px 20px;
  margin-right: 10px;
  cursor: pointer;
}

/* 태그 추가 버튼 스타일 */
.btn-add {
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 10px;
  cursor: pointer;
  margin-left: 20px;
}

.input-group {
  display: flex;
  flex-direction: row; /* 요소들을 수평 방향으로 정렬 */
  align-items: center;
  margin-bottom: 20px;
}


.input-group label {
  margin-right: 10px; /* 라벨과 입력 필드 사이의 공간 */
  white-space: nowrap; /* 라벨을 줄 바꿈 없이 한 줄로 유지 */
}
.text-input {
  border-radius: 5px;
}
.travel-style-tag {
  display: inline-block; /* 태그를 인라인 블록으로 표시 */
  margin-right: 10px; /* 태그 사이의 간격 */
  /* 필요한 스타일 추가 */
}


.slider {
  width: 100%;
  margin: 10px 0;
}

.input-group label {
  display: block;
}

.input-group span {
  margin-left: 10px;
}

/* 체크박스 스타일 */
.input-group label {
  margin-right: 20px;
}

.filter-body {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.dropdown {
  position: relative;
  font-size: 16px; /* 폰트 크기 설정 */
}

.dropdown-select {
  width: 16.5%; /* 컨테이너 너비에 맞춤 */
  padding: 10px; /* 패딩 설정 */
  background-color: transparent; /* 배경색 투명 */
  border: 1px solid #007BFF; /* 경계선 스타일 */
  appearance: none; /* 기본 브라우저 스타일 제거 */
  cursor: pointer; /* 커서 모양 변경 */
  color:#007BFF;
}

.dropdown-select::-ms-expand {
  display: none; /* IE/Edge에서 화살표 제거 */
}

/* 선택되었을 때의 배경 및 화살표 아이콘 */
.dropdown-select:active,
.dropdown-select:hover {
  background-color: #f8f8f8; /* 활성화/호버 상태의 배경색 */
}

.filter-font{
  color:#007BFF;
}

.filter-tip{
  margin-top:10px;
  border-top: #ccc 1px solid;
  text-align: start;
  padding-top: 20px;
}
</style>