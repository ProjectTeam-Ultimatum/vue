<template>
  <div class="app-container">
  <div class="title-container">
  <!-- 타이틀 -->
    <h1>여행 조인 게시판</h1>
    <p class="right-text" @click="showModal = true">
  <font-awesome-icon icon="fa-solid fa-pen-to-square" /> 글쓰기
</p>
  </div>


<!-- 모달창 내용 -->
<div v-if="showModal" class="modal" @click.self="showModal = false">
  <div class="modal-content" @click.stop>
    <h2>채팅방 게시하기<font-awesome-icon icon="fa-solid fa-pen-to-square" /></h2>
    <div class="modal-body">
      <div class="profile-picture">
        <img src="../assets/profile.png" alt="Profile Picture">
      </div>
      <p class="name-input">배정현</p>
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
      <div class="filter-text"><font-awesome-icon icon="fa-solid fa-sliders" />필터</div>
      </div>

      <!-- 채팅방 카드 목록 -->
      <div v-for="room in filteredChatRooms" :key="room.chatRoomId" class="card-container">
  <div class="profile-picture">
    <img src="../assets/hanra.jpeg" alt="Profile Picture" >
    <p class="profile-name">배정현</p> <!-- 여기에 사용자 이름을 추가 -->
    <p class="profile-detail">21살</p>
  </div>
  <div class="text-content">
    <h3 class="chatroom-name">{{ room.chatRoomName }}</h3>
    <p class="author-name">여행 스타일: 불도저 </p>
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
  },
  methods: {
    submitChatRoom() {
    const chatRoomData = {
      chatRoomName: this.newChatRoomTitle,
      travelStyleTags: this.travelStyles,
      chatRoomContent: this.newChatRoomContent,
    };
    this.$axios.post('http://localhost:8080/api/v1/chat/create', chatRoomData)
      .then(response => {
        console.log("채팅방 생성 성공:", response.data);
        this.newChatRoomTitle = ''; // 입력 필드 초기화
        this.travelStyles = []; // 태그 목록 초기화
        this.newChatRoomContent = ''; // 채팅방 내용
        this.showModal = false; // 모달 창 닫기
        this.fetchChatRooms(); // 채팅방 목록 다시 불러오기
      })
      .catch(error => {
        console.error("채팅방 생성 실패:", error);
      });

      console.log(this.newChatRoomContent);
    },
    addTravelStyle() {
    const input = document.getElementById('travelStyle');
    if (input.value.trim() !== '') {
      this.travelStyles.push(input.value);
      input.value = ''; // 입력 필드 초기화
      }
    },
    removeTravelStyle(index) {
    this.travelStyles.splice(index, 1); // 인덱스를 사용하여 배열에서 태그 삭제
    },
    fetchChatRooms() {
      this.$axios.get('http://localhost:8080/api/v1/chat/list') // 백엔드 API 주소
        .then(response => {
          this.chatRooms = response.data; // 받아온 채팅방 목록을 chatRooms 배열에 저장
        })
        .catch(error => {
          console.error("채팅방 목록을 불러오는데 실패했습니다:", error);
        });
    },
    createChatRoom() {
      const newChatRoom = {
        chatRoomName: this.newChatRoomTitle, // 사용자 입력으로 받은 채팅방 제목
        travelStyleTags: this.travelStyles, // 사용자가 추가한 여행 스타일 태그
        chatRoomContent: this.newChatRoomContent,
    };
      this.$axios.post('http://localhost:8080/api/v1/chat/create', newChatRoom)
    .then(response => {
      console.log("채팅방 생성 성공:", response.data);
      // 성공 후 필요한 상태 초기화
      console.log("travleStyles", this.travelStyles)
      this.newChatRoomTitle = '';
      this.travelStyles = [];
      this.newChatRoomContent = ''; // 채팅방 내용
      this.showModal = false; // 모달 창 닫기
      this.fetchChatRooms(); // 채팅방 목록 다시 불러오기
    })
    .catch(error => {
      console.error("채팅방 생성 실패:", error);
    });
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
    }
  }
};
</script>
<style>


/* 전체 페이지에 적용되는 스타일 */
.app-container {
  max-width: 1200px; /* 최대 너비 설정 */
  margin: 0 auto; /* 상하 마진 0, 좌우 마진 자동으로 중앙 정렬 */
  padding: 0 20px; /* 양 옆에 20px의 패딩을 추가하여 내용과 화면 가장자리 사이에 공간을 생성 */
}

.title-container {
  display: flex;
  justify-content: space-between; /* 좌우 요소를 양 끝으로 정렬 */
  align-items: center; /* 세로 방향으로 중앙 정렬 */
}
.card-container {
  background-color:white ;
  display: flex;
  align-items: center; /* 세로 중앙 정렬 */
  margin: 20px;
  padding: 10px;
  border: 1px solid #ccc; /* 경계선 설정 */
  border-radius: 8px; /* 경계선 둥글게 */
}
.profile-picture {
  padding: 30px; /* 내부 공간(패딩)을 늘립니다. */
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

.profile-picture img {
  width: 130px; /* 프로필 이미지 크기 */
  height: 130px; /* 프로필 이미지 크기 */
  border-radius: 50%; /* 원형으로 만들기 */
  margin-right: 20px; /* 텍스트 컨텐츠와의 간격 */
}

.text-content {
  flex: 1; /* 텍스트 컨텐츠가 나머지 공간을 채우도록 */
  text-align: left;
}

.chatroom-name {
  margin: 30px 0;
  font-size: 25px; /* 제목 크기 */
  font-weight: bold;
}

.author-name {
  margin: 20px 0;
  font-size: 16px; /* 작성자 이름 크기 */
}

.subtitle {
  margin: 20px 0;
  font-size: 14px; /* 서브타이틀 크기 */
  color: #666; /* 서브타이틀 색상 */
}
.chatting-background {
  background-color: #FFC83B;
  padding-bottom: 20px;
}

.chatroom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px; /* 양쪽에 패딩을 추가해줍니다. */
}

.title-wrapper {
  flex-grow: 1; /* title-wrapper가 가능한 많은 공간을 차지하도록 합니다. */
  display: flex;
  justify-content: center; /* 가운데 정렬 */
}

.filter-text {
  cursor: pointer;
  /* 필터 텍스트에 대한 추가 스타일링 */
}
.profile-name {
  text-align: center; /* 이름을 중앙 정렬합니다. */
  margin-top: 8px; /* 이미지와 텍스트 사이의 마진을 추가합니다. */
  font-size: 16px; /* 텍스트 사이즈를 조정합니다. */
  color: #333; /* 텍스트 색상을 조정합니다. */
  font-weight: bold;
}
.profile-detail {
  font-size: 13px;
  color:#666;
}
.button-group {
  display: flex;
  justify-content: flex-end; /* 오른쪽 정렬 */
  align-items: flex-end; /* 아래 정렬 */
  margin-top: auto; /* 나머지 모든 요소들 위에 위치 */
}
.tag {
  margin-top: 20px;
  margin-bottom: 20px;
}
.modal {
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

.modal-content {
  background-color: #FFF;
  padding: 30px;
  border-radius: 10px;
  width: 700px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.modal-body {
  display: flex;
  align-items: center; /* 중앙 정렬 */
  gap: 20px; /* 요소 사이의 간격 */
}
.name-input {
  flex-grow: 1; /* 남은 공간을 모두 차지하도록 설정 */
  padding: 10px; /* 입력 필드 내부의 패딩 */
  font-size: 16px; /* 글자 크기 */
  text-align: left;
}
.text-input,
.form-control {
  border: 1px solid #CCC;
  border-radius: 4px;
  padding: 10px;
  width: 80%;
}
.text-input{
  padding: 8px;
  margin: 4px; /* 필요에 따라 조정 */
}
.tags {
  padding-left: 40px;
}

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

.remove-tag {
  background-color: white;
  border: none;
  color: #FFC83B;
  cursor: pointer;
  margin-left: 10px;
  border-radius: 50%;
  padding: 0 5px;
}

.btn-submit {
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
}
.btn-down {
  background-color: #ffffff;
  color: #FFC83B;
  border: solid 1px #FFC83B;
  border-radius: 4px;
  padding: 10px 20px;
  margin-right: 10px;
  cursor: pointer;
}

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

</style>