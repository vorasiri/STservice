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


document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    ipcRenderer.send('createMysqlCon')
    var con = remote.getGlobal("con");
    let username = document.getElementById('username').value
    let password = document.getElementById('password').value
    let responseText = document.getElementById('responseText')
    console.log(`${username}, ${password}`)
    if (username != '' && password != '') {
        con.query(`SELECT users.*, staff_name, staff_position FROM users JOIN staff ON users.staff_id = staff.staff_id WHERE username = '${username}' AND password = '${password}'`, function (err, result, fields) {
            if (err) throw err;

            if (result.length > 0) {
                // Set MyGlobalVariable.
                ipcRenderer.send("loginUser", [result[0].staff_name, result[0].staff_position]);

                location.replace("./home.html")
            } else {
                responseText.innerHTML = 'Incorrect Username and/or Password!'
            }
        })
    }
    else {
        responseText.innerHTML = 'Please enter Username and Password!'
    }
})