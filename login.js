var mysql = require('mysql');

var con = mysql.createConnection({
    host: "seutrongluckydraw.ddns.net",
    user: "remote",
    password: "seutrongRemote_1",
    database: "seutrong_service"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    let username = document.getElementById('username').value
    let password = document.getElementById('password').value
    let responseText = document.getElementById('responseText')
    console.log(`${username}, ${password}`)
    if (username != '' && password != ''){
        con.query(`SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`, function (err, result, fields) {
            if (err) throw err;
    
            if (result.length > 0) {
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