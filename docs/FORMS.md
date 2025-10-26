# Forms Guide

This guide covers how to create, configure, and use Optimizely Forms in your Astro project, including integration with Optimizely Data Platform (ODP).

## 📋 Table of Contents

- [Overview](#overview)
- [Form Types](#form-types)
- [Creating Forms](#creating-forms)
- [Form Field Components](#form-field-components)
- [ODP Integration](#odp-integration)
- [Testing & Verification](#testing--verification)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)
- [Advanced Configuration](#advanced-configuration)
- [File Reference](#file-reference)

## Overview

This project supports two approaches to forms:

1. **Optimizely Forms** - Native forms built with the CMS Visual Builder
2. **ODP Forms** - Forms created in ODP and rendered via selector injection

Both form types integrate seamlessly with the Astro SSR architecture and support flexible submission endpoints.

## Form Types

### 1. Optimizely Forms (Built-in)

Native Optimizely Forms created in the CMS with the Visual Builder.

**Key Features:**
- Visual form builder in CMS
- Drag-and-drop field configuration
- Built-in validation
- Automatic ODP tracking (when configured)
- Custom submit handlers
- Multi-step form support

**Location:** `src/cms/forms/base/OptiFormsContainerDataComponent/OptiForm.astro`

**When to use:**
- Need full control over form design
- Want to match site styling
- Require custom validation logic
- Building multi-step forms
- Need complex form layouts

### 2. ODP Forms (Hosted)

Forms created in ODP's form builder and rendered via selector injection.

**Key Features:**
- Created in ODP dashboard
- Rendered dynamically by ODP script
- Pre-styled by ODP
- Direct ODP integration
- Quick deployment

**Location:** `src/cms/components/OdpFormComponent/OdpForm.astro`

**When to use:**
- Want ODP-managed styling
- Need quick form deployment
- Prefer ODP form builder interface
- Already have forms in ODP

## Creating Forms

### Option A: Create Optimizely Form in CMS

1. **Create Form Content Type** (if not exists):
   - Navigate to **Content Types** in CMS
   - Create new **Form** content type
   - Add fields: Title, Description, Submit URL, etc.

2. **Build Form in Visual Builder**:
   - Open a page in Visual Builder
   - Add **Form** component
   - Configure form properties:
     - **Title**: Form display title
     - **Description**: Optional description text
     - **Submit URL**: Your endpoint (e.g., webhook, ODP endpoint)
     - **Submit Confirmation Message**: Success message text
     - **Reset Confirmation Message**: Confirmation text for reset action

3. **Add Form Fields**:
   - Drag field components into form (Textbox, Email, Textarea, etc.)
   - Configure field properties:
     - Label
     - Placeholder
     - Validation rules
     - Required flag

4. **Add Submit Button**:
   - Add **Submit Button** element
   - Configure button text and styling

5. **Optional: Add Reset Button**:
   - Add **Reset Button** element
   - Confirmation modal will show before resetting

### Option B: Create ODP Form Component

1. **Create Form in ODP**:
   - Log into ODP dashboard
   - Navigate to **Forms**
   - Create new form with desired fields
   - Note the form selector (ID or class)

2. **Add to CMS**:
   - Open page in Visual Builder
   - Add **ODP Form** component
   - Configure:
     - **Selector Type**: `id` or `class`
     - **Selector Name**: The selector from ODP

## Form Field Components

All form field components are located in `src/cms/forms/`:

### Available Field Types

| Component | Purpose | Input Type |
|-----------|---------|------------|
| **OptiFormsTextboxElementComponent** | Single-line text input | Text |
| **OptiFormsTextareaElementComponent** | Multi-line text input | Textarea |
| **OptiFormsChoiceElementComponent** | Radio buttons or checkboxes | Radio/Checkbox |
| **OptiFormsSelectionElementComponent** | Dropdown selection | Select |
| **OptiFormsNumberElementComponent** | Number input | Number |
| **OptiFormsRangeElementComponent** | Range slider | Range |
| **OptiFormsUrlElementComponent** | URL input with validation | URL |
| **OptiFormsSubmitElementComponent** | Form submission button | Button |
| **OptiFormsResetElementComponent** | Form reset button | Button |

### Form Field Configuration

Each field component supports:
- **Label**: Display text for the field
- **Placeholder**: Hint text in the input
- **Required**: Make field mandatory
- **Validation**: Built-in validation rules
- **Help Text**: Additional guidance for users

### Multi-step Forms

Forms can be organized with multiple steps:

1. Create form with **step** nodes in Visual Builder
2. Each step contains **rows** → **columns** → **fields**
3. Navigation between steps can be customized
4. Track step progression with events (when ODP is configured)

## ODP Integration

### Overview

Integrate forms with Optimizely Data Platform (ODP) for customer data collection and tracking.

**Capabilities:**
- Track form impressions automatically when forms load
- Submit form data to ODP for customer profile enrichment
- Capture user identifiers (VUID and email) for tracking
- Monitor form interactions in ODP for segmentation and personalization

### Architecture

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│   Browser   │ ───▶  │ Astro Server │ ───▶  │     ODP     │
│  (Form UI)  │       │  (Transform) │       │  (Events)   │
└─────────────┘       └──────────────┘       └─────────────┘
     ▲                       │
     │                       │
     └───── ODP Script ──────┘
         (Tracking)
```

### Prerequisites

Add these to your `.env` file:

```bash
# ODP Configuration (Required for ODP integration)
OPTIMIZELY_DATA_PLATFORM_ENDPOINT=https://api.zaius.com
OPTIMIZELY_DATA_PLATFORM_PRIVATE_KEY=YOUR-PRIVATE-KEY-HERE

# Forms Configuration (Optional)
OPTIMIZELY_FORMS_ENABLED=true
```

**Where to find your ODP Private Key:**
1. Log into your Optimizely Data Platform account
2. Navigate to **Account Settings → API Management**
3. Copy your **Private API Key** (format: `public_key.private_key`)

For more details, see [Environment Variables Configuration](ENVIRONMENT-VARIABLES.md).

### ODP Tracking Script

The ODP tracking script is automatically included when you set the `OPTIMIZELY_DATA_PLATFORM_PRIVATE_KEY` environment variable.

**What it does:**
- Initializes the `zaius` tracking object globally
- Tracks pageviews automatically
- Provides form tracking capabilities
- Works with Astro view transitions

**Implementation:** `src/cms/shared/DataPlatform/DataPlatform.astro`

### Public vs Private Keys

The system automatically extracts the public key from your private key:

```typescript
// Private key format: public_key.private_key_portion
const odpPrivateKey = "abc123.xyz789";
const odpPublicKey = odpPrivateKey.split('.')[0]; // "abc123"
```

- **Public Key**: Used for client-side tracking script initialization
- **Private Key**: Used for server-side API authentication (form submissions)

### Form Submission to ODP

When a form is submitted with an ODP submit URL:

1. **User submits form** in browser
2. **Astro action** captures form data (`src/actions/index.ts`)
3. **System detects ODP submission** by comparing submit URL
4. **VUID extracted** from cookies for user identification
5. **Data transformed** to ODP Events API format
6. **Request sent** to ODP with authentication
7. **Response returned** to user

#### Data Transformation

Form data is automatically transformed into ODP's event format:

```javascript
{
  type: "web_form",
  action: "submission",
  data: {
    form_name: "Contact Form",
    campaign: "Form Submission: Contact Form",
    email: "user@example.com",
    firstname: "John",
    lastname: "Doe",
    // ... all other form fields
  },
  identifiers: {
    vuid: "abc123xyz789",  // From cookie
    email: "user@example.com"  // From form field
  }
}
```

**Code Reference:** `src/actions/index.ts:33-57`

#### Authentication

ODP API requests use HTTP Basic Authentication:

```javascript
// Private key used as username, password is empty
const basicAuth = Buffer.from(`${odpPrivateKey}:`).toString('base64');
headers['Authorization'] = `Basic ${basicAuth}`;
headers['x-api-key'] = odpPublicKey;
```

**Code Reference:** `src/actions/index.ts:70-74`

#### Field Naming Conventions

- Form fields are automatically lowercased for consistency
- Hidden field `formTitle` captures form name
- Field `email` is used for user identification
- All other fields passed as-is to ODP

### Event Tracking

#### Events Tracked Automatically

| Event Type | Action | When Triggered | Location |
|------------|--------|----------------|----------|
| **web_form** | impression | Form loads on page | `OptiForm.astro:201-221` |
| **web_form** | submission | User submits form | `actions/index.ts:47-56` |
| **pageview** | - | Page loads/navigates | `DataPlatform.astro:22-36` |

#### Form Impression Tracking

Automatically tracks when forms are displayed:

```javascript
zaius.event('web_form', {
  action: 'impression',
  form_name: 'Contact Form',
  campaign: 'Form Impression: Contact Form'
});
```

**Triggered:**
- On initial page load
- On Astro view transition navigation
- Skipped in CMS edit mode

**Code Reference:** `src/cms/forms/base/OptiFormsContainerDataComponent/OptiForm.astro:201-221`

#### Form Submission Tracking

Automatically tracked when form is submitted to ODP:

```javascript
zaius.event('web_form', {
  action: 'submission',
  form_name: 'Contact Form',
  campaign: 'Form Submission: Contact Form',
  // ... form field data
});
```

**Code Reference:** `src/actions/index.ts:46-56`

#### Pageview Tracking

Every page view is tracked for user journey analysis:

```javascript
zaius.event('pageview');
```

**Features:**
- Tracks initial page load
- Tracks Astro view transitions
- Skipped in CMS edit mode

**Code Reference:** `src/cms/shared/DataPlatform/DataPlatform.astro:22-36`

## Testing & Verification

### 1. Test Form Display

1. Navigate to a page with a form
2. Verify form renders correctly
3. Check all fields are accessible
4. Test responsive behavior

### 2. Test Form Validation

1. Try submitting empty required fields
2. Test field-specific validation (email format, number ranges)
3. Verify error messages display correctly

### 3. Test Form Submission

1. Fill out form with valid data
2. Submit form
3. Verify success message displays
4. Check network request in DevTools

### 4. Verify ODP Script Loads (if ODP enabled)

Open browser console and check:

```javascript
// Should return the zaius object
console.log(window.zaius);

// Should show initialized methods
console.log(typeof window.zaius.event); // "function"
```

### 5. Monitor Network Requests (if ODP enabled)

1. Open browser **Developer Tools → Network**
2. Filter by **XHR** or **Fetch**
3. Submit a form
4. Look for POST request to `/v3/events`
5. Verify request payload:
   ```json
   {
     "type": "web_form",
     "action": "submission",
     "data": { ... },
     "identifiers": { ... }
   }
   ```

### 6. Check ODP Dashboard (if ODP enabled)

1. Log into ODP
2. Navigate to **Events → Real-time Events**
3. Look for `web_form` events
4. Verify event data contains form fields
5. Check customer profiles are updated

### 7. Test VUID Tracking (if ODP enabled)

1. Open browser **Developer Tools → Application → Cookies**
2. Look for `vuid` cookie
3. Submit a form
4. Verify VUID is included in event identifiers

## Troubleshooting

### Form Not Displaying

**Symptoms:**
- Form component doesn't render
- Blank space where form should be

**Solutions:**
1. ✅ Check form is published in CMS
2. ✅ Verify form content type exists
3. ✅ Check console for JavaScript errors
4. ✅ Ensure form has at least one field

---

### Form Validation Not Working

**Symptoms:**
- Required fields can be skipped
- Invalid data accepted

**Solutions:**
1. ✅ Check field has `required` attribute set
2. ✅ Verify validation rules are configured
3. ✅ Ensure HTML5 validation is not disabled
4. ✅ Check for JavaScript errors in console

---

### Form Submission Fails

**Symptoms:**
- Form submits but shows error
- Network request fails
- No response received

**Solutions:**
1. ✅ Verify submit URL is correct and accessible
2. ✅ Check CORS settings on endpoint
3. ✅ Ensure endpoint accepts POST requests
4. ✅ Verify authentication if required
5. ✅ Check server logs for errors

**Debug code reference:** `src/actions/index.ts:82-93`

---

### ODP Script Not Loading

**Symptoms:**
- `window.zaius` is undefined
- No tracking events fired
- Console error: "zaius is not defined"

**Solutions:**
1. ✅ Verify `OPTIMIZELY_DATA_PLATFORM_PRIVATE_KEY` is set
2. ✅ Check `DataPlatform.astro` is included in layout
3. ✅ Ensure you're not in CMS edit mode
4. ✅ Clear browser cache and reload

**Code to check:** `src/layouts/Layout.astro`

---

### Form Submissions Not Reaching ODP

**Symptoms:**
- Form submits but no data in ODP
- Console shows errors
- Network request fails

**Solutions:**
1. ✅ Verify `OPTIMIZELY_DATA_PLATFORM_ENDPOINT` is set correctly
2. ✅ Check private key format: `public.private`
3. ✅ Ensure submit URL matches ODP endpoint
4. ✅ Check ODP API key permissions
5. ✅ Look for CORS errors in console

**Debug steps:**
```bash
# Check environment variables
echo $OPTIMIZELY_DATA_PLATFORM_PRIVATE_KEY

# Test ODP API directly
curl -X POST https://api.zaius.com/v3/events \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_PUBLIC_KEY" \
  -u "YOUR_PRIVATE_KEY:" \
  -d '{"type":"web_form","action":"test","data":{},"identifiers":{}}'
```

---

### VUID Not Captured

**Symptoms:**
- Form submissions missing `vuid` identifier
- Can't track anonymous users

**Solutions:**
1. ✅ Ensure ODP script loads before form submission
2. ✅ Check that `vuid` cookie is set (DevTools → Cookies)
3. ✅ Verify cookie domain matches site domain
4. ✅ Check browser isn't blocking third-party cookies

**Code Reference:** `src/actions/index.ts:128-129`

---

### Form Impressions Not Tracking

**Symptoms:**
- Forms display but no impression events
- ODP shows zero form impressions

**Solutions:**
1. ✅ Check `OPTIMIZELY_DATA_PLATFORM_PRIVATE_KEY` environment variable
2. ✅ Verify form has a title (used for `form_name`)
3. ✅ Ensure not in CMS edit mode
4. ✅ Check browser console for errors

**Code Reference:** `src/cms/forms/base/OptiFormsContainerDataComponent/OptiForm.astro:201-221`

---

### ODP Form Component Shows Warning

**Symptoms:**
- Yellow warning box displays: "ODP Form Configuration Required"

**Solutions:**
1. ✅ Set **Selector Type** (id or class) in CMS
2. ✅ Set **Selector Name** matching ODP form
3. ✅ Verify ODP form exists with that selector
4. ✅ Publish changes in CMS

**Code Reference:** `src/cms/components/OdpFormComponent/OdpForm.astro:44-55`

---

### Authentication Errors (401/403)

**Symptoms:**
- API returns 401 Unauthorized or 403 Forbidden
- Form submission fails with auth error

**Solutions:**
1. ✅ Verify private key is correct and active
2. ✅ Check key hasn't expired
3. ✅ Ensure proper key format: `public.private`
4. ✅ Verify API key has proper permissions in ODP
5. ✅ Try regenerating API key in ODP dashboard

---

## Best Practices

### Form Design

1. **Keep forms simple** - Only ask for necessary information
2. **Use clear labels** - Make field purpose obvious
3. **Provide helpful placeholders** - Show format examples
4. **Group related fields** - Use rows and columns effectively
5. **Show validation feedback** - Help users fix errors quickly

### Security

1. **Never expose private keys** to client-side code
   - Private key only used server-side in actions
   - Public key automatically extracted for client

2. **Validate form data** before submission
   - Add server-side validation in `src/actions/index.ts`
   - Use Zod schemas for type safety
   - Sanitize user inputs

3. **Protect sensitive fields**
   - Don't send passwords or credit cards to ODP
   - Use HTTPS for all form submissions
   - Consider PII regulations (GDPR, CCPA)

### Performance

1. **Lazy load scripts** when possible
2. **Minimize form impression tracking** on high-traffic pages
3. **Batch events** for multi-step forms
4. **Use async/await** for non-blocking submissions
5. **Optimize form field count** - Less is more

### User Experience

1. **Show clear confirmation messages** after submission
2. **Provide error feedback** when submission fails
3. **Add loading states** during submission
4. **Preserve form data** on errors
5. **Make forms accessible** (ARIA labels, keyboard navigation)
6. **Test on mobile devices** - Ensure touch-friendly inputs

### Content Management

1. **Use consistent form naming** for easier tracking
2. **Document custom fields** in form descriptions
3. **Test forms** in staging before production
4. **Monitor form performance** in analytics
5. **Review form submissions regularly** for quality

## Advanced Configuration

### Custom Event Data (ODP)

Add custom fields to form events by modifying the transform function:

```typescript
// src/actions/index.ts
function transformFormDataForOdpEvent(formData: FormData, vuid?: string | null): object {
  const allFields = formDataToObjectWithLowercaseKeys(formData);

  return {
    type: "web_form",
    action: "submission",
    data: {
      form_name: allFields.formtitle,
      campaign: "Form Submission: " + allFields.formtitle,

      // Add custom fields here
      source: "website",
      language: Astro.currentLocale,
      url: Astro.url.pathname,

      ...allFields,
    },
    identifiers: { vuid, email: allFields.email }
  };
}
```

### Non-ODP Form Submissions

Forms can submit to any endpoint (webhooks, third-party services):

1. Set **Submit URL** to your endpoint
2. System automatically detects non-ODP submissions
3. Form data sent as plain object (not transformed)

**Code Reference:** `src/actions/index.ts:131-133`

### Custom Form Handlers

Add custom form submission logic:

```typescript
// src/actions/index.ts
export const server = {
  submitForm: defineAction({
    accept: "form",
    handler: async (formSubmission, { cookies }) => {
      // Add custom logic here
      // Example: Send to multiple endpoints
      // Example: Add custom validation
      // Example: Transform data differently

      const webhookUrl = formSubmission.get('formSubmitUrl') as string;
      // ... existing logic
    }
  })
}
```

### Custom Validation

Add Zod validation schemas:

```typescript
// src/actions/index.ts
import { z } from "astro:schema";

export const server = {
  submitForm: defineAction({
    accept: "form",
    input: z.object({
      email: z
        .string({ message: "Email is required." })
        .email("Invalid email format."),
      name: z.string().min(2, "Name must be at least 2 characters."),
    }),
    handler: async (formSubmission, { cookies }) => {
      // Validated data is available here
    }
  })
}
```

## File Reference

### Key Files

| File | Purpose | Type |
|------|---------|------|
| `src/cms/forms/base/OptiFormsContainerDataComponent/OptiForm.astro` | Main form component | Component |
| `src/cms/components/OdpFormComponent/OdpForm.astro` | ODP hosted form component | Component |
| `src/cms/shared/DataPlatform/DataPlatform.astro` | ODP script initialization | Component |
| `src/actions/index.ts` | Form submission handler | Server Action |
| `src/cms/forms/_FormComponents.astro` | Form field renderer | Component |

### Form Field Components

Located in `src/cms/forms/`:
- `OptiFormsTextboxElementComponent/` - Text input
- `OptiFormsTextareaElementComponent/` - Multi-line text
- `OptiFormsChoiceElementComponent/` - Radio/checkbox
- `OptiFormsSelectionElementComponent/` - Dropdown
- `OptiFormsNumberElementComponent/` - Number input
- `OptiFormsRangeElementComponent/` - Range slider
- `OptiFormsSubmitElementComponent/` - Submit button
- `OptiFormsResetElementComponent/` - Reset button
- `OptiFormsUrlElementComponent/` - URL input

## Additional Resources

- [Optimizely Forms Documentation](https://docs.developers.optimizely.com/optimizely-connect-platform/docs/ocpcoreconcepts-forms)
- [Optimizely Data Platform Documentation](https://docs.developers.optimizely.com/optimizely-data-platform/)
- [ODP Events API Reference](https://docs.developers.optimizely.com/optimizely-data-platform/reference/events-api/)
- [Astro Actions Documentation](https://docs.astro.build/en/guides/actions/)
- [Environment Variables Guide](ENVIRONMENT-VARIABLES.md)

---

*Last updated: October 2024*
