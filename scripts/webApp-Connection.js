/*Autor: Stefan Rautner*/

//Variablen definieren
let left = 0;
let right = 0;

//Ausgewählter MBot
let mBotID = 999999999;

//Variable für senden/Controller checken
let initialized = false;

//Variablen für die Ambiente-Beleuchtung
let linksLED = "ffffff";
let linksMitteLED = "ffffff";
let mitteLED = "ffffff";
let rechtsMitteLED = "ffffff";
let rechtsLED = "ffffff";

//Controller-Trigger-Variablen
let lineFollowerPressed = false;
let suicidePreventionPressed = false;

//Daten vom Beschleunigungssensor & UltrasonicSensor der letzten 10 Sekunden
let lastExecutionTimeUpdateCharts = 0;
const timeToSaveData = 10;
let ultrasonicSensorData = [];
let accelerometerData = [];

//Geschwindigkeiten für den LineFollower
const lineFollowerSpeed = 17.5;       //DEBUG: muss noch auf Testergebnis von Testscript gesetzt werden
const lineFollowerCurveSpeed = 15;  //DEBUG: muss noch auf Testergebnis von Testscript gesetzt werden
let lineFollowerSpeedLeft = 0;
let lineFollowerSpeedRight = 0;

//Geschwindigkeiten
let speed = 0;
const addedSpeedForCurve = 20;
const maxReverseSpeed = -100;
const maxForwardSpeed = 100;

//Liste für alle Verfügbare MBots
let possibleMBot2sToConnect = [];
let formerConnectedMBots = [];

//MBots geladen Zeitbegrenzung
let lastExecutionTime = 0;
const duration = 11000; //11 Sekunden

//Variable für Verbindungsstatus mit MBot
let connected = false;

//IP-Addresse des Zwischenservers
let intermediaryServerIP = "127.0.0.1";

//Überprüfung, ob jede Sekunde mindestens eine Nachricht empfangen wurde
setInterval(checkConnectionStatus, 1000);

//UTF-8 En-/Decoder
let encoder;
let decoder;
try {
    encoder = new TextEncoder();
    decoder = new TextDecoder();
} catch (error) {
    console.error(`Error while creating UTF-8 Encoder & Decoder ${error}`);
}

let socket = null;

//WebSocket
function createWebSocketConnection() {
    //Websocket verbunden
    socket.onopen = function () {
        console.log("WebSocket connected");
    };

    //WebSocket getrennt
    socket.onclose = function () {
        console.log("WebSocket disconnected");
    };

    //WebSocket Error
    socket.onerror = function (event) {
        console.error(`WebSocket error: ${event.data}`);
    };

    //WebSocket Verbindung zum Empfangen einer Nachricht vom MBot2 über Server
    socket.onmessage = async function (event) {
        try {
            let receivedData = decoder.decode(await event.data.arrayBuffer());
            let data = JSON.parse(receivedData);

            //Liste an möglichen MBots erhalten
            if (Array.isArray(data) && data.length > 0 && data[0] === "MBots:") {
                const mbots = data.slice(1);
                document.getElementById("textForWhileSearchingMBot").style.display = "none";

                //Liste in HTML anzeigen
                const myList = document.getElementById("showPossibleMBots");
                myList.innerHTML = "";

                await makeListElementsForArray(mbots, myList);
            } else {
                connected = true;
                //Daten des Gyrosensors erhalten & an ModelViewer übergeben
                updateOrientation(data.gyroscopeRoll, -data.gyroscopePitch, data.gyroscopeYaw + 150.45);

                //Farbe unter dem MBot
                document.getElementById("rgbSensor").style.background = "#" + (data.rgbSensorMiddleRight).slice(2);

                //Zeitdaten des Ultrasonic-Sensors & Beschleunigungssensors updaten
                if (Date.now() >= lastExecutionTimeUpdateCharts + 500) {
                    //Ultraschal-Sensor
                    ultrasonicSensorData.push(data.ultrasonicSensor);
                    if (ultrasonicSensorData.length > timeToSaveData) {
                        ultrasonicSensorData.shift();
                    }
                    //Beschleunigungssensor
                    accelerometerData.push(data.accelerometer);
                    if (accelerometerData.length > timeToSaveData) {
                        accelerometerData.shift();
                    }
                    lastExecutionTimeUpdateCharts = Date.now();
                }

                if (data.suicideActivated) {
                    left = 0;
                    right = 0;
                }

                //LocalStorage Variablen der Charts setzen
                localStorage.setItem('beschleunigungsChartData', accelerometerData.join(','));
                localStorage.setItem('abstandChartData', ultrasonicSensorData.join(','));

                //Überprüfen, ob der LineFollower eingeschalten ist (wenn ja, Daten verarbeiten)
                if (document.getElementById("lineFollower").checked) {
                    //Farbflächen des LineFollower setzen
                    document.getElementById("lightSensorLeft").style.background = "#" + (data.rgbSensorLeft).slice(2);
                    document.getElementById("lightSensorMiddleLeft").style.background = "#" + (data.rgbSensorMiddleLeft).slice(2);
                    document.getElementById("lightSensorMiddleRight").style.background = "#" + (data.rgbSensorMiddleRight).slice(2);
                    document.getElementById("lightSensorRight").style.background = "#" + (data.rgbSensorRight).slice(2);
                    //LineFollower
                    await lineFollower("#" + (data.rgbSensorMiddleLeft).slice(2), "#" + (data.rgbSensorMiddleRight).slice(2));
                } else if (lineFollowerSpeedLeft !== 0 || lineFollowerSpeedRight !== 0) {
                    lineFollowerSpeedLeft = 0;
                    lineFollowerSpeedRight = 0;
                }

                if (document.getElementById("suicidePrev").checked) {
                    suicidePreventionPressed = true;
                } else {
                    suicidePreventionPressed = false;
                }

                console.log("Got Message from the TCP-Server");
                connected = true;
            }
        } catch (error) {
            console.error(`Error while receiving Message from MBot: ${error}`);
        }

        if (initialized) {
            await communicating();
        }
    }
}


//Disconnected Funktion in Console schreiben
async function checkConnectionStatus() {
    let state = "";
    let stateColor = "";

    if (!connected) {
        state = "Getrennt";
        stateColor = "red";
        connected = false;
    } else {
        state = "Verbunden";
        stateColor = "green";
        connected = true;
    }

    if (mBotID !== 999999999) {
        try {
            //Listenelement erhalten
            const listElement = document.getElementById(mBotID);

            //Derzeitigen Text aus Listenelement erhalten & ändern
            const content = listElement.innerHTML;
            const currentHTML = content.split("<br>");
            currentHTML[2] = `Status: ${state}`;

            //Neuen Status auf GUI anzeigen
            listElement.innerHTML = currentHTML.join("<br>");

            //Statusanzeige (Kreis erstellen & Farbe zuweisen)
            const stateCycle = document.createElement("div");

            //Statusanzeigen stylen (Größe, Farbe & Kreis)
            stateCycle.style.backgroundColor = stateColor;
            stateCycle.style.width = "10px";
            stateCycle.style.height = "10px";
            stateCycle.style.borderRadius = "50%";

            //Statusanzeige zum Listenelement hinzufügen
            listElement.appendChild(stateCycle);
        } catch (error) {
            console.error(`Couldn't change the Connection-State of the MBot: ${error}`);
        }
    }
}

//Alle MBots mit denen eine Verbindung hergestellt werden kann erhalten
async function getPossibleMBots() {
    try {
        document.getElementById("showPossibleMBots").innerHTML = "";
        document.getElementById("textForWhileSearchingMBot").style.display = "block";
        if (socket !== null) {
            if (Date.now() - lastExecutionTime >= duration) {
                socket.send("searchForMBots");
                lastExecutionTime = Date.now();
            }
        } else {
            alert("Bitte starten Sie zuerst den Zwischenserver");
        }
    } catch (error) {
        console.error(`Looking for MBots failed: ${error}`);
    }
}

//Funktion um MBot-Verbindungen grafisch anzuzeigen
async function makeListElementsForArray(mBots, myList) {
    //Überprüfen, ob die Liste/Array leer ist
    if (mBots.length === 0) {
        const messageEmpty = document.createElement("li");
        messageEmpty.innerHTML = "Es wurden keine MBots gefunden";
        myList.appendChild(messageEmpty);
    }

    //MBots anzeigen und in Liste/Array speichern (Name, IP-Adresse & Portnummer, Status (Text & Farbkreis))
    for (let i = 0; i < mBots.length; i++) {
        let found = false;
        possibleMBot2sToConnect.forEach(bot => {
            if (bot === mBots[i]) {
                found = true;
            }
        });
        if (!found) {
            possibleMBot2sToConnect.push(mBots[i]);
        }

        //Listenelement zum Anzeigen des MBots erstellen
        let listElement = document.createElement("li");

        //Text zum Listenelement hinzufügen
        listElement.innerHTML = `MBot${i + 1}<br>${mBots[i]}<br>Status: Getrennt`;

        //Statusanzeige (Kreis erstellen & Farbe zuweisen)
        const stateCycle = document.createElement("div");

        //Statusanzeigen stylen (Größe, Farbe & Kreis)
        stateCycle.style.backgroundColor = "red";
        stateCycle.style.width = "10px";
        stateCycle.style.height = "10px";
        stateCycle.style.borderRadius = "50%";

        //Statusanzeige zum Listenelement hinzufügen
        listElement.appendChild(stateCycle);

        //Doppelklick Eventhandler auf Listenelement legen
        listElement.ondblclick = function () {
            connectToMBot2();
        };

        //Klick Eventhandler auf Listenelement legen
        listElement.onclick = function () {
            mBotID = this.id;
        }

        //Listenelement ID zuweisen
        listElement.id = `${i}`;

        //Klasse zum Stylen der Elemente
        listElement.classList.add("connection-li");

        //Listenelement stylen
        listElement.style.whiteSpace = "pre-line";

        //Listenelement zu GUI-Liste hinzufügen
        myList.appendChild(listElement);
    }
}

//Funktion zur Kommunikation mit dem MBot
async function communicating() {
    await checkGamepadInput();
    await sendToMBot2();
}

//Funktion für die Berechnungen des LineFollowers
async function lineFollower(lightSensorMiddleLeft, lightSensorMiddleRight) {
    try {
        if (lightSensorMiddleLeft !== "#ffffff" && lightSensorMiddleRight !== "#ffffff") {
            lineFollowerSpeedLeft = lineFollowerSpeed;
            lineFollowerSpeedRight = lineFollowerSpeed;
        } else if (lightSensorMiddleLeft !== "#ffffff" && lightSensorMiddleRight === "#ffffff") {
            lineFollowerSpeedLeft = -lineFollowerCurveSpeed;
            lineFollowerSpeedRight = lineFollowerCurveSpeed;
        } else if (lightSensorMiddleLeft === "#ffffff" && lightSensorMiddleRight !== "#ffffff") {
            lineFollowerSpeedLeft = lineFollowerCurveSpeed;
            lineFollowerSpeedRight = -lineFollowerCurveSpeed;
        } else if (lightSensorMiddleLeft === "#ffffff" && lightSensorMiddleRight === "#ffffff") {
            lineFollowerSpeedLeft = -lineFollowerSpeed;
            lineFollowerSpeedRight = -lineFollowerSpeed;
        }
    } catch (error) {
        console.error(`Error while calculating commands in LineFollower: ${error}`);
    }
}

//Bewegungs-Grafik-Intervals
let moveInterval;

//Grafik-Bewegung beginnen
async function startMoving(element) {
    try {
        element.style.transform = "scale(1.3)";
        moveInterval = setInterval(function () {
            move(element);
        }, 1);
    } catch (error) {
        console.error(`Error while moving (with graphic interface): ${error}`);
    }
}

//Grafik-Bewegung stoppen
async function stopMoving(element) {
    try {
        element.style.transform = "scale(1)";
        clearInterval(moveInterval);
        await stopMove(element);
    } catch (error) {
        console.error(`Error while stopping (with graphic interface): ${error}`);
    }
}

//Überprüfen, ob der MBot2 fährt (Angezeigte Steuerelemente)
async function move(element) {
    try {
        if (element.id === 'button-controll') {
            if (speed < 0) {
                speed = 0;
            }
            speed += 1;
            left = speed;
            right = speed;
            console.log("Moved straight");
        }
        if (element.id === 'button-controll2') {
            if (speed > 0) {
                speed = 0;
            }
            speed -= 1;
            left = speed;
            right = speed;
            console.log("Moved back");
        }
        if (element.id === 'button-controll1') {
            left = speed - addedSpeedForCurve;
            right = speed + addedSpeedForCurve;
            console.log("Moved left");
        }
        if (element.id === 'button-controll3') {
            left = speed + addedSpeedForCurve;
            right = speed - addedSpeedForCurve;
            console.log("Moved right");
        }
    } catch (error) {
        console.error(`Error while moving : ${error}`);
    }
}

//Überprüfen, ob der MBot2 stehen geblieben ist (Angezeigte Steuerelemente)
async function stopMove(element) {
    try {
        if (element.id === 'button-controll') {
            speed = 0;
            console.log("Stopped moving straight");
        }
        if (element.id === 'button-controll2') {
            speed = 0;
            console.log("Stopped moving back");
        }
        if (element.id === 'button-controll1') {
            console.log("Stopped moving left");
        }
        if (element.id === 'button-controll3') {
            console.log("Stopped moving right");
        }
        left = speed;
        right = speed;
    } catch (error) {
        console.error(`Error while stopping: ${error}`);
    }

}

//Variablen Statuse definieren
let keyState = {
    'ArrowUp': false,
    'ArrowDown': false,
    'ArrowLeft': false,
    'ArrowRight': false,
    'w': false,
    's': false,
    'a': false,
    'd': false
};

//Listener für KeyDown-Event
document.addEventListener('keydown', async function (event) {
    try {
        // Key-State updaten
        keyState[event.key] = true;
        await handleKeys();
    } catch (error) {
        console.error(`Error while moving (with keyboard): ${error}`);
    }
});

//Listener für KeyUp-Event
document.addEventListener('keyup', async function (event) {
    try {
        // Key-State updaten
        keyState[event.key] = false;
        await handleKeys();
    } catch (error) {
        console.error(`Error while stopping (with keyboard): ${error}`);
    }
});

//Auf Tasten reagieren
async function handleKeys() {
    try {
        let keyPressed = false;
        // Check key state and update speed accordingly
        if (keyState['ArrowUp'] || keyState['w']) {
            if (speed < 0) {
                speed = 0;
            }
            speed += 1;
            left = speed;
            right = speed;
            console.log("Moving straight");
            keyPressed = true;
        }
        if (keyState['ArrowDown'] || keyState['s']) {
            if (speed > 0) {
                speed = 0;
            }
            speed -= 1;
            left = speed;
            right = speed;
            console.log("Moving back");
            keyPressed = true;
        }
        if (keyState['ArrowLeft'] || keyState['a']) {
            left = speed - addedSpeedForCurve;
            right = speed + addedSpeedForCurve;
            console.log("Moving left");
            keyPressed = true;
        }
        if (keyState['ArrowRight'] || keyState['d']) {
            left = speed + addedSpeedForCurve;
            right = speed - addedSpeedForCurve;
            console.log("Moving right");
            keyPressed = true;
        }
        if (!keyPressed) {
            speed = 0;
            left = speed;
            right = speed
            console.log("Stopped moving");
        }

    } catch (error) {
        console.error(`Error while handling keyboard keys: ${error}`);
    }
}


//Listener für Ausgabe, ob Controller verbunden wurde
window.addEventListener("gamepadconnected", async function () {
    console.log("Controller connected");
});

//Listener für Ausgabe, on Controller getrennt wurde
window.addEventListener("gamepaddisconnect", async function () {
    console.log("Controller disconnected");
});

//Überprüfen, ob Controller (PS & XBOX) zur Steuerung des MBot2 verwendet wird
async function checkGamepadInput() {
    try {
        //Alle Gamepads erhalten
        const gamepads = navigator.getGamepads();

        //Alle verbundenen Gamepads überprüfen
        for (const gamepad of gamepads) {
            if (gamepad) {
                // Überprüfen ob Controller das Standard mapping verwendet
                if (gamepad.mapping === 'standard') {

                    // Rechter Joystick
                    const stickX = gamepad.axes[2];
                    const stickY = gamepad.axes[3];

                    // Druckstärke (links & rechts) ausrechnen (zwischen 1 & -1)
                    let leftRaw = stickY - stickX;
                    let rightRaw = stickY - stickX;

                    //-1 bis 1 auf maxReverseSpeed bis maxForwardSpeed mappen
                    left = -Math.round((leftRaw - -1) * (maxForwardSpeed - maxReverseSpeed) / (1 - -1) + maxReverseSpeed);
                    right = -Math.round((rightRaw - -1) * (maxForwardSpeed - maxReverseSpeed) / (1 - -1) + maxReverseSpeed);

                    if (left === -0) {
                        left = 0;
                    }
                    if (right === -0) {
                        right = 0;
                    }

                    console.log(left);
                    console.log(right);

                    // Linker Trigger (SuicidePrevention)
                    if (!gamepad.buttons[5].pressed) {
                        suicidePreventionPressed = false;
                    }
                    if (!suicidePreventionPressed) {
                        if (gamepad.buttons[5].pressed && document.getElementById("suicidePrev").checked) {
                            document.getElementById("suicidePrev").checked = false;
                            console.log("SuicidePrevention deactivated");
                            suicidePreventionPressed = true;
                        } else if (gamepad.buttons[5].pressed) {
                            document.getElementById("suicidePrev").checked = true;
                            console.log("SuicidePrevention activated");
                            suicidePreventionPressed = true;
                        }
                    }

                    // Rechter Trigger (LineFollower)
                    if (!gamepad.buttons[4].pressed) {
                        lineFollowerPressed = false;
                    }
                    if (!lineFollowerPressed) {
                        if (gamepad.buttons[4].pressed && document.getElementById("lineFollower").checked) {
                            document.getElementById("lineFollower").checked = false;
                            console.log("LineFollower deactivated");
                            lineFollowerPressed = true;
                        } else if (gamepad.buttons[4].pressed) {
                            document.getElementById("lineFollower").checked = true;
                            console.log("LineFollower activated");
                            lineFollowerPressed = true;
                        }
                    }
                } else {
                    console.log("Connected Controller doesn't support standard mapping");
                }
            }
        }
    } catch (error) {
        console.error(`Error while checking controller inputs: ${error}`);
    }
}

//Nachricht an Server senden
async function sendToMBot2() {
    try {
        //Motoren limitieren
        while (true) {
            if (left > maxForwardSpeed || right > maxForwardSpeed) {
                left -= 1;
                right -= 1;
            } else if (left < maxReverseSpeed || right < maxReverseSpeed) {
                left += 1;
                right += 1;
            } else {
                break;
            }
        }

        //LineFollower
        if (document.getElementById("lineFollower").checked) {
            left = lineFollowerSpeedLeft;
            right = lineFollowerSpeedRight;
        }

        //JSON für MBot (Motorengeschwindigkeit)
        const data = {
            links: left,
            rechts: right,
            leftLED: linksLED,
            leftMiddleLED: linksMitteLED,
            middleLED: mitteLED,
            rightMiddleLED: rechtsMitteLED,
            rightLED: rechtsLED,
            suicidePrevention: suicidePreventionPressed
        }
        //Daten durch WebSocket über Server an MBot2 senden
        const json = JSON.stringify(data);
        socket.send(encoder.encode(json));

    } catch (error) {
        console.error(`Error while sending Commands to TCP-Server: ${error}`);
    }
}

//Funktion um die Farben Ambiente-Beleuchtung einzustellen
async function ambientColorPicker(id) {
    const colorPicker = document.getElementById(id);
    const color = colorPicker.value.substring(1);

    if (id === "leftLED") {
        linksLED = color;
    } else if (id === "leftMiddleLED") {
        linksMitteLED = color;
    } else if (id === "middleLED") {
        mitteLED = color;
    } else if (id === "rightMiddleLED") {
        rechtsMitteLED = color;
    } else if (id === "rightLED") {
        rechtsLED = color;
    }
}

//Funktion um schon einmal verbundene MBots anzuzeigen
async function showFormerMBots() {
    //Liste in HTML anzeigen
    const myList = document.getElementById("showFormerConnectedMBots");
    myList.innerHTML = "";
    let listElement = document.createElement("li");
    listElement.innerHTML = "Anderen MBot verbinden";
    listElement.id = "NewMBot";
    listElement.onclick = function () {
        mBotID = this.id;
    }
    myList.appendChild(listElement);
    await makeListElementsForArray(formerConnectedMBots, myList);
}

//Funktion zum Hinzufügen von MBots zur Liste der zuvor verbundenen MBots
async function addToFormerConnected() {
    if (mBotID !== 999999999) {
        formerConnectedMBots.push(possibleMBot2sToConnect[mBotID]);
    } else {
        alert("Bitte wählen Sie einen MBot aus");
    }
}

//Funktion zum Löschen von MBots von der Liste der zuvor verbundenen MBots
async function removeFromFormerConnected() {
    if (formerConnectedMBots.contains(possibleMBot2sToConnect[mBotID])) {
        formerConnectedMBots.remove(possibleMBot2sToConnect[mBotID]);
    }
}

//Funktion zum Anzeigen von bereits verbundenen MBots
async function connectToFormerMBot() {
    if (mBotID !== "NewMBot") {
        socket.send(formerConnectedMBots[mBotID]);
        await communicating();
        console.log("MBot2 connected & communicating");
    } else {
        window.location.href = "index.html#controller";
    }
}

//Verbindung mit MBot herstellen
async function connectToMBot2() {
    try {
        window.closeConnecting();
        if (socket !== null) {
            //Kommunikation mit MBot2 freigeben
            initialized = true;

            const form = document.getElementsByClassName("wrapper");
            form[0].style.display = "none";

            const connectedListelement = document.getElementById(mBotID);
            connectedListelement.classList.add("connected");

            //Verbindung des ausgewählten MBots senden
            formerConnectedMBots.push(possibleMBot2sToConnect[mBotID]);
            socket.send(possibleMBot2sToConnect[mBotID]);
            await communicating();

            console.log("MBot2 connected & communicating");
        } else {
            alert("Bitte starten Sie zuerst den Zwischenserver");
        }
    } catch (error) {
        console.error(`Error while connecting to MBot: ${error}`);
    }
}

//Von MBot2 trennen
async function disconnectFromMBot2() {
    try {
        const connectedListelement = document.getElementById(mBotID);
        connectedListelement.classList.remove("connected");

        //Kommunikation beenden
        initialized = false;

        //Trennen Nachricht senden
        socket.send(encoder.encode("Disconnect"));
        connected = false;

        console.log("MBot2 disconnected");

        localStorage.setItem('beschleunigungsChartData', JSON.stringify([]));
        localStorage.setItem('abstandChartData', JSON.stringify([]));
    } catch (error) {
        console.error(`Error while disconnecting from MBot: ${error}`);
    }
}

//Zwischenserver downloaden & Benutzer anweisen den Zwischenserver zu starten
window.addEventListener("DOMContentLoaded", async function () {

    let mobileDevice = false;

    //UserAgent auslesen
    const userAgent = navigator.userAgent.toLowerCase();

    // Schlüsselwörter, die auf Mobilgeräte hinweisen können
    const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];

    //Überprüfen ob eines der Wörter im UserAgent vorhanden ist
    if (mobileKeywords.some(keyword => userAgent.includes(keyword))) {
        mobileDevice = true;
        alert("Zum Steuern des MBot benötigen Sie einen PC!\nBitte öffnen Sie auf ihrem PC diese Seite erneut (dadurch wird der Zwischenserver heruntergeladen).\nDanach führen Sie diesen bitte auf ihrem PC aus, geben Sie in dem folgenden Eingabefeld die (auf dem Zwischenserver) angezeigte IP-Addresse ein und zu guter Letzt kreuzen Sie bitte die Checkbox 'Zwischenserver gestartet' an.\nJetzt können Sie den MBot auch über ihr Mobilgerät steuern!");
        document.getElementById("settingForIntermediaryServer").style.display = "block";
    } else {
        //Zwischenserver downloaden
        try {
            //Iframe erstellen, konfigurieren & dadurch ZwischenServer Downloaden
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            iframe.src = '../WebSocketServer/IntermediaryServerForMBotConnection.py';

            //Ausgabe, wenn Zwischenserver heruntergeladen wurde
            console.log("Intermediary Server downloaded");

            //Benutzer Zwischenserver ausführen lassen
            try {
                alert("Bitte führen Sie das gerade Heruntergeladene Python-Skript 'IntermediaryServerFromBotConnection.py' in ihrem Download-Ordner aus");
            } catch (error) {
                console.error(`Error while giving User Instructions to execute Intermediary Server locally: ${error}`);
            }
        } catch (error) {
            console.error(`Error while downloading the Intermediary Server: ${error}`);
        }
    }

    //Überprüfen, ob Benutzer mitteilt, dass er den Zwischenserver gestartet hat
    try {
        //Search-text ausblenden
        document.getElementById("textForWhileSearchingMBot").style.display = "none";

        //Überprüfen, ob der Benutzer bestätigt hat, dass er den ZwischenServer gestartet hat
        while (!document.getElementById("zwischenserverGestartet").checked) {
            //50 ms warten
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        console.log("Intermediary Server started");

        //Wenn Mobilgerät, dann andere ServerIP als localhost benötigt
        if (mobileDevice) {
            intermediaryServerIP = document.getElementById("IPAddressOfIntermediaryServer").value;
        }

        //Socket verbinden
        socket = new WebSocket('ws://' + intermediaryServerIP + ':5431');
        createWebSocketConnection();

        //100 ms warten, um sicherzugehen, das der WebSocket verbunden ist
        await new Promise(resolve => setTimeout(resolve, 100));

        //MBots vom Zwischenserver holen
        await getPossibleMBots();
    } catch (error) {
        console.error(`Can't connect to Websocket: ${error}`);
    }
});

//Wenn Client WebApp verlässt/zumacht, dann Verbindung beenden
window.addEventListener("beforeunload", async function () {
    try {
        // Kommunikation beenden
        initialized = false;

        // Schließen-Nachricht senden
        if (socket.readyState === WebSocket.OPEN) {
            socket.send("Close");
            //2 Sekunde warten, um sicherzugehen, dass MBot getrennt ist
            await new Promise(resolve => setTimeout(resolve, 2000));
            socket.close();
        }
    } catch (error) {
        console.error(`Error while closing Connection with Server: ${error}`);
    }

    // Localstorage-Variablen löschen
    localStorage.remove('beschleunigungsChartData');
    localStorage.remove('abstandChartData');
});