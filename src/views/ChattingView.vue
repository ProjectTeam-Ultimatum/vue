<template>
  <div>
    <h2>채팅방 목록</h2>
    <ul>
      <li v-for="room in chatRooms" :key="room.chatRoomId">
        <a href="#" @click="enterChatRoom(room.chatRoomId)">{{ room.chatRoomName }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chatRooms: [], // 채팅방 목록을 저장할 배열
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
    enterChatRoom(roomId) {
      // Vue Router를 사용하여 해당 채팅방의 상세 페이지로 이동
      this.$router.push({ name: 'ChatRoom', params: { roomId: roomId } });
    }
  }
};
</script>
