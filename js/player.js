var current = 1;
var count = 1;

function getresp(){
    var resp = $.ajax({
        url: "http://127.0.0.1/remoter/broker.php",
        async: false
    }).responseText;
    var respsplit = resp.split(',');
    return respsplit;
}

function haschanged(got){
    if (got > current) {
        current = got;
        return true;
    } else {
        return false;
    }
}

function getQueryStrings(addr){
    var queryString = {};
    addr.replace(
    new RegExp("([^?=&]+)(=([^&]*))?", "g"),
        function($0, $1, $2, $3) { queryString[$1] = $3; }
    );
    return queryString;
}

function checkandchange(current){
    count++;
    var resp = getresp();
    console.log(current);
    console.log(resp);
    if (haschanged(resp[1], current)) {
        action = resp[0];
        $('#dialog').html("loading");

        if (action == 'open') {
            //window.open(resp[2]);
            window.open(resp[2]);
        }

    } else {
        $('#dialog').html("count:" + count + "<br>action: " + resp[0] + "<br>stamp: " + resp[1] + "<br>params: " + resp[2]);
    }
}

window.setInterval(function(){checkandchange(current)}, 5000);
