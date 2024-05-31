const progressLabel = document.querySelector(".search_label");
let count = 0;

function updateLabel() {
    count++;
    progressLabel.textContent = "Searching" + ".".repeat(count);

    if (count === 4) {
        count = 0;
        progressLabel.textContent = "Searching";
    }
}

setInterval(updateLabel, 1000);