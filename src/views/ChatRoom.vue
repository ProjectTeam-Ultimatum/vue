<template>
  <div class="chat-room-container">
    <!-- 채팅방 상단 영역: 채팅방 이름 및 사용자 정보 -->
    <header class="chat-room-header">
      <div class="chat-room-title">{{ chatRoomName }}</div>
      <div class="user-profile">
        <img src="../assets/profile.png" alt="User Avatar" class="user-avatar" />
        <span class="user-name">배정현</span>
            <input v-model="userId" placeholder="아이디 입력" />
    <!-- 입장 버튼 추가 -->
    <button @click="enterChatRoom">입장</button>
      </div>
    </header>

    <!-- 채팅 메시지 목록 -->
    <section class="chat-messages">
      <ul>
        <li v-for="message in messages" :key="message.id" class="message-item">
          <span class="message-sender">{{ message.senderId }}:</span>
          <span class="message-content">{{ message.message }}</span>
        </li>
      </ul>
    </section>

    <!-- 메시지 입력 영역 -->
    <footer class="message-input-area">
      <form @submit.prevent="sendMessage" class="message-form">
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
    sendMessage() {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        const messageData = {
          messageType: "TALK",
          chatRoomId: this.chatRoomId,
          senderId: this.userId, 
          message: this.newMessage,
        };
        // WebSocket을 통해 서버로 메시지를 전송합니다.
        this.socket.send(JSON.stringify(messageData));
        this.newMessage = ''; // 입력 필드 초기화
      } else {
        console.error("WebSocket 연결이 되어있지 않습니다.");
      }
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
/* 전체 채팅방 컨테이너 */
.chat-room-container {
  display: flex;
  flex-direction: column;
  height: 100%;
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

.chat-room-title {
  font-size: 1.5em;
}

.user-profile {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-name {
  font-size: 1em;
}

/* 채팅 메시지 목록 스타일 */
.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 16px;
  background-color: #e9e9e9;
}

.message-item {
  margin-bottom: 10px;
}

.message-sender {
  font-weight: bold;
  margin-right: 5px;
}

.message-content {
  word-break: break-word;
}

/* 메시지 입력 영역 스타일 */
.message-input-area {
  padding: 16px;
  background-color: #f5f5f5;
  border-top: 1px solid #ddd;
}

.message-form {
  display: flex;
}

.input-field {
  flex-grow: 1;
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.send-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
