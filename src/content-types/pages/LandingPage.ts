import { contentType } from '@episerver/cms-sdk';

export const LandingPage = contentType({
  key: 'LandingPage',
  displayName: 'Landing Page',
  description: '',
  baseType: '_page',
  sortOrder: 0,
  mayContainTypes: ['*'],
  mediaFileExtensions: [],
  compositionBehaviors: [],
  properties: {
    TopContentArea: {
      type: 'array',
      displayName: 'Top Content Area',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: -100,
      items: {
        type: 'content',
        allowedTypes: [],
        restrictedTypes: []
      }
    },
    MainContentArea: {
      type: 'array',
      displayName: 'Main Content Area',
      description: '',
      localized: true,
      required: false,
      group: 'Information',
      sortOrder: 0,
      items: {
        type: 'content',
        allowedTypes: [],
        restrictedTypes: []
      }
    }
    // SeoSettings removed for now - would need actual PageSeoSettings contentType object
  }
});