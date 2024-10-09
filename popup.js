document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const submitButton = document.getElementById('submitText');
    const textInput = document.getElementById('textInput');
    const pwpushLinkInput = document.getElementById('pwpushLink');
    const resultContainer = document.getElementById('resultContainer');
    const copyButton = document.getElementById('copyButton');
    const toggleOptionalButton = document.getElementById('toggleOptionalButton');
    const optionalSettings = document.getElementById('optionalSettings');
    const passphraseInput = document.getElementById('passphraseInput');
    const kindInput = document.getElementById('kind');

    // Toggle optional settings visibility
    toggleOptionalButton.addEventListener('click', function () {
        optionalSettings.classList.toggle('hidden');
        toggleOptionalButton.textContent = optionalSettings.classList.contains('hidden')
            ? 'Show Optional Settings'
            : 'Hide Optional Settings';
    });

    // Copy to clipboard functionality
    copyButton.addEventListener('click', function () {
        navigator.clipboard.writeText(pwpushLinkInput.value).then(() => {
            console.log('PWPush link copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy PWPush link:', err);
        });
    });

    // Generate PWPush link
    submitButton.addEventListener('click', function () {
        const payload = textInput.value.trim();
        if (!payload) {
            alert('Please enter some text or a URL to push.');
            return;
        }

        // Optional settings
        const passphrase = passphraseInput.value.trim();
        const kind = kindInput.value;

        // Send message to background script
        chrome.storage.sync.get({
            daysValue: 2,               // Default: 2 days
            viewsValue: 10,             // Default: 10 views
            oneStepValue: false,        // Default: not a one-step link
            userDeletable: false        // Default: not deletable by viewer
        }, (items) => {
            const data = {
                payload: payload,
                expire_after_days: items.daysValue,
                expire_after_views: items.viewsValue,
                oneStepValue: items.oneStepValue,
                userDeletable: items.userDeletable,
                passphrase: passphrase,
                kind: kind
            };

            // Send request to background.js
            chrome.runtime.sendMessage({ action: 'submitToPWPush', data: data }, function (response) {
                if (response.success) {
                    const pwpushUrl = `${response.response.html_url}`;
                    pwpushLinkInput.value = pwpushUrl;

                    // Show the result container and reset the input
                    resultContainer.classList.remove('hidden');
                    textInput.value = '';

                    console.log('PWPush URL:', pwpushUrl);
                } else {
                    console.error('Error sending password to PWPush:', response.error);
                    alert('Failed to generate PWPush link. Please try again.');
                }
            });
        });
    });
});
