async function getFile() {
    let urlResponse = await fetch('env')
    if (!urlResponse.ok) {
        document.getElementById('invalid-login').innerHTML = `URL HTTP ERROR: ${urlResponse.status}`
        throw new Error(`URL HTTP ERROR: ${urlResponse.status}`);
    }
    let url = await urlResponse.text();
    let baseUrl = url.slice(19, url.length-1)

    let filenames = ['2025S1-Route1.png', '2025S1-Route1a.png', '2025S1-Route2.png']

    for (let i = 0; i < filenames.length; i++) {
        let fileUrl = `https://${baseUrl}:8080/media/shuttleinfo/${filenames[i]}`
        let fileResponse = await fetch(fileUrl)
        if (!fileResponse.ok) {
            document.getElementById('error').innerHTML = "Unable to retrieve shuttle info. "
            throw new Error(`URL HTTP ERROR: ${fileResponse.status}`);
        }
        let files = document.getElementsByClassName('shuttle-file')
        for (let file = 0; file < files.length; file++) {
            if (files[file].src.length === 0) {
                files[file].src = fileUrl
                break
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    getFile()
})