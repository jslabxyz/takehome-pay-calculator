# Replit Setup Guide

This guide will help you set up and run the JS Labs Geld Calculator on Replit.

## Quick Start on Replit

### Option 1: Import from GitHub

1. Go to [Replit](https://replit.com)
2. Click "Create Repl"
3. Select "Import from GitHub"
4. Enter repository URL: `https://github.com/jslabxyz/takehome-pay-calculator`
5. Click "Import from GitHub"
6. Replit will automatically detect the configuration and set up the project

### Option 2: Fork Existing Repl

If someone has already created a Repl for this project:
1. Visit the Repl URL
2. Click "Fork" at the top
3. The project will be copied to your account

## First Time Setup

After importing, Replit will automatically:
1. Detect it's a Next.js project
2. Install dependencies using npm
3. Set up the development environment

## Running the App

### Development Mode

Click the **Run** button at the top of Replit, or use the Shell:

```bash
npm run dev
```

The app will start on port 3000. Replit will provide a URL like:
`https://your-repl-name.your-username.repl.co`

### Production Build

To test the production build:

```bash
npm run build
npm start
```

## Environment Configuration

The app doesn't require environment variables by default, but you can add them in the "Secrets" tab:

1. Click the lock icon (🔒) in the left sidebar
2. Add any environment variables as key-value pairs

Optional variables:
- `NEXT_PUBLIC_EXCHANGE_RATE_API_URL` - Custom exchange rate API endpoint
- `NEXT_PUBLIC_DEFAULT_EXCHANGE_RATE` - Default fallback rate (default: 18.5)

## File Structure

```
takehome-pay-calculator/
├── .replit              # Replit configuration
├── replit.nix           # Nix packages for Replit
├── .replitignore        # Files to ignore in Replit
├── app/                 # Next.js app directory
├── components/          # React components
├── lib/                 # Utilities and state
├── hooks/               # Custom React hooks
└── public/              # Static assets
```

## Troubleshooting

### Dependencies Not Installing

If dependencies fail to install:

1. Open the Shell tab
2. Run: `rm -rf node_modules package-lock.json`
3. Run: `npm install`
4. Click Run again

### Port Issues

If you get a port error:
1. The app runs on port 3000 by default
2. Replit should automatically handle port forwarding
3. Check the Webview tab for the live URL

### Build Errors

If the build fails:

1. Check the Console tab for specific errors
2. Most TypeScript errors are ignored (configured in next.config.mjs)
3. Check if all dependencies installed correctly

### Clear Cache

If you experience persistent issues:

```bash
rm -rf .next
rm -rf node_modules
npm install
npm run dev
```

## Features Available on Replit

All features work on Replit:
- ✅ Live exchange rate API (requires internet)
- ✅ LocalStorage (works in browser)
- ✅ Data persistence
- ✅ Excel/PDF export
- ✅ All calculations and features

## Performance Tips

### For Better Performance:

1. **Use Production Build for Testing:**
   ```bash
   npm run build
   npm start
   ```
   Production builds are faster and more optimized.

2. **Keep Dependencies Updated:**
   Regularly update dependencies in package.json

3. **Monitor Console:**
   Check Console tab for warnings or errors

## Development Workflow

### Making Changes

1. Edit files in the Code editor
2. Changes auto-reload in development mode
3. Check the Webview for live updates
4. Use Console tab to debug

### Using Git in Replit

Replit has built-in Git support:

1. Click the Git icon in the left sidebar
2. Stage changes
3. Commit with a message
4. Push to your repository

Or use Shell:

```bash
git add .
git commit -m "Your message"
git push
```

## Deploying from Replit

### Using Replit Deployments

1. Click "Deploy" at the top
2. Choose deployment type
3. Configure settings
4. Deploy

### Using Vercel (Recommended for Next.js)

1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Vercel will auto-detect Next.js
4. Deploy with one click

### Using Netlify

1. Go to [Netlify](https://netlify.com)
2. Import from Git
3. Build command: `npm run build`
4. Publish directory: `.next`

## Useful Replit Commands

### In the Shell Tab:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check for linting issues
npm run lint

# Clear Next.js cache
rm -rf .next

# View running processes
ps aux

# Check Node version
node --version
```

## Browser Storage

The app uses browser localStorage for:
- Saved scenarios
- User preferences
- Auto-saved inputs

This works perfectly in Replit's Webview. Data persists across sessions.

## API Access

The exchange rate API works in Replit:
- API: `https://api.exchangerate-api.com/v4/latest/USD`
- Free tier: 1,500 requests/month
- Cached for 1 hour
- Automatic fallback if API unavailable

## Known Limitations on Replit

1. **Always-On**: Free Repls sleep after inactivity (use Replit Hacker plan for always-on)
2. **Storage**: Limited to Repl storage size
3. **Bandwidth**: Subject to Replit's fair use policy

## Getting Help

### In Replit:
- Check Console tab for errors
- Use Shell for debugging
- Check Network tab in browser DevTools

### External Resources:
- [Replit Docs](https://docs.replit.com)
- [Next.js Docs](https://nextjs.org/docs)
- [Project README](./README.md)
- [Feature Documentation](./FEATURES.md)

## Tips for Success

1. **Keep It Running**: Bookmark your Repl URL for easy access
2. **Regular Commits**: Save your work with Git regularly
3. **Test in Browser**: Open the Webview in a new tab for better testing
4. **Use Shell**: The Shell tab is your friend for debugging
5. **Monitor Console**: Always keep an eye on errors

## Next Steps

1. ✅ Import/Fork the Repl
2. ✅ Install dependencies (automatic)
3. ✅ Click Run
4. ✅ Test all features in the Webview
5. ✅ Customize as needed
6. ✅ Deploy to production

Enjoy using the JS Labs Geld Calculator on Replit! 🚀
