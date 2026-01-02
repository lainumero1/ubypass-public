import { getBusEta, getMtrEta } from "./eta.js";

let stop
let filter = document.getElementById('filter')

function setStopContatiner(campus) {
    let stop_name = []
    switch (campus) {
        case '0':
            stop_name = ["HKU Centennial Campus; Pok Fu Lam Road", 
                        "Chiu Sheung School Hong Kong; Pok Fu Lam Road", 
                        "HKU West Gate; Pok Fu Lam Road", 
                        "HKU East Gate; Bonham Road", 
                        "King's College; Bonham Road"]
            break
        case '1':
            stop_name = ["Queen Mary Hospital; Pok Fu Lam Road (Northbound)", 
                        "HKU Li Ka Shing Faculty of Medicine; Victoria Road (Northbound)", 
                        "Sassoon Road; Victoria Road (Northbound)", 
                        "Queen Mary Hospital; Pok Fu Lam Road (Southbound)", 
                        "HKU Li Ka Shing Faculty of Medicine; Victoria Road (Southbound)", 
                        "Sassoon Road; Victoria Road (Southbound)"]
            break
        case '2':
            stop_name = ["Sha Wan Drive (Northbound)", 
                        "Sha Wan Drive (Southbound)"]
            break
    }

    let result = []
    for (let stop = 0; stop < stop_name.length; stop++){
        result.push([stop_name[stop]])
    }

    let busEtaContainer = document.getElementById('bus-eta-container')
    result.forEach(stop => {
        let busDeparture = document.createElement('div')
        busDeparture.className = 'bus-departure'
        busEtaContainer.appendChild(busDeparture)
        let stopNameContainer = document.createElement('div')
        stopNameContainer.className = 'stop-name'
        busDeparture.appendChild(stopNameContainer)
        let stopName = document.createTextNode(stop[0])
        stopNameContainer.appendChild(stopName)
    })
}

async function setBusEtaContainer(campus, sortBy) {
    const busEta = await getBusEta(campus, sortBy)
    busEta.forEach(stop => {
        let busDeparture = document.getElementsByClassName('bus-departure')
        for (let i = 0; i < busDeparture.length; i++) {
            let stopName = busDeparture[i].querySelector('.stop-name').innerHTML
            if (stopName === stop[0]) {
                busDeparture = busDeparture[i]
                break
            }
        }
        let stopContainer = document.createElement('div')
        stopContainer.className = "stop"
        let departureContainer = document.createElement('div')
        departureContainer.className = 'departure'
        busDeparture.appendChild(stopContainer)
        if (stop.length > 2) {
            stop.slice(2, stop.length).forEach(departure => {
                let departureContainer = document.createElement('div')
                departureContainer.className = 'departure'
                let departureCo = document.createElement('span')
                let departureRoute = document.createElement('span')
                let departureDest = document.createElement('span')
                let departureEta = document.createElement('span')
                departureCo.className = 'co'
                departureRoute.className = 'route'
                departureDest.className = 'dest'
                departureEta.className = 'eta'
                departureCo.innerHTML = `${departure['co']} `
                departureRoute.innerHTML = `${departure['route']} `
                departureDest.innerHTML = `${departure['dest']} `
                departureEta.innerHTML = `${departure['eta']} `
                departureContainer.appendChild(departureCo)
                departureContainer.appendChild(departureRoute)
                departureContainer.appendChild(departureDest)
                departureContainer.appendChild(departureEta)
                stopContainer.appendChild(departureContainer)
            })
        }
        else {
            stopContainer.appendChild(departureContainer)
            let noDeparture = document.createElement('span')
            noDeparture.className = 'dest'
            noDeparture.innerHTML = stop[1]
            departureContainer.appendChild(noDeparture)
            busDeparture.appendChild(stopContainer)
        }
    })

    stop = document.querySelectorAll('.bus-departure>.stop')
    for (let i = 0; i < stop.length; i++) {
        let departures = stop[i].getElementsByClassName('departure')
        if (departures.length > 5) {
            for (let dep = 0; dep < departures.length; dep++) {
                if (dep >= 5) {
                    departures[dep].style.display = 'none'
                }
            }
        }
    }
    stop = document.querySelectorAll('.bus-departure>.stop')
    for (let i = 0; i < stop.length; i++) {
        stop[i].addEventListener('click', function() {
            if (filter.value.length === 0) {
                let departures = stop[i].getElementsByClassName('departure')
                for (let dep = 0; dep < departures.length; dep++) {
                    if (dep >= 5) {
                        if (departures[dep].style.display === 'none') {
                            departures[dep].style.display = 'flex'
                        }
                        else{
                            departures[dep].style.display = 'none'
                        }
                    }
                }
            }
        })
    }
}

async function setMtrEtaContainer() {
    const mtrAPI = await getMtrEta()
    let mtrEtaContainer = document.getElementById("mtr-eta-container")
    mtrAPI.forEach(station => {
        let mtrDepartureContainer = document.createElement("div")
        mtrDepartureContainer.className = "mtr-departure"
        let mtrStopName = document.createElement("div")
        mtrStopName.className = "stop-name"
        mtrDepartureContainer.appendChild(mtrStopName)
        mtrEtaContainer.appendChild(mtrDepartureContainer)
        
        let stationName = station[0]
        mtrStopName.innerHTML = stationName 
        let mtrDeparture = station.slice(1, station.length)
        let mtrStopDepartureContainer = document.createElement('div')
        mtrStopDepartureContainer.className = "stop"
        for (const train of mtrDeparture) {
            let mtrDepartureInnerContainer = document.createElement('div')
            let mtrStationText = document.createElement('span')
            let mtrDepartureText = document.createElement('span')
            mtrDepartureInnerContainer.className = 'departure'
            mtrStationText.className = 'dest'
            mtrDepartureText.className = 'eta'
            if (train.slice(0, 5) === 'ERROR') {
                mtrStationText.innerHTML = train.slice(0, 5)
            }
            else if (train.slice(0, 9) === 'NOSERVICE') {
                mtrStationText.innerHTML = train.slice(11, train.length-1)
            }
            else {
                mtrStationText.innerHTML = train[0]
                mtrDepartureText.innerHTML = train[1]
            }
            mtrDepartureInnerContainer.appendChild(mtrStationText)
            mtrDepartureInnerContainer.appendChild(mtrDepartureText)
            mtrStopDepartureContainer.appendChild(mtrDepartureInnerContainer)
            mtrDepartureContainer.appendChild(mtrStopDepartureContainer)
        }
    })
}

document.addEventListener("DOMContentLoaded", function() {
    let scheme = localStorage.getItem('scheme')
    let campus = localStorage.getItem('campus')
    let sortBy = localStorage.getItem('sortBy')

    if (campus === null) {
        localStorage.setItem("campus", "0")
        campus = localStorage.getItem('campus')
    }
    if (sortBy === null) {    
        localStorage.setItem("sortBy", "1")
        sortBy = localStorage.getItem('sortBy')
    }    

    setStopContatiner(campus)
    setBusEtaContainer(campus, sortBy)
    setMtrEtaContainer()
    let containerCheck = setInterval(function(){
        if (document.getElementsByClassName('bus-departure')){
            let busContainer = document.getElementsByClassName('bus-departure')
            if (scheme === 'dark') {
                for (const bus of busContainer) {
                    bus.style.backgroundColor = 'dimgray'
                }
            }
            else if (scheme === 'light') {
                for (const bus of busContainer) {
                    bus.style.backgroundColor = '#bbb'
                }
            }
        }
        if (document.getElementsByClassName('mtr-departure')){
            let mtrContainer = document.getElementsByClassName('mtr-departure')
            if (scheme === 'dark') {
                for (const mtr of mtrContainer) {
                    mtr.style.backgroundColor = 'dimgray'
                }
            }
            else if (scheme === 'light') {
                for (const mtr of mtrContainer) {
                    mtr.style.backgroundColor = '#bbb'
                }
            }
        }
    },50);

    let searchRange = document.getElementsByClassName('bus-departure')
    filter.addEventListener('input', e => {
        for (let i = 0; i < searchRange.length; i++) {
            if (searchRange[i].getElementsByClassName('stop')) {
                let searchTargetRoute = searchRange[i].getElementsByClassName('route')
                let searchTargetDest = searchRange[i].getElementsByClassName('dest')

                if (e.target.value.length === 0) {
                    stop = document.querySelectorAll('.bus-departure>.stop')
                    for (let j = 0; j < stop.length; j++) {
                        let departures = stop[j].getElementsByClassName('departure')
                        if (departures.length > 5) {
                            for (let dep = 0; dep < departures.length; dep++) {
                                if (dep >= 5) {
                                    departures[dep].style.display = 'none'
                                }
                            }
                        }
                    }
                }

                if (/\d/.test(e.target.value) === true) {
                    for (let j = 0; j < searchTargetRoute.length; j++) {
                        if (searchTargetRoute[j].innerHTML.toLowerCase().includes(e.target.value.toLowerCase())) {
                            searchTargetRoute[j].parentElement.style.display = 'flex'
                        }
                        else {
                            searchTargetRoute[j].parentElement.style.display = 'none'
                        }
                    }
                }
                else {
                    for (let j = 0; j < searchTargetDest.length; j++) {
                        if (searchTargetDest[j].innerHTML.toLowerCase().includes(e.target.value.toLowerCase())) {
                            searchTargetDest[j].parentElement.style.display = 'flex'
                        }
                        else {
                            searchTargetDest[j].parentElement.style.display = 'none'
                        }
                    }
                }
            }
        }
    })

    if (scheme === null) {
        localStorage.setItem("scheme", "light")
        scheme = localStorage.getItem('scheme')
    }
})

