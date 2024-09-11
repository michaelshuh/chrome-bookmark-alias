"use strict";
var _a, _b;
function renderBookmarks() {
    chrome.storage.sync.get(null, (items) => {
        const bookmarkList = document.getElementById("bookmark-list");
        bookmarkList.innerHTML = ""; // Clear the list
        for (let [keyword, url] of Object.entries(items)) {
            const li = document.createElement("li");
            li.innerHTML = `
              <input type="text" class="edit-keyword" value="${keyword}">
              <input type="text" class="edit-url" value="${url}">
              <button class="delete" data-keyword="${keyword}">Delete</button>
          `;
            bookmarkList.appendChild(li);
        }
        document.querySelectorAll(".delete").forEach((button) => {
            button.addEventListener("click", (event) => {
                const keyword = event.currentTarget.dataset.keyword;
                chrome.storage.sync.remove(keyword, () => {
                    renderBookmarks(); // Re-render after deletion
                });
            });
        });
    });
}
(_a = document.getElementById("add")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    const keyword = document.getElementById("new-keyword")
        .value;
    const url = document.getElementById("new-url").value;
    if (keyword && url) {
        chrome.storage.sync.set({ [keyword]: url }, () => {
            document.getElementById("new-keyword").value = "";
            document.getElementById("new-url").value = "";
            renderBookmarks(); // Re-render after adding
        });
    }
});
(_b = document.getElementById("save-all")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
    const updatedBookmarks = {};
    document.querySelectorAll("ul#bookmark-list li").forEach((li) => {
        const keyword = li.querySelector(".edit-keyword")
            .value;
        const url = li.querySelector(".edit-url").value;
        if (keyword && url) {
            updatedBookmarks[keyword] = url;
        }
    });
    chrome.storage.sync.set(updatedBookmarks, () => {
        console.log("All changes saved!");
        renderBookmarks(); // Re-render after saving all
        // Show confirmation message
        const confirmationMessage = document.getElementById("save-confirmation");
        confirmationMessage.style.display = "block";
        setTimeout(() => {
            confirmationMessage.style.display = "none";
        }, 2000);
    });
});
// Initial render
renderBookmarks();
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
        const currentUrl = tabs[0].url;
        document.getElementById("new-url").value =
            currentUrl || "";
    }
});
