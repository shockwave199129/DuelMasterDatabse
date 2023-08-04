"use client"
import axios from "axios"
import Cookies from "universal-cookie";
import Swal from "sweetalert2";

const BASE_ENDPOINT = "http://192.168.0.5:8000/";

const cookies = new Cookies()

export default function Api() {
    return {

        get: function (endpoint, params = {}) {

            let auth = cookies.get('dm_a_token');

            let headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }

            let config = {
                headers: headers,
                params: params
            }

            return axios.get(BASE_ENDPOINT + endpoint, config);
        },


        post: function (endpoint, data = {}) {
            let auth = cookies.get('dm_a_token');

            let headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            }

            let config = {
                headers: headers
            }

            return axios.post(BASE_ENDPOINT + endpoint, data, config);
        },


        validatePost: async function (endpoint, data = {}) {
            try {
                let auth = cookies.get('dm_a_token');

                let headers = {
                    'Content-Type': 'application/json',
                    'Authorization': auth
                }

                let config = {
                    headers: headers
                }

                const response = await axios.post(BASE_ENDPOINT + endpoint, data, config);
                return response.data;
            } catch (error) {
                Swal.fire({
                    title: error.response.data.detail,
                    text: error.message,
                    timer: 5000,
                });
                return false;
            }
        }
    };
};