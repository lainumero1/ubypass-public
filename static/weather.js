async function getWeather() {
    let warnMsg = []
    try {
        const weatherResponse = await fetch(`https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en`)
        if (!weatherResponse.ok) {
            throw new Error(`Weather HTTP ERROR: ${weatherResponse.status}`);
        }
        const weather = await weatherResponse.json();

        let temperatureMsg = weather["temperature"]["data"]
        temperatureMsg.forEach(location => {
            if (warnMsg.length === 0) {
                if (location["place"] === "Hong Kong Park") {
                    let temperature = `${location["value"]}°C`
                    warnMsg.push(temperature)
                }
                else if (location["place"] === "Hong Kong Observatory") {
                    let temperature = `${location["value"]}°C`
                    warnMsg.push(temperature)
                }
            }
        })
            
        const warnsumResponse = await fetch(`https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=warnsum&lang=en`)
        if (!warnsumResponse.ok) {
            throw new Error(`Warnsum HTTP ERROR: ${warnsumResponse.status}`);
        }
        const warnsum = await warnsumResponse.json();
        let warnSumList = Object.values(warnsum)
        if (warnSumList.length > 0) {
            warnSumList.forEach(warn => {
                if (warn["actionCode"] !== "CANCEL") {
                    warnMsg.push(warn["code"])
                }
            })
        }
    }
    catch (error){
        console.error(`ERROR: ${error.message}. `)
    }
    return warnMsg
}

async function setWeatherContainer() {
    const weatherAPI = await getWeather()
    let weatherContainer = document.getElementById("weather-container")
    weatherAPI.forEach((weatherInfo, index) => {
        if (index === 0) {
            let temperatureMsg = document.createElement("span")
            temperatureMsg.innerHTML = `Current Temperature: ${weatherInfo}`
            weatherContainer.appendChild(temperatureMsg)
        }
        else {
            let warnicon = document.createElement('img')
            warnicon.className = "warnicon"
            warnicon.src = `static/warnicon/${weatherInfo}.gif`
            weatherContainer.insertBefore(warnicon, weatherContainer.children[0])
        }
    })
}

export {getWeather, setWeatherContainer}