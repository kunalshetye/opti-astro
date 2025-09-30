# Environment Variables Configuration

This document provides a comprehensive guide to all environment variables used in the Opti-Astro project.

## 📋 Required Environment Variables

These variables are **required** for the application to function properly:

### Optimizely Graph Configuration

```bash
# GraphQL endpoint for Optimizely Graph
OPTIMIZELY_GRAPH_GATEWAY=https://cg.optimizely.com/content/v2

# Single key for authentication (public access)
OPTIMIZELY_GRAPH_SINGLE_KEY=your_single_key_here

# Application key (public access)
OPTIMIZELY_GRAPH_APP_KEY=your_app_key_here

# Secret key for server-side operations (keep secure!)
OPTIMIZELY_GRAPH_SECRET=your_secret_key_here
```

## 🔧 Optional Environment Variables

These variables have default values but can be customized as needed:

### Performance & Features

```bash
# Enable/disable Astro view transitions site-wide
# Default: true
ASTRO_TRANSITIONS_ENABLED=true

# Development mode for Optimizely features
# Default: false
OPTIMIZELY_DEV_MODE=false

# Delay for preview functionality (in milliseconds)
# Default: 0
PREVIEW_DELAY=1000

# Enable/disable Optimizely Forms functionality
# Default: false
OPTIMIZELY_FORMS_ENABLED=false
```

### Preview & External Access

```bash
# Enable external preview functionality
# Default: false
EXTERNAL_PREVIEW_ENABLED=true

# Token for external preview authentication (keep secure!)
# Only required if EXTERNAL_PREVIEW_ENABLED=true
EXTERNAL_PREVIEW_TOKEN=your_preview_token_here

# CMS URL for client-side operations (optional)
OPTIMIZELY_CMS_URL=https://cms.optimizely.com
```

### Admin Dashboard Authentication

```bash
## HTTP Basic Authentication credentials for /admin route
## If not configured, the admin dashboard will return 404

# Admin username for HTTP Basic Authentication (default: admin)
# Only required if using admin dashboard
ADMIN_DASHBOARD_USERNAME=your-admin-username-here

# Admin password for HTTP Basic Authentication (keep secure!)
# Only required if using admin dashboard
ADMIN_DASHBOARD_PASSWORD=your-secure-password-here
```

## 🏗️ Environment Setup

### 1. Create .env File
Create a `.env` file in your project root:

```bash
# Copy from .env.example if available
cp .env.example .env
```

### 2. Obtain Optimizely Credentials
1. Log into your Optimizely CMS
2. Navigate to Settings → API Keys
3. Generate or copy your GraphQL credentials:
   - **Gateway URL**: Usually `https://cg.optimizely.com/content/v2`
   - **Single Key**: For public client operations
   - **App Key**: Application identifier
   - **Secret**: For server-side operations

### 3. Configure Preview (Optional)
If you need external preview functionality:
1. Enable external previews in your CMS
2. Set `EXTERNAL_PREVIEW_ENABLED=true`
3. Provide a secure `EXTERNAL_PREVIEW_TOKEN`

## 📚 Variable Details

### OPTIMIZELY_GRAPH_GATEWAY
- **Type**: String (URL)
- **Access**: Public (client-side)
- **Purpose**: GraphQL endpoint for content queries
- **Example**: `https://cg.optimizely.com/content/v2`

### OPTIMIZELY_GRAPH_SINGLE_KEY
- **Type**: String
- **Access**: Public (client-side)
- **Purpose**: Authentication for client-side GraphQL requests
- **Security**: Safe to expose to browsers

### OPTIMIZELY_GRAPH_APP_KEY
- **Type**: String
- **Access**: Public (client-side)  
- **Purpose**: Application identifier for Optimizely services
- **Security**: Safe to expose to browsers

### OPTIMIZELY_GRAPH_SECRET
- **Type**: String
- **Access**: Secret (server-side only)
- **Purpose**: Server-side authentication for sensitive operations
- **Security**: ⚠️ **Never expose to client-side code!**

### ASTRO_TRANSITIONS_ENABLED
- **Type**: Boolean
- **Access**: Public (client-side)
- **Default**: `true`
- **Purpose**: Enable/disable Astro view transitions globally
- **Use Cases**:
  - Disable for accessibility requirements
  - Disable for performance on low-end devices
  - Disable for sites where transitions interfere with custom animations

### OPTIMIZELY_FORMS_ENABLED
- **Type**: Boolean
- **Access**: Public (client-side)
- **Default**: `false`
- **Purpose**: Enable/disable Optimizely Forms functionality in the application
- **Use Cases**:
  - Enable to render and process Optimizely Forms components
  - Disable to hide form functionality when not needed
  - Control form feature availability per environment

### EXTERNAL_PREVIEW_ENABLED
- **Type**: Boolean
- **Access**: Public (server-side)
- **Default**: `false`
- **Purpose**: Enable external preview functionality for content editors
- **Requirements**: Must also set `EXTERNAL_PREVIEW_TOKEN`

### EXTERNAL_PREVIEW_TOKEN
- **Type**: String
- **Access**: Secret (server-side only)
- **Purpose**: Authentication token for external preview access
- **Security**: ⚠️ **Keep this secure!**

### OPTIMIZELY_DATA_PLATFORM_ENDPOINT
- **Type**: String (URL)
- **Access**: Secret (server-side only)
- **Purpose**: ODP endpoint
- **Example**: `https://api.zaius.com`

### OPTIMIZELY_DATA_PLATFORM_PRIVATE_KEY
- **Type**: String
- **Access**: Secret (server-side only)
- **Purpose**: Private key for Optimizely Data Platform
- **Security**: ⚠️ **Keep this secure!**

### OPTIMIZELY_FX_SDK_KEY
- **Type**: String
- **Access**: Public (client-side)
- **Purpose**: SDK key for Optimizely Feature Experimentation
- **Use Cases**:
  - Enable A/B testing for content variants
  - Serve personalized content based on user segments
  - Track experiment metrics and conversions
- **Note**: When configured, the system will automatically fetch variant content from CMS based on FX SDK decisions

### ADMIN_DASHBOARD_USERNAME
- **Type**: String
- **Access**: Secret (server-side only)
- **Default**: `admin`
- **Purpose**: Username for HTTP Basic Authentication to admin dashboard
- **Security**: ⚠️ **Keep this secure!**
- **Note**: If not configured along with password, admin dashboard returns 404

### ADMIN_DASHBOARD_PASSWORD
- **Type**: String
- **Access**: Secret (server-side only)
- **Purpose**: Password for HTTP Basic Authentication to admin dashboard
- **Security**: ⚠️ **Keep this secure!**
- **Requirement**: Both username and password must be set for admin dashboard to be accessible
- **Usage**: Enables Basic Auth protection for /admin route and all admin APIs
- **Note**: If not configured, admin dashboard returns 404 to hide its existence


## 🚀 Development vs Production

### Development (.env)
```bash
OPTIMIZELY_DEV_MODE=true
ASTRO_TRANSITIONS_ENABLED=true
EXTERNAL_PREVIEW_ENABLED=true
PREVIEW_DELAY=500
OPTIMIZELY_FORMS_ENABLED=true
```

### Production
```bash
OPTIMIZELY_DEV_MODE=false
ASTRO_TRANSITIONS_ENABLED=true
EXTERNAL_PREVIEW_ENABLED=false
PREVIEW_DELAY=0
OPTIMIZELY_FORMS_ENABLED=false
```

## 🔍 Testing Configuration

### Verify Environment Setup
```javascript
// Check in browser console (development only)
console.log('Gateway:', import.meta.env.PUBLIC_OPTIMIZELY_GRAPH_GATEWAY);
console.log('Transitions:', import.meta.env.PUBLIC_ASTRO_TRANSITIONS_ENABLED);

// Server-side verification (add to any .astro file temporarily)
console.log('Secret available:', !!process.env.OPTIMIZELY_GRAPH_SECRET);
```

### Common Issues

#### ❌ "GraphQL endpoint not responding"
- Verify `OPTIMIZELY_GRAPH_GATEWAY` URL
- Check if your IP is allowlisted in Optimizely settings
- Ensure keys have proper permissions

#### ❌ "Unauthorized GraphQL requests"
- Verify `OPTIMIZELY_GRAPH_SINGLE_KEY` is correct
- Ensure `OPTIMIZELY_GRAPH_APP_KEY` matches your CMS configuration
- Check that keys haven't expired

#### ❌ "View transitions not working"
- Check `ASTRO_TRANSITIONS_ENABLED=true`
- Verify the environment variable is properly loaded
- Clear browser cache and rebuild the project

#### ❌ "External preview not working"
- Set `EXTERNAL_PREVIEW_ENABLED=true`
- Provide valid `EXTERNAL_PREVIEW_TOKEN`
- Check that the token matches your CMS configuration

## 🔒 Security Best Practices

### Environment Variable Security
1. **Never commit `.env` files** to version control
2. **Use different credentials** for development/staging/production
3. **Rotate secrets regularly**, especially `OPTIMIZELY_GRAPH_SECRET`
4. **Restrict API key permissions** to minimum required scope
5. **Monitor usage** of your API keys in Optimizely dashboard

### Production Deployment
1. Set environment variables through your hosting platform (not `.env` files)
2. Use secure secret management services for production
3. Enable IP restrictions where possible
4. Set up monitoring for unusual API usage

## 📖 Additional Resources

- [Optimizely Graph API Documentation](https://docs.developers.optimizely.com/content-graph/v1.0.0-content-graph/)
- [Astro Environment Variables Guide](https://docs.astro.build/en/guides/environment-variables/)
- [Astro View Transitions Documentation](https://docs.astro.build/en/guides/view-transitions/)

---

*Keep this documentation updated when adding new environment variables to the project.*