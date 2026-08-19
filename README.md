# Omar Diaa — Reels Portfolio

## Files
- `index.html` — website structure
- `style.css` — design
- `script.js` — projects and filters

## Add a video
1. Create a folder called `videos`.
2. Put your MP4 inside it.
3. Open `script.js`.
4. Add/update a project:

{
  title: "My New Reel",
  category: "Real Estate",
  video: "videos/my-new-reel.mp4",
  poster: ""
}

For best performance, use compressed MP4/H.264 videos.

## Change contact details
Open `index.html` and replace:
- `YOUR_EMAIL@example.com`
- `YOUR_USERNAME`
- `YOUR_NUMBER`

## Publish for free
Recommended: GitHub Pages.
Create a public GitHub repository, upload these files, then enable:
Settings → Pages → Deploy from branch → main → / (root)

Your free site will be available at:
https://YOUR-USERNAME.github.io/REPOSITORY-NAME/

For a cleaner professional URL later, connect a custom domain.


## Current demo reel
The first project is configured as `videos/reel-01.mp4`.
It is muted and set to autoplay when the project enters the visitor's viewport.


## Editing Tools strip
The portfolio now includes an interactive tools strip above Selected Work.
Desktop: hover a tool to expand its description.
Mobile: the selected tool rotates automatically every few seconds.


## Upload videos without editing code
The portfolio automatically reads video files from the public GitHub `videos/` folder.

To add a new Reel:
1. Open the `videos` folder in GitHub.
2. Choose **Add file → Upload files**.
3. Upload an `.mp4`, `.webm`, or `.mov`.
4. Commit the change.
5. Refresh the portfolio after GitHub Pages updates.

The filename becomes the project title. Category is inferred from the filename:
- `real-estate-...` → Real Estate
- `commercial-...` / `brand-...` → Commercial
- `personal-...` / `creator-...` → Personal Brand
- `social-...` / `reel-...` → Social
- anything else → Reels

No JavaScript edits are required for new videos.
