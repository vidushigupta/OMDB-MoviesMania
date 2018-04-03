/* Call to server to fetch data based on URL*/
let API = {
    _fetchDetails: (URL) => {
        return fetch(URL, {
            method: 'get'
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            return (data.Response == "False" ? undefined : data);
        }).catch(function (err) {
            console.log("err response: " + err);
        });
    }
};

export default API;