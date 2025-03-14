/*
 * script.js
 * This file handles the functionality of fetching a random joke from an API and using VoiceRSS to convert it to speech.
 * Extensive comments are provided to help beginners understand the code.
 */

// Wait for the DOM to load before accessing any elements
document.addEventListener("DOMContentLoaded", () => {
  // Get references to the DOM elements
  const jokeButton = document.getElementById("jokeButton");
  const jokeTextElement = document.getElementById("jokeText");
  const audioElement = document.getElementById("audio");

  /**
   * Fetches a random joke from the icanhazdadjoke API.
   * @returns {Promise<string>} A promise that resolves to the joke text.
   */
  async function fetchJoke() {
    try {
      // Fetch a random joke in JSON format
      const response = await fetch("https://icanhazdadjoke.com/", {
        headers: {
          Accept: "application/json",
        },
      });
      // Convert the response into JSON
      const data = await response.json();
      return data.joke;
    } catch (error) {
      // Log any errors to the console for debugging
      console.error("Error fetching joke:", error);
      throw new Error("Failed to fetch a joke.");
    }
  }

  /**
   * Handles the click event on the joke button.
   * It fetches a joke, displays it, and uses VoiceRSS to speak it.
   */
  async function handleJokeButtonClick() {
    try {
      // Disable the button to avoid multiple clicks
      jokeButton.disabled = true;
      // Provide immediate feedback to the user
      jokeTextElement.textContent = "Loading joke...";

      // Fetch a random joke from the API
      const joke = await fetchJoke();

      // Display the fetched joke text on the page
      jokeTextElement.textContent = joke;

      // Use the VoiceRSS API to convert the text to speech
      // NOTE: Replace 'YOUR_API_KEY' with your actual VoiceRSS API key.
      VoiceRSS.speech({
        key: "YOUR API", // Your VoiceRSS API key here.
        src: joke, // The joke text to convert to speech
        hl: "en-us", // Language (US English)
        r: 0, // Speech rate (0 is default)
        c: "mp3", // Audio codec to use
        f: "44khz_16bit_stereo", // Audio format
      });
    } catch (error) {
      // Log errors and inform the user if something goes wrong
      console.error("Error processing the joke:", error);
      alert("Sorry, we couldn't fetch a joke. Please try again later.");
      jokeTextElement.textContent = "";
    } finally {
      // Re-enable the button so the user can try again
      jokeButton.disabled = false;
    }
  }

  // Attach the click event listener to the joke button
  jokeButton.addEventListener("click", handleJokeButtonClick);
});
