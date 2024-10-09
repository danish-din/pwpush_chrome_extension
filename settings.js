document.addEventListener('DOMContentLoaded', function () {
    // Get the elements from the page
    const daysRange = document.getElementById('daysRange');
    const viewsRange = document.getElementById('viewsRange');
    const oneStepCheckbox = document.getElementById('oneStep');
    const userDeletableCheckbox = document.getElementById('userDeletable');
    const saveOptionsButton = document.getElementById('saveOptions');
    const daysValue = document.getElementById('daysValue');
    const viewsValue = document.getElementById('viewsValue');

    // Load saved settings and update UI
    chrome.storage.sync.get({
        daysValue: 5,
        viewsValue: 10,
        oneStepValue: false,
        userDeletable: false
    }, function (items) {
        daysRange.value = items.daysValue;
        daysValue.textContent = items.daysValue;
        viewsRange.value = items.viewsValue;
        viewsValue.textContent = items.viewsValue;
        oneStepCheckbox.checked = items.oneStepValue;
        userDeletableCheckbox.checked = items.userDeletable;
    });

    // Update displayed range values as the sliders are adjusted
    daysRange.addEventListener('input', function () {
        daysValue.textContent = daysRange.value;
    });

    viewsRange.addEventListener('input', function () {
        viewsValue.textContent = viewsRange.value;
    });

    // Save options when save button is clicked
    saveOptionsButton.addEventListener('click', function () {
        chrome.storage.sync.set({
            daysValue: daysRange.value,
            viewsValue: viewsRange.value,
            oneStepValue: oneStepCheckbox.checked,
            userDeletable: userDeletableCheckbox.checked
        }, function () {
            // Show custom notification
            showNotification('Options saved successfully!');
        });
    });

    // Function to create and show a notification box
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Automatically hide the notification after 2 seconds
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }
});
