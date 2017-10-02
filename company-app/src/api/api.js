import axios from 'axios';

class CompanyApi {

    constructor() {
        axios.defaults.baseURL = 'http://localhost:8080/bonita';
    }

    login(user = '', password = '') {
        const config = {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        };

        let params = new URLSearchParams();
        params.append('username', user);
        params.append('password', password);
        params.append('redirect', false);

        return axios('loginservice', {
            method: 'post',
            data: params,
            config: config,
            withCredentials: true
        }).catch(this.errorHandler);

    }

    getCurrentUser() {

        return axios('API/system/session/unusedid', {
            method: 'get',
            withCredentials: true
        }).catch(this.errorHandler);

    }

    getProcessInfo(processName = '', version = '1.0') {

        let filter = '';

        if(processName !== '') {
            filter += `&f=name=${processName}`;
        }
        if(version !== '') {
            filter += `&f=version=${version}`;
        }

        return axios(`API/bpm/process?c=10&p=0${filter}`, {
            method: 'get',
            withCredentials: true
        }).catch(this.errorHandler);

    }

    getHumanPendingTasks(taskName = '') {

        if(taskName !== '') {
            taskName = `&f=name=${taskName}`;
        }

        return axios(`API/bpm/humanTask?p=0&c=10${taskName}`, {
            method: 'get',
            withCredentials: true
        }).catch(this.errorHandler);

    }

    getCaseContext(caseId = '') {

        if(caseId === '') {
            return;
        }

        return axios(`/API/bpm/case/${caseId}/context`, {
            method: 'get',
            withCredentials: true
        }).catch(this.errorHandler);

    }

    getCaseData(url = '') {

        if(url === '') {
            return;
        }

        // API/bdm/businessData/com.company.model.Curriculum/2"
        return axios(url, {
            method: 'get',
            withCredentials: true
        }).catch(this.errorHandler);
    }

    assignTask(token = '', taskId = '', userId = '') {

        const headers = {'Content-Type': 'application/json',
                'X-Bonita-API-Token': token};

        let data = {
            assigned_id: userId
        };

        return axios(`/API/bpm/userTask/${taskId}`, {
            method: 'put',
            data,
            headers,
            withCredentials: true
        }).catch(this.errorHandler);

    }

    executeTask(token = '', taskId = '', data = {}) {

        const headers = {'Content-Type': 'application/json',
            'X-Bonita-API-Token': token};

        return axios(`/API/bpm/userTask/${taskId}/execution`, {
            method: 'post',
            data,
            headers,
            withCredentials: true
        }).catch(this.errorHandler);
    }

    static errorHandler(err) {
        console.error('Error API - %s', err);
    }

};

export const api = new CompanyApi();