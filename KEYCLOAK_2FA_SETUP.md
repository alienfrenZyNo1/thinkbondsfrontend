# Keycloak 2FA Setup Guide

This document provides instructions for setting up Two-Factor Authentication (2FA) in Keycloak for the ThinkBonds Portal.

## Overview

The ThinkBonds Portal uses Keycloak for authentication. 2FA can be enforced at the realm level through Keycloak's built-in policies. The application is already configured to work with 2FA - no additional code changes are required.

## Setting up 2FA in Keycloak

### 1. Log into Keycloak Admin Console

1. Access your Keycloak admin console
2. Log in with administrative credentials

### 2. Configure Realm Settings

1. Select the realm used by the ThinkBonds Portal
2. Navigate to "Authentication" in the left sidebar
3. Go to the "Flows" tab
4. Select "Browser" flow or create a custom flow

### 3. Add 2FA Execution

1. Find the "Browser - Forms" section
2. Click "Actions" dropdown
3. Select "Add execution"
4. Choose "OTP Form" from the list
5. Set "OTP Form" to "REQUIRED"

### 4. Configure OTP Policy

1. Navigate to "Authentication" > "Policies" > "OTP Policy"
2. Configure the OTP settings:
   - Type: TOTP (Time-based)
   - Algorithm: HmacSHA1
   - Digits: 6
   - Period: 30
   - Look ahead window: 1
   - Initial counter: 0 (for HOTP)
   - OTP length: 6
   - Secret key length: 32
   - Maximum allowed attempts: 3

### 5. Configure User Registration (Optional)

If you want users to set up 2FA during registration:

1. Go to "Authentication" > "Flows" > "Registration"
2. Add "OTP Form" execution
3. Set it as "REQUIRED"

### 6. Test the Configuration

1. Log out of Keycloak
2. Try to log in to the ThinkBonds Portal
3. You should be prompted for a one-time password after entering your credentials

## Application-Level Considerations

The ThinkBonds Portal is already configured to work with Keycloak's 2FA:

- The Keycloak provider is configured with the standard OIDC scopes
- The JWT session strategy handles tokens correctly
- Token refresh logic accounts for 2FA tokens
- Error handling is in place for authentication failures

No additional code changes are needed in the application for 2FA to work.

## Troubleshooting

### Common Issues

1. **Users not prompted for 2FA**:
   - Check that the OTP Form execution is set to "REQUIRED"
   - Verify the browser flow is set as the default

2. **OTP codes not accepted**:
   - Check OTP policy settings
   - Ensure the system clocks are synchronized

3. **Users can't register 2FA devices**:
   - Verify the registration flow includes OTP Form
   - Check that users have the required permissions

### Logs

For debugging 2FA issues, check Keycloak logs:

```
tail -f /path/to/keycloak/standalone/log/server.log
```

Look for authentication-related messages and OTP errors.

## Security Recommendations

1. Enforce 2FA for all users
2. Regularly review and update OTP policies
3. Monitor authentication logs for suspicious activity
4. Educate users on proper 2FA device management
