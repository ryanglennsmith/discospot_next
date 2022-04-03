
# discospot

discospot connects to Spotify's API after authentication and retrieves a user's top artists. From there the user can click on an artist image and get recommendations from the Spotify API based on the artist seed. The app will then find sellers of albums matching those recommendations through a small web scraping utility and the Discogs API.

This version uses Next.js and Tailwind CSS (quite minimally so far).

The project remains a work-in-progress.

## project inception and challenges
This project began as a Christmas break assignment* during a full stack bootcamp. Initially I built it as a Node/Express app serving a Bootstrap frontend. After some exposure to React and then Next.js, I thought that the power of Next to handle the server-side functions would be perfect for the original idea. I switched the CSS framework to Tailwind to try something new.

Getting data from Discogs is a bit of a challenge, as the API tends to be very stingy with rate limits. Their API also doesn't have a search by album title function in its marketplace endpoints, so a little light web scraping was necessary. :unlock:

*The assignment was simply: "Go Build Something." :hammer_and_wrench:
I gave some thought to what problem I might like to solve, and I figured that "I don't own enough vinyl" seemed like a good enough place to start. :metal:

## to-dos

 - create a real UI
 - incorporate unit and integration testing
 - ~~clean up the results from Discogs -- sometimes running up against rate-limiting~~
