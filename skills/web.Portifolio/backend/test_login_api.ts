import axios from 'axios';

async function testLoginRequest() {
    const url = 'http://localhost:5000/api/auth/login';
    const credentials = {
        username: 'natansrangel@gmail.com',
        password: 'Santos*1950'
    };

    console.log(`Testing Login at ${url}...`);
    try {
        const response = await axios.post(url, credentials);
        console.log('SUCCESS!');
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2));
    } catch (error: any) {
        console.log('FAILED!');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.log('Error Message:', error.message);
        }
    }
}

testLoginRequest();
