// log out function
// C(RU)D for files

BaseURL = localStorage.getItem('BaseURL');
accessToken = localStorage.getItem('accessToken');
refreshToken = localStorage.getItem('refreshToken');

async function refreshTokens(func) {
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
        func(); // we do it again
        return
    }
}

function contactPage() {
    window.location.href="contact.html";
}

function uploadDialog() {
    if (document.getElementById('upload-form').style.display == 'block') {
        document.getElementById('upload-form').style.display = 'none';
    } else {
        document.getElementById('upload-form').style.display = 'block';
    }
}

// 'NOT my code (slightly modified by me)' block start
const dropArea = document.getElementById('dropArea');
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
var lastFileName;

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Highlight drop area when item is dragged over it
['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
});

function highlight() {
    dropArea.classList.add('highlight');
}

function unhighlight() {
    dropArea.classList.remove('highlight');
}

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

// Handle selected files
fileInput.addEventListener('change', function() {
    handleFiles(this.files);
});

// Process files
function handleFiles(files) {
    preview.innerHTML = '';
    
    if (files.length === 0) return;
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        previewFile(file);
        lastFileName = file.name
    }
}

// Preview non-image files
function previewFile(file) {
    const fileDiv = document.createElement('div');
    fileDiv.className = 'file-item';
    
    fileDiv.innerHTML = `
    <p><strong>${file.name}</strong></p>
    <p>${formatFileSize(file.size)} - ${file.type || 'Unknown type'}</p>
    `;
    
    preview.appendChild(fileDiv);
    uploadFile(file);
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 'NOT my code' block end

async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(BaseURL + 'upload', {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (!response.ok) {
            if (response.status == 403) {
                // refresh the tokens
                refreshTokens(uploadFile(file))
            } else {
                alert(
                    JSON.parse(
                        JSON.stringify(data, null, 2),
                        {message: String} // typical message class
                    ).message
                )
            }
        } else {
            alert(
                JSON.parse(
                    JSON.stringify(data, null, 2),
                    {message: String} // typical message class
                ).message
            )
            // close the form
            if (file.name === lastFileName) // this trick is done to close the form when the last file is uploaded
                uploadDialog()
        }
    } catch (error) {
        console.error('Error: ', error);
    }
}

async function logOut() {
    try {
        const response = await fetch(BaseURL + 'logout', {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            method: 'GET'
        });
        const data = await response.json();

        if (!response.ok) {
            if (response.status == 403) {
                // refresh the tokens
                refreshTokens(logOut())
            } else {
                alert(
                    JSON.parse(
                        JSON.stringify(data, null, 2),
                        {message: String} // typical message class
                    ).message
                )
            }
        } else {
            console.log(JSON.stringify(data, null, 2));
            // move to the sign up menu, clean the tokens
            accessToken = "";
            localStorage.setItem('accessToken', "");
            refreshToken = "";
            localStorage.setItem('refreshToken', "");

            window.location.href="index.html";
            return
        }
    } catch (error) {
        console.error('Error: ', error);
    }
}