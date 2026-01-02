import { setWeatherContainer } from "./weather.js";

let sidebarStatus = false
const sidebar = document.querySelector('#sidebar')
const sideButton = document.querySelector('#side-button');
const lastUpdate = document.getElementById('last-refresh')

document.addEventListener('DOMContentLoaded', e => {
    let loggedIn = localStorage.getItem('in')

    if (loggedIn !== null) {
        if (Date.now() - loggedIn > 3600000) {
            localStorage.removeItem('in')
            if (window.location.pathname === '/shuttleinfo.html') {
                window.location.replace("./index.html")
            }
        }
    }
    else {
        if (window.location.pathname === '/shuttleinfo.html') {
            window.location.replace("./index.html")
        }
    }
    
    setWeatherContainer()

    Date.prototype.today = function () { 
        return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
    }

    Date.prototype.timeNow = function () {
        return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
    }

    var currentDate = new Date();
    var lastRefreshed = `Last Refreshed:  ${currentDate.today()} ${currentDate.timeNow()}`

    lastUpdate.innerHTML = lastRefreshed
})

document.addEventListener('click', e => {
    if (sideButton.contains(e.target)) {
        if (sidebarStatus === false) {
            if (window.innerWidth <= 575) {
                document.getElementById("sidebar").style.height = "250px"
                document.getElementById("sidebar").style.width = "100%"
            }
            else {
                document.getElementById("sidebar").style.height = "100%"
                document.getElementById("sidebar").style.width = "320px"
                document.getElementById("main").style.marginLeft = "320px"
                document.getElementById("topbar").style.marginLeft = "320px"
            }
            sidebarStatus = true
        }
        else {
            if (window.innerWidth <= 575) {
                document.getElementById("sidebar").style.height = "0"
            }
            else {
                document.getElementById("sidebar").style.width = "0"
                document.getElementById("main").style.marginLeft = "0"
                document.getElementById("topbar").style.marginLeft = "0"
            }
            sidebarStatus = false
        }
    }
    else if (!sidebar.contains(e.target)) {
        if (sidebarStatus === true) {
            if (window.innerWidth <= 575) {
                document.getElementById("sidebar").style.height = "0"
            }
            else {
                document.getElementById("sidebar").style.width = "0"
                document.getElementById("main").style.marginLeft = "0"
                document.getElementById("topbar").style.marginLeft = "0"
            }
            sidebarStatus = false
        }
    }
})