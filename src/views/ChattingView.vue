<template>
  <div class="app-container">
  <div class="title-container">
  <!-- 타이틀 -->
    <h1>여행 조인 게시판</h1>
    <p class="right-text"><font-awesome-icon icon="fa-solid fa-pen-to-square" />글쓰기</p>
  </div>
  <!-- 서브타이틀 -->
  <p style="text-align: left;">당신의 여행이 더욱 특별해질 수 있게 여행메이트를 찾아보세요.</p>

  <!-- 검색 폼 -->
  <div class="d-flex justify-content-center">
  <input class="form-control me-2" style="flex-grow: 1; max-width: 80%;" type="text" placeholder="Default input" aria-label="default input example">
  <button type="button" class="btn btn-primary">Primary</button>
  </div>
  
  <!-- 채팅방 목록 -->
  <div class="app-container">
    <!-- 타이틀과 서브타이틀, 검색 폼 등 기존 내용 유지 -->

    <!-- 채팅방 목록 -->
    <div class="chatting-background">
      <h2>채팅방 목록</h2>
      <form @submit.prevent="createChatRoom">
        <input v-model="newChatRoomName" type="text" placeholder="채팅방 이름 입력" />
        <button type="submit">채팅방 생성</button>
      </form>

      <!-- 채팅방 카드 목록 -->
      <div v-for="room in chatRooms" :key="room.chatRoomId" class="card-container">
        <div class="profile-picture">
          <img src="../assets/hanra.jpeg" alt="Profile Picture" >
        </div>
        <div class="text-content">
          <h3 class="chatroom-name">{{ room.chatRoomName }}</h3>
          <p class="author-name">작성자 이름: {{ room.authorName }}</p>
          <p class="subtitle">서브타이틀: 예시 텍스트</p>
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
    };
  },
  mounted() {
    this.fetchChatRooms();
  },
  methods: {
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
        chatRoomName: this.newChatRoomName, // 사용자 입력으로 받은 채팅방 이름
      };
      this.$axios.post('http://localhost:8080/api/v1/chat/create', newChatRoom)
        .then(response => {
          console.log("채팅방 생성 성공:", response.data);
          this.newChatRoomName = ''; // 입력 필드 초기화
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

.profile-picture img {
  width: 80px; /* 프로필 이미지 크기 */
  height: 80px; /* 프로필 이미지 크기 */
  border-radius: 50%; /* 원형으로 만들기 */
  margin-right: 20px; /* 텍스트 컨텐츠와의 간격 */
}

.text-content {
  flex: 1; /* 텍스트 컨텐츠가 나머지 공간을 채우도록 */
}

.chatroom-name {
  margin: 0;
  font-size: 20px; /* 제목 크기 */
}

.author-name {
  margin: 5px 0;
  font-size: 16px; /* 작성자 이름 크기 */
}

.subtitle {
  margin: 0;
  font-size: 14px; /* 서브타이틀 크기 */
  color: #666; /* 서브타이틀 색상 */
}
.chatting-background {
  background-color: rgb(255, 241, 244);
}
</style>