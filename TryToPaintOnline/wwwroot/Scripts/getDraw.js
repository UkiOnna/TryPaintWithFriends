let hubUrl = 'https://localhost:44343/paint';
const hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl)
    .configureLogging(signalR.LogLevel.Information)
    .build();

start();


window.addEventListener("load", function onWindowLoad() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    context.lineCap = "round";
    context.lineWidth = 8;
    //получает контекст и приравнивает к этому
    hubConnection.on('Send', function (x, y,dx,dy, color) {
        context.strokeStyle = color;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x - dx, y - dy);
        context.stroke();
        context.closePath();
    });
    hubConnection.on('Clear', function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
    });

    hubConnection.onclose(async () => {
        await start();
    });

});



async function start() {
    try {
        await hubConnection.start();
        console.log("connected");
    } catch (err) {
        console.log(err);
        setTimeout(() => start(), 5000);
    }
}