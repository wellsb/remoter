var addr;

function getdate() {
    var unix = Math.round(+new Date()/1000);
    return unix;
}

function notify(action, params) {
    unix = getdate();
    $.ajax({
        type: "POST",
        url: getURLAndFolderPath() + "broker.php",
        data: { txaction: action,
                stamp: unix,
                txparams: params
              },
        success: function (response) {
            // jQuery("#usergrid").trigger("reloadGrid");
            // clear();
            // alert("Details saved successfully!!!");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
        }
    })
    $('#dialog').html("action: " + action + "<br>stamp: " + unix + "<br>params: " + params);
}

function getURLAndFolderPath() {
    // Full domain (protocol + hostname + port)
    const fullDomain = window.location.origin;

    // Folder path (removing the file name from the URL path)
    const folderPath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));

    // Return as a single string: Domain + Folder Path
    return `${fullDomain}${folderPath}/`;
}

// Example usage
const result = getURLAndFolderPath();
console.log("URL and Folder Path:", result);

console.log(getURLAndFolderPath());


$("#butsync").click(function(){
    params = $("#taddr").val();
    notify('open',params);
});

$("#taddr").on("click", function() {
    //$("#taddr").val("")
})
