let current = 1;
let count = 1;

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
            let resJson;
            try {
                resJson = JSON.parse(response); // Safely parse JSON
            } catch (error) {
                console.error("Error parsing response JSON:", error);
                return; // Exit the function on invalid JSON
            }

            // Validate the structure of the response JSON
            if (resJson && resJson.action && resJson.stamp !== undefined && resJson.params) {

                // Check if the stamp (or some other field) has changed
                if (haschanged(resJson.stamp, current)) {
                    action = resJson.action;
                    updateElement('dialog', "loading");

                    if (action === 'open') {
                        // Ensure the URL in 'params' is absolute
                        let url = resJson.params;
                        if (!/^https?:\/\//i.test(url)) { // If URL doesn't start with http:// or https://
                            url = 'http://' + url; // Prepend http://
                        }
                        window.open(url);
                    }
                } else {
                    // Format the current state as HTML content
                    const content =
                        "Count: " + count +
                        "<br>Action: " + resJson.action +
                        "<br>Stamp: " + resJson.stamp +
                        "<br>Param: " + resJson.params +
                        "<br>Last Update: " + formatDate(new Date());

                    // Update the dialog DOM element with content
                    updateElement('dialog', content);
                }
            } else {
                console.error("Invalid JSON structure received:", response);
            }
        })
        .catch((error) => {
            // Handle errors from getresp() here
            console.error("Error in getresp():", error);
        });

    //console.log(current); // Optional debugging
}

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
    const url = getURLAndFolderPath() + "broker.php";

    return fetch(url, { method: 'GET' })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text(); // Return the response as text
        })
        .catch((error) => {
            console.error("Error fetching response:", error);
        });
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

// Run the checkAndChange function every 5 seconds with the current value
window.setInterval(() => checkAndChange(current), 5000);
