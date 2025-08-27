# A/B Testing and Content Personalization Guide

This guide shows you how to create different versions of your website content and test them with your visitors to see which performs better.

## What is A/B Testing?

A/B testing lets you show different versions of your content to different visitors to see which one works best. For example, you might test:

- Two different headlines on your homepage
- Different button colors or text
- Various product descriptions
- Alternative page layouts

## Quick Start

### 1. First-Time Setup

**Ask your developer** to add this setting to your website's configuration:

```
OPTIMIZELY_FX_SDK_KEY=your-sdk-key-from-optimizely
```

You'll get this key from your Optimizely Feature Experimentation project settings.

### 2. Create Your First A/B Test

#### Step A: Create Content Variants in Your CMS

1. **Create your original content** (like a homepage)
2. **Create alternative versions** of the same content
3. **Give each version a unique name** (like `variant_a`, `variant_b`)

**Example:**

- Original homepage: No special variation name
- Homepage Version A: `variant_a`
- Homepage Version B: `variant_b`

#### Step B: Set Up the Test in Optimizely

1. **Go to your Optimizely Feature Experimentation dashboard**
2. **Create a new feature flag**
3. **Name it using this format:** `cms_[CONTENT-GUID]` (lowercase cms + content GUID without dashes)

    **⚠️ Important:** Use the content's GUID (not the path). Find this in your CMS content metadata.
    
    - For content GUID `12345678-90ab-cdef-1234-567890abcdef`: `cms_1234567890abcdef1234567890abcdef`
    - For content GUID `abcd1234-5678-90ef-abcd-123456789012`: `cms_abcd123456789012abcd123456789012`

4. **Configure the flag:**

    - **Delete the default "On" variation**
    - **Add a String variable called "VariationKey"**
    - **Create variations matching your CMS variants:**
        - `control` (VariationKey: leave empty or "control")
        - `variant_a` (VariationKey: `variant_a`)
        - `variant_b` (VariationKey: `variant_b`)

5. **Create an experiment:**

    - Add all your variations to the experiment
    - Set traffic split (33% each for 3 variations)
    - Add any metrics you want to track

6. **Generate results** (optional):
    - Use the Results Generator at https://demo-builder.optidemo.com
    - This helps create demo data for testing

## How It Works

### Behind the Scenes

When someone visits your website:

1. **System loads default content** from your CMS
2. **Optimizely decides** which test version to show them
3. **If they're in a test variant,** the system loads that content instead
4. **Visitor sees their assigned version** consistently on future visits

### Visitor Experience

- **Visitors don't know they're in a test** - everything looks normal
- **Each person sees the same version** every time they visit
- **Different visitors see different versions** based on the test setup

## Content Management

### Creating Test Content

#### In Your CMS:

1. **Create your main content first**

    - Example: Create your homepage with path `/homepage`

2. **Create variations of the same content**

    - Copy your original content
    - Make your changes (different headline, button, etc.)
    - **Important:** Use the exact same path (`/homepage`)
    - Set the variation field to your test name (`variant_a`)

3. **Repeat for each test version**
    - Create `variant_b`, `variant_c`, etc.

#### Naming Your Tests

**Content GUID** → **Feature Flag Name** (Important: lowercase cms + lowercase GUID without dashes)

**⚠️ Critical:** Use the content's GUID from CMS metadata, NOT the content path.

**How to find your content GUID:**
1. Go to your CMS content item
2. Look at the content metadata/properties 
3. Find the GUID (usually looks like: `12345678-90ab-cdef-1234-567890abcdef`)
4. Remove dashes and keep lowercase
5. Add `cms_` prefix

**Examples:**
- Content GUID `12345678-90ab-cdef-1234-567890abcdef` → `cms_1234567890abcdef1234567890abcdef`
- Content GUID `abcd1234-5678-90ef-abcd-123456789012` → `cms_abcd123456789012abcd123456789012`

**⚠️ Critical:** The flag name must exactly match this format or your tests won't work.

## Running Tests

### Setting Up in Optimizely

1. **Create Feature Flag**

    - Use the naming pattern: `cms_[CONTENT-GUID]` (lowercase cms + lowercase content GUID without dashes)
    - Enable the flag

2. **Configure Flag Variables**

    - **Delete the default "On" variation**
    - **Add one String variable called "VariationKey"**

3. **Add Variations** (⚠️ VariationKey must match CMS variation names exactly)

    - `control` (VariationKey: empty or "control" - shows original content)
    - `variant_a` (VariationKey: `variant_a` - shows first test version)
    - `variant_b` (VariationKey: `variant_b` - shows second test version)

4. **Create Experiment**

    - Add all variations to a new experiment
    - Configure traffic splits (33% each for 3 variations)
    - Add metrics you want to track (clicks, conversions, etc.)

5. **Optional: Generate Demo Results**

    - Visit https://demo-builder.optidemo.com
    - Use their Results Generator for your experiment
    - This creates demo data for testing and presentations

6. **Launch Experiment**
    - Start your experiment
    - Monitor results in real-time

### Testing Your Setup

**Enable Debug Mode** (ask your developer):

```
OPTIMIZELY_DEV_MODE=true
```

**Check Your Setup:**

1. Visit your website
2. Look for the "Optimizely Feature Experimentation" panel at the bottom
3. Verify:
    - ✅ SDK Status shows "Enabled"
    - ✅ Your flag appears in "Available Flags"
    - ✅ Decision shows the correct variation
    - ✅ Content shows the right version

## Monitoring Your Tests

### What to Watch

**In Optimizely Dashboard:**

- **Traffic allocation** - Are visitors being split correctly?
- **Conversion rates** - Which version performs better?
- **Statistical significance** - Is the difference meaningful?

**In Debug Panel** (when enabled):

- **SDK Status** - Is the connection working?
- **User assignments** - Are visitors getting consistent experiences?
- **Content delivery** - Is the right content being served?

### Key Metrics

- **Conversion Rate:** Percentage of visitors who complete your goal
- **Statistical Significance:** Confidence that results aren't due to chance
- **Sample Size:** Number of visitors in each variation

## Common Use Cases

### Homepage Testing

Test different value propositions, headlines, or calls-to-action on your main page.

**Setup:**

- Content GUID: `12345678-90ab-cdef-1234-567890abcdef` (from CMS metadata)
- Flag: `cms_1234567890abcdef1234567890abcdef`
- VariationKey values: `control`, `variant_a`, `variant_b`
- Test: Different headlines and hero images

### Product Page Optimization

Try different product descriptions, images, or pricing presentations.

**Setup:**

- Content GUID: `abcd1234-5678-90ef-abcd-123456789012` (from CMS metadata)
- Flag: `cms_abcd123456789012abcd123456789012`
- VariationKey values: `control`, `variant_a`, `variant_b`
- Test: Various product descriptions

### Landing Page Variants

Test different approaches for campaign landing pages.

**Setup:**

- Content GUID: `fedcba98-7654-3210-fedc-ba9876543210` (from CMS metadata)
- Flag: `cms_fedcba9876543210fedcba9876543210`
- VariationKey values: `control`, `variant_a`, `variant_b`
- Test: Different promotional offers

## Troubleshooting

### "My test isn't working"

**Check these first:**

1. **SDK Key:** Is `OPTIMIZELY_FX_SDK_KEY` set correctly in your configuration?
2. **Flag Name:** Does it match the `cms_[CONTENT-GUID]` pattern (lowercase cms + lowercase GUID without dashes)?
3. **VariationKey Variable:** Did you add the String variable called "VariationKey"?
4. **VariationKey Values:** Do the values match your CMS variation names exactly (case-sensitive)?
5. **Default "On" Variation:** Did you delete it?
6. **Content Exists:** Are all your content variants published in the CMS?
7. **Flag Active:** Is your Optimizely flag turned on and experiment running?

### "Visitors see inconsistent content"

**Possible causes:**

- **Cookie issues:** Visitors' browsers might be blocking cookies
- **Cache problems:** Content might be cached incorrectly
- **Targeting rules:** Your audience rules might be conflicting

### "Debug panel shows errors"

**Common error messages:**

- **"SDK Status: Disabled"** → Check your `OPTIMIZELY_FX_SDK_KEY` setting
- **"Flag not found"** → Verify flag name matches `cms_[CONTENT-GUID]` pattern (lowercase cms + lowercase GUID without dashes)
- **"Variant content not found"** → Ensure variant content is published in CMS
- **"VariationKey variable missing"** → Add String variable "VariationKey" to your flag
- **"Variation values don't match"** → Check VariationKey values match CMS variation names exactly

### Getting Help

**Check the debug panel first:**

1. Enable debug mode
2. Look at the "Errors" section
3. Check SDK, User, and Content sections for issues

**Contact support with:**

- Screenshot of debug panel
- Description of expected vs actual behavior
- Steps you've tried to fix it

## Best Practices

### Content Strategy

- **Plan your variants** before creating content
- **Make meaningful differences** between versions
- **Keep fallback content** available (your original version)

### Test Management

- **Run one test at a time** per page to avoid conflicts
- **Let tests run long enough** for statistical significance
- **Document your hypotheses** and results

### Performance Tips

- **Start with small traffic** (10-20%) then increase
- **Monitor site performance** during tests
- **Clean up old tests** regularly

## Example Walkthrough

### Testing a Product Page

**Goal:** Increase "Add to Cart" clicks

**Step 1: Create Content**

- Original: Current product page (GUID: `98765432-10fe-dcba-9876-543210fedcba`)
- Variant A: Larger product images (variation: `variant_a`)
- Variant B: Different button color (variation: `variant_b`)

**Step 2: Set Up Test**

- Find content GUID in CMS: `98765432-10fe-dcba-9876-543210fedcba`
- Optimizely flag: `cms_9876543210fedcba9876543210fedcba`
- Add String variable: `VariationKey`
- Delete default "On" variation
- Create variations:
    - `control` (VariationKey: empty or "control")
    - `variant_a` (VariationKey: `variant_a`)
    - `variant_b` (VariationKey: `variant_b`)
- Create experiment with 33% traffic each
- Add "Add to Cart" conversion metrics
- Optional: Generate demo results at https://demo-builder.optidemo.com

**Step 3: Monitor**

- Track "Add to Cart" conversion rates
- Let run for 2-4 weeks minimum
- Analyze results when statistically significant

**Step 4: Implement Winner**

- Stop the test
- Make the winning version your new default
- Archive the test content

This approach helps you make data-driven decisions about your website content and continuously improve your visitor experience.
