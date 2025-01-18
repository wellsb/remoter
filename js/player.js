let current = 1;
let count = 1;

/**
 * Asynchronously fetches a response from the server, processes it, and returns the result as a Promise.
 *
 * This function performs an asynchronous AJAX request to a `broker.php` file located in the same folder as the current
 * page. The server response is expected to be a comma-separated string, which is split into an array of strings and returned.
 * If an error occurs during the request, it logs the error to the console.
 *
 * @returns {Promise<string[]>} - A Promise that resolves to an array of strings obtained by splitting the server's response on commas.
 *
 * @example
 * // Assuming the server returns the response string "open,12345,example.com":
 * getresp().then((respsplit) => {
 *     console.log(respsplit);
 *     // Output: ['open', '12345', 'example.com']
 * });
 *
 * @description
 * - **Request**: Sends an asynchronous AJAX GET request via jQuery to the `broker.php` script.
 * - **Response Handling**:
 *   - The response text is split by commas (`,`) into an array of strings.
 *   - The resulting array is logged to the console and returned via a Promise.
 * - **Error Handling**:
 *   - If any error occurs (e.g., network issue or server failure), it logs the error to the console.
 *
 * @note
 * - This function uses jQuery for making the AJAX request. If jQuery is unavailable, the function will not work.
 * - The URL to the `broker.php` script is dynamically constructed using the `getURLAndFolderPath()` helper function.
 * - Asynchronous behavior ensures that the function does not block execution or freeze the UI while waiting for a response.
 *
 * @see getURLAndFolderPath - Helper function used to dynamically construct the URL for the AJAX request.
 */
function getresp() {
    return $.ajax({
        url: getURLAndFolderPath() + "broker.php",
        async: true // Default is true; explicitly defining for clarity
    }).then((response) => {
        //const respsplit = response.split(',');
        //return respsplit; // Resolves the Promise with the split array
        return response; // Resolves the Promise with the split array
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
