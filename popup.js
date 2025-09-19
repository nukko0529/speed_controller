const range = document.getElementById("stepRange");
const applyBtn = document.getElementById("applyBtn");

// stepを更新
applyBtn.addEventListener("click", () => {
    const step = parseFloat(range.value);
    chrome.storage.sync.set({ step }, () => {
        //alert(step);
    });
});
