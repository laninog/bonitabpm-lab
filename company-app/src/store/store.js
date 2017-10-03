import Vue from 'vue';
import Vuex from 'vuex';

import {api} from '../api/api';

Vue.use(Vuex);

export const appStore = new Vuex.Store({
    state: {
        token: '',
        isLogged: false,
        userId: '',
        username: '',
        processId: '',
        tasks: []
    },
    mutations: {
        setToken: (state, token) => state.token = token,
        setIsLogged: (state, isLogged) => state.isLogged = isLogged,
        setUserId: (state, userId) => state.userId = userId,
        setProcessId: (state, processId) => state.processId = processId,
        addTask: (state, task) => state.tasks.push(task),
        clearTasks: (state) => state.tasks = [],
        taskAssigned: (state, {taskId, userId}) => {
            state.tasks.filter((t) => t.id === taskId).map((t) => {
                t.assignedId = userId;
            })
        },
        taskExecuted: (state, taskId) => {
            let i = state.tasks.findIndex((t) => t.id === taskId);
            state.tasks.splice(i, 1);
        }
    },
    actions: {
        loginBpm: (context, {username, password}) => {

            api.login(username, password).then((res) => {

                context.commit('setToken', document.cookie.substring(
                    document.cookie.indexOf('X-Bonita-API-Token=')+19, document.cookie.length));

                context.commit('setIsLogged', true);

                api.getCurrentUser().then((res) => {

                    context.commit('setUserId', res.data.user_id);

                });

                api.getProcessInfo('Candidates', '2.0').then((res) => {

                    if(res.data && Array.isArray(res.data) && res.data.length > 0) {

                        context.commit('setProcessId', res.data[0].id);

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

            context.commit('clearTasks');

            api.getHumanPendingTasks(name).then((res) => {

                res.data.map((t) => {

                    api.getCaseContext(t.rootCaseId).then((resContext) => {

                        api.getCaseData(resContext.data.curriculum_ref.link).then((resCase) => {

                            context.commit('addTask', {
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

                context.commit('taskAssigned', {taskId, userId});

            });

        },
        executeTaskByUser: (context, {taskId, data}) => {

            let token = context.state.token;

            api.executeTask(token, taskId, data).then((res) => {

                context.commit('taskExecuted', taskId);

            });

        }
    }
});