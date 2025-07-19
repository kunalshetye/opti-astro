import { StyleSchema } from '../../../../lib/schema-registry.js';
import { ButtonComponentDefinition } from './Button.type.schema.js';

// Auto-registering Login Button style schema
export const LoginButtonStyleDefinition = StyleSchema({
  key: 'LoginButton',
  displayName: 'Login Button',
  contentType: ButtonComponentDefinition.key,
  isDefault: false,
  settings: {
      "loginService": {
        "displayName": "Login Service",
        "editor": "",
        "sortOrder": 5,
        "choices": {
          "Email": {
            "displayName": "Email",
            "sortOrder": 10
          },
          "Amazon": {
            "displayName": "Amazon",
            "sortOrder": 20
          },
          "Apple": {
            "displayName": "Apple",
            "sortOrder": 30
          },
          "Facebook": {
            "displayName": "Facebook",
            "sortOrder": 40
          },
          "GitHub": {
            "displayName": "GitHub",
            "sortOrder": 50
          },
          "Google": {
            "displayName": "Google",
            "sortOrder": 60
          },
          "LinkedIn": {
            "displayName": "LinkedIn",
            "sortOrder": 70
          },
          "Microsoft": {
            "displayName": "Microsoft",
            "sortOrder": 80
          },
          "Slack": {
            "displayName": "Slack",
            "sortOrder": 90
          },
          "xtwitter": {
            "displayName": "X (Twitter)",
            "sortOrder": 100
          }
        }
      }
    },
});
