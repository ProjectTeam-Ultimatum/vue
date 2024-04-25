<template>
  <div class="chat-room-container">
    <div class="divider" ></div>
    <!-- 채팅방 상단 영역: 채팅방 이름 및 사용자 정보 -->
    <header class="chat-room-header">
      <div class="chat-room-title">{{ chatRoomName }}</div>
      <div class="button-container"> <!-- 버튼 컨테이너 추가 -->
        <button class="back-button" @click="goBackToChatList">채팅 목록으로</button>
        <button class="leave-button" @click="leaveChatRoom">나가기</button>
      </div>
    </header>

    <!-- 메인 콘텐츠 영역 -->
    <div class="main-content">
    <!-- 왼쪽 패널 -->
    <aside class="left-panel">
      <h2>채팅방 목록</h2>
      <div class="chatroom-list">
        <div v-for="room in connectedChatRooms" :key="room.chatRoomId" class="chatroom-card">
          <!-- 방장 이미지 출력 -->
          <img :src="room.creatorImage || '/path/to/default-image.jpg'" alt="방장 이미지" class="creator-image">
          <!-- 채팅방 정보 세부사항 -->
          <div class="chatroom-details">
            <h3>{{ room.chatRoomName }}</h3>
            <p class="chatroom-info">방장: <span class="chatroom-meta">{{ room.creatorName }}</span> ({{ room.creatorAge }} 살)</p>
            <p class="chatroom-info"><span class="chatroom-meta">{{ room.chatRoomContent }}</span></p>
          </div>
        </div>
      </div>
    </aside>

    
    <!-- 가운데 패널 -->
    <section class="center-panel" ref="messageContainer">
      <!-- 채팅 메시지 목록 -->
      <ul>
        <li v-for="message in messages" :key="message.id"
            :class="{'my-message': message.senderId === userName, 'other-message': message.senderId !== userName, 'enter-leave-message': message.messageType === 'ENTER' || message.messageType === 'LEAVE'}">
          <!-- 조건부 렌더링으로 senderId 표시 -->
          <span v-if="message.messageType !== 'ENTER' && message.messageType !== 'LEAVE'" class="message-sender">{{ message.senderId }}:</span>
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
    <div class="profile-picture">
        <div v-if="userImages.length > 0">
          <img v-for="(image, index) in userImages" :src="image" :key="index" :alt="`${userName}'s profile image ${index + 1}`" />
        </div>
      </div>
        <p class="user-name">{{ userName }}</p>
        <p class="user-detail">신뢰도</p>
        <p class="user-detail">나이:  {{ userAge }}</p>
        <p class="user-detail">여행 스타일:  {{ getMbtiNickname() }} </p>
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

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h4>경고 <font-awesome-icon icon="fa-solid fa-circle-exclamation" style=color:#FFD43B /></h4>
        <p style=margin-top:15px;>{{ warningMessage }}</p>
        <button @click="closeModal" class="closeModalButton">확인</button>
      </div>
    </div>

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
      connectedChatRooms: [],  // 사용자가 연결된 채팅방 ID 목록
      badWordsPattern: /나쁜말|나\s*쁜\s*말|나쁜[\d\s\W]*말|바보|바\s*보|바[\d\s\W]*보|멍청이|멍\s*청\s*이|멍[\d\s\W]*청이|멍청[\d\s\W]*이/,  // 정규 표현식 패턴을 사용하여 욕설 필터링
      warningCount: 0,   //비속어 5회이상 채팅제한
      isChatBanned: false,  //비속어 5회이상 채팅제한
      banTimer: null, //비속어 5회이상 채팅제한
      warningMessage: '',
      showModal: false,
      mbtiNicknames: { // MBTI 별명 매핑
        "ISFJ": "여행한정 인싸",
        "INFJ": "감성 여행자",
        "INTJ": "효율 계획러",
        "ISTJ": "프로 엑셀러",
        "ISFP": "힐링 여행러",
        "INFP": "로맨틱 여행파",
        "INTP": "한적 스팟러",
        "ISTP": "프로 혼행러",
        "ESFJ": "프로 핫스팟러",
        "ENFJ": "프로 여행러",
        "ENTJ": "효율 로보트",
        "ESTJ": "엑셀 마스터",
        "ESFP": "여행 즉흥론자",
        "ENFP": "여행 무계획러",
        "ENTP": "위기탈출 넘버원",
        "ESTP": "프로 플렉서"
      },
      userImages:[],
    };
  },

  computed: {
    isValidStyle() {
      // MBTI 스타일 문자열의 유효성 검사를 안전하게 수행
      return Object.prototype.hasOwnProperty.call(this.mbtiNicknames, this.memberStyle);
    }
  },


  mounted() {
    this.connectWebSocket(); // WebSocket 연결을 설정합니다.
    this.chatRoomId = this.$route.params.roomId; // URL에서 roomId를 추출
    this.fetchChatRoomDetails(this.chatRoomId); // 추출한 roomId를 사용하여 API 호출
    this.fetchMessages();  // 채팅방 메시지 내역을 불러옵니다.
    this.fetchUserInfo();  // 사용자 정보를 불러옵니다.
    this.fetchConnectedChatRooms();
  },
  methods: {

    // 연결된 채팅방 목록 요청
    fetchConnectedChatRooms() {
      this.$axios.get('http://localhost:8080/api/v1/chat/connected-rooms')
        .then(response => {
          console.log('Connected chat rooms:', response.data); // 로그로 데이터 확인
          this.connectedChatRooms = response.data;
          if (this.connectedChatRooms.length === 0) {
            console.log('No connected chat rooms found.'); // 로그로 빈 배열 확인
          }
        })
        .catch(error => {
          console.error('Failed to fetch connected chat rooms:', error);
        });
    },


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
        // 이미 열려 있는 웹소켓 연결이 있는지 확인합니다.
      if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
        console.log("Using existing WebSocket connection.");
        return;  // 이미 열려있는 연결을 재사용합니다.
      }
      this.setupNewWebSocketConnection();
    },


    setupNewWebSocketConnection() {
      const rawToken = localStorage.getItem('Authorization');
      if (!rawToken) {
        console.error('Authentication token is missing. Please login.');
        return;
      }
      const token = rawToken.replace('Bearer ', '');
      this.socket = new WebSocket(`ws://localhost:8080/ws/chat?chatRoomId=${this.chatRoomId}&token=${encodeURIComponent(token)}`);

      this.socket.onopen = () => {
        console.log("WebSocket connection established.");
        this.enterChatRoom();
        this.fetchConnectedChatRooms();
      };

      this.socket.onmessage = this.handleWebSocketMessage;
      // 연결이 종료될 때 실행될 콜백 함수를 정의합니다.
      // WebSocket 연결 종료 시
      this.socket.onclose = () => {
        console.log("WebSocket 연결 종료");
        // 연결 종료 후 바로 채팅방 목록을 갱신하지 않고, 짧은 딜레이 후에 갱신을 시도합니다.
        setTimeout(() => {
          this.fetchConnectedChatRooms(); // 연결된 채팅방 목록을 새로고침
        }, 1000); // 1초 후에 채팅방 목록 갱신
      };
      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    },

    handleWebSocketMessage(event) {
      const data = JSON.parse(event.data);
      console.log("Received message:", data);

      if (data.type === 'CONNECTED_CHAT_ROOMS_UPDATE') {
        this.connectedChatRooms = data.chatRooms;
      }
      if (data.messageType === 'ENTER' || data.messageType === 'LEAVE') {
        data.isSystemMessage = true;
        this.messages.push(data);
      } else if (data.senderId && data.message) {
        if (data.senderId === this.userName) {
          data.isMine = true;
        } else {
          data.isMine = false;
        }
        this.messages.push(data);
      }
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
          this.userStyle = response.data.memberStyle; // "memberStyle" 키에 접근
          this.userImages = response.data.images;  // 이미지 URL 리스트 저장
        })
        .catch(error => {
          console.error("사용자 정보를 불러오는 중 오류가 발생했습니다:", error);
        });
    },
    getMbtiNickname() {
      return this.mbtiNicknames[this.userStyle] || '알 수 없는 스타일';
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

      //비속어 5회 이상시 채팅 일시정지
      if (this.isChatBanned) {
        this.displayMessage(`채팅이 일시적으로 금지되었습니다. 잠시 후 다시 시도해 주세요.`);
        return;
      }

      // 메시지 필터링
      if (this.filterMessage(this.newMessage)) {
        this.warningCount++;
        this.displayMessage(`부적절한 내용이 포함되어 있어 메시지를 전송할 수 없습니다. 5회 이상 욕설 시 5분간 채팅이 제한됩니다. (${this.warningCount}/5)`);
        this.newMessage = '';  // 입력 필드 초기화
        if (this.warningCount >= 5) {
          this.banChat();
        }
        return; // 메시지 전송 차단
      }

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
    // 욕설 5회 이상 채팅 금지
    banChat() {
      this.isChatBanned = true;
      setTimeout(() => {
        this.isChatBanned = false;
        this.warningCount = 0;  // 경고 횟수 초기화
      }, 300000); // 5분 동안 채팅 금지
    },
    // 욕설 필터링 함수
    filterMessage(message) {
      return this.badWordsPattern.test(message);
    },
    displayMessage(msg) {
      this.warningMessage = msg;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
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
          senderId: this.userName,
          // 실제 메시지 내용은 서버에서 생성됩니다.
        };
        this.socket.send(JSON.stringify(enterSignal));
        } else {
        console.error("WebSocket 연결이 준비되지 않았습니다.");
      }
    },
    goBackToChatList() {
      // 채팅 목록 페이지로 이동
      this.$router.push('/chatting');
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
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messageContainer;
        container.scrollTop = container.scrollHeight;
      });
    },
  },
  updated() {
    this.scrollToBottom();
  }
};
</script>
<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}

.divider {
  padding: 50px;
}

/* 경고 모달창 */
.modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  width: 450px;
  height: 200px;
  box-shadow: 
    0px 4px 6px rgba(0, 0, 0, 0.1),    /* 부드러운 그림자 */
    0px 1px 3px rgba(0, 0, 0, 0.08),   /* 작은 세부 그림자 */
    0px 10px 20px rgba(0, 0, 0, 0.06); /* 큰 퍼진 그림자 */
}

.closeModalButton {
    color: #F3F3F3;
    background-color: #65B7F3;
    border: none;
    border-radius: 25px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: transform 0.3s ease;
    width: 400px;
    height: 40px;
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
  width: 125px;
  height: 50px;
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
  flex: 0.6;
  border-right: 1px solid #ddd; /* 오른쪽에 경계선 추가 */
}

.chatroom-list {
  list-style: none;
  padding: 0;
}

.chatroom-card {
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  transition: box-shadow 0.3s ease;
  display: flex; /* 추가: 카드를 플렉스 컨테이너로 설정 */
  align-items: center; /* 추가: 항목들을 세로 중앙에 위치 */
}

.creator-image {
  width: 100px; /* 이미지 크기 */
  height: 100px; /* 이미지 크기 */
  border-radius: 50%; /* 원형 이미지 */
  object-fit: cover; /* 비율 유지 */
  margin-bottom: 8px; /* 이미지와 텍스트 사이의 여백 */
  margin-right: 20px; /* 추가: 이미지와 텍스트 사이의 여백 */
}

.chatroom-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 호버 시 그림자 효과 */
}

.chatroom-card h3 {
  color: #333; /* 제목 색상 */
  margin: 0 0 10px 0; /* 제목과 정보 사이 간격 */
}

.chatroom-info {
  color: #666; /* 정보 텍스트 색상 */
  font-size: 14px; /* 정보 텍스트 크기 */
  line-height: 1.5; /* 줄간격 */
}

.chatroom-meta {
  color: #007bff; /* 메타 데이터 색상 */
  font-weight: bold; /* 메타 데이터 굵기 */
}

.chatroom-details {
  display: flex; /* 플렉스로 설정 */
  flex-direction: column; /* 항목들을 세로로 정렬 */
}

/* 가운데 세션 */
.center-panel {
  flex: 2.2;
  border-right: 1px solid #ddd; /* 오른쪽에 경계선 추가 */
  overflow-y: auto; /* 내용이 많을 경우 스크롤바를 표시 */
  height: calc(100vh - 240px); /* 뷰포트 높이에서 헤더와 푸터 높이를 빼고 설정 */
}

/* 오른쪽 세션 */
.right-panel {
  flex: 0.6;
  display: flex;
  flex-direction: column;
  align-items: center; /* 수평 방향 중앙 정렬 */
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
  width: 81.8%;
  margin-left:18.15%;
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
  height: 50px;
}

/* 메시지 전송 버튼 스타일 */
.send-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  height: 50px;
  width: 100px;
}

.back-button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}
.back-button:hover {
  background-color: #4CAF50;
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

.enter-leave-message {
  display: flex; /* Flexbox 사용 */
  justify-content: center; /* 가운데 정렬 */
  width: 100%; /* 전체 너비 사용 */
}

.enter-leave-message .message-content {
  color: #888; /* 회색으로 표시 */
  font-style: italic;
  text-align: center;
  width: auto; /* 자동 너비 설정 */
}

.button-container {
  display: flex; /* 버튼들을 가로로 나란히 배치 */
  gap: 8px; /* 버튼 사이의 간격 */
}

/* 채팅방 목록 카드 프로필이미지 스타일 */
.profile-picture img {
  width: 130px; /* 프로필 이미지 크기 */
  height: 130px; /* 프로필 이미지 크기 */
  border-radius: 50%; /* 원형으로 만들기 */
  margin-right: 20px; /* 텍스트 컨텐츠와의 간격 */
}
</style>