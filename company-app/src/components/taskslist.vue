<template>

    <div class="tasks-list">

        <h2>Pending Tasks</h2>

        <br>

        <button @click="loadPendingCheckCV()">Load CheckCV Task</button>
        <button @click="loadPendingITTest()">Load ITTest Task</button>

        <div class="tasks-container">
            <task v-for="(tk, i) in tasks" :key="i" :info="tk"></task>
        </div>

    </div>

</template>

<script>
    import task from "./task.vue";
    import {mapState, mapGetters, mapActions} from 'vuex';

    export default {
        components: {task},
        name: 'tasks-list',
        methods: mapActions(['loadPendingCheckCV', 'loadPendingITTest']),
        computed: mapState(['tasks'])
    }
</script>

<style>

    .tasks-list {
        margin: 1rem;
    }

    .tasks-container {
        display: flex;
        flex-direction: column;
    }

</style>