var addr;

function getdate() {
    var unix = Math.round(+new Date()/1000);
    return unix;
}

function notify(action, params) {
    unix = getdate();
    $.ajax({
        type: "POST",
        url: "http://localhost/remoter/broker.php",
        data: { txaction: action,
                stamp: unix,
                txparams: params
              }
    })
$('#dialog').html("action: " + action + "<br>stamp: " + unix + "<br>params: " + params);
}

$("#butsync").click(function(){
    params = $("#taddr").val();
    notify('open',params);
});

$("#taddr").on("click", function() {
    $("#taddr").val("")
})
