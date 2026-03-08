# Bill's Auto Wash Website

A modern, vibrant website for Bill's Auto Wash, featuring a premium car wash experience with rainbow colors, water splash animations, and a clean, futuristic design.

## Features

- **Hero Section**: Animated rainbow wash with colorful foam and water jets
- **Services**: Basic, Deluxe, and Rainbow Wash options
- **Pricing**: Simple pricing cards for all services
- **Gallery**: Photo gallery showcasing the wash process
- **Reviews**: Customer testimonials with star ratings (dynamic - users can add reviews)
- **Location & Hours**: Embedded map and business hours
- **Membership**: Unlimited wash plans
- **Booking Form**: Online booking system with database storage
- **Simple JavaScript Database**: Client-side storage using localStorage for bookings and reviews
- **Admin Panel**: View stored bookings and reviews (accessible via footer link)

## Design Highlights

- Glossy, futuristic design with rainbow gradients
- Water splash effects and animations
- Smooth scrolling and hover effects
- Mobile-friendly responsive layout
- Modern fonts and clean professional styling

## Technologies Used

- HTML5
- CSS3 (with animations and gradients)
- JavaScript (ES6+ with classes for database management)
- localStorage API for client-side data storage
- Font Awesome (for icons)
- Google Fonts (Poppins)

## Database Features

The website includes a simple JavaScript database using localStorage:

- **Bookings Storage**: All booking submissions are stored locally
- **Reviews Storage**: User-submitted reviews are saved and displayed (one review per device)
- **Admin Panel**: Access via the "Admin" link in the footer to view all stored data
- **Data Persistence**: Data persists across browser sessions using localStorage
- **Custom Popups**: Beautiful, themed confirmation messages instead of browser alerts
- **Review Limiting**: Prevents multiple reviews from the same device/browser

## How to Run

1. Clone or download the repository
2. Navigate to the project directory
3. Start a local HTTP server:
   ```bash
   python3 -m http.server 8000
   ```
4. Open your browser and go to `http://localhost:8000`

## File Structure

```
/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Stylesheet
├── js/
│   └── script.js       # JavaScript for animations and interactions
├── images/
│   └── car.svg         # Car illustration
└── README.md           # This file
```

## Customization

- Update colors and gradients in `css/style.css`
- Modify content in `index.html`
- Add more animations in `js/script.js`
- Replace placeholder images in the gallery section

Enjoy the vibrant car wash experience!