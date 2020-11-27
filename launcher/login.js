const { ipcRenderer, remote } = require("electron");
const notification = document.getElementById('notification');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');
ipcRenderer.on('update_available', () => {
    ipcRenderer.removeAllListeners('update_available');
    message.innerText = 'A new update is available. Downloading now...';
    notification.classList.remove('hidden');
});
ipcRenderer.on('update_downloaded', () => {
    ipcRenderer.removeAllListeners('update_downloaded');
    message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
    restartButton.classList.remove('hidden');
    notification.classList.remove('hidden');
});

function closeNotification() {
    notification.classList.add('hidden');
}
function restartApp() {
    ipcRenderer.send('restart_app');
}

(async () => {
    const admin = require('../models/person_orm.js').admin;

    document.getElementById('loginForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        let username = document.getElementById('username').value
        let password = document.getElementById('password').value
        let responseText = document.getElementById('responseText')
        console.log(`${username}, ${password}`)
        if (username != '' && password != '') {
            userMatch = await admin.findAll({
                where: {
                    _username: username,
                    _password: password
                }
            })
            if (userMatch.length > 0) {
                // Set MyGlobalVariable.
                console.log('auth sucsess')
                location.replace("./home.html")
            } else {
                responseText.innerHTML = 'Incorrect Username and/or Password!'
            }
        }
        else {
            responseText.innerHTML = 'Please enter Username and Password!'
        }
    })
})()