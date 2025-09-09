document.addEventListener('DOMContentLoaded', () => {
    if (!('NDEFReader' in window)) {
        console.error("Web NFC is not supported by this browser.");
        document.getElementById('status-display').textContent = "Error: Web NFC not supported.";
        return;
    }

    const statusDisplay = document.getElementById('status-display');
    const startGameButton = document.getElementById('startGameButton');
    let isGameActive = false;

    function activateGameSession() {
        if (isGameActive) return;
        isGameActive = true;
        statusDisplay.textContent = 'Game Started! Tap a Joker.';
        startGameButton.style.display = 'none';
    }

    startGameButton.addEventListener('click', activateGameSession);

    async function startNfcScan() {
        try {
            const reader = new NDEFReader();
            await reader.scan();
            console.log("NFC Reader is active. Waiting for a tag...");
            
            reader.onreading = event => {
                const textDecoder = new TextDecoder();
                const scannedID = textDecoder.decode(event.message.records[0].data);
                console.log(`Scanned ID: ${scannedID}`);

                if (!isGameActive) {
                    if (scannedID === 'start_game') {
                        activateGameSession();
                    } else {
                        statusDisplay.textContent = 'Please tap "Start Game" card or click the button.';
                    }
                    return;
                }

                processNfcTap(scannedID);
            };

            reader.onreadingerror = error => {
                console.error('NFC read error:', error);
                statusDisplay.textContent = 'Error reading card.';
            };
        } catch (error) {
            console.error('NFC scan failed to start:', error);
            statusDisplay.textContent = 'Error: Could not start NFC scanner.';
        }
    }

    startNfcScan();
});