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

    $.ajax({
        type: "POST",
        url: getURLAndFolderPath() + "broker.php",
        contentType: "application/json", // Set the content type to JSON
        data: data, // Send the JSON data
        success: function (response) {
            // Handle the server response here
            console.log('Response:', response);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log('Error:', xhr.status);
            console.log('Thrown Error:', thrownError);
        }
    });

    content = //"" +
        "action: " + action +
        "<br>stamp: " + unix +
        "<br>params: " + JSON.stringify(params, null, 2);
    updateElement("dialog", content);
}

$(document).ready(function () {
    // Reusable function to trigger notify with the URL value
    function triggerNotify() {
        const params = $("#url").val();
        notify('open', params);
    }

    // Notify on button click
    $('#butsync').on('click', function () {
        triggerNotify();
    });

    // Notify on Enter key press in the "url" textbox
    $('#url').on('keydown', function (event) {
        if (event.key === 'Enter') {
            triggerNotify();
        }
    });
});
