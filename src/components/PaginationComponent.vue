<template>
  <div class="pagination-wrap">
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" aria-label="Previous" @click.prevent="goToPrevPage"> 
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">Previous</span>
          </a>
        </li>
        <li class="page-item" v-for="pageNumber in totalPages" :key="pageNumber"
            :class="{ active: pageNumber === currentPage }">
          <a class="page-link" href="#" @click.prevent="goToPage(pageNumber)">
            {{ pageNumber }}
          </a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" aria-label="Next" @click.prevent="goToNextPage">
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  props: {
    totalPages: Number,
    currentPage: Number,
    currentTag: String  // 현재 선택된 태그를 props로 추가
  },
  methods: {
    goToPrevPage() {
      if (this.currentPage > 1) {
        this.$emit('changePage', this.currentTag, this.currentPage - 1); // 태그 정보 포함
      }
    },
    goToNextPage() {
      if (this.currentPage < this.totalPages) {
        this.$emit('changePage', this.currentTag, this.currentPage + 1); // 태그 정보 포함
      }
    },
    goToPage(pageNumber) {
        this.$emit('changePage', this.currentTag, pageNumber); // 태그 정보 포함
    }
  }
}
</script>