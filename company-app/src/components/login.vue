<template>

    <div class="login">

        <h2>My Company</h2>

        <br>

        <label>User</label>
        <input type="text" v-model="username" />

        <label>Password</label>
        <input type="password" v-model="password" />

        <button @click="loginBpm({username, password})">Login</button>

    </div>

</template>

<script>
    import {mapActions} from 'vuex';

    export default {
        name: 'login',
        data() {
            return {
                username: 'walter.bates',
                password: 'bpm'
            };
        },
        methods: mapActions(['loginBpm'])
    }
</script>

<style>

    .login {
        text-align: center;
    }

</style>