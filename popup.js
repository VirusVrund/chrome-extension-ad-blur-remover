// Load saved preferences when popup opens
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['blockAds'], result => {
    const blockAds = result.blockAds !== undefined ? result.blockAds : true;
    document.getElementById('adBlockToggle').checked = blockAds;
  });
});

// Handle button click
document.getElementById('removeBlur').addEventListener('click', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // First try messaging the content script directly
    chrome.tabs.sendMessage(tab.id, { action: 'removeBlur' }, response => {
      if (chrome.runtime.lastError) {
        console.log('Content script not accessible, injecting directly: ', chrome.runtime.lastError);
        // Fall back to executeScript if content script isn't available
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: removeBlurEffects
        }).then(() => {
          console.log('Blur removal script executed');
        }).catch(err => {
          console.error('Failed to execute script:', err);
        });
      } else {
        console.log('Message sent to content script:', response);
      }
    });
  } catch (err) {
    console.error('Error in removeBlur click handler:', err);
  }
});

// Handle ad blocking toggle
document.getElementById('adBlockToggle').addEventListener('change', function () {
  const blockAds = this.checked;

  // Save preference
  chrome.storage.local.set({ blockAds: blockAds });

  // Send message to content script
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: blockAds ? 'enableAdBlocking' : 'disableAdBlocking'
      }, response => {
        if (chrome.runtime.lastError) {
          console.log('Ad toggle message error:', chrome.runtime.lastError);
          // If content script isn't accessible, execute directly
          if (blockAds) {
            chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              function: removeAdsDirectly
            });
          } else {
            
            chrome.tabs.reload(tabs[0].id);
          }
        } else {
          console.log('Ad blocking toggle message sent:', response);
          if (!blockAds) {
            
            chrome.tabs.reload(tabs[0].id);
          }
        }
      });
    }
  });
});

function removeBlurEffects() {
  // Function that will be injected into the page
  // This function will run in the context of the web page

  // Common CSS properties used for blurring
  const blurProperties = [
    'filter',
    '-webkit-filter',
    'backdrop-filter',
    '-webkit-backdrop-filter'
  ];

  // Handle elements with direct blur styles
  const allElements = document.querySelectorAll('*');
  allElements.forEach(element => {
    const style = window.getComputedStyle(element);

    // Check and remove blur filter properties
    blurProperties.forEach(prop => {
      if (style[prop] && style[prop].includes('blur')) {
        element.style.setProperty(prop, 'none', 'important');
      }
    });

    // Also check for other visibility-restricting properties
    if (element.style.opacity < 1) {
      element.style.opacity = '1';
    }

    // Remove pointer events restrictions
    if (style.pointerEvents === 'none') {
      element.style.pointerEvents = 'auto';
    }
  });

  // Remove overlay elements that might be blocking content
  const possibleOverlays = document.querySelectorAll(
    '.overlay, .modal, .paywall, .blur-overlay, ' +
    '[class*="overlay"], [class*="modal"], [class*="paywall"], ' +
    '[class*="blur"], [class*="signup"], [class*="login"]'
  );

  possibleOverlays.forEach(overlay => {
    // Check if element might be an overlay
    const style = window.getComputedStyle(overlay);
    if (
      (style.position === 'fixed' || style.position === 'absolute') &&
      (style.zIndex > 1 || style.backgroundColor.includes('rgba'))
    ) {
      overlay.style.display = 'none';
    }
  });

  // Remove any body scroll locks
  document.body.style.overflow = 'auto';
  document.documentElement.style.overflow = 'auto';

  console.log('Blur removal complete!');
}

// Function to remove ads when injected directly
function removeAdsDirectly() {
  console.log('Removing ads directly...');

  // Common ad selectors - expanded list
  const adSelectors = [
    // General ad containers
    '[class*="ad-"]:not(address):not(aside)',
    '[class*="ads-"]',
    '[class*="-ad-"]',
    '[class*="-ads-"]',
    '[class*="_ad_"]',
    '[class*="_ads_"]',
    '[id*="ad-"]:not(address):not(aside)',
    '[id*="ads-"]',
    '[id*="-ad-"]',
    '[id*="-ads-"]',
    '[id*="_ad_"]',
    '[id*="_ads_"]',

    // Common ad class names
    '.advertisement',
    '.advertising',
    '.advert',
    '.ad-container',
    '.ad-banner',
    '.ad-leaderboard',
    '.ad-rectangle',
    '.ad-slot',
    '.ad-wrapper',
    '.ad-unit',
    '.adbox',
    '.ads',
    '.adsbox',
    '.adsbygoogle',
    '.sponsored',
    '.sponsor-content',
    '.sponsored-content',

    // Ad network specific
    '[id^="google_ads_"]',
    '[id^="div-gpt-ad"]',
    'ins.adsbygoogle',
    'iframe[src*="googleadservices"]',
    'iframe[src*="doubleclick.net"]',
    'iframe[src*="2mdn.net"]',
    'iframe[src*="adnxs.com"]',
    'iframe[src*="facebook.com/tr"]'
  ];

  // Remove ad elements
  adSelectors.forEach(selector => {
    try {
      document.querySelectorAll(selector).forEach(element => {
        // Skip likely navigation elements
        if (element.tagName === 'NAV' ||
          element.id.toLowerCase().includes('nav') ||
          element.className.toLowerCase().includes('nav')) {
          return;
        }

        element.style.setProperty('display', 'none', 'important');
      });
    } catch (e) {
      console.error('Error processing selector:', selector, e);
    }
  });

  console.log('Ad removal complete!');
}