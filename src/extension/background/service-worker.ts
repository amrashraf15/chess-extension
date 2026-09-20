import type {
  ExtensionMessage,
  ExtensionMessageResponse,
} from "../../types/extension-messages";

chrome.runtime.onInstalled.addListener(() => {
  console.log("Chess Human Extension installed");
});

chrome.sidePanel.setPanelBehavior({
  openPanelOnActionClick: true,
});

chrome.runtime.onMessage.addListener(
  (
    message: ExtensionMessage,
    sender,
    sendResponse,
  ) => {
    if (message.type === "BOARD_DETECTED") {
      console.log(
        "[Chess Human] Board detected:",
        message.position.site,
      );

      return false;
    }

    if (message.type === "BOARD_UPDATED") {
      console.log(
        "[Chess Human] Board updated:",
        message.position.site,
      );

      return false;
    }

    if (message.type === "BOARD_LOST") {
      console.log("[Chess Human] Board lost");

      return false;
    }

    if (message.type === "GET_CURRENT_POSITION") {
      if (!sender.tab?.id) {
        const response: ExtensionMessageResponse = {
          success: false,
          error: "No active tab is associated with this request.",
        };

        sendResponse(response);
        return false;
      }

      chrome.tabs
        .sendMessage(sender.tab.id, message)
        .then((response) => {
          sendResponse(response);
        })
        .catch(() => {
          sendResponse({
            success: true,
            position: null,
          });
        });

      return true;
    }

    return false;
  },
);