import { contentType } from '@episerver/cms-sdk';

export const SiteStyles = contentType({
  key: 'SiteStyles',
  displayName: 'Site Styles',
  description: 'Manage site colors and other display attributes via the CMS',
  baseType: '_component',
  sortOrder: 0,
  properties: {
    primary: {
      type: 'string',
      displayName: 'color-primary',
      description: 'Primary brand color',
      localized: false,
      required: false,
      group: 'StylesColors',
      sortOrder: 10
    },
    radiusSelector: {
      type: 'string',
      displayName: 'Radius - Selector (checkbox, toggle, badge, etc)',
      description: 'Border radius for selectors like checkbox, toggle, badge, etc',
      localized: false,
      required: false,
      group: 'StylesOther',
      sortOrder: 10,
      enum: [
        { displayName: 'Default', value: '' },
        { displayName: 'xs', value: '0rem' },
        { displayName: 's', value: '0.25rem' },
        { displayName: 'md', value: '0.5rem' },
        { displayName: 'lg', value: '1rem' },
        { displayName: 'xl', value: '2rem' }
      ]
    },
    SiteStylesDomain: {
      type: 'string',
      displayName: 'Site Domain',
      description: 'Domain (www.mysite.com) to associate with these Site Styles',
      localized: false,
      required: true,
      group: 'Information',
      sortOrder: 10,
      indexingType: 'searchable'
    },
    primaryContent: {
      type: 'string',
      displayName: 'color-primary-content',
      description: 'Foreground content color to use on primary color',
      localized: false,
      required: false,
      group: 'StylesColors',
      sortOrder: 20
    },
    radiusField: {
      type: 'string',
      displayName: 'Radius - Field (button, input, select, tab)',
      description: 'Border radius for fields like input, select, tab, etc',
      localized: false,
      required: false,
      group: 'StylesOther',
      sortOrder: 20,
      enum: [
        { displayName: 'Default', value: '' },
        { displayName: 'xs', value: '0rem' },
        { displayName: 's', value: '0.25rem' },
        { displayName: 'md', value: '0.5rem' },
        { displayName: 'lg', value: '1rem' },
        { displayName: 'xl', value: '2rem' }
      ]
    },
    secondary: {
      type: 'string',
      displayName: 'color-secondary',
      description: 'Secondary brand color',
      localized: false,
      required: false,
      group: 'StylesColors',
      sortOrder: 30
    },
    radiusBox: {
      type: 'string',
      displayName: 'Radius - Box (card, modal, alert, etc)',
      description: 'Border radius for boxes like card, modal, alert, etc',
      localized: false,
      required: false,
      group: 'StylesOther',
      sortOrder: 30,
      enum: [
        { displayName: 'Default', value: '' },
        { displayName: 'xs', value: '0rem' },
        { displayName: 's', value: '0.25rem' },
        { displayName: 'md', value: '0.5rem' },
        { displayName: 'lg', value: '1rem' },
        { displayName: 'xl', value: '2rem' }
      ]
    },
    sizeField: {
      type: 'string',
      displayName: 'Size - Field',
      description: 'Base scale size for fields like input, select, tab, etc',
      localized: false,
      required: false,
      group: 'StylesOther',
      sortOrder: 35,
      enum: [
        { displayName: 'Default', value: '' },
        { displayName: 'xs', value: '0.1875rem' },
        { displayName: 's', value: '0.21875rem' },
        { displayName: 'md', value: '0.25rem' },
        { displayName: 'lg', value: '0.28125rem' },
        { displayName: 'xl', value: '0.3125rem' }
      ]
    },
    secondaryContent: {
      type: 'string',
      displayName: 'color-secondary-content',
      description: 'Foreground content color to use on secondary color',
      localized: false,
      required: false,
      group: 'StylesColors',
      sortOrder: 40
    },
    sizeSelector: {
      type: 'string',
      displayName: 'Size - Selector',
      description: 'Base scale size for selectors like checkbox, toggle, badge, etc',
      localized: false,
      required: false,
      group: 'StylesOther',
      sortOrder: 40,
      enum: [
        { displayName: 'Default', value: '' },
        { displayName: 'xs', value: '0.1875rem' },
        { displayName: 's', value: '0.21875rem' },
        { displayName: 'md', value: '0.25rem' },
        { displayName: 'lg', value: '0.28125rem' },
        { displayName: 'xl', value: '0.3125rem' }
      ]
    },
    accent: {
      type: 'string',
      displayName: 'color-accent',
      description: 'Accent brand color',
      localized: false,
      required: false,
      group: 'StylesColors',
      sortOrder: 50
    },
    borderWidth: {
      type: 'float',
      displayName: 'Border Width (px)',
      description: 'Border width of all components',
      localized: false,
      required: false,
      group: 'StylesOther',
      sortOrder: 50,
      minimum: 0,
      maximum: 10
    },
    depth: {
      type: 'boolean',
      displayName: 'Depth',
      description: 'Adds a depth effect for relevant components',
      localized: false,
      required: false,
      group: 'StylesOther',
      sortOrder: 59
    },
    accentContent: {
      type: 'string',
      displayName: 'color-accent-content',
      description: 'Foreground content color to use on accent color',
      localized: false,
      required: false,
      group: 'StylesColors',
      sortOrder: 60
    },
    neutral: {
      type: 'string',
      displayName: 'color-neutral',
      description: 'Neutral dark color',
      localized: false,
      required: false,
      group: 'StylesColors',
      sortOrder: 70
    },
    noise: {
      type: 'boolean',
      displayName: 'Noise',
      description: 'Adds a background noise effect for relevant components',
      localized: false,
      required: false,
      group: 'StylesOther',
      sortOrder: 70
    },
    neutralContent: {
      type: 'string',
      displayName: 'color-neutral-content',
      description: 'Foreground content color to use on neutral color',
      localized: false,
      required: false,
      group: 'StylesColors',
      sortOrder: 80
    },
    base100: {
      type: 'string',
      displayName: 'color-base-100',
      description: 'Base color of page, used for blank backgrounds',
      localized: false,
      required: false,
      group: 'StylesColors',
      sortOrder: 210
    },
    base200: {
      type: 'string',
      displayName: 'color-base-200',
      description: 'Base color, darker shade',
      localized: false,
      required: false,
      group: 'StylesColors',
      sortOrder: 220
    },
    base300: {
      type: 'string',
      displayName: 'color-base-300',
      description: 'Base color, even more darker shade',
      localized: false,
      required: false,
      group: 'StylesColors',
      sortOrder: 230
    },
    baseContent: {
      type: 'string',
      displayName: 'color-base-content (base text color)',
      description: 'Foreground (text) content color to use on base content',
      localized: false,
      required: false,
      group: 'StylesColors',
      sortOrder: 240
    },
    info: {
      type: 'string',
      displayName: 'color-info',
      description: 'Info color',
      localized: false,
      required: false,
      group: 'StylesColors',
      sortOrder: 130
    },
    infoContent: {
      type: 'string',
      displayName: 'color-info-content',
      description: 'Foreground content color to use on info content',
      localized: false,
      required: false,
      group: 'StylesColors',
      sortOrder: 140
    },
    success: {
      type: 'string',
      displayName: 'color-success',
      description: 'Success color',
      localized: false,
      required: false,
      group: 'StylesColors',
      sortOrder: 150
    },
    successContent: {
      type: 'string',
      displayName: 'color-success-content',
      description: 'Foreground content color to use on success content',
      localized: false,
      required: false,
      group: 'StylesColors',
      sortOrder: 160
    },
    warning: {
      type: 'string',
      displayName: 'color-warning',
      description: 'Warning color',
      localized: false,
      required: false,
      group: 'StylesColors',
      sortOrder: 170
    },
    warningContent: {
      type: 'string',
      displayName: 'color-warning-content',
      description: 'Foreground content color to use on warning content',
      localized: false,
      required: false,
      group: 'StylesColors',
      sortOrder: 180
    },
    error: {
      type: 'string',
      displayName: 'color-error',
      description: 'Error color',
      localized: false,
      required: false,
      group: 'StylesColors',
      sortOrder: 190
    },
    errorContent: {
      type: 'string',
      displayName: 'color-error-content',
      description: 'Foreground content color to use on error content',
      localized: false,
      required: false,
      group: 'StylesColors',
      sortOrder: 200
    },
    daisyuiTheme: {
      type: 'string',
      displayName: 'DaisyUI Theme',
      description: 'A free form field to copy/paste the theme generated via the DaisyUI theme generator - https://daisyui.com/theme-generator/',
      localized: false,
      required: false,
      group: 'StylesOther',
      sortOrder: 499
    },
    freeFormStyles: {
      type: 'string',
      displayName: 'Styles (Free Form)',
      description: 'Free-form entry of styles list (for example, from DaisyUI\'s template generator)',
      localized: false,
      required: false,
      group: 'StylesOther',
      sortOrder: 500
    },
    textXs: {
      type: 'string',
      displayName: 'text-xs',
      description: 'Text size: xs',
      localized: false,
      required: false,
      group: 'StylesSizes',
      sortOrder: 10
    },
    textSm: {
      type: 'string',
      displayName: 'text-sm (h6)',
      description: 'Text size: sm',
      localized: false,
      required: false,
      group: 'StylesSizes',
      sortOrder: 20
    },
    textBase: {
      type: 'string',
      displayName: 'text-base (h5 + p)',
      description: 'Text size: base',
      localized: false,
      required: false,
      group: 'StylesSizes',
      sortOrder: 30
    },
    textLg: {
      type: 'string',
      displayName: 'text-lg (h4)',
      description: 'Text size: lg',
      localized: false,
      required: false,
      group: 'StylesSizes',
      sortOrder: 40
    },
    textXl: {
      type: 'string',
      displayName: 'text-xl (h3)',
      description: 'Text size: xl',
      localized: false,
      required: false,
      group: 'StylesSizes',
      sortOrder: 50
    },
    text2xl: {
      type: 'string',
      displayName: 'text-2xl (h2)',
      description: 'Text size: 2xl',
      localized: false,
      required: false,
      group: 'StylesSizes',
      sortOrder: 60
    },
    text3xl: {
      type: 'string',
      displayName: 'text-3xl (h1)',
      description: 'Text size: 3xl',
      localized: false,
      required: false,
      group: 'StylesSizes',
      sortOrder: 70
    },
    text4xl: {
      type: 'string',
      displayName: 'text-4xl',
      description: 'Text size: 4xl',
      localized: false,
      required: false,
      group: 'StylesSizes',
      sortOrder: 80
    },
    text5xl: {
      type: 'string',
      displayName: 'text-5xl',
      description: 'Text size: 5xl',
      localized: false,
      required: false,
      group: 'StylesSizes',
      sortOrder: 90
    },
    text6xl: {
      type: 'string',
      displayName: 'text-6xl',
      description: 'Text size: 6xl',
      localized: false,
      required: false,
      group: 'StylesSizes',
      sortOrder: 100
    },
    text7xl: {
      type: 'string',
      displayName: 'text-7xl',
      description: 'Text size: 7xl',
      localized: false,
      required: false,
      group: 'StylesSizes',
      sortOrder: 110
    },
    text8xl: {
      type: 'string',
      displayName: 'text-8xl',
      description: 'Text size: 8xl',
      localized: false,
      required: false,
      group: 'StylesSizes',
      sortOrder: 120
    },
    text9xl: {
      type: 'string',
      displayName: 'text-9xl',
      description: 'Text size: 9xl',
      localized: false,
      required: false,
      group: 'StylesSizes',
      sortOrder: 130
    }
  }
});