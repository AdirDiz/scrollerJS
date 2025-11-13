# ScrollerJS

A lightweight, modern, and **zero-dependency** scroller (marquee) that uses the Web Animations API (WAAPI) for maximum performance and smooth speed control.

## 🔥 Features

* **Consistent Speed:** The animation is calculated based on **pixels per second**, so its speed is independent of the amount or width of the content.
* **Any Direction:** Supports horizontal (`"left"`, `"right"`) and vertical (`"up"`, `"down"`) movement.
* **Smooth Hover Effects:** Silky-smooth **pause** (`pauseOnHover`) or **slowdown** (`slowOnHover`) on hover, thanks to `animation.playbackRate`.
* **Flexible Setup:** Control over element spacing (`gap`) and the number of duplicates (`duplicates`).
* **Custom Mask:** Option to disable the `linear-gradient` fade mask on the edges (`removeMask`).
* **Accessibility:** Automatically disables itself if the user has `prefers-reduced-motion` enabled.

## ⚙️ Setup

1.  Link `scroller.min.css` in the `<head>` of your HTML document.
2.  Link `scroller.min.js` at the end of the `<body>` of your HTML document.

## CDN 

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/AdirDiz/scrollerJS@main/scroller.min.css" />
```

```html
<script src="https://cdn.jsdelivr.net/gh/AdirDiz/scrollerJS@main/scroller.min.js"></script>
```

## HTML Structure

The basic structure consists of a **parent** (`.scroller`) and a **wrapper** (`.scroller-wrapper`). All your content items must be placed inside the `.scroller-wrapper`.

```html
<div class="scroller my-scroller-demo">
  <div class="scroller-wrapper">
    <div class="scroller-item">Content 1</div>
    <img src="/path/to/img.png" alt="">
    <div class="scroller-item">Content 3</div>
    </div>
</div>

```

## 🚀 Initialization (JS)

After including the script, call the initMyScroller function, passing it the selector for your parent (.scroller) and a configuration object.
```JavaScript

// Example: Horizontal scroller with slowdown
initMyScroller(".my-scroller-demo", {
  pixelsPerSecond: 100,
  direction: "left",
  slowOnHover: true,
  slowdownFactor: 4
});

// Example: Vertical scroller with pause
initMyScroller(".my-vertical-scroller", {
  pixelsPerSecond: 50,
  direction: "up",
  pauseOnHover: true,
  removeMask: true // Disables the fade mask
});
```

## 🔧 All Configuration Options

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `pixelsPerSecond` | `Number` | `50` | The visual speed in pixels per second. |
| `direction` | `String` | `"left"` | Direction of movement:  `"left"`, `"right"`, `"up"`, `"down"`. |
| `gap` | `Number` | `2` | The gap between elements in REM. |
| `duplicates` | `Number` | `1` | Number of content duplicates to create (for a seamless loop). |
| `removeMask` | `Boolean` | `false` | `true`, to remove the gradient mask on the edges. |
| `pauseOnHover` | `Boolean` | `false` | `true`, to pause the animation on hover. |
| `slowOnHover` | `Boolean` | `false` | `true`, to slow down the animation. (Ignored if `pauseOnHover: true`). |
| `slowdownFactor` | `Number` | `3` | The factor to slow down by (e.g., 3 = 3x slower). Only works if `slowOnHover: true`. |

