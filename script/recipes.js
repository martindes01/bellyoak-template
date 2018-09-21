// Designed to work alongside Material Design Lite v1.3.0

(function () {
    // Private constants
    const RegExp_NonWordCharacters = /\W+/;
    const ResultMax = 5;

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
    var SearchButtonTooltip = document.getElementById("search-button-tooltip");
    var SearchField = document.getElementById("search-field");

    // Private variables - Values
    var RecipesXML;
    var RecipesText = [];
    var ResultIndex;
    var ResultSetLB;
    var ResultSetUB;
    var ResultText;
    var ResultTotal;
    var ResultURLs_All = [];
    var ResultURLs_Search = [];

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
        // Search button - Initiate search on click
        SearchButton.addEventListener("click", function () { Search_Initiate(); }, false);
        // Search field - Initiate search on enter key press
        SearchField.addEventListener("keypress", function (e) {
            // Test whether enter key was pressed
            if (e.key === "Enter") {
                Search_Initiate();
            }
        }, false);
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
        // Search button - Initiate search on click
        SearchButton.attachEvent("onclick", function () { Search_Initiate(); });
        // Search field - Initiate search on enter key press
        SearchField.attachEvent("onkeypress", function () {
            // Test whether enter key was pressed
            if (window.event.key === "Enter") {
                Search_Initiate();
            }
        }, false);
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
        if (!SearchButton.hasAttribute("disabled")) {
            SearchButton.setAttribute("disabled", '');
        }
        if (SearchButtonTooltip.classList.contains("is-active")) {
            SearchButtonTooltip.classList.remove("is-active");
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
            if (PreviousButtonTooltip.classList.contains("is-active")) {
                PreviousButtonTooltip.classList.remove("is-active");
            }
        });
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
        // Enable search button
        SearchButton.removeAttribute("disabled");
    }

    // Initialise result area
    function Results_Initialise(Request) {
        // Save recipes XML document and recipe node text content
        RecipesXML = Request.responseXML;
        RecipesText = XML_RetrieveTextContent(Request, RecipesXML, "//body");
        // Save all result URLs
        ResultURLs_All = XML_RetrieveTextContent(Request, RecipesXML, "//head/link[@rel=\"search-result\"]/@href");
        // Iterate initial set of results
        ResultURLs_Search = ResultURLs_All.slice(0);
        ResultTotal = ResultURLs_Search.length;
        Results_Iterate();
    }

    // Iterate set of results specified by variables
    function Results_Iterate() {
        if (ResultTotal) {
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
            }
            // Begin requesting results
            Results_Request(ResultSetLB - 1);
        } else {
            Results_DisplayText("No matches (._.)");
        }
    }

    // Iterate next set of results
    function Results_IterateNext() {
        // Reset elements and variables as necessary
        Reset_OnIterate();
        // Scroll result placeholder into view
        ResultPlaceholder.scrollIntoView({ block: "nearest" });
        // Set iteration variables
        ResultSetLB += ResultMax;
        ResultIndex = ResultSetLB - 1;
        // Enable previous buttons
        PreviousButtons.forEach(function (PreviousButton) {
            if (PreviousButton.hasAttribute("disabled")) {
                PreviousButton.removeAttribute("disabled");
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
        ResultPlaceholder.scrollIntoView({ block: "nearest" });
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

    // Initiate search
    function Search_Initiate() {
        // Reset elements and variables as necessary
        Reset_OnSearch();
        // Test whether search query contains search items
        var SearchQuery = SearchField.value.trim().toLowerCase();
        if (SearchQuery) {
            // Split search query into items to be matched
            var SearchItems = SearchQuery.split(RegExp_NonWordCharacters);
            // Assign each result a value indicating number of matched search items
            var SearchRankings = [];
            ResultURLs_All.forEach(function (ResultURL, i) {
                var Count = 0;
                SearchItems.forEach(function (SearchItem) {
                    Count += Search_ReturnMatches(RecipesText[i], SearchItem);
                });
                SearchRankings.push([ResultURL, Count]);
            });
            // Sort search rankings by matches descending
            SearchRankings.sort(Search_SortRankings);
            // Save matched search result URLs
            SearchRankings.forEach(function (SearchRanking) {
                if (SearchRanking[1]) {
                    ResultURLs_Search.push(SearchRanking[0]);
                }
            });
        } else {
            // Copy all result URLs to search result URLs
            ResultURLs_Search = ResultURLs_All.slice(0);
        }
        // Iterate initial set of results
        ResultTotal = ResultURLs_Search.length;
        Results_Iterate();
    }

    // Return number of matches of substring in string
    function Search_ReturnMatches(String, Substring) {
        var Count = 0;
        // Test whether substring is not empty
        if (Substring) {
            var Position = 0;
            var Step = Substring.length;
            while (true) {
                // Find position of next substring in string
                Position = String.indexOf(Substring, Position);
                // Test whether substring was found
                if (Position >= 0) {
                    Count++;
                    // Increase search position so find not repeated
                    Position += Step;
                } else {
                    break;
                }
            }
        }
        return Count;
    }

    // Sort search rankings by matches descending
    function Search_SortRankings(a, b) {
        // Test whether values equal
        if (a[1] === b[1]) {
            // Retain order
            return 0;
        } else {
            // Sort descending
            return a[1] > b[1] ? -1 : 1;
        }
    }

    // Retrieve text content of nodes at specified path
    function XML_RetrieveTextContent(Request, ContextNode, NodePath) {
        var TextValues = [];
        // Retrieve text content of nodes at specified path
        if (ContextNode.evaluate) {
            var Nodes = ContextNode.evaluate(NodePath, ContextNode, null, XPathResult.ANY_TYPE, null);
            var NextNode = Nodes.iterateNext();
            while (NextNode) {
                TextValues.push(NextNode.textContent);
                NextNode = Nodes.iterateNext();
            }
        } else if (window.ActiveXObject || Request.responseType === "msxml-document") {
            // Support for Internet Explorer
            ContextNode.setProperty("SelectionLanguage", "XPath");
            var Nodes = ContextNode.selectNodes(NodePath);
            var NodesLength = Nodes.length;
            for (var i = 0; i < NodesLength; i++) {
                TextValues.push(Nodes[i].textContent);
            }
        }
        return TextValues;
    }
})();
