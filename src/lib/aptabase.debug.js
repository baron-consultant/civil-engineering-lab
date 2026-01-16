"use strict";
var aptabase = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    init: () => init,
    trackEvent: () => trackEvent
  });

  // ../shared.ts
  var defaultLocale;
  var defaultIsDebug;
  var isInBrowser = typeof window !== "undefined" && typeof window.fetch !== "undefined";
  var isInBrowserExtension = typeof chrome !== "undefined" && !!chrome.runtime?.id;
  var _sessionId = newSessionId();
  var _lastTouched = /* @__PURE__ */ new Date();
  var _hosts = {
    US: "https://us.aptabase.com",
    EU: "https://eu.aptabase.com",
    DEV: "https://localhost:3000",
    SH: ""
  };
  function inMemorySessionId(timeout) {
    let now = /* @__PURE__ */ new Date();
    const diffInMs = now.getTime() - _lastTouched.getTime();
    const diffInSec = Math.floor(diffInMs / 1e3);
    if (diffInSec > timeout) {
      _sessionId = newSessionId();
    }
    _lastTouched = now;
    return _sessionId;
  }
  function newSessionId() {
    const epochInSeconds = Math.floor(Date.now() / 1e3).toString();
    const random = Math.floor(Math.random() * 1e8).toString().padStart(8, "0");
    return epochInSeconds + random;
  }
  function validateAppKey(appKey) {
    const parts = appKey.split("-");
    if (parts.length !== 3 || _hosts[parts[1]] === void 0) {
      console.warn(`The Aptabase App Key "${appKey}" is invalid. Tracking will be disabled.`);
      return false;
    }
    return true;
  }
  function getApiUrl(appKey, options) {
    const region = appKey.split("-")[1];
    if (region === "SH") {
      if (!options?.host) {
        console.warn(`Host parameter must be defined when using Self-Hosted App Key. Tracking will be disabled.`);
        return;
      }
      return `${options.host}/api/v0/event`;
    }
    const host = options?.host ?? _hosts[region];
    return `${host}/api/v0/event`;
  }
  async function sendEvent(opts) {
    if (!isInBrowser && !isInBrowserExtension) {
      console.warn(`Aptabase: trackEvent requires a browser environment. Event "${opts.eventName}" will be discarded.`);
      return;
    }
    if (!opts.appKey) {
      console.warn(`Aptabase: init must be called before trackEvent. Event "${opts.eventName}" will be discarded.`);
      return;
    }
    try {
      const response = await fetch(opts.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "App-Key": opts.appKey
        },
        credentials: "omit",
        body: JSON.stringify({
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          sessionId: opts.sessionId,
          eventName: opts.eventName,
          systemProps: {
            locale: opts.locale ?? getBrowserLocale(),
            isDebug: opts.isDebug ?? getIsDebug(),
            appVersion: opts.appVersion ?? "",
            sdkVersion: opts.sdkVersion
          },
          props: opts.props
        })
      });
      if (response.status >= 300) {
        const responseBody = await response.text();
        console.warn(`Failed to send event "${opts.eventName}": ${response.status} ${responseBody}`);
      }
    } catch (e) {
      console.warn(`Failed to send event "${opts.eventName}"`);
      console.warn(e);
    }
  }
  function getBrowserLocale() {
    if (defaultLocale) {
      return defaultLocale;
    }
    if (typeof navigator === "undefined") {
      return void 0;
    }
    if (navigator.languages.length > 0) {
      defaultLocale = navigator.languages[0];
    } else {
      defaultLocale = navigator.language;
    }
    return defaultLocale;
  }
  function getIsDebug() {
    if (defaultIsDebug !== void 0) {
      return defaultIsDebug;
    }
    if (true) {
      defaultIsDebug = true;
      return defaultIsDebug;
    }
    if (typeof location === "undefined") {
      defaultIsDebug = false;
      return defaultIsDebug;
    }
    defaultIsDebug = location.hostname === "localhost";
    return defaultIsDebug;
  }

  // src/index.ts
  var SESSION_TIMEOUT = 1 * 60 * 60;
  var sdkVersion = `aptabase-web@${"0.4.3"}`;
  var _appKey = "";
  var _apiUrl;
  var _options;
  function init(appKey, options) {
    if (!validateAppKey(appKey))
      return;
    _apiUrl = options?.apiUrl ?? getApiUrl(appKey, options);
    _appKey = appKey;
    _options = options;
  }
  async function trackEvent(eventName, props) {
    if (!_apiUrl)
      return;
    const sessionId = inMemorySessionId(SESSION_TIMEOUT);
    await sendEvent({
      apiUrl: _apiUrl,
      sessionId,
      appKey: _appKey,
      isDebug: _options?.isDebug,
      appVersion: _options?.appVersion,
      sdkVersion,
      eventName,
      props
    });
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=aptabase.debug.js.map