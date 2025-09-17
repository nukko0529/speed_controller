let currentRate = 1.0;
const MAX_RATE = 5.0;
const MIN_RATE = 0.1;

function setPlaybackRate(video) {
    video.playbackRate = currentRate;
    updateSpeedDisplay(currentRate);
}

function updateSpeedDisplay(rate) {
    let speedDisplay = document.getElementById("speed-display");

    if(!speedDisplay) {
        speedDisplay = document.createElement("div");
        speedDisplay.id = "speed-display";
        speedDisplay.style.position = "fixed";
        speedDisplay.style.top = "10px";
        speedDisplay.style.right = "10px";
        speedDisplay.style.background = "grey";
        speedDisplay.style.color = "white";
        speedDisplay.style.padding = "4px 8px";
        speedDisplay.style.borderRadius = "6px";
        speedDisplay.style.zIndex = "10000";
        document.body.appendChild(speedDisplay);
    }

    speedDisplay.textContent = `${rate.toFixed(2)}x`;
}


const initialVideo = document.querySelector('video');

if (initialVideo) {
    //initialVideo.playbackRate = 2.0;
    setPlaybackRate(initialVideo);
}

document.addEventListener('keydown', (event) => {
    const video = document.querySelector('video');
    if (!video) return;

    const step = 0.1;
    if (event.key === 'd') {
        currentRate = Math.min(currentRate + step, MAX_RATE);
    } else if (event.key === 's') {
        currentRate = Math.max(currentRate - step, MIN_RATE);
    } else if (event.key === 'r') {
        currentRate = 1.0;
    } else {
        return;
    }

    video.playbackRate = currentRate;
    updateSpeedDisplay(currentRate);
});