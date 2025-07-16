// Initial check
BaseURL = "";

authorization()

async function authorization() {
    if(localStorage.getItem('BaseURL')) {
        // checks the URL
        BaseURL = localStorage.getItem('BaseURL');
        try {
            const response = await fetch(BaseURL + 'check', { // TODO: check should also process the tokens
                headers: {'Content-Type': 'application/json'},
                method: 'GET'
            });
            const data = await response.json();

            if (!response.ok) {
                insertAPIKeyDialog();
                localStorage.setItem('BaseURL', "");
                alert("The API key was invalid");
            } else {
                mainPage(); // temporary solution. Will be fixed with JWT
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

function mainPage() {
    window.location.href="mainpage.html";
}

function contactPage() {
    window.location.href="contact.html";
}

async function signUp() {
    const username = document.getElementById('username-signup').value;
    const password = document.getElementById('password-signup').value;

    console.log("Sent data: ", JSON.stringify({
                username: username,
                password: password
            }));

    try {
        const response = await fetch(BaseURL + 'register', {
            method: 'POST',
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        const data = await response.json();

        if (!response.ok) {
            alert(
                JSON.parse(
                    JSON.stringify(data, null, 2),
                    {message: String} // typical message class
                ).message
            )
        } else {
            // save the tokens and move to the main page
            mainPage()
        }

        console.log('Received: ', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error: ', error);
    }
}

async function signIn() {
    const username = document.getElementById('username-signin').value;
    const password = document.getElementById('password-signin').value;

    console.log("Sent data: ", JSON.stringify({
                username: username,
                password: password
            }));

    try {
        const response = await fetch(BaseURL + 'login', {
            method: 'POST',
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        const data = await response.json();
        
        if (!response.ok) {
            alert(
                JSON.parse(
                    JSON.stringify(data, null, 2),
                    {message: String} // typical message class
                ).message
            )
        } else {
            // save the tokens and move to the main page
            mainPage()
        }

        console.log('Received: ', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error: ', error);
    }
}

