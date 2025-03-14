/*
 * voiceRSS.js
 * This file contains the VoiceRSS JavaScript SDK for converting text to speech.
 * The code has been refactored to use modern JavaScript best practices.
 */

const VoiceRSS = {
  /**
   * Converts text to speech using VoiceRSS API.
   * @param {Object} settings - The configuration settings for the API.
   */
  speech(settings) {
    this._validate(settings);
    this._request(settings);
  },

  /**
   * Validates the provided settings for the API.
   * @param {Object} settings - The configuration settings for the API.
   */
  _validate(settings) {
    if (!settings) throw new Error("The settings are undefined");
    if (!settings.key) throw new Error("The API key is undefined");
    if (!settings.src) throw new Error("The text is undefined");
    if (!settings.hl) throw new Error("The language is undefined");

    // Check if a specific audio codec is provided and if it's supported by the browser.
    if (settings.c && settings.c.toLowerCase() !== "auto") {
      let codecSupported = false;
      const audio = new Audio();
      switch (settings.c.toLowerCase()) {
        case "mp3":
          codecSupported = audio.canPlayType("audio/mpeg").replace("no", "");
          break;
        case "wav":
          codecSupported = audio.canPlayType("audio/wav").replace("no", "");
          break;
        case "aac":
          codecSupported = audio.canPlayType("audio/aac").replace("no", "");
          break;
        case "ogg":
          codecSupported = audio.canPlayType("audio/ogg").replace("no", "");
          break;
        case "caf":
          codecSupported = audio.canPlayType("audio/x-caf").replace("no", "");
          break;
        default:
          codecSupported = false;
      }
      if (!codecSupported)
        throw new Error(
          `The browser does not support the audio codec ${settings.c}`
        );
    }
  },

  /**
   * Builds the request and sends it to the VoiceRSS API.
   * @param {Object} settings - The configuration settings for the API.
   */
  _request(settings) {
    const requestBody = this._buildRequest(settings);
    const xhr = this._getXHR();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          if (xhr.responseText.indexOf("ERROR") === 0) {
            throw new Error(xhr.responseText);
          }
          // Get the audio element by its ID and set its source to the returned audio URL
          const audioElement = document.getElementById("audio");
          if (audioElement) {
            audioElement.src = xhr.responseText;
            // Attempt to play the audio and catch any errors that occur during playback
            audioElement.play().catch((err) => {
              console.error("Audio playback failed:", err);
            });
          } else {
            console.error("Audio element not found in the DOM.");
          }
        } else {
          console.error("HTTP request failed with status", xhr.status);
        }
      }
    };
    xhr.open("POST", "https://api.voicerss.org/", true);
    xhr.setRequestHeader(
      "Content-Type",
      "application/x-www-form-urlencoded; charset=UTF-8"
    );
    xhr.send(requestBody);
  },

  /**
   * Builds the request string with the given settings.
   * @param {Object} settings - The configuration settings for the API.
   * @returns {string} - The URL-encoded request string.
   */
  _buildRequest(settings) {
    const codec =
      settings.c && settings.c.toLowerCase() !== "auto"
        ? settings.c
        : this._detectCodec();
    return (
      `key=${encodeURIComponent(settings.key || "")}` +
      `&src=${encodeURIComponent(settings.src || "")}` +
      `&hl=${encodeURIComponent(settings.hl || "")}` +
      `&r=${encodeURIComponent(settings.r || "")}` +
      `&c=${encodeURIComponent(codec || "")}` +
      `&f=${encodeURIComponent(settings.f || "")}` +
      `&ssml=${encodeURIComponent(settings.ssml || "")}` +
      `&b64=true`
    );
  },

  /**
   * Detects the best supported audio codec by the browser.
   * @returns {string} - The detected audio codec.
   */
  _detectCodec() {
    const audio = new Audio();
    if (audio.canPlayType("audio/mpeg").replace("no", "")) return "mp3";
    if (audio.canPlayType("audio/wav").replace("no", "")) return "wav";
    if (audio.canPlayType("audio/aac").replace("no", "")) return "aac";
    if (audio.canPlayType("audio/ogg").replace("no", "")) return "ogg";
    if (audio.canPlayType("audio/x-caf").replace("no", "")) return "caf";
    return "";
  },

  /**
   * Creates and returns an XMLHttpRequest object.
   * @returns {XMLHttpRequest} - The XMLHttpRequest object.
   */
  _getXHR() {
    try {
      return new XMLHttpRequest();
    } catch (error) {}
    try {
      return new ActiveXObject("Msxml3.XMLHTTP");
    } catch (error) {}
    try {
      return new ActiveXObject("Msxml2.XMLHTTP.6.0");
    } catch (error) {}
    try {
      return new ActiveXObject("Msxml2.XMLHTTP.3.0");
    } catch (error) {}
    try {
      return new ActiveXObject("Msxml2.XMLHTTP");
    } catch (error) {}
    try {
      return new ActiveXObject("Microsoft.XMLHTTP");
    } catch (error) {}
    throw new Error("The browser does not support HTTP request");
  },
};
