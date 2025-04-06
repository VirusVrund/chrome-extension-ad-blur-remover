
console.log('Blur Remover extension loaded');


function autoRemoveBlur() {


  // Common CSS properties used for blurring
  const blurProperties = [
    'filter',
    '-webkit-filter',
    'backdrop-filter',
    '-webkit-backdrop-filter'
  ];

  // Add ad blocking functionality
  chrome.storage.local.get(['blockAds'], result => {
    const blockAds = result.blockAds !== undefined ? result.blockAds : true;
    if (blockAds) {
      removeAds();
    }
  });

  const styleSheets = [...document.styleSheets];
  try {
    styleSheets.forEach(sheet => {
      try {
        const rules = sheet.cssRules || sheet.rules;
        for (let i = 0; i < rules.length; i++) {
          const rule = rules[i];
          // Look for fade-in animations
          if (rule.type === CSSRule.KEYFRAMES_RULE &&
            (rule.name.includes('fade') || rule.name.includes('in') || rule.name.includes('overlay'))) {
            // Disable the animation
            sheet.deleteRule(i);
            i--; // Adjust for the removed rule
          }
        }
      } catch (e) {
        // Security error - cross-origin stylesheets can't be accessed
        // This is normal, just continue
      }
    });
  } catch (e) {
    console.error('Error handling CSS animations:', e);
  }

  // Common classes/selectors for signup overlays and blurred content
  const commonSelectors = [
    // Your existing selectors
    '.paywall',
    '.modal',
    '.overlay',
    '.signup-modal',
    '.login-wall',
    '.login-modal',
    '.signup-wall',
    '.popup-overlay',
    '.blur-overlay',
    '[class*="paywall"]',
    '[class*="modal"]',
    '[class*="overlay"]',
    '[class*="signup"]',
    '[class*="login"]',
    '[class*="blur"]',
    '.js-signup-overlay',
    '.newsletter-signup',
    '.subscription-wall',
    '.premium-banner',
    '.register-wall',
    '.register-gate',
    '.content-gate',
    '.ad-blocker-notice',
    '.subscribe-notice',
    '#subscribe-banner',
    '#paywall-banner',
    '#signup-overlay',
    '#registration-wall',
    '.fc-ab-root', // Common ad blocker detection
    '.fc-dialog-overlay', // Common paywall system
    '[id*="paywall"]',
    '[id*="subscribe"]',
    '.tp-modal', // Tinypass modal (Piano/Tinypass is a common paywall system)
    '.tp-backdrop',
    '.tp-container',
    '.piano-modal'
  ];

  // Remove overlay elements
  commonSelectors.forEach(selector => {
    try {
      document.querySelectorAll(selector).forEach(element => {
        const style = window.getComputedStyle(element);
        if (style.position === 'fixed' || style.position === 'absolute') {
          element.style.setProperty('display', 'none', 'important');
          element.style.setProperty('visibility', 'hidden', 'important');
          element.style.setProperty('opacity', '0', 'important');
          element.style.setProperty('pointer-events', 'none', 'important');
        }
      });
    } catch (e) {
      console.error('Error processing selector:', selector, e);
    }
  });

  // Remove blur styles from elements
  try {
    document.querySelectorAll('*').forEach(element => {
      const style = window.getComputedStyle(element);

      // Check for blur in computed style
      blurProperties.forEach(prop => {
        if (style[prop] && style[prop].includes('blur')) {
          element.style.setProperty(prop, 'none', 'important');
        }
      });

      // Check for low opacity
      if (parseFloat(style.opacity) < 1) {
        element.style.setProperty('opacity', '1', 'important');
      }

      
      element.style.setProperty('user-select', 'auto', 'important');
      element.style.setProperty('pointer-events', 'auto', 'important');
    });

    // Ensure body scrolling works
    document.body.style.setProperty('overflow', 'auto', 'important');
    document.documentElement.style.setProperty('overflow', 'auto', 'important');

    // Remove any fixed body position
    document.body.style.setProperty('position', 'static', 'important');
  } catch (e) {
    console.error('Error removing blur styles:', e);
  }
}


function removeAds() {
  console.log('Removing ads from page...');

  // Special case handling for test page elements first
  try {
    const testPageSelectors = [
      '.ad-banner',
      '.sidebar-ad',
      '.sticky-ad',
      '.popup-ad',
      '.sponsored-content',
      '.newsletter-signup',
      '#div-gpt-ad-1234567890-0'
    ];

    testPageSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        console.log('Found test page element:', selector);
        // Applying more aggressive hiding
        element.style.setProperty('display', 'none', 'important');
        element.style.setProperty('visibility', 'hidden', 'important');
        element.style.setProperty('opacity', '0', 'important');
        element.style.setProperty('height', '0', 'important');
        element.style.setProperty('position', 'absolute', 'important');
        element.style.setProperty('pointer-events', 'none', 'important');
      });
    });
  } catch (e) {
    console.error('Error handling test page elements:', e);
  }

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
    'iframe[src*="facebook.com/tr"]',

    // Ad containers
    'aside[class*="sidebar"] [class*="ads"]',
    'aside[class*="sidebar"] [id*="ads"]',
    'div[role="complementary"] [class*="ad"]',
    'div[role="complementary"] [id*="ad"]',

    // Sticky ads and banners
    '[class*="sticky-ad"]',
    '[class*="banner-ad"]',
    '[class*="banner_ad"]',
    '.sticky-banner',
    '.promo-banner',
    '.top-banner',
    '.bottom-banner',

    // Video ads
    '.video-ads',
    '.video-ad-container',
    '.preroll-ads',
    '.ima-ad-container',

    // Native ads and sponsored content
    '[class*="sponsored-"]',
    '[class*="-sponsored"]',
    '[class*="native-ad"]',
    '[class*="promoted-content"]',
    '[class*="partner-content"]',
    '[class*="recommendation-widget"]',
    '[class*="taboola"]',
    '[class*="outbrain"]',
    '[id*="taboola"]',
    '[id*="outbrain"]',

    // Popups and overlays that might be ads
    '.popup-ad',
    '.overlay-ad',
    '.interstitial-ad'
  ];

  let adElementsRemoved = 0;

  // Remove ad elements
  adSelectors.forEach(selector => {
    try {
      document.querySelectorAll(selector).forEach(element => {
        // Skip elements that are likely navigation/content rather than ads
        if (isLikelyNavigationElement(element)) {
          return;
        }

        // Apply more aggressive hiding for ALL elements
        element.style.setProperty('display', 'none', 'important');
        element.style.setProperty('visibility', 'hidden', 'important');
        element.style.setProperty('opacity', '0', 'important');
        element.style.setProperty('height', '0', 'important');
        element.style.setProperty('min-height', '0', 'important');
        element.style.setProperty('pointer-events', 'none', 'important');

        // For iframes, also set the src to blank
        if (element.tagName === 'IFRAME') {
          element.setAttribute('src', 'about:blank');
        }

        // Remove potentially offensive images/content
        element.querySelectorAll('img, picture, video, iframe').forEach(mediaElement => {
          mediaElement.style.setProperty('display', 'none', 'important');
        });

        adElementsRemoved++;
      });

    } catch (e) {
      console.error('Error processing ad selector:', selector, e);
    }
  });

  // Remove ad scripts to prevent future ad loads
  try {
    const adScripts = [
      'script[src*="pagead2.googlesyndication.com"]',
      'script[src*="securepubads.g.doubleclick.net"]',
      'script[src*="amazon-adsystem.com"]',
      'script[src*="ad.doubleclick.net"]',
      'script[src*="adserver"]',
      'script[src*="analytics"]',
      'script[src*="facebook.net"]'
    ];

    adScripts.forEach(selector => {
      document.querySelectorAll(selector).forEach(script => {
        script.remove();
      });
    });
  } catch (e) {
    console.error('Error removing ad scripts:', e);
  }

  // Log results
  if (adElementsRemoved > 0) {
    console.log(`Removed ${adElementsRemoved} ad elements from the page`);
  }
}

// Helper function to avoid false positives with navigation elements
function isLikelyNavigationElement(element) {
  // Check if this might be a navigation element rather than an ad

  // Common navigation element attributes
  if (element.getAttribute('role') === 'navigation' ||
    element.tagName === 'NAV' ||
    element.id.toLowerCase().includes('nav') ||
    element.className.toLowerCase().includes('nav')) {
    return true;
  }

  // If it contains multiple links, it might be navigation
  const links = element.querySelectorAll('a');
  if (links.length > 4) {
    return true;
  }

  // Check if it's in the header/footer area
  const parent = element.closest('header, footer, nav');
  if (parent) {
    return true;
  }

  return false;
}



// Only keep the observer to watch for changes after manual activation
let isProcessing = false;
let observerActive = false; // Add this flag to track if observer is active
const observer = new MutationObserver(mutations => {
  if (!isProcessing && observerActive) { // Only process if observer is active
    isProcessing = true;
    setTimeout(() => {
      autoRemoveBlur();
      isProcessing = false;
    }, 500);
  }
});

// Start observer but don't make it active yet
try {
  observer.observe(document, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
  });
} catch (e) {
  console.error('Error setting up mutation observer:', e);
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'removeBlur') {
    // When button is clicked, run blur removal and activate observer
    observerActive = true; // Activate the observer
    autoRemoveBlur();
    sendResponse({ status: 'Blur removal executed' });
  } else if (request.action === 'enableAdBlocking') {
    removeAds();
    sendResponse({ status: 'Ad blocking enabled' });
  } else if (request.action === 'disableAdBlocking') {
    sendResponse({ status: 'Please refresh the page to restore ads' });
  }
  return true;
});

chrome.storage.local.get(['blockAds'], result => {
  console.log('Initial ad blocking setting:', result.blockAds);
  // If explicitly set to false, don't block ads on initial load
  if (result.blockAds === false) {
    console.log('Ad blocking disabled by user preference');
    // We don't need to do anything, just don't run removeAds()
  }
});