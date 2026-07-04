console.log("🚀 Popup Killer Pro started.");

chrome.tabs.onCreated.addListener((tab) => {

    setTimeout(async () => {

        try {

            const newTab = await chrome.tabs.get(tab.id);

            // Ignore tabs that disappeared already
            if (!newTab)
                return;

            // Must have an opener
            if (!newTab.openerTabId)
                return;

            const openerTab = await chrome.tabs.get(newTab.openerTabId);

            const originalURL = openerTab.url || "";
            const newURL = newTab.url || "";

            console.log("================================");
            console.log("Original:", originalURL);
            console.log("New:", newURL);

            // Don't touch Chrome internal pages
            if (
                newURL.startsWith("chrome://") ||
                newURL.startsWith("chrome-extension://")
            ) {
                console.log("🟢 Chrome page - Keeping");
                return;
            }

            const originalDomain = getDomain(originalURL);
            const newDomain = getDomain(newURL);

            console.log("Original Domain:", originalDomain);
            console.log("New Domain:", newDomain);

            // Same website
            if (originalDomain === newDomain) {
                console.log("🟢 Same domain - Keeping");
                return;
            }

            console.log("🔴 Suspicious tab detected");

            // Close popup
            await chrome.tabs.remove(newTab.id);

            // Return focus
            await chrome.tabs.update(openerTab.id, {
                active: true
            });

            console.log("✅ Popup closed");

        } catch (err) {
            console.log(err);
        }

    }, 500);

});

function getDomain(url) {

    if (!url)
        return "";

    try {
        return new URL(url).hostname;
    } catch {
        return "";
    }

}