# Render Deployment Guide

## Quick Deploy Steps:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for Render deployment"
   git push origin main
   ```

2. **Deploy on Render:**
   - Go to [render.com](https://render.com)
   - Connect your GitHub repository
   - Render will auto-detect the `render.yaml` file
   - Click "Deploy"

## Environment Variables (Auto-configured in render.yaml):
- `MONGODB_URI`: Your Atlas connection string
- `MONGODB_DB_NAME`: internhub
- `NODE_ENV`: production
- `PORT`: 10000 (Render default)

## URLs after deployment:
- Backend: `https://internhub-backend.onrender.com`
- Frontend: `https://internhub-frontend.onrender.com`

## Notes:
- Free tier may have cold starts (30-60 seconds)
- MongoDB Atlas is already configured and whitelisted
- Both frontend and backend will deploy automatically