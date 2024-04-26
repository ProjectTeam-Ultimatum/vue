<template>
  <div class="backimg">
    <div class="plancontainer">
      <div class="planallday">
        <div class="alldayplan">전체일정</div>
        <div v-for="(day, index) in planDays" :key="day.id">
          <h3>{{ index + 1 }}일차</h3>
          <p>{{ day.description }}</p>
        </div>
      </div>
    </div>
    <div class="gohomecontainer">
      <button>홈으로</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return{
        planId: null,
        planDays: [],
    };
  },
  mounted() {
        this.planId = this.$route.params.planId;
        console.log("Fetched planId:", this.planId);
        if (this.planId) {
            this.fetchPlanDays();
        } else {
            console.error("Plan ID is undefined");
        }
    },
  methods: {
    fetchPlanDays() {
    axios.get(`http://localhost:8080/api/plans/${this.planId}/days`)
        .then(response => {
            this.planDays = response.data;
        })
        .catch(error => {
            console.error("Failed to fetch plan days", error);
        });
    },
  }
}
</script>


<style lang="scss" scoped>
.backimg {
  background-image: url('~@/assets/map.jpg');
  background-size: cover;
  background-position: center;
  margin: -8px -8px;
  height: 100vh;
  display: flex;
  overflow: hidden;
}

.plancontainer {
  background-color: white;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content:center;
  width: 80%;
  height: 100px;
  margin-top: 0;
  border-bottom: 2px solid rgb(189, 189, 189);
  border-right: 2px solid rgb(189, 189, 189);
}

.gohomecontainer{
    background-color: white;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content:center;
  width: 20%;
  height: 100px;
  margin-top: 0;
  border-bottom: 2px solid rgb(189, 189, 189);
  border-right: 2px solid rgb(189, 189, 189);
  margin-left: auto;
}

</style>