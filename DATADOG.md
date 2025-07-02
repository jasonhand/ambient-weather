# Datadog Integration Guide

This document explains how to use the Datadog metrics integration in the Ambient Weather Dashboard.

## Overview

The Datadog integration allows you to send weather data from your Ambient Weather Network station to Datadog for monitoring, alerting, and visualization. This feature is optional and only sends data while the web app is running.

## Setup Instructions

### 1. Get Datadog API Keys

1. Sign up for a [Datadog account](https://www.datadoghq.com/) (free trial available)
2. Go to **Organization Settings** → **API Keys**
3. Create a new API key
4. Go to **Organization Settings** → **Application Keys**
5. Create a new Application key

### 2. Configure the Integration

1. Open the Weather Dashboard
2. Click the **Settings** icon (gear) in the top-right corner
3. Click **"Configure Datadog Metrics"**
4. Toggle **"Enable Datadog Metrics"** to ON
5. Enter your Datadog **API Key**
6. Enter your Datadog **Application Key**
7. Optionally set a custom **Host Name** (default: "weather-app")
8. Click **"Save Settings"**

### 3. Verify Integration

Once enabled, you'll see:
- A green "Datadog Metrics Active" banner above the weather cards
- A small "Datadog: X min" indicator in the header showing the refresh frequency
- The last send time displayed in the banner

## Metrics Sent to Datadog

The following metrics are sent with each weather data update:

| Metric Name | Description | Unit | Tags |
|-------------|-------------|------|------|
| `weather.temperature.fahrenheit` | Current temperature | °F | location, source, app |
| `weather.feels_like.fahrenheit` | Feels like temperature | °F | location, source, app |
| `weather.humidity.percent` | Relative humidity | % | location, source, app |
| `weather.wind_speed.mph` | Wind speed | MPH | location, source, app |
| `weather.wind_direction.degrees` | Wind direction | degrees | location, source, app |
| `weather.pressure.inhg` | Barometric pressure | inHg | location, source, app |
| `weather.dew_point.fahrenheit` | Dew point | °F | location, source, app |
| `weather.uv_index` | UV index | unitless | location, source, app |
| `weather.solar_radiation.wm2` | Solar radiation | W/m² | location, source, app |
| `weather.daily_rain.inches` | Daily rainfall | inches | location, source, app |
| `weather.soil_moisture.percent` | Soil moisture | % | location, source, app |
| `weather.soil_temperature.fahrenheit` | Soil temperature | °F | location, source, app |

### Tags Included

All metrics include the following tags:
- `location:[station_name]` - Your weather station name
- `source:ambient_weather` - Data source identifier
- `app:weather_dashboard` - Application identifier
- `lat:[latitude]` - Station latitude (if available)
- `lon:[longitude]` - Station longitude (if available)

## Data Frequency

Metrics are sent at the same frequency as your weather data refresh interval:
- **1 minute** - Every minute
- **5 minutes** - Every 5 minutes (default)
- **10 minutes** - Every 10 minutes
- **30 minutes** - Every 30 minutes
- **1 hour** - Every hour

## Visual Indicators

### When Enabled:
- **Header**: Small green badge showing "Datadog: X min"
- **Main Area**: Green banner with "Datadog Metrics Active" and last send time
- **Settings Modal**: Status indicator showing current state

### When Disabled:
- No visual indicators shown
- Settings modal shows "Settings configured but metrics are disabled"

## Troubleshooting

### Common Issues

1. **"Failed to send metrics to Datadog" error**
   - Check your API and Application keys are correct
   - Verify your Datadog account is active
   - Check network connectivity

2. **No metrics appearing in Datadog**
   - Wait 5-10 minutes for metrics to appear (Datadog has processing delays)
   - Check the browser console for error messages
   - Verify the integration is enabled in settings

3. **Metrics stop sending**
   - Refresh the page to restart the integration
   - Check if the app has been running for a long time
   - Verify your Datadog keys haven't expired

### Debug Information

Open your browser's developer console (F12) to see:
- Successful metric sends: "Successfully sent X metrics to Datadog"
- Error messages: "Failed to send metrics to Datadog: [error]"
- Integration status: "Weather metrics sent to Datadog successfully"

## Privacy & Security

- **API Keys**: Stored locally in your browser's localStorage
- **Data**: Only sent while the app is running and enabled
- **Location**: Your weather station location is included as tags
- **Frequency**: Data is sent at your configured refresh interval

## Datadog Dashboard Setup

Once metrics are flowing, you can create custom dashboards in Datadog:

1. Go to **Dashboards** → **New Dashboard**
2. Add widgets for your weather metrics
3. Use tags to filter by location: `location:your_station_name`
4. Set up alerts for extreme weather conditions
5. Create timeboards for historical analysis

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Datadog account and API keys
3. Try disabling and re-enabling the integration
4. Refresh the page to restart the service 