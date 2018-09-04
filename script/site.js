(function () {
    // Assign document print capability to print buttons
    var PrintButtons = document.getElementsByClassName("site-js-print-button");
    for (var i in PrintButtons) {
        if (PrintButtons[i].addEventListener) {
            PrintButtons[i].addEventListener("click", function () { window.print(); }, false);
        } else if (PrintButtons[i].attachEvent) {
            PrintButtons[i].attachEvent("onclick", function () { window.print(); });
        }
    }

    // Calculate ingredient quantities on change of servings field value
    var ServingsField = document.getElementById("servings-field");
    if (ServingsField.addEventListener) {
        ServingsField.addEventListener("change", function () { Quantities_Calculate(); }, false);
    } else if (ServingsField.attachEvent) {
        ServingsField.attachEvent("onchange", function () { Quantities_Calculate(); });
    }
    Quantities_Calculate = function () {
        var Servings = ServingsField.value;
        var RegExp_PositiveInteger = /^([0]*[1-9]+[0-9]*)$/;
        if (RegExp_PositiveInteger.test(Servings)) {
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
            //alert("no " + Servings);
        }
    };
})();
