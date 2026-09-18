# Why Imagine video is blocked

Error observed:
```
HTTP 400: Zero Data Retention teams must provide output.upload_url for video generation.
```

## Meaning
This Grok/Imagine environment is on a **Zero Data Retention (ZDR)** team policy.  
- **Image generation works** (images can return as local session files).  
- **Video generation requires** an external `output.upload_url` so the service never stores the video on xAI infrastructure.

We do not have a configured public upload URL in this workspace, so `image_to_video` cannot complete.

## Workaround used
1. Generate stills with `image_gen`
2. Animate with **ffmpeg Ken Burns / zoompan** locally → `assets/media/*.mp4`

## Unblock options (for the human)
1. Ask xAI/admin for non-ZDR video access or a supported upload bucket workflow
2. Provide a signed S3/R2/GCS upload URL if the API supports it in this product
3. Keep using local ffmpeg animation (current production path)

Last checked: 2026-08-11
