chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'submitToPWPush') {
        const data = request.data;

        const urlencoded = new URLSearchParams();
        urlencoded.append("password[payload]", data.payload);
        urlencoded.append("password[expire_after_days]", data.expire_after_days || "2");
        urlencoded.append("password[expire_after_views]", data.expire_after_views || "10");
        urlencoded.append("password[deletable_by_viewer]", data.userDeletable ? "true" : "false");
        urlencoded.append("password[retrieval_step]", data.oneStepValue ? "true" : "false");

        if (data.passphrase) {
            urlencoded.append("password[passphrase]", data.passphrase);
        }
        if (data.kind) {
            urlencoded.append("password[kind]", data.kind);
        }

        // Log the request data
        console.log("Sending request to PWPush with data:", urlencoded.toString());

        fetch("https://pwpush.com/p.json", {
            method: 'POST',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: urlencoded.toString(),
        })
        .then(response => {
            // Log the response status before attempting to parse JSON
            console.log("Received response from PWPush:", response);

            return response.json();
        })
        .then(responseData => {
            // Log the parsed JSON response
            console.log("Parsed response from PWPush:", responseData);

            sendResponse({ success: true, response: responseData });
        })
        .catch(error => {
            console.error('Error sending password to PWPush:', error);
            sendResponse({ success: false, error: error.message });
        });

        return true;  // Keep the message channel open for async sendResponse
    }
});


// Create context menu on installation
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'pwpush_menu',
        title: 'Send to PWPush',
        contexts: ['selection']  // Only show the menu when text is selected
    });
});

// Handle API call for PWPush
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'submitToPWPush') {
        const data = request.data;

        const urlencoded = new URLSearchParams();
        urlencoded.append("password[payload]", data.payload);
        urlencoded.append("password[expire_after_days]", data.expire_after_days || "2");
        urlencoded.append("password[expire_after_views]", data.expire_after_views || "10");
        urlencoded.append("password[deletable_by_viewer]", data.userDeletable ? "true" : "false");
        urlencoded.append("password[retrieval_step]", data.oneStepValue ? "true" : "false");

        if (data.passphrase) {
            urlencoded.append("password[passphrase]", data.passphrase);
        }
        if (data.kind) {
            urlencoded.append("password[kind]", data.kind);
        }

        // Log the request data
        console.log("Sending request to PWPush with data:", urlencoded.toString());

        fetch("https://pwpush.com/p.json", {
            method: 'POST',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: urlencoded.toString(),
        })
        .then(response => {
            // Log the response status
            console.log("Received response from PWPush:", response);

            return response.json();
        })
        .then(responseData => {
            // Log the parsed JSON response
            console.log("Parsed response from PWPush:", responseData);

            sendResponse({ success: true, response: responseData });
        })
        .catch(error => {
            console.error('Error sending password to PWPush:', error);
            sendResponse({ success: false, error: error.message });
        });

        return true;  // Keep the message channel open for async sendResponse
    }
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'pwpush_menu' && info.selectionText) {
        // Check if the tab URL is valid for injection (not chrome:// or disallowed URLs)
        if (tab.url.startsWith('http://') || tab.url.startsWith('https://')) {
            // Get saved settings
            chrome.storage.sync.get({
                daysValue: 2,               // Default: 2 days
                viewsValue: 10,             // Default: 10 views
                oneStepValue: false,        // Default: not a one-step link
                userDeletable: false        // Default: not deletable by viewer
            }, async (items) => {
                const data = {
                    payload: info.selectionText,
                    expire_after_days: items.daysValue,
                    expire_after_views: items.viewsValue,
                    oneStepValue: items.oneStepValue,
                    userDeletable: items.userDeletable
                };

                const urlencoded = new URLSearchParams();
                urlencoded.append("password[payload]", data.payload);
                urlencoded.append("password[expire_after_days]", data.expire_after_days || "2");
                urlencoded.append("password[expire_after_views]", data.expire_after_views || "10");
                urlencoded.append("password[deletable_by_viewer]", data.userDeletable ? "true" : "false");
                urlencoded.append("password[retrieval_step]", data.oneStepValue ? "true" : "false");

                // Log the request details before sending
                console.log("Sending request to PWPush with data (context menu):", urlencoded.toString());

                try {
                    // Send request to PWPush
                    const response = await fetch("https://pwpush.com/p.json", {
                        method: 'POST',
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: urlencoded.toString(),
                    });

                    // Log the raw response before parsing
                    console.log("Received response from PWPush (context menu):", response);

                    if (!response.ok) {
                        throw new Error('Failed to send request to PWPush');
                    }

                    const result = await response.json();

                    // Log the parsed response
                    console.log("Parsed response from PWPush (context menu):", result);

                    const pwpushUrl = `${result.html_url}`;

                    // Inject a content script to copy to clipboard
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        func: (text) => {
                            navigator.clipboard.writeText(text).then(() => {
                                console.log('Text copied to clipboard:', text);
                            }).catch(err => {
                                console.error('Failed to copy text to clipboard:', err);
                            });
                        },
                        args: [pwpushUrl]
                    });

                    // Show a notification
                    chrome.notifications.create({
                        type: 'basic',
                        iconUrl: 'icons/icon_38.png',  // Ensure this path matches your icon path
                        title: 'PWPush',
                        message: 'PWPush link copied to clipboard!'
                    });

                } catch (error) {
                    console.error('Error sending password to PWPush via context menu:', error);
                    chrome.notifications.create({
                        type: 'basic',
                        iconUrl: 'icons/icon_38.png',  // Ensure this path matches your icon path
                        title: 'PWPush Error',
                        message: 'Failed to generate PWPush link.'
                    });
                }
            });
        } else {
            console.error("Cannot inject script into this URL:", tab.url);
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon_38.png',
                title: 'PWPush Error',
                message: 'Cannot use PWPush on this page.'
            });
        }
    }
});
