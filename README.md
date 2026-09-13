# SIH26033 Live Tracker

Dark/tricolour live submission tracker for SIH26033.

- Frontend polls `/api/sih?ps=SIH26033` every 60 seconds.
- The Vercel function reads the public SIH problem-statement page and attempts to extract the public submission count.
- Deploy the whole folder/repository, not just `index.html`.
- This is an unofficial tracker and should not be presented as an SIH service.
