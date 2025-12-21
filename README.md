# Font Switcher Widget ([Demo](https://callijatra.github.io/newa-font-switch-widget/demo))

A standalone, easy-to-distribute font switcher widget that allows users to switch between Original, Ranjana (Nithya Ranjana), and Noto Sans Newa fonts on any webpage.

## Quick Start

### Basic Usage

1. Include the CSS and JavaScript files in your HTML:

```html
<link rel="stylesheet" href="font-switcher.css">
<script src="font-switcher.js"></script>
<script>
  FontSwitcher.init();
</script>
```

### Configuration Options

You can customize the widget behavior by passing options to `FontSwitcher.init()`:

```html
<script>
  FontSwitcher.init({
    targetSelector: 'body',        // CSS selector for elements to apply fonts (default: 'body')
    targetClasses: null,           // Array of class names (e.g., ['content', 'article']) - takes precedence over targetSelector
    container: null,               // CSS selector or DOM element to insert widget into (null = fixed top-right)
    backgroundColor: null,          // Custom background color (e.g., '#2c3e50', 'transparent', 'rgba(0,0,0,0.1)')
    position: 'fixed',             // Widget position (default: 'fixed')
    autoLoad: true                 // Auto-load Google Fonts (default: true)
  });
</script>
```

### Examples

#### Apply to entire page
```html
<script>
  FontSwitcher.init({ targetSelector: 'body' });
</script>
```

#### Apply to specific container
```html
<script>
  FontSwitcher.init({ targetSelector: '.content' });
</script>
```

#### Apply to multiple selectors
```html
<script>
  FontSwitcher.init({ targetSelector: 'article, .main-content' });
</script>
```

#### Apply to specific class names (recommended)
```html
<script>
  FontSwitcher.init({ targetClasses: ['content', 'article', 'main-text'] });
</script>
```

#### Apply to single class name
```html
<script>
  FontSwitcher.init({ targetClasses: ['readable-content'] });
</script>
```

**Note:** When `targetClasses` is specified, it takes precedence over `targetSelector`. The class names should be provided without the leading dot (e.g., `'content'` not `'.content'`).

#### Place widget in navigation bar or custom container
```html
<!-- HTML -->
<nav id="main-nav">
  <!-- Your navigation items -->
</nav>

<!-- JavaScript -->
<script>
  // Using CSS selector
  FontSwitcher.init({
    container: '#main-nav',
    targetClasses: ['content']
  });
  
  // Or using DOM element
  const navElement = document.getElementById('main-nav');
  FontSwitcher.init({
    container: navElement,
    targetClasses: ['content']
  });
</script>
```

#### Default: Fixed position in top-right corner
```html
<script>
  // No container specified = fixed top-right (default behavior)
  FontSwitcher.init({
    targetClasses: ['content']
  });
</script>
```

#### Customize background color
```html
<script>
  // Dark background (text color auto-adjusts for contrast)
  FontSwitcher.init({
    backgroundColor: '#2c3e50',
    targetClasses: ['content']
  });
  
  // Transparent background
  FontSwitcher.init({
    backgroundColor: 'transparent',
    targetClasses: ['content']
  });
  
  // Semi-transparent background
  FontSwitcher.init({
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    targetClasses: ['content']
  });
  
  // Match navigation bar color
  FontSwitcher.init({
    container: '#main-nav',
    backgroundColor: '#2c3e50',  // Match nav background
    targetClasses: ['content']
  });
</script>
```

**Note:** When a dark background color is detected, the widget automatically adjusts text colors to white for better contrast and readability.

## Features

- **Three font options**: Original, Ranjana (Nithya Ranjana), and Noto Sans Newa
- **Persistent selection**: Saves user preference to localStorage
- **Auto-loads Google Fonts**: Automatically loads Noto Sans Newa from Google Fonts when needed
- **Configurable**: Customize target selector, widget placement, and behavior
- **Flexible placement**: Place widget anywhere (navigation bar, sidebar, etc.) or use default fixed top-right position
- **Accessible**: Includes ARIA labels and keyboard navigation
- **Responsive**: Works on mobile and desktop
- **Dark mode support**: Automatically adapts to user's color scheme preference

## Files

- `font-switcher.css` - Widget styles and font definitions
- `font-switcher.js` - Core widget functionality

## Browser Support

Works in all modern browsers that support:
- ES5 JavaScript
- CSS3
- localStorage API

## License

Same license as the Nithya Ranjana font project.

