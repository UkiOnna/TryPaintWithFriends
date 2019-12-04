let hubUrl = 'https://localhost:44343/painter/';
const hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
    })
    .configureLogging(signalR.LogLevel.Information)
    .build();

start();


hubConnection.on('Notify', function (message, countMessage) {

    // добавляет элемент для диагностического сообщения
    let notifyElem = document.createElement("b");
    notifyElem.appendChild(document.createTextNode(message));
    let elem = document.createElement("li");
    let divComment = document.createElement("div");
    divComment.classList.add("commentText");
    divComment.appendChild(notifyElem);
    elem.appendChild(divComment);
    document.getElementById("connectedCount").innerHTML = countMessage;
    document.getElementById("chatroom").appendChild(elem);
});

hubConnection.on('StartGame', function (username) {
    currentUser = getCookie("user");
    if (username === currentUser) {
        document.getElementById("paintScript").src = "~/Scripts/draw.js";
    }
    else {
        document.getElementById("paintScript").src = "~/Scripts/getDraw.js";
    }
});

hubConnection.on('SendMessage', function (message) {
    array = message.split(":");
    let bElem = document.createElement("b");
    bElem.appendChild(document.createTextNode(array[0] + ":"));
    let notifyElem = document.createElement("span");
    notifyElem.appendChild(document.createTextNode(array[1]));
    let elem = document.createElement("li");
    let divComment = document.createElement("div");
    divComment.classList.add("commentText");
    divComment.appendChild(bElem);
    divComment.appendChild(notifyElem);
    elem.appendChild(divComment);
    document.getElementById("chatroom").appendChild(elem);
    var objDiv = document.getElementById("chatroom");
    objDiv.scrollTop = objDiv.scrollHeight;
});

document.getElementById("sendButton").onclick = function sendMessage() {
    message = document.getElementById('inputMessage').value;
    if (message) {
        document.getElementById('inputMessage').value = "";
        hubConnection.invoke('SendMessage', message);
    }
};


//Выполняем по завершении загрузки страницы
window.addEventListener("load", function onWindowLoad() {
    // Инициализируем переменные
    // Генерируем палитру в элемент #palette
    generatePalette(document.getElementById("palette"));

    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");



    // переменные для рисования
    context.lineCap = "round";
    context.lineWidth = 8;

    // вешаем обработчики на кнопки
    // очистка изображения
    document.getElementById("clear").onclick = function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        hubConnection.invoke('Clear');
    };

    // На любое движение мыши по canvas будет выполнятся эта функция
    canvas.onmousemove = function drawIfPressed(e) {
        // в "e"  попадает экземпляр MouseEvent
        var x = e.offsetX;
        var y = e.offsetY;
        var dx = e.movementX;
        var dy = e.movementY;

        // Проверяем зажата ли какая-нибудь кнопка мыши
        // Если да, то рисуем
        if (e.buttons > 0) {
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x - dx, y - dy);
            context.stroke();
            context.closePath();
            hubConnection.invoke('Send', x, y, dx, dy, context.strokeStyle);
        }

        // отправляет контекст



    };

    function generatePalette(palette) {
        // генерируем палитру
        // в итоге 5^3 цветов = 125
        for (var r = 0, max = 4; r <= max; r++) {
            for (var g = 0; g <= max; g++) {
                for (var b = 0; b <= max; b++) {
                    var paletteBlock = document.createElement('div');
                    paletteBlock.className = 'button';
                    paletteBlock.addEventListener('click', function changeColor(e) {
                        context.strokeStyle = e.target.style.backgroundColor;
                    });

                    paletteBlock.style.backgroundColor = (
                        'rgb(' + Math.round(r * 255 / max) + ", "
                        + Math.round(g * 255 / max) + ", "
                        + Math.round(b * 255 / max) + ")"
                    );

                    palette.appendChild(paletteBlock);
                }
            }
        }
    }
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

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}
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


