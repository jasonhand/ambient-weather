# Draggable Weather Cards

The weather dashboard now features draggable metric cards that allow users to customize their layout and organize the information according to their preferences.

## Features

### Drag and Drop
- **Drag Handle**: Each card has a subtle drag handle (grip icon) that appears on hover
- **Smooth Animation**: Cards smoothly animate during drag operations
- **Visual Feedback**: Dragging cards show visual feedback with rotation and shadow effects
- **Persistent Layout**: Card order is automatically saved to localStorage and persists between sessions

### Card Organization
- **12 Weather Metrics**: All available weather metrics can be reordered
- **Responsive Grid**: Cards maintain their responsive grid layout (1 column on mobile, 2 on tablet, 3 on desktop)
- **Custom Order**: Users can arrange cards in any order they prefer

## How to Use

### Reordering Cards
1. **Hover** over any weather card to reveal the drag handle (grip icon) in the top-right corner
2. **Click and drag** the handle to move the card to a new position
3. **Release** to drop the card in its new location
4. The new order is automatically saved

### Reset to Default
1. Open **Settings** (gear icon in the header)
2. Click **"Reset Card Order"** to restore the default arrangement
3. The page will reload to apply the changes

## Available Metrics

The following 12 weather metrics can be reordered:

1. **Soil Moisture** - Soil moisture percentage
2. **Soil Temperature** - Ground temperature
3. **Feels Like** - Apparent temperature with wind chill
4. **Temperature** - Current air temperature
5. **Humidity** - Relative humidity
6. **Wind Speed** - Wind speed in mph
7. **Wind Direction** - Compass direction
8. **Pressure** - Barometric pressure
9. **Dew Point** - Moisture level indicator
10. **UV Index** - Sun protection level
11. **Solar Radiation** - Solar energy measurement
12. **Daily Rain** - Precipitation today

## Technical Implementation

### Libraries Used
- **react-beautiful-dnd**: Provides smooth drag and drop functionality
- **localStorage**: Persists card order between sessions

### Data Structure
```typescript
interface CardConfig {
  id: string;
  title: string;
  field: string;
  color: string;
  gradient: string;
}
```

### Storage
- Card order is stored in `localStorage` under the key `ambient_weather_card_order`
- Default order is restored if no saved order exists
- Missing cards are automatically added to the end if the saved order is incomplete

### Analytics
- Card reordering actions are tracked in Datadog for user behavior analysis
- Reset actions are also tracked for feature usage insights

## Benefits

- **Personalization**: Users can prioritize the metrics most important to them
- **Improved UX**: Custom layouts improve user experience and workflow
- **Accessibility**: Drag handles provide clear affordances for interaction
- **Persistence**: Layout preferences are maintained across sessions
- **Analytics**: User behavior data helps understand feature usage patterns 