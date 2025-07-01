# Datadog RUM Instrumentation

This weather dashboard has been instrumented with Datadog Real User Monitoring (RUM) to track user interactions, performance metrics, and application errors.

## Configuration

The Datadog RUM SDK is loaded in `index.html` with the following configuration:

- **Client Token**: `pube9baef23d6715258f73ebf2af8e8302a`
- **Application ID**: `c03b4df7-6481-42ec-a4ef-44099b68ba26`
- **Service**: `ambient-weather-dashboard`
- **Environment**: `prod`
- **Session Sample Rate**: 100%
- **Session Replay Sample Rate**: 100%
- **Privacy Level**: `mask-user-input`

## Tracked Events

### Page Views
- `page_view` - Tracks when users visit different pages
  - `index` - Main dashboard page
  - `data_view` - Raw data page

### Application Events
- `app_initialized` - Tracks when the application starts
- `api_key_configured` - Tracks when users set up their API keys

### API Calls
- `api_call` - Tracks all API requests to Ambient Weather Network
  - Includes URL, method, status code, and response time
- `weather_data_update` - Tracks weather data fetch attempts
  - Includes data source (api/mock), success status, and error messages

### User Interactions
- `user_interaction` - Tracks various user actions
  - API key configuration
  - Settings changes
  - Data refreshes

### Chart Interactions
- `chart_interaction` - Tracks when users switch between different weather metrics
  - Chart type and selected metric

### Modal Interactions
- `modal_interaction` - Tracks when users open/close detail modals
  - Action (open/close) and modal type

### Error Tracking
- Automatic error tracking for all JavaScript errors
- Custom error tracking for API failures
- Error context includes the source of the error

## Custom Attributes

The following custom attributes are set to provide additional context:

- `version` - Application version (1.0.0)
- `data_source` - Whether data is from API or mock
- `chart_type` - Type of chart being viewed
- `metric` - Specific weather metric being displayed
- `modal_type` - Type of modal being interacted with

## Performance Monitoring

Datadog automatically tracks:
- Page load times
- Resource loading performance
- User interactions and their timing
- Session replay for debugging user issues

## Privacy

The configuration uses `mask-user-input` as the default privacy level, which means:
- User input fields are automatically masked
- Sensitive data like API keys are not captured
- Session replays respect user privacy

## Usage

The Datadog utility functions are available in `src/utils/datadog.ts`:

```typescript
import { datadog } from '../utils/datadog';

// Track custom actions
datadog.addAction('custom_event', { key: 'value' });

// Track errors
datadog.addError(new Error('Something went wrong'));

// Track API calls
datadog.trackApiCall(url, method, status, duration);

// Track user interactions
datadog.trackUserInteraction('button_click', 'refresh_button');
```

## Viewing Data

All tracked events and metrics can be viewed in your Datadog dashboard at:
https://app.datadoghq.com/rum/explorer

The data will appear under the service name `ambient-weather-dashboard` in the `prod` environment.

## Historical Data Management

The application automatically manages historical data to prevent duplicates:

- **Polling Frequency**: Data is fetched every 5 minutes (300,000ms) by default
- **Duplicate Prevention**: Historical data is only stored if at least 5 minutes have passed since the last data point
- **Automatic Cleanup**: Existing duplicate entries are automatically cleaned up on app initialization
- **Storage Limit**: Maximum of 288 data points (24 hours worth of 5-minute intervals)

This ensures that charts and modals display clean, non-duplicate historical data. 