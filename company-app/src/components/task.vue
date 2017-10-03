<template>

    <div :class="typeTask">

        <h4 class="title">{{info.name}} ({{info.caseId}})</h4>

        <button v-if="!info.assignedId" @click="assignTask">Get Task</button>

        <div v-if="info.taskName === 'Check_CV' && info.assignedId">
            <textarea cols="30" rows="3" placeholder="Comments..." v-model="comments"></textarea>
            Validated <input type="checkbox" v-model="validated"/>
            <button @click="checkCV">Ok</button>
        </div>

        <div v-if="info.taskName === 'IT_Test' && info.assignedId">
            Approved <input type="checkbox" v-model="approved"/>
            <button @click="itTest">Ok</button>
        </div>

        <h4>Position: {{info.jobPosition}}</h4>
        <p>{{info.cv}}</p>

    </div>

</template>

<script>
    import {mapState, mapGetters, mapActions} from 'vuex';

    export default {
        name: 'task',
        props: {
            info: {
                type: Object
            }
        },
        data() {
            return {
                validated: false,
                approved: false,
                comments: ''
            };
        },
        methods: {
            assignTask() {
                this.$store.dispatch('assignTaskToUser', this.info.id);
            },
            checkCV() {
                this.$store.dispatch('executeTaskByUser', {
                    taskId: this.info.id,
                    caseId: this.info.caseId,
                    data: {
                        isValidated: this.validated,
                        comments: this.comments
                    }
                });
            },
            itTest() {
                this.$store.dispatch('executeTaskByUser', {
                    taskId: this.info.id,
                    caseId: this.info.caseId,
                    data: {
                        isApproved: this.approved
                    }
                });
            },
            isCheckCV() {
                return (this.info.taskName === 'Check_CV')? 'checkcv' : '';
            },
            isITTest() {
                return (this.info.taskName === 'IT_Test')? 'ittest' : '';
            }
        },
        computed: {
            typeTask() {
                return 'task ' + (this.isCheckCV() || this.isITTest());
            }
        }
    }
</script>

<style scoped>

    .task {
        margin: 0.5rem;
        padding: 0 0.8rem 0 0.8rem;
        border: 1px solid;
    }

    .title {
        display: inline-block;
    }

    h4 {
        margin-top: 0.3rem;
        margin-bottom: 0.3rem;
    }

    .checkcv {
        background-color: beige;
    }

    .ittest {
        background-color: darkseagreen;
    }

</style>