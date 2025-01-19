function getdate() {
    var unix = Math.round(+new Date()/1000);
    return unix;
}

function notify(action, params) {
    const unix = getdate();
    const data = JSON.stringify({
        action: action,
        stamp: unix,
        params: params
    });
    console.log(data);

    // Use the Fetch API for the POST request
    fetch(getURLAndFolderPath() + "broker.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // Set the content type to JSON
        },
        body: data // Send the JSON data
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text(); // Return the server response as text
        })
        .then((responseText) => {
            // Handle the server response here
            console.log("Response:", responseText);
        })
        .catch((error) => {
            console.error("Error:", error.message);
        });

    const content =
        "action: " + action +
        "<br>stamp: " + unix +
        "<br>params: " + JSON.stringify(params, null, 2);

    updateElement("dialog", content); // Update the dialog content
}

// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", function () {
    // Reusable function to trigger notify with the URL value
    function triggerNotify() {
        const params = document.getElementById("url").value; // Get the value of the "url" textbox
        notify('open', params); // Call the notify function
    }

    // Notify on button click
    const button = document.getElementById("butsync"); // Get the sync button
    if (button)
    {
        button.addEventListener("click", function () {
            triggerNotify();
        });
    }

    const urlInputField = document.getElementById("url");
    // Notify on Enter key press in the "url" textbox
    if (urlInputField)
    {
        urlInputField.addEventListener("keydown", function (event) {
            if (event.key === 'Enter') {
                triggerNotify();
            }
        });
    }

    const clearButton = document.getElementById("clear-url");
    if (clearButton)
    {
        clearButton.addEventListener("click", function () {
            console.log("Clear button clicked"); // Verify this executes
            if (urlInputField)
            {
                urlInputField.value = ""; // Clear the text box
                urlInputField.focus(); // Set focus back to the input
            }
        });
    } else {
        console.error("Clear button not found in DOM!");
    }
});
