import React from 'react'
import axios from 'axios';

const API_HOST = process.env.REACT_APP_API_HOST;
const API_TOKEN = process.env.REACT_APP_API_TOKEN;

export class ServerApi extends React.Component {

    static getServerHost() {
        return API_HOST;
    }

    static getToken() {
        return API_TOKEN;
    }

    static async getStarterStory() {
        const list = await axios({
            method: 'get',
            url: this.getServerHost() + '/story/starter',
            headers: {
                'Authorization': 'Bearer ' + this.getToken()
            }
        });
        return list;
    }

    static async getStory(id) {
        const list = await axios({
            method: 'get',
            url: this.getServerHost() + '/story/item/' + id,
            headers: {
                'Authorization': 'Bearer ' + this.getToken()
            }
        });
        return list;
    }

    static async setStory(dataParam) {
        let saved;
        if (typeof dataParam.id != 'undefined' && dataParam.id > 0) {
            saved = await axios({
                method: 'put',
                url: this.getServerHost() + '/story/edit',
                headers: {
                    'Authorization': 'Bearer ' + this.getToken()
                },
                data: dataParam
            });
        } else {
            saved = await axios({
                method: 'post',
                url: this.getServerHost() + '/story/add',
                headers: {
                    'Authorization': 'Bearer ' + this.getToken()
                },
                data: dataParam
            });
        }

        return saved;
    }

    static async delStory(id) {
        const item = await axios({
            method: 'delete',
            url: this.getServerHost() + '/story/del',
            headers: {
                'Authorization': 'Bearer ' + this.getToken()
            },
            data: {id}
        });
        return item;
    }

}