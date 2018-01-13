import Vue from 'vue';
import Vuex from 'vuex';

import {api} from '../api/api';

Vue.use(Vuex);

const state = {
    token: '',
    isLogged: false,
    userId: '',
    username: '',
    processId: '',
    tasks: []
}

const types = {
    SET_TOKEN: 'SET_TOKEN',
    SET_IS_LOGGED: 'SET_IS_LOGGED',
    SET_USER_ID: 'SET_USER_ID',
    SET_PROCESS_ID: 'SET_PROCESS_ID',
    ADD_TASK: 'ADD_TASK',
    CLEAR_TASKS: 'CLEAR_TASKS',
    SET_TASK_ASSIGNED: 'SET_TASK_ASSIGNED',
    SET_TASK_EXECUTED: 'SET_TASK_EXECUTED'
}

const mutations = {
    [types.SET_TOKEN]: (state, token) => state.token = token,
    [types.SET_IS_LOGGED]: (state, isLogged) => state.isLogged = isLogged,
    [types.SET_USER_ID]: (state, userId) => state.userId = userId,
    [types.SET_PROCESS_ID]: (state, processId) => state.processId = processId,
    [types.ADD_TASK]: (state, task) => state.tasks.push(task),
    [types.CLEAR_TASKS]: (state) => state.tasks = [],
    [types.SET_TASK_ASSIGNED]: (state, {taskId, userId}) => {
        state.tasks.filter((t) => t.id === taskId).map((t) => {
            t.assignedId = userId;
        })
    },
    [types.SET_TASK_EXECUTED]: (state, taskId) => {
        let i = state.tasks.findIndex((t) => t.id === taskId);
        state.tasks.splice(i, 1);
    }
}

const actions = {
    loginBpm: (context, {username, password}) => {

        api.login(username, password).then((res) => {

            context.commit(types.SET_TOKEN, document.cookie.substring(
                document.cookie.indexOf('X-Bonita-API-Token=')+19, document.cookie.length));

            context.commit(types.SET_IS_LOGGED, true);

            api.getCurrentUser().then((res) => {
                context.commit(types.SET_USER_ID, res.data.user_id);
            });

            api.getProcessInfo('Candidates', '2.0').then((res) => {

                if(res.data && Array.isArray(res.data) && res.data.length > 0) {
                    context.commit(types.SET_PROCESS_ID, res.data[0].id);
                }

            });

        });

    },
    loadPendingCheckCV(context) {
        context.dispatch('loadPendingTasks', 'Check_CV');
    },
    loadPendingITTest(context) {
        context.dispatch('loadPendingTasks', 'IT_Test');
    },
    loadPendingTasks: (context, name) => {

        context.commit(types.CLEAR_TASKS);

        api.getHumanPendingTasks(name).then((res) => {

            res.data.map((t) => {

                api.getCaseContext(t.rootCaseId).then((resContext) => {

                    api.getCaseData(resContext.data.curriculum_ref.link).then((resCase) => {

                        context.commit(types.ADD_TASK, {
                            id: t.id,
                            caseId: t.caseId,
                            taskName: t.name,
                            storageId: resContext.data.curriculum_ref.storageId,
                            name: resCase.data.name,
                            jobPosition: resCase.data.jobPosition,
                            cv: resCase.data.cv,
                            type: resContext.data.curriculum_ref.type,
                            assignedId: t.assigned_id
                        });

                    });

                });

            }).sort((a, b) =>{
                if(a.id < b.id)
                    return 1;
                else
                    return -1;
            });

        });

    },
    assignTaskToUser: (context, taskId) => {

        let userId = context.state.userId;
        let token = context.state.token;

        api.assignTask(token, taskId, userId).then((res) => {

            context.commit(types.SET_TASK_ASSIGNED, {taskId, userId});

        });

    },
    executeTaskByUser: (context, {taskId, data}) => {

        let token = context.state.token;

        api.executeTask(token, taskId, data).then((res) => {

            context.commit(types.SET_TASK_EXECUTED, taskId);

        });

    }
}

export const appStore = new Vuex.Store({
    state,
    mutations,
    actions
});