(function () {
    // Private variables - elements
    var PrintButtons = document.getElementsByClassName("site-js-print-button");
    var ServingsField = document.getElementById("servings-field");
    var Snackbar = document.querySelector(".mdl-js-snackbar");

    // Private variables - values
    var RegExp_PositiveInteger = /^([0]*[1-9]+[0-9]*)$/;
    var Servings = ServingsField.value;

    // Event listener - print button
    for (var i in PrintButtons) {
        // Open document print dialog on click
        if (PrintButtons[i].addEventListener) {
            PrintButtons[i].addEventListener("click", function () { window.print(); }, false);
        } else if (PrintButtons[i].attachEvent) {
            // Support for Internet Explorer
            PrintButtons[i].attachEvent("onclick", function () { window.print(); });
        }
    }

    // Event listener - servings field
    // Calculate ingredient quantities on value change
    if (ServingsField.addEventListener) {
        ServingsField.addEventListener("change", function () { Quantities_Calculate(); }, false);
    } else if (ServingsField.attachEvent) {
        // Support for Internet Explorer
        ServingsField.attachEvent("onchange", function () { Quantities_Calculate(); });
    }

    // Calculate ingredient quantities based on value of servings field
    Quantities_Calculate = function () {
        if (RegExp_PositiveInteger.test(ServingsField.value)) {
            Servings = ServingsField.value;
            Snackbar.MaterialSnackbar.showSnackbar({ message: "Showing quantities for " + Servings + " servings." });
            var Ingredients = document.getElementsByClassName("site-js-ingredient");
            for (var i in Ingredients) {
                var IngredientId = Ingredients[i].getAttribute("id");
                if (Ingredients[i].hasAttribute("data-ingredient-specific-quantity")) {
                    var IngredientQuantity = Ingredients[i].getAttribute("data-ingredient-specific-quantity") * Servings;
                    if (Ingredients[i].hasAttribute("data-ingredient-basic-unit")) {
                        var IngredientBasicUnit = Ingredients[i].getAttribute("data-ingredient-basic-unit");
                        if (IngredientQuantity < 1) {
                            IngredientQuantity *= 1000;
                            var IngredientUnitPrefix = 'm';
                            if (IngredientBasicUnit === 'l') {
                                if (IngredientQuantity < 15) {
                                    IngredientQuantity /= 5;
                                    IngredientBasicUnit = "tsp";
                                    IngredientUnitPrefix = '';
                                } else if (IngredientQuantity < 100) {
                                    IngredientQuantity /= 15;
                                    IngredientBasicUnit = "tbsp";
                                    IngredientUnitPrefix = '';
                                }
                            }
                        } else if (IngredientQuantity < 1000) {
                            var IngredientUnitPrefix = '';
                        } else if (IngredientQuantity < 1000000) {
                            IngredientQuantity /= 1000;
                            var IngredientUnitPrefix = 'k';
                        } else {
                            var IngredientUnitPrefix = '';
                        }
                        IngredientQuantity = IngredientQuantity.toPrecision(3);
                        document.getElementById(IngredientId + "__unit").innerHTML = IngredientUnitPrefix + IngredientBasicUnit;
                    }
                    document.getElementById(IngredientId + "__quantity").innerHTML = IngredientQuantity;
                }
            }
        } else {
            Snackbar.MaterialSnackbar.showSnackbar({ message: "Invalid input.\u00A0\u00A0Showing quantities for " + Servings + " servings." });
        }
    };
})();
