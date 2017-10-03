<template>

    <div id="app">

        <login v-if="!isLogged"></login>

        <tasks-list v-if="isLogged"></tasks-list>

    </div>

</template>

<script>
    import login from './components/login.vue';
    import tasksList from './components/taskslist.vue';

    import {mapState} from 'vuex';

    export default {
        components: {login, tasksList},
        name: 'app',
        computed: mapState(['isLogged']),
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
    }
</style>
