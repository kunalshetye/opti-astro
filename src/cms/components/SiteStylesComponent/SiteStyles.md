# Usage Notes

Styles can be entered in several different ways.

## Using the properties

### Colors
Colors can be entered in a variety of ways:
- Color name: _red_
- Hex: _#FF0000_
- OKLCH: _oklch(63% 0.237 25.331)_
- Tailwind CSS variables: _var(--color-red-500)_

Style values will be added with their corresponding variable. For example:
```
--color-primary: oklch(63% 0.237 25.331);
```

Entry is designed to be somewhat forgiving -- for example, it _shouldn't_ choke if you include semi-colons at the end, etc.

### Sizes
When you enter the size, you should also include the units you're using. For example:
- _12px_
- _1.5rem_
- etc

## Using the free-form entry

Note: free-form entry is fully functional, however the UI is limited by the "Long String" field not being expandable. It's recommended to build your free-form text elsewhere, and paste it into the field.

If you enter a value for a variable above, and also include it in the free-form entry, results may vary.

Tips:
- Do not include _\<style>_ tags -- they will be automatically added.
- Any mis-matched braces will break all styles added via the component, be careful. (Braces aren't required at all.)

#### DaisyUI Theme Generator
One approach to the free-form styles: [DaisyUI Theme Generator](https://daisyui.com/theme-generator/)

1. Select the colors/options you want
2. Click the "CSS" button
3. Copy all of the lines that start with "--", and paste them into the free-form entry field.


## Possible future enhancements
- Update other color references in site to just use primary/secondary/etc
- Add "custom color" options that can be defined, and then used by other components