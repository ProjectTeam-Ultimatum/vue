<template>
  <div class="chat-room-container">
    <!-- 채팅방 상단 영역: 채팅방 이름 및 사용자 정보 -->
    <header class="chat-room-header">
      <div class="chat-room-title">{{ chatRoomName }}</div>
      <div class="user-profile">
        
            <input v-model="userId" placeholder="아이디 입력" />
    <!-- 입장 버튼 추가 -->
    <button @click="enterChatRoom">입장</button>
      </div>
    </header>

    <!-- 메인 콘텐츠 영역 -->
    <div class="main-content">
    <!-- 왼쪽 패널 -->
    <aside class="left-panel">
    <!-- 왼쪽 내용 -->
    <h2>채팅방 목록</h2>
    </aside>

    
    <!-- 가운데 패널 -->
    <section class="center-panel">
    <!-- 채팅 메시지 목록 -->
      <ul>
        <li v-for="message in messages" :key="message.id" class="message-item">
          <span class="message-sender">{{ message.senderId }}:</span>
          <!-- 이미지 URL이면 img 태그로, 그렇지 않으면 span으로 메시지를 보여줍니다. -->
          <span v-if="isImageUrl(message.message)" class="message-content">
            <img :src="message.message" alt="Image" style="max-width: 200px; max-height: 200px;">
          </span>
          <span v-else class="message-content">{{ message.message }}</span>
        </li>
      </ul>
    </section>

    <!-- 오른쪽 패널 -->
    <aside class="right-panel">
    <!-- 오른쪽 내용 -->
    <img src="@/assets/images/profile.png" alt="User Avatar" class="user-avatar" />
        <p class="user-name">배정현</p>
        <p class="user-detail">신뢰도</p>
        <p class="user-detail">나이</p>
        <p class="user-detail">여행 스타일</p>
    </aside>
    </div>


    <!-- 메시지 입력 영역 -->
    <footer class="message-input-area">
      <form @submit.prevent="sendMessage" class="message-form">
        <label for="file-upload" class="custom-file-upload">
        이미지 전송
        </label>
        <input id="file-upload" type="file" @change="handleFileUpload" class="file-input" style="display: none;"/>
        <input v-model="newMessage" placeholder="메시지를 입력하세요" class="input-field" />
        <button type="submit" class="send-button">보내기</button>
      </form>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chatRoomId: null,
      chatRoomName: '',
      userId: '',
      newMessage: '', // 사용자가 입력한 새 메시지
      messages: [], // 채팅방의 메시지 목록
      socket: null,
    };
  },
  mounted() {
    this.connectWebSocket(); // WebSocket 연결을 설정합니다.
    // URL에서 roomId를 추출
    this.chatRoomId = this.$route.params.roomId;
    // 추출한 roomId를 사용하여 API 호출
    this.fetchChatRoomDetails(this.chatRoomId);
    // 채팅방 메시지 내역을 불러옵니다.
    this.fetchMessages(); 
  },
  methods: {
    // 이미지 파일 처리
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      this.$axios.post('http://localhost:8080/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    .then(response => {
      const imageUrl = response.data;
      this.sendMessage(imageUrl);  // 이미지 URL을 채팅으로 전송
    })
    .catch(error => console.error("이미지 업로드 실패:", error));
    },
    connectWebSocket() {
      // WebSocket 연결을 생성합니다.
      this.socket = new WebSocket(`ws://localhost:8080/ws/chat?chatRoomId=${this.chatRoomId}`);
      
      // 연결이 열릴 때 실행될 콜백 함수를 정의합니다.
      this.socket.onopen = () => {
        console.log("WebSocket 연결 성공");
        // 채팅방에 입장 메시지를 전송합니다.
        this.enterChatRoom();
      };
      
      // 메시지를 수신할 때 실행될 콜백 함수를 정의합니다.
      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.messages.push(data); // 수신된 메시지를 메시지 목록에 추가합니다.
      };
      
      // 연결이 종료될 때 실행될 콜백 함수를 정의합니다.
      this.socket.onclose = () => {
        console.log("WebSocket 연결 종료");
      };
      
      // 오류가 발생했을 때 실행될 콜백 함수를 정의합니다.
      this.socket.onerror = (error) => {
        console.error("WebSocket 오류 발생:", error);
      };
    },
    fetchChatRoomDetails(roomId) {
      // Axios를 사용하여 백엔드 API 호출
      this.$axios.get(`http://localhost:8080/api/v1/chat/room/${roomId}`)
        .then(response => {
          // 응답으로 받은 데이터에서 채팅방 정보를 추출하여 저장
          this.chatRoomName = response.data.chatRoomName;
          // 필요에 따라 추가 정보를 여기에 저장
        })
        .catch(error => {
          console.error("채팅방 정보를 불러오는 중 오류가 발생했습니다:", error);
        });
    },
    fetchMessages() {
      // 채팅방 메시지 내역을 불러오는 API 호출
      this.$axios.get(`http://localhost:8080/api/v1/chat/room/${this.chatRoomId}/messages`)
        .then(response => {
          this.messages = response.data; // 불러온 메시지 목록으로 messages 배열 갱신
        })
        .catch(error => {
          console.error("채팅방 메시지를 불러오는 중 오류가 발생했습니다:", error);
        });
    },
    // 웹소켓 메세지 전송 메소드 
    sendMessage(imageUrl = '') {
      const messageData = {
        messageType: "TALK",
        chatRoomId: this.chatRoomId,
        senderId: this.userId,
        message: this.newMessage || imageUrl,
      };
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(messageData));
        this.newMessage = '';  // 입력 필드 초기화
      } else {
        console.error("WebSocket 연결이 되어있지 않습니다.");
      }
    },
    // 이미지 url 이 실제 사진으로 보이게 하는 메소드
    isImageUrl(message) {
      return message.startsWith("http") && (message.endsWith(".png") || message.endsWith(".jpg") || message.endsWith(".jpeg") || message.endsWith(".gif"));
    },
    enterChatRoom() {
    // WebSocket이 열려있는지 확인하고, 열려있다면 서버에 입장 신호만 전송합니다.
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      // messageType이 'ENTER'인 메시지를 서버로 전송합니다.
      // 이 메시지는 서버에서 사용자의 입장을 알리는 용도로 사용됩니다.
        const enterSignal = {
          messageType: "ENTER",
          chatRoomId: this.chatRoomId,
          senderId: this.userId,
          // 실제 메시지 내용은 서버에서 생성됩니다.
        };
        this.socket.send(JSON.stringify(enterSignal));
        } else {
        console.error("WebSocket 연결이 준비되지 않았습니다.");
      }
    },
  }
};
</script>
<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}

/* 전체 채팅방 컨테이너 */
.chat-room-container {
  display: flex;
  flex-direction: column;
  height: 90vh; /* 화면의 전체 높이 */
}

/* 채팅메시지 이미지 크기 */
.message-content img {
  max-width: 100%;  /* 이미지가 채팅창 너비를 넘지 않도록 설정 */
  height: auto;  /* 이미지 비율을 유지하면서 너비에 맞춤 */
}

/* 이미지 업로드 버튼 */
.custom-file-upload {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}
/* 이미지 업로드 버튼 */
.custom-file-upload:hover {
  background-color: #0056b3;

}

/* 이미지 업로드 버튼 */
.file-input {
  margin-right: 10px;
  border: 1px solid #ccc;
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
}

/* 채팅방 헤더 스타일 */
.chat-room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

/* 채팅방 헤더 스타일 */
.chat-room-header {

  /* 상단 헤더 스타일링 */
}

/* 채팅 메시지 스타일 */
.center-panel ul {
  list-style-type: none; /* 기본적으로 설정된 목록 스타일의 점을 제거 */
  padding-left: 0; /* 목록 앞의 기본 패딩도 제거 */
}

/* 메인 콘텐츠 영역을 3개의 섹션으로 나누기 */
.main-content {
  display: flex;
  flex-grow: 1; /* 헤더 아래의 남은 공간을 모두 사용 */
}

/* 왼쪽, 가운데, 오른쪽 섹션 스타일링 */
.left-panel, .center-panel, .right-panel {
  flex: 1; /* 각각의 패널이 동일한 너비를 가지도록 */
  padding: 10px; /* 패딩을 추가하여 내용과 경계 사이에 여백을 만듦 */
  overflow-y: auto; /* 내용이 많을 경우 스크롤바를 표시 */
}

/* 왼쪽 세션 */
.left-panel {
  flex: 0.5;
  border-right: 1px solid #ddd; /* 오른쪽에 경계선 추가 */
}

/* 가운데 세션 */
.center-panel {
  flex: 2.2;
  border-right: 1px solid #ddd; /* 오른쪽에 경계선 추가 */
}

/* 오른쪽 세션 */
.right-panel {
  flex: 0.8;
}

/* 채팅방 이름 스타일 */
.chat-room-title {
  font-size: 1.5em;
}

/* 아이디 로그인 스타일 */
.user-profile {
  display: flex;
  align-items: center;
}

/* 유저 프로필 스타일 */
.user-avatar {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  margin-right: 10px;
  margin-top: 40px;
  margin-bottom: 20px;
}

/* 유저 이름 스타일 */
.user-name {
  font-size: 1.5em;
  font-weight: bold;
}

/* 유저 추가정보 스타일 */
.user-detail{
  font-size: 0.8em;
  color: #5c5c5c;
}

/* 채팅메시지 스타일 */
.message-item {
  margin-bottom: 10px;
}

/* 채팅메시지 유저아이디 스타일 */
.message-sender {
  font-weight: bold;
  margin-right: 5px;
}

/* 채팅메시지 내용 스타일*/
.message-content {
  word-break: break-word;
}

/* 메시지 입력 영역 스타일 */
.message-input-area {
  padding: 16px;
  background-color: #f5f5f5;
  border-top: 1px solid #ddd;
  border-left: 1px solid #dddd;
  width: 85%;
  margin-left:14.8%;
}

/* 메시지 이미지 전송 폼 스타일 */
.message-form {
  display: flex;
}

/* 메시지 (텍스트) 입력 영역 스타일 */
.input-field {
  flex-grow: 1;
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* 메시지 전송 버튼 스타일 */
.send-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
