const range = document.getElementById("step-range");
const rangeDisplay = document.getElementById("new-step-value");
const applyBtn = document.getElementById("apply-btn");

let step = 0;
let interval = 300;
let animationTimer = null;

const canvasOtter = document.getElementById("otter-canvas");
const displayBg = document.getElementById("otter-display");
const ctx = canvasOtter.getContext("2d");
//const bgx = canvasBg.getContext("2d");
ctx.imageSmoothingEnabled = false;
//bgx.imageSmoothingEnabled = false;

let frame = 0;
let frameCount = 4;
//let spriteBg = new Image();
let spriteOtter = new Image();


// 初期読み込み
chrome.storage.sync.get("step", (data) => {
    if (data.step) step = data.step;
    updateCurrentStep(step);
});

// stepが更新されたら起こってほしい処理
function updateCurrentStep(currentStep) {
    let currentStepDisplay = document.getElementById("current-step-value");
    currentStepDisplay.textContent = `${ currentStep.toFixed(2)}`;

    let newStepSlider = document.getElementById("step-range");
    newStepSlider.value = currentStep;
}

// stepを更新
applyBtn.addEventListener("click", () => {
    const step = parseFloat(range.value);
    chrome.storage.sync.set({ step }, () => {
        //alert(step);
        updateCurrentStep(step);
    });
});

// sliderとnew stepの同期
range.addEventListener("input", () => {
    rangeDisplay.textContent = range.value;
});

// sliderの表示設定
const slider = document.getElementById("step-range");
function update() {
    const val = (slider.value - slider.min) / (slider.max - slider.min) * 100;
    slider.style.background = `linear-gradient(to right, #c7995d ${val}%, #ddd ${val}%)`;
}
slider.addEventListener("input", update);
update();

// * アニメーションの表示
// content.jsから再生速度を取得
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: "GET_RATE" }, (response) => {
        if (response && response.rate) {
            updateOtterAnimation(response.rate);
        }
        if (chrome.runtime.lastError) {
            //console.error("sendMessage error: ", chrome.runtime.lastError.message);
            return;
        }
        console.log("response: ", response);
    });
});

// 再生速度に応じてアニメーションを変更
function updateOtterAnimation(rate) {
    if (rate < 1.0) {
        showOtter("sleep");
    } else if (rate === 1.0) {
        showOtter("walk");
    } else if (rate < 2.0) {
        showOtter("run");
    } else {
        showOtter("swim");
    }
}

// 表示するアニメーションの設定
function showOtter(mode) {
    if (mode === "sleep") {
        frameCount = 8;
        interval = 300;
        displayBg.className = "otter-display";
        spriteOtter.src = "img/otter-sleep.png";
    } else if (mode === "walk") {
        frameCount = 8;
        interval = 300;
        displayBg.className = "otter-display bg-walk";
        spriteOtter.src = "img/otter-walk.png";
    } else if (mode === "run") {
        frameCount = 8;
        interval = 100;
        displayBg.className = "otter-display bg-run";
        spriteOtter.src = "img/otter-run.png";
    } else if (mode === "swim") {
        frameCount = 16;
        interval = 200;
        displayBg.className = "otter-display bg-swim";
        spriteOtter.src = "img/otter-swim.png";
    }

    restartAnimation();
}

// フレーム毎にアニメーションの再読み込み
function restartAnimation() {
    if (animationTimer) clearInterval(animationTimer);

    animationTimer = setInterval(() => {
        let spriteWidth = spriteOtter.width / frameCount;
        let spriteHeight = spriteOtter.height;

        ctx.clearRect(0, 0, canvasOtter.width, canvasOtter.height);
        ctx.drawImage(
            spriteOtter,
            frame * spriteWidth, 0, spriteWidth, spriteHeight,
            0, 0, canvasOtter.width, canvasOtter.height
        );

        frame = (frame + 1) % frameCount;
    }, interval);
}