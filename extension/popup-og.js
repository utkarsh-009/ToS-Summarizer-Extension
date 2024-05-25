document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("summarise");
    btn.addEventListener("click", function () {
        btn.disabled = true;
        btn.innerHTML = "Summarising...";
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            var url = tabs[0].url;
            console.log("URL to summarize:", url);  // Debug log
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "http://127.0.0.1:5000/summary?url=" + encodeURIComponent(url), true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    console.log("Request completed with status:", xhr.status);  // Debug log
                    if (xhr.status === 200) {
                        var jsonResponse = JSON.parse(xhr.responseText);
                        var summaryText = jsonResponse.summary;
                        console.log("Summary received:", summaryText);  // Debug log
                        const p = document.getElementById("output");
                        p.innerHTML = summaryText;
                    } else {
                        console.error('Error:', xhr.status);
                        const p = document.getElementById("output");
                        p.innerHTML = "Error summarizing the content. Please try again.";
                    }
                    btn.disabled = false;
                    btn.innerHTML = "Summarise";
                }
            };
            xhr.send();
        });
    });
});
