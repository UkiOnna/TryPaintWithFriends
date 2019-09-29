// Выполняем по завершении загрузки страницы
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
