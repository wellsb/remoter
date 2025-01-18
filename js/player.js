let current = 1;
let count = 1;

/**
 * Sends an asynchronous AJAX request to fetch a response from the server.
 *
 * @returns {Promise<String|void>}
 * - A promise resolving to the server's response as a string if the request is successful.
 * - Logs an error and resolves as `undefined` if the request fails.
 *
 * Behavior:
 * - Sends a GET request to `broker.php` located at the path provided by `getURLAndFolderPath()`.
 * - The request is asynchronous (`async: true`), ensuring non-blocking behavior.
 * - On success, the server's response is returned through the resolved promise.
 * - On failure, logs an error message (`"Error fetching response"`) and provides the error object.
 *
 * Requirements:
 * - jQuery is required for the `$.ajax` functionality.
 * - The helper function `getURLAndFolderPath()` must return a valid base URL/path.
 * - The server-side script `broker.php` must exist and be accessible on the provided URL.
 */
function getresp() {
    return $.ajax({
        url: getURLAndFolderPath() + "broker.php",
        async: true // Default is true; explicitly defining for clarity
    }).then((response) => {
        return response;
    }).fail((error) => {
        console.error("Error fetching response:", error);
    });
}

function getresp() {
    return $.ajax({
        url: getURLAndFolderPath() + "broker.php",
        async: true // Default is true; explicitly defining for clarity
    }).then((response) => {
        return response;
    }).fail((error) => {
        console.error("Error fetching response:", error);
    });
}

/**
 * Retrieves the full URL consisting of the domain and the folder path of the current page.
 *
 * This function combines the protocol, hostname, and port (if any) from the browser's `window.location.origin`
 * with the folder path (excluding the current page or file name) derived from the `window.location.pathname`.
 * It constructs and returns the full URL path up to the folder, ensuring the result ends with a slash (`/`).
 *
 * @returns {string} - The full URL including the domain and folder path. The result always ends with a trailing slash.
 *
 * @example
 * // Assuming the current page URL is "https://example.com/folder/subfolder/index.html":
 * console.log(getURLAndFolderPath());
 * // Output: "https://example.com/folder/subfolder/"
 *
 * @example
 * // Assuming the current page URL is "http://localhost:8080/project/page.html":
 * console.log(getURLAndFolderPath());
 * // Output: "http://localhost:8080/project/"
 *
 * @note This function relies on the `window.location` object, which is only available in a browser environment.
 * It will not work in non-browser (e.g., Node.js) environments.
 */
function getURLAndFolderPath() {
    // Full domain (protocol + hostname + port)
    const fullDomain = window.location.origin;

    // Folder path (removing the file name from the URL path)
    const folderPath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));

    // Return as a single string: Domain + Folder Path
    return `${fullDomain}${folderPath}/`;
}

/**
 * Checks if the given value (`got`) is greater than the current value of the global `current` variable.
 * If so, updates the `current` variable with the value of `got` and returns `true`.
 * Otherwise, returns `false`.
 *
 * @param {number} got - The value to compare against the current value.
 * @returns {boolean} - Returns `true` if `got` is greater than `current`, otherwise `false`.
 *
 * @example
 * let current = 5; // Global variable
 * console.log(haschanged(10)); // Output: true (current becomes 10)
 * console.log(haschanged(8));  // Output: false (current remains 10)
 *
 * @note This function uses a global variable `current`, which needs to be defined before calling this function.
 *       Ensure `current` is correctly set for consistent behavior.
 */
function haschanged(got){
    if (got > current) {
        current = got;
        return true;
    } else {
        return false;
    }
}

/**
 * Checks for changes in the response data and performs appropriate actions.
 *
 * @param {*} current - The current value used to detect changes in the response 'stamp'.
 *
 * Behavior:
 * 1. Increments a global `count` variable to track the number of calls to this function.
 * 2. Calls the asynchronous `getresp` function to fetch a response, which is then parsed as JSON.
 * 3. Validates the JSON structure to ensure it contains the required fields: `action`, `stamp`, and `params`.
 * 4. Compares the `stamp` value in the response with the `current` value using the `haschanged` function:
 *    - If a change is detected:
 *      - Updates the dialog to show "loading".
 *      - If the action is `'open'`, ensures the `params` field contains a valid URL and opens it in a new tab.
 *    - If no change is detected:
 *      - Updates the dialog with the current `action`, `stamp`, and `params` values.
 * 5. Handles errors:
 *    - Logs an error if the JSON structure is invalid.
 *    - Logs an error if the `getresp` function fails.
 *
 * Side Effects:
 * - Updates the HTML content of the `#dialog` element dynamically.
 * - Opens a URL in a new browser tab when the action is `'open'`.
 *
 * Requirements:
 * - A global `count` variable to track function calls.
 * - A global `action` variable to store the current response action.
 * - The functions `getresp` (asynchronous) and `haschanged` must be defined elsewhere in the codebase.
 * - jQuery is required for DOM manipulation ($('#dialog').html(...)`) and handling dialog updates.
 */
function checkAndChange(current) {
    count++;

    // Call getresp() and handle the asynchronous result
    getresp()
        .then((response) => {
            // Parse the JSON response
            const resJson = JSON.parse(response);

            // Validate the structure of the response JSON
            if (resJson && resJson.action && resJson.stamp !== undefined && resJson.params) {
                // Check if the stamp (or some other field, if needed) has changed
                if (haschanged(resJson.stamp, current)) {
                    action = resJson.action;
                    $('#dialog').html("loading");

                    if (action === 'open') {
                        // Ensure the URL in 'params' is absolute
                        let url = resJson.params;
                        if (!/^https?:\/\//i.test(url)) { // If URL doesn't start with http:// or https://
                            url = 'http://' + url; // Prepend http://
                        }
                        window.open(url);
                    }
                } else {
                    // Update the dialog with the current action, stamp, and parameters
                    $('#dialog').html(
                        "count:" + count +
                        "<br>action: " + resJson.action +
                        "<br>stamp: " + resJson.stamp +
                        "<br>params: " + resJson.params
                    );
                }
            } else {
                console.error("Invalid JSON structure received:", response);
            }
        })
        .fail((error) => {
            console.error("Error in getresp():", error);
        });

    //console.log(current); // Current value logged for debugging
}

// Run the checkAndChange function every 5 seconds with the current value
window.setInterval(() => checkAndChange(current), 5000);
