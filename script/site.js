(function () {
    var PrintButtons = document.getElementsByClassName("site-js-print-button");
    for (var i in PrintButtons) {
        if (PrintButtons[i].addEventListener) {
            PrintButtons[i].addEventListener("click", function () { window.print(); }, false);
        } else if (PrintButtons[i].attachEvent) {
            PrintButtons[i].attachEvent("onclick", function () { window.print(); });
        }
    }
})();
