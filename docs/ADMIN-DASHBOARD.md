# Admin Dashboard

The Admin Dashboard provides a web-based interface for managing CMS content synchronization tasks, eliminating the need for terminal access.

## Features

- **Real-time Log Streaming**: Watch command output as it happens, just like in a terminal
- **Push Content Types**: Sync all content type definitions to Optimizely CMS
- **Push Component Styles**: Sync all component styles to Optimizely CMS
- **Terminal-style Output**: Color-coded logs with timestamps
- **Auto-scroll Control**: Toggle auto-scrolling of logs
- **Copy Logs**: Copy command output to clipboard
- **Execution Timer**: Track how long commands take to execute
- **Secure Access**: Token-based authentication in production

## Accessing the Dashboard

### Development Mode
In development, the dashboard is accessible without authentication:
```
https://localhost:4321/admin
```

### Production Mode
The browser will prompt for username/password:
```
https://your-domain.com/admin
# Enter: username=admin, password=your-secure-password
```

## Configuration

### 1. Set Up Authentication
Add the following to your `.env` file:
```bash
# HTTP Basic Authentication (required in production)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password-here
```

### 2. Ensure CMS Credentials Are Set

The dashboard uses the same environment variables as the CLI commands:
```bash
# Required for pushing types and styles
OPTIMIZELY_CLIENT_ID=your-client-id
OPTIMIZELY_CLIENT_SECRET=your-client-secret
OPTIMIZELY_CMS_URL=https://app-your-instance.cms.optimizely.com/
```

## Using the Dashboard

### Push Content Types
1. Click the "Push Types to CMS" button
2. Watch the real-time logs in the terminal output
3. Monitor progress with the execution timer
4. Check the status indicator for success/failure

### Push Component Styles
1. Click the "Push Styles to CMS" button
2. View live output as styles are synchronized
3. Copy logs if needed for debugging
4. Review any errors in the color-coded output

### Terminal Output Features

- **Auto-scroll**: Automatically scrolls to show latest output (toggle on/off)
- **Clear**: Clear all logs from the terminal view
- **Copy**: Copy all terminal output to clipboard
- **Color Coding**:
  - 🟢 Green: Success messages
  - 🔴 Red: Error messages
  - 🟡 Yellow: Warning messages
  - ⚪ Default: Informational messages

## Authentication

### How It Works
The admin dashboard uses **HTTP Basic Authentication** for secure access.

#### HTTP Basic Authentication
- **Environment Variables**: `ADMIN_USERNAME` (default: "admin") and `ADMIN_PASSWORD`
- **User Experience**: Browser shows native login dialog
- **Security**: Standard HTTP Basic Auth with Base64 encoding
- **Compatibility**: Works on all hosting platforms (Vercel, Netlify, etc.)

### Authentication Flow
1. **Development**: No authentication required if `ADMIN_PASSWORD` is not set (convenient for local development)
2. **Production**: 
   - User visits `/admin`
   - Browser prompts for username/password
   - Credentials verified against environment variables
   - Access granted on successful authentication

## Technical Implementation

### Architecture
- **Frontend**: Astro page with AlpineJS for interactivity
- **Backend**: Server-Sent Events (SSE) for real-time streaming
- **CMS Operations**: Direct API calls using `@remkoj/optimizely-cms-api` client (serverless compatible)
- **Authentication**: HTTP Basic Auth or token-based protection
- **Styling**: TailwindCSS + daisyUI for modern UI

### API Endpoints
- `/api/admin/stream/push-types`: Streams output from bulk type synchronization
- `/api/admin/stream/push-styles`: Streams output from bulk style synchronization
- `/api/admin/stream/push-type?type=NAME`: Streams output from individual type push
- `/api/admin/stream/push-style?style=NAME`: Streams output from individual style push
- `/api/admin/list-types.json`: Returns available content types for dropdown
- `/api/admin/list-styles.json`: Returns available styles for dropdown

### Serverless Compatibility
- **✅ Netlify/Vercel Compatible**: Uses direct API calls instead of child processes
- **No Dependencies on CLI Tools**: No yarn/npm commands executed at runtime
- **Optimizely CMS API**: Direct integration with `@remkoj/optimizely-cms-api`
- **Real-time Progress**: SSE streaming with progress callbacks

### Security
- Token-based authentication in production
- Direct CMS API integration with proper credentials
- No shell access or arbitrary command execution

## Troubleshooting

### Dashboard Not Loading
- Verify server is running (`yarn dev`)
- Check that you're using the correct URL
- In production, ensure token parameter is provided

### Commands Not Executing
- Verify CMS credentials in `.env` file
- Check that `yarn types:push` and `yarn styles:push` work from terminal
- Review browser console for connection errors

### No Output in Terminal
- Check browser supports Server-Sent Events
- Verify no proxy/firewall blocking SSE connections
- Look for errors in server logs

### Authentication Issues
- Ensure `ADMIN_PASSWORD` is set in production
- Verify browser prompts for username/password
- Check credentials match environment variables (`ADMIN_USERNAME` and `ADMIN_PASSWORD`)
- Try clearing browser cache/cookies
- Verify environment variables are properly loaded in your hosting platform

## Development Tips

### Testing Locally
```bash
# Start dev server
yarn dev

# Access dashboard
open https://localhost:4321/admin
```

### Testing with Token
```bash
# Set token in .env
ADMIN_DASHBOARD_TOKEN=test123

# Access with token
open https://localhost:4321/admin?token=test123
```

### Monitoring Server Logs
The dashboard streams command output, but server errors appear in the terminal where you ran `yarn dev`.

## Future Enhancements

Potential improvements for the dashboard:
- Add more commands (pull types, pull styles, etc.)
- Command history and logs persistence
- Scheduled/automated synchronization
- Diff view for changes being pushed
- Rollback functionality
- Multiple environment support