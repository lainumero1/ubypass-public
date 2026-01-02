async function getBusEta(campus, sortBy) {
    let citybus_stop_id = "None"
    let kmb_stop_id = "None"
    let gmb_stop_id = "None"
    let stop_name = []

    switch (campus) {
        case '0':
            citybus_stop_id = ['001113', '001188', '001116', '001012', '001006']
            kmb_stop_id = ['None', '1843FAE700FCA5AF', '46E6BA3C612CE74A', '5D694E9F5A66F888', '65523F89F26B2088']
            gmb_stop_id = ['20014878', '20000072', '20000008', '20014869', '20014880']
            stop_name = ["HKU Centennial Campus; Pok Fu Lam Road", 
                        "Chiu Sheung School Hong Kong; Pok Fu Lam Road", 
                        "HKU West Gate; Pok Fu Lam Road", 
                        "HKU East Gate; Bonham Road", 
                        "King's College; Bonham Road"]
            break
        case '1':
            citybus_stop_id = ['002231', '002330', '002324', '002236', '002312', '002313']
            kmb_stop_id = 'None'
            gmb_stop_id = ['20004114', 'None', 'None', '20004547', 'None', 'None']
            stop_name = ["Queen Mary Hospital; Pok Fu Lam Road (Northbound)", 
                        "HKU Li Ka Shing Faculty of Medicine; Victoria Road (Northbound)", 
                        "Sassoon Road; Victoria Road (Northbound)", 
                        "Queen Mary Hospital; Pok Fu Lam Road (Southbound)", 
                        "HKU Li Ka Shing Faculty of Medicine; Victoria Road (Southbound)", 
                        "Sassoon Road; Victoria Road (Southbound)"]
            break
        case '2':
            citybus_stop_id = 'None'
            kmb_stop_id = 'None'
            gmb_stop_id = ['20000331', '20004594']
            stop_name = ["Sha Wan Drive (Northbound)", 
                        "Sha Wan Drive (Southbound)"]
            break
    }
    let arrival = []
    let result = []

    for (let stop = 0; stop < stop_name.length; stop++){
        result.push([stop_name[stop]])
        try {
            result[stop].push("No upcoming departure. ")
            if (citybus_stop_id !== 'None') {
                if (citybus_stop_id[stop] !== 'None') {
                    let citybusResponse = await fetch(`https://rt.data.gov.hk/v1/transport/batch/stop-eta/CTB/${citybus_stop_id[stop]}`)
                    if (!citybusResponse.ok) {
                        throw new Error(`CTB HTTP ERROR: ${citybusResponse.status}`);
                    }
                    let citybusStop = await citybusResponse.json();
                    citybusStop["data"].forEach(departure => {
                        if (departure['eta'] === null || departure['eta'].length === 0) {
                            ;
                        }
                        else {
                            arrival.push({"co": "CTB", 
                                                "route": departure['route'], 
                                                "dest": departure['dest'], 
                                                "eta": departure['eta'].slice(0, 16)})
                        }
                    });
                }
            }
            
            if (kmb_stop_id !== 'None') {
                if (kmb_stop_id[stop] !== 'None') {
                    let kmbResponse = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/stop-eta/${kmb_stop_id[stop]}`)
                    if (!kmbResponse.ok) {
                        throw new Error(`KMB HTTP ERROR: ${kmbResponse.status}`);
                    }
                    let kmbStop = await kmbResponse.json();
                    kmbStop["data"].forEach(departure => {
                        if (departure['eta'] === null || departure['eta'].length === 0) {
                            ;
                        }
                        else {
                            arrival.push({"co": "KMB", 
                                                "route": departure['route'], 
                                                "dest": departure['dest_en'], 
                                                "eta": departure['eta'].slice(0, 16)})
                        }
                    })
                }
            }   
            if (gmb_stop_id !== 'None') {
                if (gmb_stop_id[stop] !== 'None') {
                    let gmbResponse = await fetch(`https://data.etagmb.gov.hk/eta/stop/${gmb_stop_id[stop]}`, {mode: 'cors'})
                    if (!gmbResponse.ok) {
                        throw new Error(`GMB HTTP ERROR: ${gmbResponse.status}`);
                    }
                    let gmbStop = await gmbResponse.json();
                    for (const departure of gmbStop["data"]) {
                        if (departure['enabled'] === false) {
                            ;
                        }
                        if (departure['eta'] === null || departure['eta'].length === 0) {
                            ;
                        }
                        else {
                            let gmbRes = await fetch(`https://data.etagmb.gov.hk/route/${departure['route_id']}`, {mode: 'cors'})
                            if (!gmbRes.ok) {
                                throw new Error(`HTTP ERROR: ${gmbRes.status}`);
                            }
                            let route = await gmbRes.json();
                            let routeData = route["data"][0]
                            let routeCode = routeData["route_code"]
                            let departureSeq = departure["route_seq"]
                            let routeDest
                            if (departureSeq === 1) {
                                routeDest = routeData["directions"][0]["dest_en"]
                            }
                            else if (departureSeq === 2) {
                                routeDest = routeData["directions"][1]["dest_en"]
                            }
                            arrival.push({"co": "GMB", 
                                                "route": routeCode, 
                                                "dest": routeDest, 
                                                "eta": departure['eta'][0]['timestamp'].slice(0, 16)})
                        }
                    };
                }
            }
        }
        catch (error){
            console.log(`ERROR: ${error}`)
        }
        if (sortBy === '0') {
            let arrivals = arrival
            arrivals.sort((a, b) => a.route.localeCompare(b.route));
            arrivals.forEach(departure => {
                result[stop].push({"co": departure['co'], 
                                "route": departure['route'], 
                                "dest": departure['dest'], 
                                "eta": departure['eta'].slice(11, departure['eta'].length)})
            })
            arrival = []
        }
        else {
            let arrivals = arrival
            arrivals.sort((a, b) => a.eta.localeCompare(b.eta));
            arrivals.forEach(departure => {
                result[stop].push({"co": departure['co'], 
                                "route": departure['route'], 
                                "dest": departure['dest'], 
                                "eta": departure['eta'].slice(11, departure['eta'].length)})
            })
            arrival = []
        }
    }
    return result
}

async function getMtrEta() {
    const mtr_station_id = ["SYP", "HKU"]
    const station_name = ["Sai Ying Pun", "HKU"]
    let result = []
    for (let station = 0; station < station_name.length; station++) {
        result.push([station_name[station]])
        try {
            const mtrResponse = await fetch(`https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=ISL&sta=${mtr_station_id[station]}`)
            if (!mtrResponse.ok) {
                throw new Error(`MTR HTTP ERROR: ${mtrResponse.status}`);
            }
            let mtr = await mtrResponse.json();
            let mtrStation = mtr["data"]
            let eastbound = mtrStation[`ISL-${mtr_station_id[station]}`]["UP"]
            for (let departure of eastbound) {
                let eastboundDepartureTime = departure['time'].slice(11, departure['time'].length-3)
                result[result.length-1].push(["Chai Wan", eastboundDepartureTime])
            }
            let westbound = mtrStation[`ISL-${mtr_station_id[station]}`]["DOWN"]
            for (let departure of westbound) {
                let westboundDepartureTime = departure['time'].slice(11, departure['time'].length-3)
                result[result.length-1].push(["Kennedy Town", westboundDepartureTime])
            }
        }
        catch (error) {
            result[result.length-1].push(`ERROR: ${error}`)
        }
    }
    for (const station of result) {
        if (station.length <= 1) {
            station.push("NOSERVICE: No upcoming departure. ")
        }
    }
    return result
}

export {getBusEta, getMtrEta}