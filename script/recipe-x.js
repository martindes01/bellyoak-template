// Designed to work alongside Material Design Lite v1.3.0

(function () {
    // Private variables - Elements
    var PrintButtons = document.querySelectorAll(".site-js-print-button");
    var ServingsField = document.getElementById("servings-field");
    var Snackbar = document.querySelector(".mdl-js-snackbar");

    // Private variables - Values
    var RegExp_PositiveInteger = /^(\s*[0]*[1-9]+[0-9]*\s*)$/;
    var Servings = ServingsField.value;

    // Event listeners
    if (document.addEventListener) {
        // Print button - Open document print dialog on click
        PrintButtons.forEach(function (PrintButton) {
            PrintButton.addEventListener("click", function () { window.print(); }, false);
        });
        // Servings field - Calculate ingredient quantities on value change
        ServingsField.addEventListener("change", function () { Quantities_Calculate(); }, false);
    } else if (document.attachEvent) {
        // Support for Internet Explorer
        // Print button - Open document print dialog on click
        PrintButtons.forEach(function (PrintButton) {
            PrintButton.attachEvent("onclick", function () { window.print(); });
        });
        // Servings field - Calculate ingredient quantities on value change
        ServingsField.attachEvent("onchange", function () { Quantities_Calculate(); });
    }

    // Calculate ingredient quantities based on value of servings field
    Quantities_Calculate = function () {
        // Test whether value is positive integer
        if (RegExp_PositiveInteger.test(ServingsField.value)) {
            Servings = ServingsField.value.trim();
            Snackbar.MaterialSnackbar.showSnackbar({ message: "Showing quantities for " + Servings + " servings." });
            var Ingredients = document.querySelectorAll(".site-js-ingredient");
            Ingredients.forEach(function (Ingredient) {
                // Test whether ingredient quantity is dynamic
                if (Ingredient.hasAttribute("data-ingredient-specific-quantity")) {
                    var IngredientQuantity = Ingredient.getAttribute("data-ingredient-specific-quantity") * Servings;
                    // Test whether ingredient has a non-trivial unit
                    if (Ingredient.hasAttribute("data-ingredient-basic-unit")) {
                        var IngredientBasicUnit = Ingredient.getAttribute("data-ingredient-basic-unit");
                        // Initialise unit prefix as necessary
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
                        } else if (IngredientQuantity < 1000000000) {
                            IngredientQuantity /= 1000000;
                            var IngredientUnitPrefix = 'M';
                        } else if (IngredientQuantity < 1000000000000) {
                            IngredientQuantity /= 1000000000;
                            var IngredientUnitPrefix = 'G';
                        } else if (IngredientQuantity < 1000000000000000) {
                            IngredientQuantity /= 1000000000000;
                            var IngredientUnitPrefix = 'T';
                        } else {
                            var IngredientUnitPrefix = '';
                        }
                        IngredientQuantity = IngredientQuantity.toPrecision(3);
                        // Display updated ingredient unit
                        Ingredient.querySelector(".site-js-ingredient__unit").innerHTML = IngredientUnitPrefix + IngredientBasicUnit;
                    } else if (IngredientQuantity.toString().length > 6) {
                        IngredientQuantity = IngredientQuantity.toPrecision(3);
                    }
                    // Display updated ingredient quantity
                    Ingredient.querySelector(".site-js-ingredient__quantity").innerHTML = IngredientQuantity;
                }
            });
        } else {
            Snackbar.MaterialSnackbar.showSnackbar({ message: "Invalid input.\u00A0\u00A0Showing quantities for " + Servings + " servings." });
        }
    };
})();
