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
In production, you must provide an authentication token:
```
https://your-domain.com/admin?token=YOUR_SECURE_TOKEN
```

## Configuration

### 1. Set Up Authentication Token

Add the following to your `.env` file:
```bash
# Admin Dashboard Token (required for production)
ADMIN_DASHBOARD_TOKEN=your-secure-token-here
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

## Technical Implementation

### Architecture
- **Frontend**: Astro page with AlpineJS for interactivity
- **Backend**: Server-Sent Events (SSE) for real-time streaming
- **Commands**: Executes `yarn types:push` and `yarn styles:push` via child processes
- **Styling**: TailwindCSS + daisyUI for modern UI

### API Endpoints
- `/api/admin/stream/push-types`: Streams output from type synchronization
- `/api/admin/stream/push-styles`: Streams output from style synchronization

### Security
- Token-based authentication in production
- Commands run with same permissions as the server process
- No direct shell access or arbitrary command execution

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
- Ensure `ADMIN_DASHBOARD_TOKEN` is set in production
- Verify token in URL matches environment variable
- Check for typos in token value

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