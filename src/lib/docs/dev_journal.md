## dev journal

### 2025-01-06

1-
Rebuilding the app for the cloudflare workers.
https://developers.cloudflare.com/workers/frameworks/framework-guides/svelte/
this will enable the app to be deployed to the cloudflare workers. and use the cloudflare workers to host the app. and the AI features will be hosted on the cloudflare workers.
It asked if wanted to install  msdvex so going to try to that
https://mdsvex.pngwn.io/playground

### 2024-01-07

Working on implementing Cloudflare AI Workers integration. Encountered an intermittent "No response received from AI" issue. Research shows this is a known behavior with Cloudflare AI Workers where the first request might fail but subsequent requests work consistently.

Reference: https://developers.cloudflare.com/workers-ai/

TODO: Implement retry logic for AI requests. Consider:
- Adding a retry mechanism (2-3 attempts) when no response is received
- Adding exponential backoff between retries
- Showing loading state to user during retries
- Logging retry attempts for monitoring

Current workaround is to retry the request manually if first attempt fails.


