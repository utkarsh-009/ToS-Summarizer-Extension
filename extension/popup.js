document.addEventListener("DOMContentLoaded", function () {
    const btnSummarizeWebpage = document.getElementById("summarize-webpage");
    const btnSummarizeText = document.getElementById("summarize-text");
    const outputContainer = document.getElementById("output-container");
    const output = document.getElementById("output");
    const inputText = document.getElementById("input-text");

    // Function to handle text summarization
    function summarizeText(text) {
        btnSummarizeText.disabled = true; // Disable the button
        btnSummarizeText.innerHTML = "Summarizing..."; // Change button text

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://127.0.0.1:5000/summary", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                btnSummarizeText.disabled = false; // Enable the button
                btnSummarizeText.innerHTML = "Summarize Text"; // Restore button text

                if (xhr.status === 200) {
                    try {
                        const jsonResponse = JSON.parse(xhr.responseText);
                        const summaryText = jsonResponse.summary;
                        output.innerHTML = summaryText;
                        outputContainer.style.display = "block"; // Show output container
                    } catch (e) {
                        console.error("Error parsing JSON response:", e);
                        output.innerHTML = "Error parsing the summary response. Please try again.";
                        outputContainer.style.display = "block"; // Show output container
                    }
                } else {
                    console.error('Error:', xhr.status);
                    output.innerHTML = "Error summarizing the content. Please try again.";
                    outputContainer.style.display = "block"; // Show output container
                }
            }
        };
        xhr.onerror = function () {
            console.error("Request failed");
            output.innerHTML = "Request failed. Please check your connection and try again.";
            outputContainer.style.display = "block"; // Show output container

            btnSummarizeText.disabled = false; // Enable the button
            btnSummarizeText.innerHTML = "Summarize Text"; // Restore button text
        };
        xhr.send(JSON.stringify({ text: text }));
    }

    // Event listener for summarizing text
    btnSummarizeText.addEventListener("click", function () {
        const text = inputText.value.trim();
        if (text !== "") {
            output.innerHTML = "Summarizing...";
            summarizeText(text);
        } else {
            output.innerHTML = "Please enter text to summarize.";
            outputContainer.style.display = "block"; // Show output container
        }
    });

    // Event listener for summarizing webpage
    btnSummarizeWebpage.addEventListener("click", function () {
        output.innerHTML = "Summarizing...";
        btnSummarizeWebpage.disabled = true; // Disable the button
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            const url = tabs[0].url;
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "http://127.0.0.1:5000/summary?url=" + encodeURIComponent(url), true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    btnSummarizeWebpage.disabled = false; // Enable the button
                    if (xhr.status === 200) {
                        try {
                            const jsonResponse = JSON.parse(xhr.responseText);
                            const summaryText = jsonResponse.summary;
                            output.innerHTML = summaryText;
                            outputContainer.style.display = "block"; // Show output container
                        } catch (e) {
                            console.error("Error parsing JSON response:", e);
                            output.innerHTML = "Error parsing the summary response. Please try again.";
                            outputContainer.style.display = "block"; // Show output container
                        }
                    } else {
                        console.error('Error:', xhr.status);
                        output.innerHTML = "Error summarizing the content. Please try again.";
                        outputContainer.style.display = "block"; // Show output container
                    }
                }
            };
            xhr.onerror = function () {
                console.error("Request failed");
                output.innerHTML = "Request failed. Please check your connection and try again.";
                outputContainer.style.display = "block"; // Show output container

                btnSummarizeWebpage.disabled = false; // Enable the button
            };
            xhr.send();
        });
    });
});
