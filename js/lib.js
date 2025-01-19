// /**
//  * Retrieves the full URL consisting of the domain and the folder path of the current page.
//  *
//  * This function combines the protocol, hostname, and port (if any) from the browser's `window.location.origin`
//  * with the folder path (excluding the current page or file name) derived from the `window.location.pathname`.
//  * It constructs and returns the full URL path up to the folder, ensuring the result ends with a slash (`/`).
//  *
//  * @returns {string} - The full URL including the domain and folder path. The result always ends with a trailing slash.
//  *
//  * @example
//  * // Assuming the current page URL is "https://example.com/folder/subfolder/index.html":
//  * console.log(getURLAndFolderPath());
//  * // Output: "https://example.com/folder/subfolder/"
//  *
//  * @example
//  * // Assuming the current page URL is "http://localhost:8080/project/page.html":
//  * console.log(getURLAndFolderPath());
//  * // Output: "http://localhost:8080/project/"
//  *
//  * @note This function relies on the `window.location` object, which is only available in a browser environment.
//  * It will not work in non-browser (e.g., Node.js) environments.
//  */
// function getURLAndFolderPath() {
//     // Full domain (protocol + hostname + port)
//     const fullDomain = window.location.origin;
//
//     // Folder path (removing the file name from the URL path)
//     const folderPath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
//
//     // Return as a single string: Domain + Folder Path
//     return `${fullDomain}${folderPath}/`;
// }
function getURLAndFolderPath() {
    // Full domain (protocol + hostname + port)
    const fullDomain = window.location.origin;

    // Folder path (removing the file name from the URL path)
    const folderPath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));

    // Return as a single string: Domain + Folder Path
    return `${fullDomain}${folderPath}/`;
}

// Formats a given date into a human-readable format
function formatDate(date) {
    return date.toLocaleString(); // User's locale for consistent formatting
}

function updateElement(targetElementId, content) {
    const element = document.getElementById(targetElementId); // Get the element by its ID
    if (element) {
        element.innerHTML = content; // Update the content of the element
    } else {
        console.warn(`Element with ID "${targetElementId}" not found.`);
    }
}