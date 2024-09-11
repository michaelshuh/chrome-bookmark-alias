"use strict";
chrome.omnibox.onInputEntered.addListener((text) => {
    chrome.storage.sync.get([text], (result) => {
        if (result[text]) {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length > 0) {
                    chrome.tabs.update(tabs[0].id, { url: result[text] });
                }
            });
        }
    });
});
