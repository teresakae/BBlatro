// nfc_handler.js (FINAL CORRECTED VERSION)

document.addEventListener('DOMContentLoaded', () => {
    // First, check if Web NFC is even supported by the browser.
    if (!('NDEFReader' in window)) {
        console.error("Web NFC is not supported by this browser.");
        // Disable the button and show an error if NFC is not available.
        const startButton = document.getElementById('startGameButton');
        if (startButton) {
            startButton.textContent = "Error: Web NFC Not Supported";
            startButton.disabled = true;
        }
        return;
    }

    // Get references to all the elements we need to control
    const startScreen = document.getElementById('start-screen');
    const calculatorUi = document.getElementById('calculator-ui');
    const startGameButton = document.getElementById('startGameButton');
    const statusDisplay = document.getElementById('status-display');
    const backgroundMusic = document.getElementById('background-music');

    // This is the main function that starts everything. It only runs when the button is clicked.
    startGameButton.addEventListener('click', async () => {
        
        // --- 1. Handle UI Changes ---
        startScreen.style.display = 'none'; // Hide the start screen
        calculatorUi.style.display = 'block'; // Show the main calculator UI. Using 'block' is safer.
        statusDisplay.textContent = 'Game Started! Tap a Joker.';

        // --- 2. Start Background Music (now allowed because of the user's click) ---
        // A try/catch block is good practice in case of any audio errors.
        try {
            await backgroundMusic.play();
        } catch (err) {
            console.warn("Background music could not be played:", err);
        }

        // --- 3. Start the NFC Scanner (now allowed because of the user's click) ---
        try {
            const reader = new NDEFReader();
            // This scan() call is now safely inside the click event.
            await reader.scan(); 
            console.log("NFC Reader is now active and listening.");

            reader.onreading = event => {
                const textDecoder = new TextDecoder();
                const scannedID = textDecoder.decode(event.message.records[0].data);
                
                // Since the game is active, we just process the Joker tap.
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
    });
});