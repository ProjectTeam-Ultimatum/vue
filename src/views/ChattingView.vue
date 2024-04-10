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
    <h2>채팅방 게시하기</h2>
    <div class="modal-body">
      <div class="profile-picture">
        <img src="../assets/hanra.jpeg" alt="Profile Picture">
      </div>
      <p class="name-input">배정현 입니다</p>
    </div>
    <!-- 제목 입력 부분 -->
    <div class="input-group">
      <label for="title">제목</label>
      <input type="text" id="title" v-model="newChatRoomTitle" placeholder="제목을 입력하세요" class="text-input">
    </div>
    <div class="input-group">
      <div class="input-group">
  <label for="travelStyle">원하는<br>여행스타일</label>
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
    <div class="submit-group">
      <button class="btn-submit" @click="submitChatRoom">게시하기</button>
    </div>
    <button @click="showModal = false">닫기</button>
  </div>
</div>

  <!-- 서브타이틀 -->
  <p style="text-align: left;">당신의 여행이 더욱 특별해질 수 있게 여행메이트를 찾아보세요.</p>

  <!-- 검색 폼 -->
  <div class="d-flex justify-content-center pb-5 pt-5">
  <input class="form-control me-2" style="flex-grow: 1; max-width: 80%;" type="text" placeholder="Default input" aria-label="default input example">
  <button type="button" class="btn btn-primary">Primary</button>
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
      <form @submit.prevent="createChatRoom">
        <input v-model="newChatRoomName" type="text" placeholder="채팅방 이름 입력" />
        <button type="submit">채팅방 생성</button>
      </form>

      <!-- 채팅방 카드 목록 -->
      <div v-for="room in chatRooms" :key="room.chatRoomId" class="card-container">
  <div class="profile-picture">
    <img src="../assets/hanra.jpeg" alt="Profile Picture" >
    <p class="profile-name">배정현 입니다</p> <!-- 여기에 사용자 이름을 추가 -->
  </div>
  <div class="text-content">
    <h3 class="chatroom-name">{{ room.chatRoomName }}</h3>
    <p class="author-name">여행 스타일: 불도저 </p>
    <p class="subtitle">내용 : 저랑 같이 회 드시러 가실분~</p>
    <p class="tag"> #제주여행 #술좋아하는 #재밌는 사람</p>
    <div class="button-group">
    <button @click="enterChatRoom(room.chatRoomId)">입장</button>
    <button @click="deleteChatRoom(room.chatRoomId)">삭제</button>
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
      newChatRoomTitle: '',
    };
  },
  mounted() {
    this.fetchChatRooms();
  },
  methods: {
    submitChatRoom() {
    const chatRoomData = {
      chatRoomName: this.newChatRoomTitle,
      travelStyleTags: this.travelStyles,
    };
    this.$axios.post('http://localhost:8080/api/v1/chat/create', chatRoomData)
      .then(response => {
        console.log("채팅방 생성 성공:", response.data);
        this.newChatRoomTitle = ''; // 입력 필드 초기화
        this.travelStyles = []; // 태그 목록 초기화
        this.showModal = false; // 모달 창 닫기
        this.fetchChatRooms(); // 채팅방 목록 다시 불러오기
      })
      .catch(error => {
        console.error("채팅방 생성 실패:", error);
      });
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
        travelStyleTags: this.travelStyles // 사용자가 추가한 여행 스타일 태그
    };
      this.$axios.post('http://localhost:8080/api/v1/chat/create', newChatRoom)
    .then(response => {
      console.log("채팅방 생성 성공:", response.data);
      // 성공 후 필요한 상태 초기화
      console.log("travleStyles", this.travelStyles)
      this.newChatRoomTitle = '';
      this.travelStyles = [];
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
.right-text {
}

.card-container {
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
  width: 180px; /* 프로필 이미지 크기 */
  height: 180px; /* 프로필 이미지 크기 */
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
  background-color: rgb(255, 241, 244);
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
  font-size: 14px; /* 텍스트 사이즈를 조정합니다. */
  color: #333; /* 텍스트 색상을 조정합니다. */
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
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  max-width: 800px;
  /* 필요에 따라 추가 스타일링 */
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
.input-group {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.text-input {
  flex-grow: 1;
  padding: 10px;
  font-size: 16px;
}
.text-input, .btn-add {
  padding: 8px;
  margin: 4px; /* 필요에 따라 조정 */
}

.btn-add {
  cursor: pointer; /* 버튼 위에 마우스를 올렸을 때 커서 변경 */
  background-color: #007bff; /* 버튼 배경 색상 */
  color: white; /* 버튼 텍스트 색상 */
  border: none; /* 테두리 제거 */
  border-radius: 4px; /* 버튼 모서리 둥글게 */
  /* 필요에 따라 추가 스타일링 */
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.tag {
  display: flex;
  align-items: center;
  background-color: #e1e1e1;
  border-radius: 16px;
  padding: 5px 10px;
}

.remove-tag {
  margin-left: 8px;
  cursor: pointer;
  background-color: red;
  color: white;
  border: none;
  border-radius: 50%;
}

</style>