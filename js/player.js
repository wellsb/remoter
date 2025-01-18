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
        const respsplit = response.split(',');
        //console.log(respsplit);
        return respsplit; // Resolves the Promise with the split array
    }).catch((error) => {
        console.error("Error fetching response:", error);
    });
}

// Usage Example with Promises
getresp().then((respsplit) => {
    console.log(respsplit);
});

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
 * Monitors changes to a server response and performs actions based on the differences.
 *
 * This function periodically calls the asynchronous `getresp()` function to fetch a response
 * from the server. If a specific value in the response differs from the given `current` value,
 * actions such as opening a window or updating a dialog are performed. The results are dynamically
 * displayed in the UI, and errors are logged for debugging.
 *
 * @param {any} current - The current reference value used to detect changes in the server response.
 *
 * @description
 * - **Behavior**:
 *   - Fetches an asynchronous response (`getresp()`).
 *   - Compares the second element of the response (`respsplit[1]`) with the `current` value using `haschanged()`.
 *   - If a change is detected:
 *     1. Prepares the necessary action string (`respsplit[0]`).
 *     2. Opens a new URL if the action is `"open"`.
 *     3. Ensures the URL is absolute by prepending `http://` if needed.
 *     4. Updates the dialog to show “loading” while processing.
 *   - Otherwise, updates the dialog with the count, action, timestamp (`stamp`), and additional parameters.
 * - **Error Handling**:
 *   - Logs any errors encountered during the `getresp()` call to the console for debugging.
 * - **Asynchronous Workflow**:
 *   - Uses `then()` to process the resolved response of the `getresp()` Promise.
 *   - If the `getresp()` call fails, the function handles the error via `.catch()`.
 *
 * @returns {void} - This function does not return a value. Instead, it performs UI updates and executes side effects.
 *
 * @example
 * // Example of how a periodic check is set up:
 * window.setInterval(() => checkAndChange(currentValue), 5000);
 *
 * // Functionally, the server response may look like:
 * // ['open', '2023-01-01', 'example.com']
 * // Where:
 * // - 'open' is the action
 * // - '2023-01-01' is the timestamp
 * // - 'example.com' is the URL
 *
 * @see getresp - The asynchronous function that fetches the server response used in this function.
 * @see haschanged - Helper function that determines if the response value has changed from `current`.
 *
 * @note
 * - This function relies on proper resolution of the `Promise` returned by `getresp()` to function as expected.
 * - Ensure that jQuery is loaded in the project for DOM manipulations (e.g., `$('#dialog')`) to work.
 * - HTML updates are done in the element with ID `dialog`.
 */
function checkAndChange(current) {
    count++;

    // Call getresp() and handle the asynchronous result
    getresp()
        .then((respsplit) => {
            //console.log(respsplit); // Log the response array

            // Check if the second element of the response array differs from the current value
            if (haschanged(respsplit[1], current)) {
                action = respsplit[0];
                $('#dialog').html("loading");

                if (action === 'open') {
                    // Ensure the URL is absolute
                    let url = respsplit[2];
                    if (!/^https?:\/\//i.test(url)) { // If URL doesn't start with http:// or https://
                        url = 'http://' + url; // Prepend http://
                    }
                    window.open(url);
                }
            } else {
                // Update the dialog with the current action, stamp, and parameters
                $('#dialog').html(
                    "count:" + count +
                    "<br>action: " + respsplit[0] +
                    "<br>stamp: " + respsplit[1] +
                    "<br>params: " + respsplit[2]
                );
            }
        })
        .catch((error) => {
            console.error("Error in getresp():", error);
        });

    //console.log(current); // Current value logged for debugging
}

// Run the checkAndChange function every 5 seconds with the current value
window.setInterval(() => checkAndChange(current), 5000);
