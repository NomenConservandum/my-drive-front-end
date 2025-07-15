// Initial check
BaseURL = "";

authorization()

async function authorization() {
    if(localStorage.getItem('BaseURL')) {
        // checks the URL
        BaseURL = localStorage.getItem('BaseURL');
        try {
            const response = await fetch(BaseURL + 'check', { // TODO: check should also require token
                headers: {'Content-Type': 'application/json'},
                method: 'GET'
            });
            const data = await response.json();

            if (!response.ok) {
                insertAPIKeyDialog();
                localStorage.setItem('BaseURL', "");
                alert("The API key was invalid");
            } else {
                signInDialog('signUpDialog'); // temporary solution. Will be fixed with JWT
            }
            
        } catch (error) {
            insertAPIKeyDialog();
            localStorage.setItem('BaseURL', "");
            alert("The API key was invalid");
        }
    } else {
        insertAPIKeyDialog();
        localStorage.setItem('BaseURL', "");
    }
}

async function APIKeyInsertion() {
    key = document.getElementById('api-key').value;
    localStorage.setItem('BaseURL', key);
    BaseURL = key;
    document.getElementById('insertAPIKey').style.display = 'none';
    // a server check
    try {
        const response = await fetch(BaseURL + 'check', { // TODO: check should also require token
            headers: {'Content-Type': 'application/json'},
            method: 'GET'
        });
        const data = await response.json();

        if (!response.ok) {
            localStorage.setItem('BaseURL', "");
            alert("The API key is invalid");
        } else {
            signUpDialog('insertAPIKey');
        }
        
    } catch (error) {
        alert("The API key is invalid");
    }
}


function insertAPIKeyDialog() {
    document.title = 'Authorization'
    document.getElementById('insertAPIKey').style.display = 'block';
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
