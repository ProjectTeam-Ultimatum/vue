<template>
  <div class="divider" />
  <div class="info-container">
    <form @submit.prevent="updateUserInfo">
      <div class="member">
        <div class="mypage-maintext">내 정보 수정</div>
        <div class="mypage-content-row">
          <div class="member-image">
            <div class="file-upload-wrapper">
              <div class="image-upload-preview" v-if="profileImageSrc">
                <img :src="profileImageSrc" class="profile-image" />
                <button
                  type="button"
                  class="image-edit-button"
                  @click.prevent="triggerFileInput"
                >
                  &#9998;
                </button>
              </div>
              <div v-else class="image-upload-placeholder">
                <button
                  type="button"
                  @click="triggerFileInput"
                  class="file-upload-button"
                ></button>
              </div>
              <input
                type="file"
                id="profileImage"
                ref="profileImage"
                @change="handleFileChange"
                style="display: none"
              />
            </div>
          </div>
          <div class="member-content">
            <div class="info-group">
              <label for="email">이메일</label>
              <div class="member-info" id="name">{{ email }}</div>
            </div>
            <div class="info-group">
              <label for="name">이 름</label>
              <input
                class="member-input"
                id="name"
                v-model="userName"
                required
              />
            </div>

            <div class="info-group">
              <label for="age">나 이</label>
              <input
                class="member-input"
                id="age"
                placeholder="숫자만 입력가능합니다"
                v-model="age"
                required
              />
            </div>
            <div class="info-group">
              <label for="gender">성 별</label>
              <select
                id="gender"
                v-model="gender"
                class="member-input"
                required
              >
                <option value="M">남성</option>
                <option value="F">여성</option>
              </select>
            </div>
            <div class="info-group">
              <label for="post">우편번호</label>
              <input
                id="post"
                type="text"
                placeholder="우편번호"
                class="member-input"
                v-model="zonecode"
                readonly
              />
              <button
                id="postcode"
                type="button"
                @click="openPostcode"
                class="icon-button"
              >
                <font-awesome-icon icon="search" style="color: #65b7f3" />
              </button>
            </div>
            <div class="info-group">
              <label for="address">주 소</label>
              <input
                id="address"
                type="text"
                v-model="roadAddress"
                placeholder="주소"
                class="member-input"
                readonly
              />
            </div>
            <div class="info-group">
              <label for="detailAddress">상세주소</label>
              <input
                id="detailAddress"
                type="text"
                v-model="detailAddress"
                placeholder="상세주소"
                class="member-input"
                @blur="saveAddress"
                ref="detailAddress"
              />
            </div>
            <div class="info-group">
              <label for="findByAnswer">가고싶은 여행지는?</label>
              <input
                class="member-input"
                id="findByAnswer"
                placeholder="여행지"
                v-model="findByAnswer"
                required
              />
            </div>
            <div class="info-group">
              <label for="style">여행 스타일</label>
              <div class="member-info" id="style">
                {{ style }}
              </div>
              <div @click="goToStyle" class="goToStyle">스타일 변경</div>
            </div>
          </div>
        </div>
        <div class="buttons">
          <button type="submit" class="goToModify">저 장</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userName: this.userName,
      email: this.email,
      age: this.age,
      gender: this.gender,
      address: this.address,
      findByAnswer: this.findByAnswer,
      style: this.style,
      profileImageSrc: null,
      profileImageFile: null,
      zonecode: "",
      roadAddress: "",
      detailAddress: "",
    };
  },
  mounted() {
    this.fetchUserDetail();
  },
  methods: {
    goToStyle() {
      this.$router.push("/travel");
    },
    updateUserInfo() {
      try {
        const formData = new FormData();
        formData.append("memberName", this.userName);
        formData.append("userEmail", this.email);
        formData.append("memberAge", this.age);
        formData.append("memberGender", this.gender);
        formData.append("memberAddress", this.address);
        formData.append("findByPasswordAnswer", this.findByAnswer);
        console.log("변경정보 : ", formData);
        // 프로필 이미지 파일 추가
        if (this.profileImageFile) {
          formData.append("files", this.profileImageFile);
        }

        // FormData 내용 검사
        for (var pair of formData.entries()) {
          console.log(pair[0] + ", " + pair[1]);
        }

        this.$axios.put(`/api/v1/user/update-info`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("수정이 완료되었습니다.");
        alert("회원정보 수정 완료 !");

        this.$router.push("/mypage");
      } catch (error) {
        console.error("멤버 정보 수정 실패 : ", error);
      }
    },
    async fetchUserDetail() {
      try {
        const response = await this.$axios.get("/api/v1/user/info/detail");

        this.userName = response.data.userName;
        this.email = response.data.email;
        this.age = response.data.age;
        this.gender = response.data.gender;
        this.address = response.data.address;
        this.profileImageSrc = response.data.images;
        this.findByAnswer = response.data.findByAnswer;
        this.style = response.data.memberStyle;

        console.log("멤버 디테일 : ", response.data); // API 응답 로깅
      } catch (error) {
        console.error("멤버 정보를 가져오는데 실패하였습니다. : ", error);
        alert(error.response.data.message);
      }
    },
    triggerFileInput() {
      console.log("File input triggered");
      this.$refs.profileImage.click();
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.profileImageFile = file;
        // 데이터 URL을 읽어 이미지 미리보기를 설정합니다.
        const reader = new FileReader();
        reader.onload = (e) => {
          this.profileImageSrc = e.target.result; // 미리보기 이미지를 데이터 URL로 설정
        };
        reader.readAsDataURL(file);
        // 파일 객체를 저장합니다.
        this.profileImageFile = file;
      }
    },
    openPostcode() {
      new window.daum.Postcode({
        oncomplete: (data) => {
          // 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분
          this.zonecode = data.zonecode; // 우편번호
          this.roadAddress = data.roadAddress; // 도로명 주소
          this.detailAddress = ""; // 상세 주소는 초기화

          // 이제 세 부분의 주소를 합쳐서 `address`에 저장
          this.address = `${data.roadAddress}`; // 도로명 주소로 초기 설정
          this.$refs.detailAddress.focus(); // 상세 주소 필드에 포커스를 줍니다.
        },
      }).open();
    },
    saveAddress() {
      // 우편번호, 도로명 주소, 상세 주소를 합쳐 `address`에 저장
      this.address =
        `${this.zonecode} ${this.roadAddress} ${this.detailAddress}`.trim();
    },
  },
};
</script>

<style scoped>
@import "@/assets/css/login_style.css";

.goToStyle {
  cursor: pointer;
  background-color: white;
  color: #68c7ff;
  border: 1px solid #68c7ff;
  border-radius: 5px;
  font-size: 18px;
  padding: 10px;
  margin: 8px;
}
.info-container {
  display: flex;
  flex-direction: column;
  margin-left: 10%;
  margin-right: 10%;
  margin-top: 50px;
}
.mypage-maintext {
  padding: 30px;
  color: #393939;
  font-size: 40px;
  font-weight: bold;
}
.mypage-content-row {
  border-top: 1px solid #e1e1e1;
  display: flex;
  flex-direction: row;
  padding: 50px;
}
.member {
  justify-content: center;
  text-align: center;
}
.info-group {
  display: flex;
  flex-direction: row;
  font-size: 20px;
  color: #393939;
  border-bottom: 1px solid #e1e1e1;
}
.member-image {
  display: flex;
  justify-content: center;
  width: 30%;
  padding: 20px;
}
.member-content {
  width: 70%;
}
label {
  display: flex;
  justify-content: start;
  width: 40%;
  padding: 20px;
  margin-left: 50px;
}
.member-info {
  display: flex;
  justify-content: start;
  width: 40%;
  padding: 20px;
}
.buttons {
  display: flex;
  justify-content: center;
}
.buttons button {
  width: 300px;
  height: 70px;
  border-radius: 5px;
  margin-top: 20px;
  margin-left: 10px;
}
.goToModify {
  background-color: #68c7ff;
  color: white;
  border: none;
  font-size: 20px;
}

.info-group-pw {
  display: flex;
  flex-direction: row;
  font-size: 20px;
  color: #393939;
  border-bottom: 1px solid #e1e1e1;
}
.pw {
  display: flex;
  justify-content: start;
  margin-top: 10px;
  padding: 10px;
  height: 100%;
  border-radius: 5px;
  background-color: white;
  border: 1px solid #1275d6;
  color: #1275d6;
}
.pw:hover {
  border-radius: 5px;
  background-color: #1275d6;
  border: 1px solid white;
  color: white;
}
.member-input {
  font-size: 18px; /* 입력 필드 글자 크기 */
  width: 400px; /* 전체 너비 */
  border: 1px solid #e1e1e1; /* 모든 테두리 제거 */
  outline: none; /* 클릭 시 테두리 없앰 */
  margin: 10px;
  margin-right: 5px;
  border-radius: 5px;
  padding: 10px;
}
</style>