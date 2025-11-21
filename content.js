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
//const initialVideo = document.querySelector('video');
let initialVideo = document.querySelector("video");

if (initialVideo) {
    //initialVideo.playbackRate = 2.0;
    console.log("initial playbackrate: ", currentRate);
    setPlaybackRate(initialVideo);
}

document.addEventListener('keydown', (event) => {
    const video = document.querySelector('video');
    if (!video) return;

    //const step = 0.1;
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

// * 動画が切り替わったら速度表示をリセット
/*// オブザーバの設定
const config_ob = {
    childList: true,
    subtree: true
};

// コールバック関数の定義
const callback = () => {
    const video = document.querySelector('video');
    if (video && video.playbackRate !== currentRate) {
        currentRate = 1.0;
        console.log("CALLBACK");
        setPlaybackRate(video);
    }
};

// MutationObserverのインスタンスを作成
const observer = new MutationObserver(callback);
// 監視を開始
observer.observe(document.body, config_ob);*/

function observeVideoAppearance() {
    const observer = new MutationObserver(() => {
        const newVideo = document.querySelector("video");

        if (newVideo && newVideo !== initialVideo) {
            console.log("Video changed!");
            initialVideo = newVideo;

            // 速度を再適用
            setPlaybackRate(newVideo);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

observeVideoAppearance();

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