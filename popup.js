const range = document.getElementById("step-range");
const rangeDisplay = document.getElementById("new-step-value");
const applyBtn = document.getElementById("apply-btn");


const canvas = document.getElementById("otter-canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

let frame = 0;
let frameCount = 4;
let sprite = new Image();
sprite.src = "img/otter-sleep.png";


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

function drawFrame() {
    let spriteWidth = sprite.width / frameCount;
    let spriteHeight = sprite.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
        sprite,
        frame * spriteWidth, 0, spriteWidth, spriteHeight,
        0, 0, canvas.width, canvas.height
    );

    frame = (frame + 1) % frameCount;
}

setInterval(drawFrame, 300);