const label = document.querySelector(".button__text");
const progress = document.querySelector(".download-progress");
let update = false;
let count = 0
let updateprogress = 0;
let deferredPrompt = null;

document.addEventListener("DOMContentLoaded", function () {
    const button = document.querySelector(".button--hoo");

    button.addEventListener("click", function () {
        const firstBird = document.querySelector(".character:nth-child(1)");
        const secondBird = document.querySelector(".character:nth-child(2)");
        const thirdBird = document.querySelector(".character:nth-child(3)");

        // Add a class to trigger the animation
        firstBird.classList.add("animate-bird");
        secondBird.classList.add("animate-bird");
        thirdBird.classList.add("animate-bird");

        label.style.fontSize = '15px';
        update = true;

        // Remove the class after the animation is complete
        setTimeout(() => {
            firstBird.classList.remove("animate-bird");
            secondBird.classList.remove("animate-bird");
            thirdBird.classList.remove("animate-bird");

            label.textContent = "DOWNLOAD";
            label.style.fontSize = '20px';
            progress.textContent = "";
            update = false;
            count = 0;
            updateprogress = 0;
        }, 5000); // Zeitspanne der Animation festlegen
    });
});


setInterval(updateProgressLabel, 500);

function updateProgressLabel() {
    if (update) {
        updateprogress += 10;
        progress.textContent = updateprogress + "%";
    }
}

setInterval(updateLabel, 1000);

function updateLabel() {
    if (update) {
        count++;
        label.textContent = "DOWNLOADING" + ".".repeat(count);
    }
    if (count === 3) {
        count = 0;
    }
}

// Function um das Install-Prompt aufzurufen
async function installWebApp() {
    if (deferredPrompt) {
        await sleep(4750);
        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the installation prompt');
            } else {
                console.log('User dismissed the installation prompt');
            }
            // Reset the deferredPrompt variable, as it can only be used once
            deferredPrompt = null;
        });
    }
}

// Eventlistener zum Abfangen des "beforeinstallprompt"s
window.addEventListener('beforeinstallprompt', (event) => {
    // Prevent the default browser install prompt
    event.preventDefault();

    console.log("TEST");

    // Store the event object for later use
    deferredPrompt = event;

    // Show the install button
    document.getElementById('installButton').style.visibility = 'visible';
});

//Wartezeit für Download-Button
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
