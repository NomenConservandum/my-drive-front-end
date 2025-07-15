const BaseURL = localStorage.getItem('BaseURL');

if(localStorage.getItem('JWT-ACCESS-TOKEN')) { // temporary solution
    // main page
} else {
    signUpDialog('signInDialog');
}

function signUpDialog(name) {
    document.getElementById(name).style.display = 'none';
    document.title = 'Sign Up'
    document.getElementById('signUpDialog').style.display = 'block';
}

function signInDialog(name) {
    document.getElementById(name).style.display = 'none';
    document.title = 'Log In'
    document.getElementById('signInDialog').style.display = 'block';
}

async function signUp() {
    const username = document.getElementById('username-signup').value;
    const password = document.getElementById('password-signup').value;

    console.log(JSON.stringify({
                username: username,
                password: password
            }));
    console.log(BaseURL);

    try {
        const response = await fetch(BaseURL + 'register', {
            // headers: {'Content-Type': 'application/json'},
            method: 'POST',
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        const data = await response.json();
        console.log('Success: ', JSON.stringify(data, null, 2));
        
    } catch (error) {
        console.error('Error:', error);
    }
}
