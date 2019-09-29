indow.addEventListener("load", function onWindowLoad() {
    // Инициализируем переменные
    // Генерируем палитру в элемент #palette
    generatePalette(document.getElementById("palette"));

    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    //получает контекст и приравнивает к этому

    function generatePalette(palette) {
        // генерируем палитру
        // в итоге 5^3 цветов = 125
        for (var r = 0, max = 4; r <= max; r++) {
            for (var g = 0; g <= max; g++) {
                for (var b = 0; b <= max; b++) {
                    var paletteBlock = document.createElement('div');
                    paletteBlock.className = 'button';

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