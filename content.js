let currentRate = 1.0;
const MAX_RATE = 5.0;
const MIN_RATE = 0.1;

function setPlaybackRate(rate) {
    const video = document.querySelector('video');
    if (video) {
        video.playbackRate = rate;
    } 
}


const initialVideo = document.querySelector('video');

if (initialVideo) {
    //initialVideo.playbackRate = 2.0;
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

    setPlaybackRate(currentRate);
});