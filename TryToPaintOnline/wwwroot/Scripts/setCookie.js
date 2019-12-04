let hubUrl = 'https://localhost:44343/painter/';
const hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
    })
    .configureLogging(signalR.LogLevel.Information)
    .build();

start();

function WriteCookie(id) {
    if (document.myform.customer.value === "") {
        alert("Enter some value!");
        return;
    }
    document.myform.action = "/Main/IndexPost";
    document.myform.method = "post";
    cookievalue = escape(document.myform.customer.value) + ";";
    document.cookie = "user=" + cookievalue;
    if (id === 'createRoomBtn') {
        hubConnection.invoke('CreateGroup', cookievalue);
    }
    else {
        if (document.myform.number.value === "") {
            alert("Enter some value!");
            return;
        }
        hubConnection.invoke('JoinGroup', document.myform.number.value, cookievalue);
    }
}

function CreateRoom() {

}

function ConnectRoom() {

}

async function start() {
    try {
        await hubConnection.start();
        console.log("connected");
    } catch (err) {
        console.log(err);
        setTimeout(() => start(), 5000);
    }
}
