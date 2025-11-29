let currentRate = 1.0;
let step = 0.25;
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


// * chrome.storage
// 初期読み込み
chrome.storage.sync.get("step", (data) => {
    if (data.step) step = data.step;
    console.log("Loaded step: ", step);
});

// 設定が変更されたら更新
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "sync" && changes.step) {
        step = changes.step.newValue;
        console.log("Step updated: ", step);
    }
});

// * メイン動作
let video = null;

function waitForVideo() {
    const found = document.querySelector("video");

    if(!found) {
        setTimeout(waitForVideo, 300);
        return;
    }

    if (found !== video) {
        video = found;
        console.log("video initialized or changed", video);

        hookVideo(video);
    }

    setTimeout(waitForVideo, 300);
}

function hookVideo(video) {
    setPlaybackRate(video);

    const observer = new MutationObserver(() => {
        if (video.playbackRate !== currentRate) {
            video.playbackRate = currentRate;
        }
    });

    observer.observe(video, {attributes: true, attributeFilter: ["src"]});
}

waitForVideo();

// ショートカットキー
document.addEventListener('keydown', (event) => {
    const video = findRealVideo();
    if (!video) return;

    if (event.key === 'd') {
        currentRate = Math.min(currentRate + step, MAX_RATE);
    } else if (event.key === 's') {
        currentRate = Math.max(currentRate - step, MIN_RATE);
    } else if (event.key === 'r') {
        currentRate = 1.0;
    } else if (event.key === 'v'){
        // videoタグを再スキャン
        const vid = findRealVideo();
        if (vid) {
            video = vid;
            setPlaybackRate(video);
            updateSpeedDisplay(currentRate);
            console.log("Video manually refreshed", video);
        } else {
            console.log("video not found");
        }
    } else {
        return;
    }

    video.playbackRate = currentRate;
    updateSpeedDisplay(currentRate);
});

function findRealVideo() {
    const videos = Array.from(document.querySelectorAll("video"));

    let real = videos.find(v =>
        v.readyState === 4 &&
        v.videoWidth > 0 &&
        v.videoHeight > 0
    );

    if (real) return real;

    real = videos.find(v => v.readyState >= 2);
    if (real) return real;

    real = videos.find(v => v.src.startsWith("blob:"));
    if (real) return real;

    //return videos[0];
    return real;
}

// * popup.jsに再生速度の情報を送る
function getPlaybackRate() {
    const video = document.querySelector("video");
    console.log("playback rate is gotten");
    return video ? video.playbackRate : 1.0;
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "GET_RATE") {
        console.log("send response");
        sendResponse({ rate: getPlaybackRate() });
    }
});

// * Shadow DOM 内の videoを探す
function findVideo(root = document) {
    const videos = root.querySelectorAll("video");
    if (videos.length) return videos[0];

    const shadows = [...root.querySelectorAll("*")]
        .map(el => el.shadowRoot)
        .filter(Boolean);
    
    for (const shadow of shadows) {
        const v = findVideo(shadow);
        if (v) return v;
    }

    return null;
}