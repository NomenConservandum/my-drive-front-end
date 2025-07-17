// Initial check
BaseURL = localStorage.getItem('BaseURL');
accessToken = localStorage.getItem('accessToken');
refreshToken = localStorage.getItem('refreshToken');

authorization()

async function authorization() {
    if (
        localStorage.getItem('BaseURL') != "" &&
        localStorage.getItem('accessToken') != "" &&
        localStorage.getItem('refreshToken') != ""
    ) {
        BaseURL = localStorage.getItem('BaseURL');
        accessToken = localStorage.getItem('accessToken');
        refreshToken = localStorage.getItem('refreshToken');
        try {
            const response = await fetch(BaseURL + 'check', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                },
                method: 'GET'
            });
            const data = await response.json();

            if (!response.ok) {
                // refresh the token. TODO: implement
                const responseRefresh = await fetch(BaseURL + 'refresh', {
                    method: 'POST',
                    body: {
                        access: accessToken,
                        refresh: refreshToken
                    }
                });
                if (!responseRefresh.ok) {
                    insertAPIKeyDialog();
                    localStorage.setItem('BaseURL', "");
                    localStorage.setItem('accessToken', "");
                    localStorage.setItem('refreshToken', "");
                    return
                } else { // the refreshment of the tokens went good
                    const dataRefresh = await responseRefresh.json();
                    data2 = {
                                access: String,
                                refresh: String,
                            } // typical token class
                    data2 = JSON.parse(
                            JSON.stringify(dataRefresh, null, 2),
                            data2
                    )
                    accessToken = data2.access
                    refreshToken = data2.refresh

                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);
                    authorization(); // we check again
                    return
                }
            } else {
                mainPage();
            }
            
        } catch (error) {
            insertAPIKeyDialog();
            localStorage.setItem('BaseURL', "");
            alert("The API key was invalid");
        }
    } else if (
        localStorage.getItem('BaseURL') != "" &&
        localStorage.getItem('accessToken') == "" &&
        localStorage.getItem('refreshToken') == ""
    ) {
            document.title = 'Sign Up';
            document.getElementById('signUpDialog').style.display = 'block';
    } else {
        insertAPIKeyDialog();
        localStorage.setItem('BaseURL', "");
    }
}

async function APIKeyInsertion() {
    key = document.getElementById('api-key').value;
    localStorage.setItem('BaseURL', key);
    BaseURL = key;
    signUpDialog('insertAPIKey');
}


function insertAPIKeyDialog() {
    document.title = 'Authorization'
    document.getElementById('insertAPIKey').style.display = 'block';
}


function signUpDialog(name) {
    document.getElementById(name).style.display = 'none';
    document.title = 'Sign Up';
    document.getElementById('signUpDialog').style.display = 'block';
}

function signInDialog(name) {
    document.getElementById(name).style.display = 'none';
    document.title = 'Log In';
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

    if (username.length < 5 || password.length < 5) {
        alert(
            "Both fields should be at least 5 symbols"
        )
        return
    }

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
            data2 = {
                        access: String,
                        refresh: String,
                    } // typical token class
            data2 = JSON.parse(
                    JSON.stringify(data, null, 2),
                    data2
            )
            accessToken = data2.access
            refreshToken = data2.refresh

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            mainPage()
        }
    } catch (error) {
        console.error('Error: ', error);
    }
}

async function signIn() {
    const username = document.getElementById('username-signin').value;
    const password = document.getElementById('password-signin').value;

    if (username.length < 5 || password.length < 5) {
        alert(
            "Both fields should be at least 5 symbols"
        )
        return
    }

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
            data2 = {
                        access: String,
                        refresh: String,
                    } // typical token class
            data2 = JSON.parse(
                    JSON.stringify(data, null, 2),
                    data2
            )
            accessToken = data2.access
            refreshToken = data2.refresh

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            mainPage()
        }
    } catch (error) {
        console.error('Error: ', error);
    }
}

