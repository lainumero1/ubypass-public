const ndef = new NDEFReader();


document.addEventListener("DOMContentLoaded", function() {
    ndef
        .scan()
        .then(() => {
            console.log("Scan started successfully.");
                ndef.onreadingerror = (event) => {
                    document.getElementById('error').innerText = "Error! Cannot read data from the NFC tag. Try a different one?"
                console.log(
                    "Error! Cannot read data from the NFC tag. Try a different one?",
                );
            };
            ndef.addEventListener("reading" , ({ message, serialNumber }) => {
                document.getElementById('error').innerText = "NDEF message read."
                console.log("NDEF message read.");
            });
        })
        .catch((error) => {
            document.getElementById('error').innerText = `Error! Scan failed to start: ${error}.`
            console.log(`Error! Scan failed to start: ${error}.`);
    });
})