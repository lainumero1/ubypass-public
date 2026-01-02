let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: 22.28333, lng: 114.1348611 },
    zoom: 14,
  });

 const trafficLayer = new google.maps.TrafficLayer();

  trafficLayer.setMap(map);
}
initMap();

async function getTrafficNews() {
  let news = []
  const docResponse = await fetch('https://resource.data.one.gov.hk/td/en/specialtrafficnews.xml')
  if (!docResponse.ok) {
    throw new Error(`Traffic News HTTP ERROR: ${docResponse.status}`);
  }
  const doc = await docResponse.text()
  let prcessedDoc = new DOMParser().parseFromString(doc, "text/xml").getElementsByTagName('message')
  for (const message of prcessedDoc) {
    news.push(message.getElementsByTagName('EngShort')[0].innerHTML)
  }  
  return news
}

async function setTrafficNewsContainer() {
  const newsAPI = await getTrafficNews()
  let trafficNewsContainer = document.getElementById("traffic-news-container")
  newsAPI.forEach((news) => {
    let newsMsg = document.createElement('p')
    newsMsg.innerHTML = news
    trafficNewsContainer.appendChild(newsMsg)
  })
}

document.addEventListener('DOMContentLoaded', e => {
    setTrafficNewsContainer()
    let scheme = localStorage.getItem('scheme')

    let containerCheck = setInterval(function(){ 
      if (document.querySelectorAll('#traffic-news-container>p')) {
        let trafficNewsContainer = document.querySelectorAll('#traffic-news-container>p')
        if (scheme === 'dark') {
          for (const news of trafficNewsContainer) {
            news.style.backgroundColor = 'dimgray'
          }
        }
        else if (scheme === 'light') {
          for (const news of trafficNewsContainer) {
            news.style.backgroundColor = '#bbb'
          }
        }   
      }
    },50)
})