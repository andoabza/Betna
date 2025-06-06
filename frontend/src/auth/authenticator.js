const registerUser = async (data) =>  {    
    return fetch('http://localhost:5000/api/v1/users/register', {
                   method: 'POST',
                   headers: {
                    'Content-Type': 'Application/json',
                   },
                   body: JSON.stringify(data)
            }).then(data => data.json());
};

const loginUser = async (data) => {
    return fetch('http://localhost:5000/api/v1/users/login', {
                   method: 'POST',
                   headers: {
                    'Content-Type': 'Application/json',
                   },
                   body: JSON.stringify(data)
            }).then(data => data.json());
}
const fetchUser = async (id) => {
return fetch(`http://localhost:5000/api/v1/users/${id}`,
{
    method: 'GET',

},
).then(data => data.json());
}
const logoutUser = async () => {
    return fetch('http://localhost:5000/api/v1/users/logout', {
                   method: 'POST',
                   headers: {
                    'Content-Type': 'Application/json',
                   },
            }).then(data => data.json());
};
const getUser = async () => {
    return fetch('http://localhost:5000/api/v1/users/me', {
                   method: 'GET',
                   headers: {
                    'Content-Type': 'Application/json',
                   },
            }).then(data => data.json());
};

const listHouse = async(data) => {
    return fetch('http://localhost:5000/api/v1/houses/', {
                   method: 'POST',
                   headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                   body: JSON.stringify(data)
            }).then(data => data.json());
};
const uploadImages = async(data) => {
    return fetch('http://localhost:5000/api/v1/houses/multiple', {
                   method: 'POST',
                   headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                   body: JSON.stringify(data)
            }).then(data => data.json());
};



export { registerUser, loginUser, logoutUser, getUser, listHouse, uploadImages, fetchUser };