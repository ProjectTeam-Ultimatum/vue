<template>
    <div>
        {{ testMessage }}
    </div>

    <script>
        export default{
            data(){
                return{
                    textMessage:'',
                };
            },
            mounted(){
                this.$axios.get('http://localhost:8080/recommend/list')
                .then((response) => {
                    this.testMessage = response.data;
                })
                .catch((error) => {
                    console.error("There was an error!", error);
                })
            },
        }
    </script>
</template>