//Autor: Patrick Thor
export function updateOrientation(roll, pitch, yaw){
    document.querySelector("model-viewer#mbot2Model").orientation = `${roll}deg ${pitch}deg ${yaw}deg`;
}

//Variablen deklarieren
let icon_close = document.querySelector('.icon-close');
let wrapper = document.querySelector('.wrapper');
let main = document.querySelector('.main-controll-page');

export function closeConnecting() {
    wrapper.style.display = 'none';
    main.style.display = 'block';
    main.style.pointerEvents = 'auto'; // Re-enable pointer events
    main.style.opacity = '1'; // Set opacity back to 1
}

//Funktion für alle Skripte verfügbar machen
window.closeConnecting = closeConnecting;
window.updateOrientation = updateOrientation;