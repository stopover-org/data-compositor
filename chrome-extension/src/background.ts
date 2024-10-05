// src/background.ts

// Define the structure of an XHR request with headers
interface XHRRequest {
  method: string;
  url: string;
  statusCode: number;
  timeStamp: string;
  requestHeaders: chrome.webRequest.HttpHeader[];
  responseHeaders: chrome.webRequest.HttpHeader[];
}

// Store XHR requests per tab
const xhrRequests: Record<number, XHRRequest[]> = {};
// Temporary storage for headers per requestId
const pendingRequests: Record<string, Partial<XHRRequest>> = {};
// Track the currently active tab ID
let activeTabId: number | null = null;

// Update activeTabId when a tab is activated
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  activeTabId = activeInfo.tabId;
  // Optionally clear previous requests for the new active tab
  if (!xhrRequests[activeTabId]) {
    xhrRequests[activeTabId] = [];
  }
});

// Update activeTabId when the window focus changes
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    activeTabId = null;
    return;
  }
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  activeTabId = tab.id ?? null;
});

// Initialize activeTabId on service worker startup
chrome.runtime.onStartup.addListener(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  activeTabId = tab.id ?? null;
});

// Listener for capturing request headers
chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    if (details.tabId !== activeTabId) return;

    pendingRequests[details.requestId] = {
      requestHeaders: details.requestHeaders,
    };

    console.log(
      `[XHR Monitor] [${details.requestId}] Request headers: `,
      pendingRequests[details.requestId].responseHeaders,
    );
  },
  { urls: ["<all_urls>"], types: ["xmlhttprequest"] },
  ["requestHeaders", "extraHeaders"], // Correct usage
);

// Listener for capturing response headers
chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    if (details.tabId !== activeTabId) return;

    if (pendingRequests[details.requestId]) {
      pendingRequests[details.requestId].responseHeaders =
        details.responseHeaders;
    } else {
      pendingRequests[details.requestId] = {
        responseHeaders: details.responseHeaders,
      };
    }

    console.log(
      `[XHR Monitor] [${details.requestId}] Response headers: `,
      pendingRequests[details.requestId].responseHeaders,
    );
  },
  { urls: ["<all_urls>"], types: ["xmlhttprequest"] },
  ["responseHeaders", "extraHeaders"], // Correct usage
);

// Listener for completed requests to finalize and store data
chrome.webRequest.onCompleted.addListener(
  (details) => {
    if (details.tabId !== activeTabId) return;

    const request = pendingRequests[details.requestId] || {};
    const xhrRequest: XHRRequest = {
      method: details.method,
      url: details.url,
      statusCode: details.statusCode,
      timeStamp: new Date(details.timeStamp).toLocaleTimeString(),
      requestHeaders: request.requestHeaders ?? [],
      responseHeaders: request.responseHeaders ?? [],
    };

    if (!xhrRequests[details.tabId]) {
      xhrRequests[details.tabId] = [];
    }

    xhrRequests[details.tabId].push(xhrRequest);

    // Limit to the last 100 requests to prevent excessive memory usage
    if (xhrRequests[details.tabId].length > 100) {
      xhrRequests[details.tabId].shift();
    }

    // Clean up the pending request
    delete pendingRequests[details.requestId];

    // Log the request to the service worker console
    console.log(
      `[XHR Monitor] [Tab ${details.tabId}] ${xhrRequest.method} ${xhrRequest.url} - ${xhrRequest.statusCode}`,
    );

    console.log(
      "[XHR Monitor] Completed Request Headers:",
      xhrRequest.requestHeaders,
    );

    console.log(
      "[XHR Monitor] Completed Response Headers:",
      xhrRequest.responseHeaders,
    );
  },
  { urls: ["<all_urls>"], types: ["xmlhttprequest"] },
  ["responseHeaders", "extraHeaders"], // Correct usage
);

// Cleanup stored requests when a tab is removed
// eslint-disable-next-line @typescript-eslint/no-unused-vars
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  if (xhrRequests[tabId]) {
    delete xhrRequests[tabId];

    console.log(`[XHR Monitor] Cleared XHR requests for Tab ${tabId}`);
  }
});

// Cleanup stored requests when a tab is updated (e.g., reloaded)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "loading" && xhrRequests[tabId]) {
    xhrRequests[tabId] = [];

    console.log(
      `[XHR Monitor] Cleared XHR requests for Tab ${tabId} due to reload`,
    );
  }
});
