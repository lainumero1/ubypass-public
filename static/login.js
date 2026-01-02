let loggedIn = localStorage.getItem('in')

async function getLogin(userInput, pwInput) {   
    let urlResponse = await fetch('env')
    if (!urlResponse.ok) {
        document.getElementById('invalid-login').innerHTML = `URL HTTP ERROR: ${urlResponse.status}`
        throw new Error(`URL HTTP ERROR: ${urlResponse.status}`);
    }
    let url = await urlResponse.text();
    let baseUrl = url.slice(19, url.length-1)
    let userInfoResponse = await fetch(`https://${baseUrl}:8080/api/user/${userInput}`)

    if (!userInfoResponse.ok) {
        document.getElementById('invalid-login').innerHTML = 'Wrong Username or Password! Please try again. '
        throw new Error(`UserInput HTTP ERROR: ${userInfoResponse.status}`);
    }
    const userInfo = await userInfoResponse.json();
    const dbUser = userInfo['username']
    const dbPassword = userInfo['password']

    if (dbUser === userInput && dbPassword === pwInput) {
        localStorage.setItem('in', Date.now())
        window.location.replace("./shuttleinfo.html")
    }
    else {
        document.getElementById('invalid-login').innerHTML = 'Wrong Username or Password! Please try again. '
    }
}

document.addEventListener('DOMContentLoaded', function() {
    let submit = document.getElementById('submit')
    if (loggedIn !== null) {
        window.location.replace("./shuttleinfo.html")
    }
    else {
        submit.addEventListener('click', function() {
            let username = document.getElementById('username').value
            let password = document.getElementById('password').value
            getLogin(username, password)
        })
    }
})