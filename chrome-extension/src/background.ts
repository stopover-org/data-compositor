// Define the structure of an XHR request with headers and cookies
interface XHRRequest {
  method: string;
  url: string;
  statusCode: number;
  timeStamp: string;
  requestHeaders: chrome.webRequest.HttpHeader[];
  responseHeaders: chrome.webRequest.HttpHeader[];
  requestCookies: chrome.cookies.Cookie[];
  responseCookies: chrome.cookies.Cookie[];
}

// Store XHR requests per tab
const xhrRequests: Record<number, XHRRequest[]> = {};
// Track the currently active tab ID
let activeTabId: number | null = null;

// Update activeTabId when a tab is activated
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  activeTabId = activeInfo.tabId;
  // Initialize storage for the new active tab if not present
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

// Helper function to fetch cookies for a given URL
const fetchCookiesForUrl = async (
  url: string,
): Promise<chrome.cookies.Cookie[]> => {
  try {
    const parsedUrl = new URL(url);
    const cookies = await chrome.cookies.getAll({
      url: parsedUrl.origin,
    });
    return cookies;
  } catch (error) {
    console.error("Error fetching cookies:", error);
    return [];
  }
};

// Listener for capturing request headers
chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    if (details.tabId !== activeTabId) return;

    // Fetch cookies associated with the request URL
    fetchCookiesForUrl(details.url)
      .then((requestCookies) => {
        // Initialize storage for the tab if not present
        if (!xhrRequests[details.tabId]) {
          xhrRequests[details.tabId] = [];
        }

        // Create a partial XHRRequest object
        const xhrRequest: Partial<XHRRequest> = {
          method: details.method,
          url: details.url,
          requestHeaders: details.requestHeaders,
          requestCookies,
          timeStamp: new Date(details.timeStamp).toLocaleTimeString(),
        };

        // Temporarily store the request in the xhrRequests array
        xhrRequests[details.tabId].push(xhrRequest as XHRRequest);
      })
      .catch((error) => {
        console.error("Error processing onBeforeSendHeaders:", error);
      });
  },
  {
    urls: ["https://www.viator.com/orion/ajax/react/inauth/result"],
    types: ["xmlhttprequest"],
  },
  ["requestHeaders", "extraHeaders"],
);

// Listener for capturing response headers
chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    if (details.tabId !== activeTabId) return;

    // Fetch cookies associated with the response URL
    fetchCookiesForUrl(details.url)
      .then((responseCookies) => {
        // Find the corresponding XHRRequest in xhrRequests
        const xhrRequest = xhrRequests[details.tabId]?.find(
          (req) => req.url === details.url && req.method === details.method,
        );

        if (xhrRequest) {
          xhrRequest.responseHeaders = details.responseHeaders!;

          xhrRequest.statusCode = details.statusCode;

          xhrRequest.responseCookies = responseCookies;

          // Log the complete XHRRequest
          console.log(
            `[XHR Monitor] [Tab ${details.tabId}] ${xhrRequest.method} ${xhrRequest.url} - ${xhrRequest.statusCode}`,
          );

          // Log Request Headers
          console.log(
            "Request Headers:",
            xhrRequest.requestHeaders,
            xhrRequest.requestCookies,
          );

          // Log Response Headers
          console.log(
            "Response Headers:",
            xhrRequest.responseHeaders,
            xhrRequest.responseCookies,
          );
        }
      })
      .catch((error) => {
        console.error("Error processing onHeadersReceived:", error);
      });
  },
  {
    urls: ["https://www.viator.com/orion/ajax/react/inauth/result"],
    types: ["xmlhttprequest"],
  },
  ["responseHeaders", "extraHeaders"],
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
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "loading" && xhrRequests[tabId]) {
    xhrRequests[tabId] = [];

    console.log(
      `[XHR Monitor] Cleared XHR requests for Tab ${tabId} due to reload`,
    );
  }
});
