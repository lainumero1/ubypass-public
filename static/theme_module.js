document.addEventListener("DOMContentLoaded", function() {
    if ("scheme" in localStorage) {
        let scheme = localStorage.getItem("scheme")
        if (scheme === "dark") {
            darkMode()
            document.getElementById("dark-mode").checked = true
        }
        else {
            lightMode()
            document.getElementById("dark-mode").checked = false
        }
    }
    else {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark').matches){
            darkMode()
            document.getElementById("dark-mode").checked = true
        }
        else{
            lightMode()
            document.getElementById("dark-mode").checked = false
        }
    }
})

document.getElementById("dark-mode").addEventListener("change", function() {
    if (this.checked) {
        darkMode()
    }
    else{
        lightMode()
    }
})

function darkMode() {
    if ("scheme" in localStorage) {
        localStorage.removeItem("scheme")
    }
    localStorage.setItem("scheme", "dark")
    document.querySelector('html').style.backgroundColor = "#323232"
    document.getElementById('main').style.backgroundColor = "#323232"
    document.getElementById('main').style.color = "#bbbbbb"
    let text = document.querySelectorAll("label")
    for (let i = 0; i < text.length; i++) {
        text[i].style.color = "rgb(187, 187, 187)"
    }
    let settingContainer = document.getElementsByClassName('container')
    for (const setting of settingContainer) {
        setting.style.backgroundColor = 'dimgray'
    }
}

function lightMode() {
    if ("scheme" in localStorage) {
        localStorage.removeItem("scheme")
    }
    localStorage.setItem("scheme", "light")
    document.querySelector('html').style.backgroundColor = "white"
    document.getElementById('main').style.backgroundColor = "white"
    document.getElementById('main').style.color = "#555555"
    let text = document.querySelectorAll("label")
    for (let i = 0; i < text.length; i++) {
        text[i].style.color = "rgb(85, 85, 85)"
    }
    let settingContainer = document.getElementsByClassName('container')
    for (const setting of settingContainer) {
        setting.style.backgroundColor = '#bbb'
    }
}



