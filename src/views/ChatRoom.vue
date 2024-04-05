<template>
  <div>
    <h1>{{ chatRoomName }}</h1>
    <!-- 채팅방 내용 -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      chatRoomId: null,
      chatRoomName: '', // 채팅방 이름을 저장할 변수
      // 필요한 경우, 추가 데이터 속성을 여기에 선언
    };
  },
  mounted() {
    // URL에서 roomId를 추출
    this.chatRoomId = this.$route.params.roomId;
    // 추출한 roomId를 사용하여 API 호출
    this.fetchChatRoomDetails(this.chatRoomId);
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
    }
  }
};
</script>
