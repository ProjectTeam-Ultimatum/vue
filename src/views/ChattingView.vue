<template>
    <div>
      <h2>채팅방 목록</h2>
      <ul>
        <li v-for="room in chatRooms" :key="room.chatRoomId">
          {{ room.chatRoomName }}
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
      }
    }
  };
  </script>
  