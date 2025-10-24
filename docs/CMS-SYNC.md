# CMS Sync Manager

The CMS Sync Manager provides a web-based interface for managing CMS content synchronization tasks, eliminating the need for terminal access.

## Features

- **Real-time Log Streaming**: Watch command output as it happens, just like in a terminal
- **Push Content Types**: Sync all content type definitions to Optimizely CMS
- **Push Component Styles**: Sync all component styles to Optimizely CMS
- **Individual or Bulk Operations**: Push specific types/styles or all at once
- **Terminal-style Output**: Color-coded logs with timestamps
- **Auto-scroll Control**: Toggle auto-scrolling of logs
- **Copy Logs**: Copy command output to clipboard
- **Execution Timer**: Track how long commands take to execute
- **Secure Access**: HTTP Basic Authentication in production

## Accessing the CMS Sync Manager

### Development Mode
In development, the dashboard is accessible at:
```
https://localhost:4321/opti-admin/cms-sync
```

### Production Mode
The browser will prompt for username/password:
```
https://your-domain.com/opti-admin/cms-sync
# Enter: username and password from your environment variables
```

## Configuration

### 1. Set Up Authentication
Add the following to your `.env` file:
```bash
# HTTP Basic Authentication
# If not configured, the admin dashboard will return 404
ADMIN_DASHBOARD_USERNAME=admin
ADMIN_DASHBOARD_PASSWORD=your-secure-password-here
```

### 2. Ensure CMS Credentials Are Set

The dashboard uses the same environment variables as the CLI commands:
```bash
# Required for pushing types and styles
OPTIMIZELY_CLIENT_ID=your-client-id
OPTIMIZELY_CLIENT_SECRET=your-client-secret
OPTIMIZELY_CMS_URL=https://app-your-instance.cms.optimizely.com/
```

## Using the CMS Sync Manager

### Push Content Types

#### Bulk Push (All Types)
1. Click the "Push All Types" button
2. Watch the real-time logs in the terminal output
3. Monitor progress with the execution timer
4. Check the status indicator for success/failure

#### Individual Push (Single Type)
1. Select a type from the dropdown menu (organized by category)
2. Click the "Push" button
3. View live output as the type is synchronized
4. Review success/failure status

### Push Component Styles

#### Bulk Push (All Styles)
1. Click the "Push All Styles" button
2. View live output as styles are synchronized
3. Copy logs if needed for debugging
4. Review any errors in the color-coded output

#### Individual Push (Single Style)
1. Select a style from the dropdown menu (organized by category)
2. Click the "Push" button
3. Watch the synchronization progress
4. Check the result status

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
The CMS Sync Manager uses **HTTP Basic Authentication** for secure access.

#### HTTP Basic Authentication
- **Environment Variables**: `ADMIN_DASHBOARD_USERNAME` (default: "admin") and `ADMIN_DASHBOARD_PASSWORD`
- **User Experience**: Browser shows native login dialog
- **Security**: Standard HTTP Basic Auth with Base64 encoding
- **Compatibility**: Works on all hosting platforms (Vercel, Netlify, etc.)

### Authentication Flow
1. **If credentials not configured**: Returns 404 Not Found (hides admin dashboard existence)
2. **If credentials configured**:
   - User visits `/opti-admin/cms-sync`
   - Browser prompts for username/password
   - Credentials verified against environment variables
   - Access granted on successful authentication

## Technical Implementation

### Architecture
- **Frontend**: Astro page with vanilla JavaScript for interactivity
- **Backend**: Server-Sent Events (SSE) for real-time streaming
- **CMS Operations**: Direct API calls using `@remkoj/optimizely-cms-api` client (serverless compatible)
- **Authentication**: HTTP Basic Auth protection
- **Styling**: TailwindCSS for modern, responsive UI

### API Endpoints
- `/opti-admin/api/stream/push-types`: Streams output from bulk type synchronization
- `/opti-admin/api/stream/push-styles`: Streams output from bulk style synchronization
- `/opti-admin/api/stream/push-type?type=NAME`: Streams output from individual type push
- `/opti-admin/api/stream/push-style?style=NAME`: Streams output from individual style push
- `/opti-admin/api/list-types.json`: Returns available content types for dropdown
- `/opti-admin/api/list-styles.json`: Returns available styles for dropdown

### Serverless Compatibility
- **✅ Netlify/Vercel Compatible**: Uses direct API calls instead of child processes
- **No Dependencies on CLI Tools**: No yarn/npm commands executed at runtime
- **Optimizely CMS API**: Direct integration with `@remkoj/optimizely-cms-api`
- **Real-time Progress**: SSE streaming with progress callbacks

### Security
- HTTP Basic Authentication for production access
- Direct CMS API integration with proper credentials
- No shell access or arbitrary command execution
- Credentials stored in environment variables, never exposed to client

## Troubleshooting

### Dashboard Not Loading
- Verify server is running (`yarn dev`)
- Check that you're using the correct URL: `/opti-admin/cms-sync`
- Ensure authentication credentials are set in `.env`

### Commands Not Executing
- Verify CMS credentials in `.env` file:
  - `OPTIMIZELY_CLIENT_ID`
  - `OPTIMIZELY_CLIENT_SECRET`
  - `OPTIMIZELY_CMS_URL`
- Check that `yarn type:push` and `yarn style:push` work from terminal
- Review browser console for connection errors

### No Output in Terminal
- Check browser supports Server-Sent Events (all modern browsers do)
- Verify no proxy/firewall blocking SSE connections
- Look for errors in server logs (`yarn dev` output)
- Check browser DevTools Network tab for failed requests

### Authentication Issues
- Ensure both `ADMIN_DASHBOARD_USERNAME` and `ADMIN_DASHBOARD_PASSWORD` are set
- If not set, the dashboard will return 404 to hide its existence
- Verify browser prompts for username/password
- Check credentials match environment variables
- Try clearing browser cache/cookies
- Verify environment variables are properly loaded in your hosting platform

### Dropdowns Not Loading
- Check that `.opti-type.json` and `.opti-style.json` files exist in `src/cms/` subdirectories
- Verify the API endpoints are accessible: `/opti-admin/api/list-types.json` and `/opti-admin/api/list-styles.json`
- Review browser console for JavaScript errors

## Development Tips

### Testing Locally
```bash
# Start dev server
yarn dev

# Access CMS Sync Manager
open https://localhost:4321/opti-admin/cms-sync
```

### Monitoring Server Logs
The dashboard streams command output, but server errors appear in the terminal where you ran `yarn dev`.

### Testing Individual Operations
Use the dropdown menus to test individual type or style pushes. This is useful for:
- Debugging specific synchronization issues
- Updating a single component after changes
- Verifying property groups are created correctly

## Related Documentation

- **[Environment Variables Configuration](ENVIRONMENT-VARIABLES.md)** - Complete environment variable reference
- **[Graph Optimizations Guide](GRAPH-OPTIMIZATIONS.md)** - Synonyms and Pinned Results management

## CLI Equivalents

For users who prefer the command line, these are the equivalent commands:

```bash
# Push all content types (equivalent to "Push All Types")
yarn types:push

# Push a specific content type (equivalent to individual type push)
yarn type:push YourTypeName

# Push all styles (equivalent to "Push All Styles")
yarn styles:push

# Push a specific style (equivalent to individual style push)
yarn style:push YourStyleName
```

The CMS Sync Manager provides the same functionality with added benefits:
- Real-time visual progress
- No need for terminal access
- Easier for non-technical users
- Works on any device with a modern browser
