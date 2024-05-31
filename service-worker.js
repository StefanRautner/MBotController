/* Autor: Stefan Rautner */

// Definition Cache-Version
let cacheVersion = 'mbotController-cache';

// Überprüfen ob service-worker schon einmal gefetched wurde
let checkedForUpdatesAtOpening = false;

// Definition Versions-Dokumente
const versionDocuments = [
    /* Stylesheets */
    './css/dino.css',
    './css/about.css',
    './css/controller.css',
    './css/download.css',
    './css/form.css',
    './css/form-temp.css',
    './css/main.css',
    './css/team.css',
    /* Bilder */
    './images/controller.png',
    './images/detect.png',
    './images/display.png',
    './images/downkey.png',
    './images/feature.png',
    './images/leftkey.png',
    './images/login_background.png',
    './images/pat.jpg',
    './images/Patrick.png',
    './images/rightkey.png',
    './images/safety.png',
    './images/speed.png',
    './images/Stefan.jpg',
    './images/Tobias.jpg',
    './images/upkey.png',
    './images/wlan.png',
    /* Icons */
    './images/icons/icon.ico',
    './images/icons/replacement_icon.png',
    /* 3D Model */
    './Mbot2/mbot2_model.glb',
    /* Librarys */
    /* ModelViewer */
    './librarys/modelViewer/model-viewer-lib.js',
    /* ionicons */
    './librarys/ionicons/svg/close.svg',
    './librarys/ionicons/svg/lock-closed.svg',
    './librarys/ionicons/svg/mail.svg',
    './librarys/ionicons/p-d15ec307.js',
    './librarys/ionicons/p-40ae2aa7.js',
    './librarys/ionicons/p-1c0b2c47.entry.js',
    './librarys/ionicons/ionicons-lib.js',
    './librarys/ionicons/ionicons-lib.esm.js',
    /* gsap */
    './librarys/gsap/gsap.min.js',
    './librarys/gsap/ScrollTrigger.min.js',
    /* DinoGame */
    './librarys/dinoGame/platform.js',
    /* chart */
    './librarys/chart/chart.js',
    /* Skripte */
    './scripts/about.js',
    './scripts/charts.js',
    './scripts/connection.js',
    './scripts/dinoGame.js',
    './scripts/download.js',
    './scripts/gamebutton.js',
    './scripts/modelViewer.js',
    './scripts/website_logic.js',
    /* Connection to WebSocket-Sever (MBot2) */
    './scripts/webApp-Connection.js',
    /* HTML Dokumente */
    './index.html',
    './start.html',
    './dino-Game.html',
    /* Zwischenserver */
    './WebSocketServer/IntermediaryServerForMBotConnection.py',
    /* MBot2-Script */
    './MBot2/NetworkConnection_MBot2.py',
    /* Service-Worker & Manifest */
    './service-worker.js',
    './manifest.json'
];

// Hinzufügen der Ressourcen zum Cache in Chargen
const addToCacheInBatches = async () => {
    const batchSize = 10;                                                                                       // Anzahl der Dateien pro Upload-Batch
    const batches = Math.ceil(versionDocuments.length / batchSize);

    for (let i = 0; i < batches; i++) {
        const batch = versionDocuments.slice(i * batchSize, (i + 1) * batchSize);
        try {
            const cache = await caches.open(cacheVersion);
            await cache.addAll(batch);
            console.log(`Added batch ${i + 1}/${batches} to Cache`);
        } catch (error) {
            console.error(`Error while adding batch ${i + 1}/${batches} to Cache: ${error}`);
        }
    }
};

// Service Worker installieren
self.addEventListener('install', (event) => {
    event.waitUntil(addToCacheInBatches());
    console.log("Service Worker installed");
});

// Service Worker aktivieren und alte Caches entfernen
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((existingCacheName) => {
                    if (existingCacheName !== cacheVersion) {
                        console.log("Newer version detected");
                        return caches.delete(existingCacheName);
                    }
                })
            );
        })
    );
    console.log("Service Worker activated");
});

// Beim Öffnen der App auf Updates prüfen
self.addEventListener('fetch', (event) => {
    if (!checkedForUpdatesAtOpening && event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).then(async (response) => {
                try {
                    await checkForUpdates();
                    console.log("Checked for Updates");
                    checkedForUpdatesAtOpening = true;
                } catch (error) {
                    console.error(`Error while checking for Updates: ${error}`);
                }
                return response;
            }).catch(() => {
                console.error("Failed to check for Updates, using existing version from cache");
                return caches.match(event.request);
            })
        );
    }
});

// Regelmäßiges Überprüfen auf Updates
setInterval(async () => {
    try {
        await checkForUpdates();
        console.log("Check for Updates (once every 24 hours)");
    } catch (error) {
        console.error(`Error while checking for updates: ${error}`);
    }
}, 24 * 60 * 60 * 1000);   // Alle 24 Stunden

// Überprüfen auf Updates (durch Vergleich der Versionsnummer)
async function checkForUpdates() {
    try {
        console.log("Checking for Updates");
        const versions = await Promise.all(
            versionDocuments.map((document) => fetch(document)
                .then((response) => response.text())
            )
        );
        const newerVersion = versions.some((latestVersion) => latestVersion !== cacheVersion);

        if (newerVersion) {
            console.log("Update found");
            cacheVersion = 'mbotController-cache-' + Date.now();
            console.log("Updating cache");
            await addToCacheInBatches(); // Hinzufügen der Ressourcen in Chargen aktualisieren
            console.log("Cache updated");

            const clients = await self.clients.matchAll({type: 'window'});
            if (clients && clients.length > 0) {
                await Promise.all(clients.map(async (client) => {
                    await client.navigate(client.url);
                    console.log("Window updated to newer Version");
                }));
            } else {
                console.log("No clients found");
            }
        } else {
            console.log("No Updates found\nCache is up to date");
        }
    } catch (error) {
        console.error(`Error while checking for updates: ${error}`);
    }
}