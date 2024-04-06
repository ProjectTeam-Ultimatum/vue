<template>
  <div>
    <h2>채팅방 목록</h2>
    <form @submit.prevent="createChatRoom">
      <input v-model="newChatRoomName" type="text" placeholder="채팅방 이름 입력" />
      <button type="submit">채팅방 생성</button>
    </form>
    <ul>
      <li v-for="room in chatRooms" :key="room.chatRoomId">
        <a href="#" @click="enterChatRoom(room.chatRoomId)">{{ room.chatRoomName }}</a>
        <button @click="deleteChatRoom(room.chatRoomId)">삭제</button>
      </li>
    </ul>
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
