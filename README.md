# PWPush Chrome Extension

## Overview

PWPush Chrome Extension is a tool that enables users to easily send selected text, URLs, or files to PWPush, a service for sharing passwords or sensitive information securely. With just a right-click or via the extension popup, users can generate PWPush links and share them securely. All content is encrypted, and links expire after the specified number of days or views.

## Features

- **Context Menu Integration**: Right-click to push any highlighted text directly to PWPush.
- **Clipboard Integration**: Automatically copy generated PWPush links to your clipboard.
- **Optional Settings**: Set expiration days, view limits, passphrases, and other options to ensure privacy and control.
- **User-Friendly UI**: Easy-to-use popup UI for quick sharing with optional settings.
- **Custom Notification**: Get a notification when a link is successfully copied to the clipboard.

## Installation

[Chrome Webstore](https://chrome.google.com/webstore/detail/your-extension-id)

## How to Use

### Context Menu
1. Highlight any text on a webpage.
2. Right-click and select **"Send to PWPush"** from the context menu.
3. The extension will automatically generate a PWPush link and copy it to your clipboard.
4. You will see a notification confirming the link has been generated and copied.

### Popup UI
1. Click the PWPush extension icon in your toolbar to open the popup UI.
2. Enter your text or URL in the provided input field and click **"Generate PWPush Link"**.
3. Optional settings can be revealed by clicking **"Show Optional Settings"**.
4. Configure the type of push, add a passphrase, or a note if needed.
5. Once generated, the PWPush link will be displayed, and you can click **"Copy"** to add it to your clipboard.

### Settings Page
1. Click **"Go to Settings"** in the popup UI to configure the default behavior.
2. Adjust **Days until expiration** and **Views until expiration** using the sliders.
3. Enable **One-step link** and **Deletable by viewer** checkboxes if required.
4. Click **"Save Options"** to save your settings.

## Project Structure

- **manifest.json**: Defines permissions and configuration for the Chrome extension.
- **background.js**: Contains the logic for context menu actions, API requests to PWPush, and clipboard functionality.
- **popup.html**: The UI for the extension popup where users can input text, generate links, and modify settings.
- **popup.js**: Handles the front-end interaction logic, like form submissions, toggling optional settings, and making API calls.
- **settings.html**: The UI for configuring extension-wide settings.
- **settings.js**: Handles the logic for saving and retrieving user settings.
- **popup.css**: The shared stylesheet to make the extension UI look appealing and consistent.

## PWPush API Integration

This extension integrates with the PWPush API to securely push the selected text, URLs, or file data.

**API Details**:
- The content is encrypted before it is stored in PWPush.
- The expiration days and views are configurable through the extension.
- PWPush supports additional parameters such as passphrases, notes, retrieval steps, and more.

**Sample API Request**:

```javascript
fetch("https://pwpush.com/p.json", {
    method: 'POST',
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: urlencoded.toString(),
});
```



## Permissions

The extension requires the following permissions:

- `contextMenus`: To add the right-click option.
- `activeTab`: To access and interact with the current tab.
- `scripting`: To inject scripts that handle the clipboard functionality.
- `clipboardWrite`: To allow automatic copying to the clipboard.
- `notifications`: To provide notifications when actions complete.

## Known Issues

- The extension cannot generate PWPush links on `chrome://` or other internal Chrome pages due to security restrictions.
- CORS issues may occur if the API endpoint changes or if PWPush modifies its settings. Ensure proper permissions are set.

## Future Enhancements

- **Support for One-Time Secret**: Implement an alternative service for added flexibility.
- **Improved Error Handling**: Better user feedback for network issues or errors in API requests.
- **Custom Styling Options**: Allow users to customize the appearance of the extension UI.

## Contribution

Contributions are welcome! If you would like to improve the extension or add new features, feel free to fork the repository and submit a pull request.

### Steps to Contribute

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make changes and commit (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

## Credits

- **PWPush**: For the password-sharing service used by the extension.
- **Icons**: Icons used in this project are created by the developer.

## Support

Please support the official release of PWPush by visiting [PWPush.com](https://pwpush.com).

For any issues, questions, or suggestions, please open an issue on GitHub.
