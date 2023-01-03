const axios = require('axios');

const BASE_URL = 'https://api.intra.42.fr/oauth/token';
const UID = "5456b9c8ea29414b9e742ff1010167dae82e198d9d2be154aa17375b7669b014";
const SECRET = "b058115fbe312108f19401fc8bb428760e8b82d2b9f4d4188c695668eafc00b6";
function getIndex(code) {
    let index = 0;
    const c = code.split('c')[1].split('r')[0];
    const r = code.split('r')[1].split('s')[0];
    const s = code.split('s')[1];

    if (c === '2')
        index = 24;
    if (r > '1')
        index += (parseInt(r) - 1) * 6 + parseInt(s);
    else
        index += parseInt(s)
    return index;
}

module.exports.use_fetch = () => {
    const prom = new Promise((resolve, reject) => {
        axios.post(BASE_URL, {
            client_id: UID,
            client_secret: SECRET,
            grant_type: 'client_credentials'
        })
            .then(async (res) => {
                let collected = [];
                let data = [];
                axios.defaults.headers.common['Authorization'] = "Bearer " + res.data.access_token
                let collect;
                try {
                    for (let i = 0; i < 2; i++) {
                        collect = await axios.get('https://api.intra.42.fr/v2/campus/32/locations', { params: { sort: '-end_at', per_page: 100, page: i + 1 } })
                        collected = collected.concat(collect.data);
                    }

                    collected.forEach(student => {
                        if (student.end_at == null) {
                            i = getIndex(student.host);
                            data[i] = {
                                login: student.user.login,
                                host: student.host,
                                profile_url: `https://profile.intra.42.fr/users/${student.user.login}`,
                                profile_pic: student.user.image.link
                            }
                        }
                    })
                    resolve(data);
                } catch (err) {
                    reject(err)
                }

            })
            .catch(err => {
                reject(err)
            })
    })
    return (prom);
}

// module.exports.use_fetch()
//     .then(response => {
//         console.log(response.length);
//         console.log(response);
//     })
//     .catch(err => {
//         console.log(err);
//     })

