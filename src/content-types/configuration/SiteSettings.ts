import { contentType } from '@episerver/cms-sdk';

export const SiteSettings = contentType({
  key: 'SiteSettings',
  displayName: 'Site Settings',
  description: '',
  baseType: '_component',
  sortOrder: 0,
  properties: {
    Logo: {
      type: 'contentReference',
      displayName: 'Logo',
      description: '',
      localized: false,
      required: false,
      group: 'Information',
      sortOrder: 10,
      allowedTypes: ['_image']
    },
    SocialFacebook: {
      type: 'string',
      displayName: 'Facebook Account',
      description: '',
      localized: false,
      required: false,
      group: 'SocialMediaAccounts',
      sortOrder: 10,
      indexingType: 'searchable'
    },
    LogoResolution: {
      type: 'string',
      displayName: 'Logo Resolution',
      description: '',
      localized: false,
      required: false,
      group: 'Information',
      sortOrder: 20,
      enum: [
        { displayName: '32', value: '32' },
        { displayName: '16', value: '16' },
        { displayName: '12', value: '12' },
        { displayName: '10', value: '10' },
        { displayName: '8', value: '8' }
      ]
    },
    SocialInstagram: {
      type: 'string',
      displayName: 'Instagram Account',
      description: '',
      localized: false,
      required: false,
      group: 'SocialMediaAccounts',
      sortOrder: 20,
      indexingType: 'searchable'
    },
    SocialTwitter: {
      type: 'string',
      displayName: 'Twitter (X) Account',
      description: '',
      localized: false,
      required: false,
      group: 'SocialMediaAccounts',
      sortOrder: 30,
      indexingType: 'searchable'
    },
    SocialTikTok: {
      type: 'string',
      displayName: 'TikTok Account',
      description: '',
      localized: false,
      required: false,
      group: 'SocialMediaAccounts',
      sortOrder: 40,
      indexingType: 'searchable'
    },
    SocialGitHub: {
      type: 'string',
      displayName: 'GitHub Account',
      description: '',
      localized: false,
      required: false,
      group: 'SocialMediaAccounts',
      sortOrder: 50,
      indexingType: 'searchable'
    },
    HeaderLinks: {
      type: 'array',
      displayName: 'Header Links',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 100,
      maxItems: 6,
      items: {
        type: 'content'
      }
    },
    FooterText: {
      type: 'string',
      displayName: 'Footer Text',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 200,
      indexingType: 'searchable'
    },
    FooterLinks: {
      type: 'array',
      displayName: 'Footer Links',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 210,
      items: {
        type: 'content'
      }
    },
    SiteDomain: {
      type: 'string',
      displayName: 'Site Domain',
      description: 'Domain (www.mysite.com) to associate with these Site Settings',
      localized: false,
      required: false,
      group: 'Information',
      sortOrder: 1000,
      indexingType: 'searchable'
    }
  }
});