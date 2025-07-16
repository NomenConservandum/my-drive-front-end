// log out function
// C(RU)D for files

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