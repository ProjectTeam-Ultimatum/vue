<template>
  <div>
    <h1>{{ chatRoomName }}</h1>
    <!-- 사용자 아이디 입력 필드 추가 -->
    <input v-model="userId" placeholder="아이디 입력" />
    <ul v-for="message in messages" :key="message.id">
      <!-- 채팅 메시지 목록 표시 -->
      <li>{{ message.senderId }}: {{ message.message }}</li>
    </ul>
    <form @submit.prevent="sendMessage">
      <input v-model="newMessage" placeholder="메시지를 입력하세요" />
      <button type="submit">보내기</button>
    </form>
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
    };
  },
  mounted() {
    // URL에서 roomId를 추출
    this.chatRoomId = this.$route.params.roomId;
    // 추출한 roomId를 사용하여 API 호출
    this.fetchChatRoomDetails(this.chatRoomId);
    // 채팅방 메시지 내역을 불러옵니다.
    this.fetchMessages(); 
  },
  methods: {
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
      const messageData = {
        messageType: "TALK",
        chatRoomId: this.chatRoomId,
        senderId: this.userId, 
        message: this.newMessage,
      };
      this.$axios.post('http://localhost:8080/api/v1/chat/message', messageData)
        .then(() => {
          this.newMessage = ''; // 입력 필드 초기화
          this.fetchMessages(); // 메시지 목록을 다시 불러옵니다.
        })
        .catch(error => {
          console.error("메시지 전송 실패:", error);
        });
    },
  }
};
</script>
