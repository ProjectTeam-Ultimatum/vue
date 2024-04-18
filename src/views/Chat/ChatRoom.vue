<template>
  <div class="chat-room-container">
    <!-- 채팅방 상단 영역: 채팅방 이름 및 사용자 정보 -->
    <header class="chat-room-header">
      <div class="chat-room-title">{{ chatRoomName }}</div>
      <button class="leave-button" @click="leaveChatRoom">나가기</button>
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
        <li v-for="message in messages" :key="message.id"
            :class="{'my-message': message.senderId === userName, 'other-message': message.senderId !== userName}">
          <span class="message-sender">{{ message.senderId }}:</span>
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
        <p class="user-name">{{ userName }}</p>
        <p class="user-detail">신뢰도</p>
        <p class="user-detail">나이:  {{ userAge }}</p>
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
      userId: null,
      userName: '',  // 사용자 이름
      userEmail:'',
      userGender:'',
      userAge:'',
      newMessage: '', // 사용자가 입력한 새 메시지
      messages: [], // 채팅방의 메시지 목록
      socket: null,
    };
  },
  mounted() {
    this.connectWebSocket(); // WebSocket 연결을 설정합니다.
    this.chatRoomId = this.$route.params.roomId; // URL에서 roomId를 추출
    this.fetchChatRoomDetails(this.chatRoomId); // 추출한 roomId를 사용하여 API 호출
    this.fetchMessages();  // 채팅방 메시지 내역을 불러옵니다.
    this.fetchUserInfo();  // 사용자 정보를 불러옵니다.
  },
  methods: {
    // 이미지 파일 업로드 처리
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) {
        console.error("파일을 선택하지 않았습니다.");
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      this.$axios.post('http://localhost:8080/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        const imageUrl = response.data;
        this.sendMessage(imageUrl); // 이미지 URL을 채팅으로 전송
      })
      .catch(error => {
        console.error("이미지 업로드 실패:", error);
        alert("이미지를 업로드하는 동안 오류가 발생했습니다.");
      });
    },
    // WebSocket 연결 설정
    connectWebSocket() {
      // 로컬 스토리지에서 인증 토큰을 가져옵니다.
      const rawToken = localStorage.getItem('Authorization');
      if (!rawToken) {
        console.error('Authentication token is missing. Please login.');
        return;
      }
      // 'Bearer ' 접두사 제거
      const token = rawToken.replace('Bearer ', '');

      this.socket = new WebSocket(`ws://localhost:8080/ws/chat?chatRoomId=${this.chatRoomId}&token=${encodeURIComponent(token)}`);

      this.socket.onopen = () => {
        console.log("WebSocket 연결 성공");
        this.enterChatRoom();
      };

      // 메시지를 수신할 때 실행될 콜백 함수를 정의합니다.
      this.socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.senderId && data.message) {
              // 서버로부터 받은 메시지에 senderId가 현재 사용자의 ID와 동일한 경우
              if (data.senderId === this.userName) {
                  data.isMine = true;  // 메시지가 현재 사용자의 것임을 표시
              } else {
                  data.isMine = false; // 다른 사용자의 메시지임을 표시
              }
              this.messages.push(data);
          }
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
    fetchUserInfo() {
      this.$axios.get('http://localhost:8080/api/v1/user/info/detail')
        .then(response => {
          this.userId = response.data.id; // 사용자 ID 설정
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
        senderId: this.userName,
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
    leaveChatRoom() {
      const leaveMessage = {
        messageType: "LEAVE",
        chatRoomId: this.chatRoomId,
        senderId: this.userName,
      };
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(leaveMessage));
        this.socket.close(); // WebSocket 연결을 닫습니다.
      }
      this.$router.push({ name: 'chatting' });
    }
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
/* 기본 말풍선 스타일 */
.message-content {
  display: inline-block;
  padding: 10px 14px;
  border-radius: 18px;
  margin: 5px 10px;
  max-width: 60%;
  position: relative;
  box-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

/* 나의 메시지 스타일 */
.my-message {
  text-align: right;
}

.my-message .message-content {
  background-color: #F7EC1D; /* 황색 */
  border-bottom-right-radius: 0;  /* 오른쪽 아래 코너를 평평하게 */
}

.my-message .message-content::after {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  bottom: 0;
  right: 10px;
  margin-bottom: -20px;
}


/* 다른 사람의 메시지 스타일 */
.other-message {
  text-align: left;
}

.other-message .message-content {
  background-color: #F3F3F3; /* 밝은 회색 */
  border-bottom-left-radius: 0;  /* 왼쪽 아래 코너를 평평하게 */
}

.other-message .message-content::after {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  bottom: 0;
  left: 10px;
  margin-bottom: -20px;
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

.leave-button {
  padding: 8px 16px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}
.leave-button:hover {
  background-color: #ff7875;
}
</style>
