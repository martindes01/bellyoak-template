// Designed to work alongside Material Design Lite v1.3.0

(function () {
    // Private variables - Elements
    var NextButtons = document.querySelectorAll(".site-js-next-button");
    var PreviousButtons = document.querySelectorAll(".site-js-previous-button");
    var ResultArea = document.getElementById("result-area");
    var ResultContainer = document.getElementById("result-container");
    var ResultIndices = document.querySelectorAll(".site-js-result-index");
    var ResultPlaceholder = document.getElementById("result-placeholder");
    var SearchButton = document.getElementById("search-button");
    var SearchField = document.getElementById("search-field");

    // Private variables - Values
    var RecipesXML;
    var ResultCount;
    var ResultMax = 5;
    var ResultSetLB;
    var ResultSetUB;
    var ResultText;
    var ResultTotal;
    var ResultURLs_All = [];
    //var ResultURLs_Search = [];

    // Event listeners
    if (document.addEventListener) {

    } else if (document.attachEvent) {
        // Support for Internet Explorer

    }

    // Initialise page and load recipes XML document
    Reset();
    Document_Load(recipes.xml, Results_Initialise);

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

    // Reset elements and variables
    function Reset() {
        // Reset elements
        PreviousButtons.forEach(function (PreviousButton) {
            if (!PreviousButton.hasAttribute("disabled")) {
                PreviousButton.setAttribute("disabled", '');
            }
        });
        if (!ResultContainer.classList.contains("hidden")) {
            ResultContainer.classList.add("hidden");
        }
        ResultIndices.forEach(function (ResultIndex) {
            ResultIndex.innerHTML = '';
        });
        if (ResultPlaceholder.classList.contains("hidden")) {
            ResultPlaceholder.classList.remove("hidden");
        }
        if (!SearchButton.hasAttribute("disabled")) {
            SearchButton.setAttribute("disabled", '');
        }
        // Reset variables
        ResultCount = 0;
        ResultSetLB = 1;
        ResultText = '';
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
        ResultTotal = ResultURLs_All.length;
        Results_Iterate(ResultURLs_All);
    }

    // Iterate next set of results
    function Results_Iterate(ResultURLs) {
        // Test whether last set of results
        if (ResultTotal - ResultSetLB < ResultMax) {
            // Include all remaining results
            ResultSetUB = ResultTotal;
            // Disable next button
            NextButtons.forEach(function (NextButton) {
                if (!NextButton.hasAttribute("disabled")) {
                    NextButton.setAttribute("disabled", '');
                }
            });
        } else {
            // Include specified number of results
            ResultSetUB = ResultMax;
            // Enable next button
            NextButtons.forEach(function (NextButton) {
                if (NextButton.hasAttribute("disabled")) {
                    NextButton.removeAttribute("disabled");
                }
            });
        }
        // Retrieve text to display for each result
        for (var i = ResultSetLB; i <= ResultSetUB; i++) {
            Document_Load(ResultURLs[i - 1], Results_RetrieveText);
        }
    }

    // Retrieve result text
    function Results_RetrieveText(Request) {
        ResultText += Request.responseText;
        // Display all results when retrieved
        if (ResultCount++ === ResultSetUB) {
            // Update result indices
            ResultIndices.forEach(function (ResultIndex) {
                ResultIndex.innerHTML = ResultSetLB + " to " + ResultSetUB + " of " + ResultTotal;
            });
            // Post result text to result area
            Results_DisplayText(ResultText);
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
