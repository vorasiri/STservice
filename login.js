const { ipcRenderer, remote } = require( "electron" );
const con = remote.getGlobal( "con" );

document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    let username = document.getElementById('username').value
    let password = document.getElementById('password').value
    let responseText = document.getElementById('responseText')
    console.log(`${username}, ${password}`)
    if (username != '' && password != ''){
        con.query(`SELECT users.*, staff_name FROM users JOIN staff ON users.staff_id = staff.staff_id WHERE username = '${username}' AND password = '${password}'`, function (err, result, fields) {
            if (err) throw err;
    
            if (result.length > 0) {
                // Set MyGlobalVariable.
                ipcRenderer.send( "loginUser", `${result[0].staff_name}` );
                
                location.replace("./home.html")
            } else {
                responseText.innerHTML = 'Incorrect Username and/or Password!'
            }
        })
    }
    else{
        responseText.innerHTML = 'Please enter Username and Password!'
    }
})