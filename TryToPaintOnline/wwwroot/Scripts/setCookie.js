
function WriteCookie() {
    if (document.myform.customer.value === "") {
        alert("Enter some value!");
        return;
    }
    document.myform.action = "/Main/IndexPost";
    document.myform.method = "post";
    cookievalue = escape(document.myform.customer.value) + ";";
    document.cookie = "user=" + cookievalue;
}

function CreateRoom() {

}

function ConnectRoom() {

}