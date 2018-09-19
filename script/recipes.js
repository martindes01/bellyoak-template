// Designed to work alongside Material Design Lite v1.3.0

(function () {
    // Private variables - Elements
    var NextButtons = document.querySelectorAll(".site-js-next-button");
    var NextButtonTooltips = document.querySelectorAll(".site-js-next-button-tooltip");
    var PreviousButtons = document.querySelectorAll(".site-js-previous-button");
    var PreviousButtonTooltips = document.querySelectorAll(".site-js-previous-button-tooltip");
    var ResultArea = document.getElementById("result-area");
    var ResultContainer = document.getElementById("result-container");
    var ResultIndices = document.querySelectorAll(".site-js-result-index");
    var ResultPlaceholder = document.getElementById("result-placeholder");
    var SearchButton = document.getElementById("search-button");
    var SearchField = document.getElementById("search-field");

    // Private variables - Values
    var RecipesXML;
    var ResultIndex;
    var ResultMax = 5;
    var ResultSetLB;
    var ResultSetUB;
    var ResultText;
    var ResultTotal;
    var ResultURLs_All = [];
    var ResultURLs_Search = [];
    //var SearchQuery = '';

    // Event listeners
    if (document.addEventListener) {
        // Next buttons - Show next set of results on click
        NextButtons.forEach(function (NextButton) {
            NextButton.addEventListener("click", function () { Results_IterateNext(); }, false);
        });
        // Previous buttons - Show previous set of results on click
        PreviousButtons.forEach(function (PreviousButton) {
            PreviousButton.addEventListener("click", function () { Results_IteratePrevious(); }, false);
        });
    } else if (document.attachEvent) {
        // Support for Internet Explorer
        // Next buttons - Show next set of results on click
        NextButtons.forEach(function (NextButton) {
            NextButton.attachEvent("onclick", function () { Results_IterateNext(); });
        });
        // Previous buttons - Show previous set of results on click
        PreviousButtons.forEach(function (PreviousButton) {
            PreviousButton.attachEvent("onclick", function () { Results_IteratePrevious(); });
        });
    }

    // Initialise page and load recipes XML document
    Reset_OnSearch();
    Document_Load("recipes.xml", Results_Initialise);

    // Load specified document from server
    function Document_Load(Path, CallbackFunction) {
        var Request = new XMLHttpRequest();
        // Define function to handle response
        Request.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                CallbackFunction(this);
            }
        };
        // Send request for file
        Request.open("GET", Path + "?id=" + Math.random(), true);
        Request.send();
    }

    function Reset_OnIterate() {
        // Reset elements
        if (!ResultContainer.classList.contains("hidden")) {
            ResultContainer.classList.add("hidden");
        }
        ResultIndices.forEach(function (ResultIndex) {
            ResultIndex.innerHTML = '';
        });
        if (ResultPlaceholder.classList.contains("hidden")) {
            ResultPlaceholder.classList.remove("hidden");
        }
        // Reset variables
        ResultText = '';
    }

    // Reset elements and variables
    function Reset_OnSearch() {
        // Reset elements
        PreviousButtons.forEach(function (PreviousButton) {
            if (!PreviousButton.hasAttribute("disabled")) {
                PreviousButton.setAttribute("disabled", '');
            }
        });
        PreviousButtonTooltips.forEach(function (PreviousButtonTooltip) {
            if (!PreviousButtonTooltip.classList.contains("hidden")) {
                PreviousButtonTooltip.classList.add("hidden");
            }
            if (PreviousButtonTooltip.classList.contains("is-active")) {
                PreviousButtonTooltip.classList.remove("is-active");
            }
        });
        if (!SearchButton.hasAttribute("disabled")) {
            SearchButton.setAttribute("disabled", '');
        }
        // Reset variables
        ResultIndex = 0;
        ResultSetLB = 1;
        ResultText = '';
        ResultURLs_Search.splice(0);
        // Reset others
        Reset_OnIterate();
    }

    // Display search results
    function Results_DisplayText(Text) {
        // Post text to result area and upgrade any HTML elements with MDL classes
        ResultArea.innerHTML = Text;
        componentHandler.upgradeElements(ResultArea);
        // Replace result placeholder with result container
        ResultContainer.classList.remove("hidden");
        ResultPlaceholder.classList.add("hidden");
    }

    // Initialise result area
    function Results_Initialise(Request) {
        // Save recipes XML document and result URLs
        RecipesXML = Request.responseXML;
        ResultURLs_All = XML_RetrieveContent(Request, RecipesXML, "//public_UrlSearchResult");
        // Iterate initial set of results
        ResultURLs_Search = ResultURLs_All.slice(0);
        ResultTotal = ResultURLs_Search.length;
        Results_Iterate();
    }

    // Iterate set of results specified by variables
    function Results_Iterate() {
        // Test whether last set of results
        if (ResultTotal - ResultSetLB < ResultMax) {
            // Include all remaining results
            ResultSetUB = ResultTotal;
            // Disable next buttons
            NextButtons.forEach(function (NextButton) {
                if (!NextButton.hasAttribute("disabled")) {
                    NextButton.setAttribute("disabled", '');
                }
            });
            // Disable next button tooltips
            NextButtonTooltips.forEach(function (NextButtonTooltip) {
                if (!NextButtonTooltip.classList.contains("hidden")) {
                    NextButtonTooltip.classList.add("hidden");
                }
                if (NextButtonTooltip.classList.contains("is-active")) {
                    NextButtonTooltip.classList.remove("is-active");
                }
            });
        } else {
            // Include specified number of results
            ResultSetUB = ResultMax;
            // Enable next buttons
            NextButtons.forEach(function (NextButton) {
                if (NextButton.hasAttribute("disabled")) {
                    NextButton.removeAttribute("disabled");
                }
            });
            // Enable next button tooltips
            NextButtonTooltips.forEach(function (NextButtonTooltip) {
                if (NextButtonTooltip.classList.contains("hidden")) {
                    NextButtonTooltip.classList.remove("hidden");
                }
            });
        }
        // Begin requesting results
        Results_Request(ResultSetLB - 1);
    }

    // Iterate next set of results
    function Results_IterateNext() {
        // Reset elements and variables as necessary
        Reset_OnIterate();
        // Scroll result placeholder into view
        ResultPlaceholder.scrollIntoView({ behavior: "smooth", block: "nearest" });
        // Set iteration variables
        ResultSetLB += ResultMax;
        ResultIndex = ResultSetLB - 1;
        // Enable previous buttons
        PreviousButtons.forEach(function (PreviousButton) {
            if (PreviousButton.hasAttribute("disabled")) {
                PreviousButton.removeAttribute("disabled");
            }
        });
        // Enable previous button tooltips
        PreviousButtonTooltips.forEach(function (PreviousButtonTooltip) {
            if (PreviousButtonTooltip.classList.contains("hidden")) {
                PreviousButtonTooltip.classList.remove("hidden");
            }
        });
        // Iterate this set of results
        Results_Iterate();
    }

    // Iterate previous set of results
    function Results_IteratePrevious() {
        // Reset elements and variables as necessary
        Reset_OnIterate();
        // Scroll result placeholder into view
        ResultPlaceholder.scrollIntoView({ behavior: "smooth", block: "nearest" });
        // Set iteration variables
        ResultSetLB -= ResultMax;
        ResultIndex = ResultSetLB - 1;
        // Test whether this is first set of results
        if (ResultSetLB === 1) {
            // Disable previous buttons
            PreviousButtons.forEach(function (PreviousButton) {
                if (!PreviousButton.hasAttribute("disabled")) {
                    PreviousButton.setAttribute("disabled", '');
                }
            });
            // Disable previous button tooltips
            PreviousButtonTooltips.forEach(function (PreviousButtonTooltip) {
                if (!PreviousButtonTooltip.classList.contains("hidden")) {
                    PreviousButtonTooltip.classList.add("hidden");
                }
                if (PreviousButtonTooltip.classList.contains("is-active")) {
                    PreviousButtonTooltip.classList.remove("is-active");
                }
            });
        }
        // Iterate this set of results
        Results_Iterate();
    }

    // Request specified result from server
    function Results_Request(Index) {
        Document_Load(ResultURLs_Search[Index], Results_RetrieveText);
    }

    // Retrieve result text
    function Results_RetrieveText(Request) {
        ResultText += Request.responseText;
        // Test whether all results retrieved
        if (++ResultIndex === ResultSetUB) {
            // Update result indices
            ResultIndices.forEach(function (ResultIndex) {
                ResultIndex.innerHTML = ResultSetLB + " to " + ResultSetUB + " of " + ResultTotal;
            });
            // Post result text to result area
            Results_DisplayText(ResultText);
        } else {
            // Request next result
            Results_Request(ResultIndex);
        }
    }

    // !!!
    // Retrieve text values of nodes at specified path
    // Retrieve specified content from nodes at specified path
    function XML_RetrieveContent(Request, ContextNode, NodePath) {
        var TextValues = [];
        // Retrieve contents of nodes at specified path
        if (ContextNode.evaluate) {
            var Nodes = ContextNode.evaluate(NodePath, ContextNode, null, XPathResult.ANY_TYPE, null);
            var NextNode = Nodes.iterateNext();
            while (NextNode) {
                TextValues.push(NextNode.childNodes[0].nodeValue);
                NextNode = Nodes.iterateNext();
            }
        } else if (window.ActiveXObject || Request.responseType === "msxml-document") {
            // Support for Internet Explorer
            ContextNode.setProperty("SelectionLanguage", "XPath");
            var Nodes = ContextNode.selectNodes(NodePath);
            var NodesLength = Nodes.length;
            for (var i = 0; i < NodesLength; i++) {
                TextValues.push(Nodes[i].childNodes[0].nodeValue);
            }
        }
        return TextValues;
    }
})();
