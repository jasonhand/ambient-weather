# Ambient Weather Dashboard

A beautiful, real-time weather dashboard that connects to Ambient Weather Network API to display weather data from your personal weather station.

## Features

- 🌤️ Real-time weather data from Ambient Weather Network
- 📊 Interactive charts and statistics
- 🎨 Beautiful, responsive UI with dark theme
- 📱 Mobile-friendly design
- 🔄 Configurable refresh intervals
- 📈 Historical data tracking
- 🎯 Datadog metrics integration

## 📊 Datadog Integration

This app includes optional Datadog metrics integration that allows you to send weather data to Datadog for monitoring and visualization.

### Setup

1. Go to Settings → Configure Datadog Metrics
2. Enable the integration
3. Enter your Datadog API Key and Application Key
4. Optionally set a custom host name
5. Save settings

### What data is sent?

When enabled, the app will send the following metrics to Datadog:
- Temperature (Fahrenheit)
- Feels like temperature
- Humidity percentage
- Wind speed (MPH)
- Wind direction (degrees)
- Barometric pressure (inHg)
- Dew point (Fahrenheit)
- UV index
- Solar radiation (W/m²)
- Daily rainfall (inches)
- Soil moisture percentage
- Soil temperature (Fahrenheit)

All metrics include location tags and timestamps for easy filtering and analysis in Datadog.

### Monitoring

Get free monitoring for this project with [Datadog](https://www.datadoghq.com/dg/monitor/free-trial-b/?utm_source=jhand_demo)

## Project info

**URL**: https://ambient-weather.lovable.app/

