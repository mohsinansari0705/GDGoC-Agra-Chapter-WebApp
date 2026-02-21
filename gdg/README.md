# GDG on Campus - Sharda University Website

A stunning, fully responsive website for Google Developer Groups (GDG) on Campus at Sharda University. Built with modern web technologies and following Google's Material Design principles.

## 🎨 Features

### Pages Included
- **Home Page** (`index.html`) - Hero section, tech stack showcase, featured events, testimonials
- **About Page** (`about.html`) - Mission, vision, activities, achievements timeline
- **Events Page** (`events.html`) - Upcoming and past events with filtering capabilities
- **Event Detail Page** (`event-detail.html`) - Detailed event information, agenda, speakers, registration
- **Team Page** (`team.html`) - Core team, department leads, and members showcase
- **Gallery Page** (`gallery.html`) - Photo gallery with modal view and filtering

### Design Features
✨ **Google Material Design Theme**
- Google brand colors (Blue: #4285F4, Red: #EA4335, Yellow: #FBBC04, Green: #34A853)
- Clean, modern UI with smooth animations
- Responsive design for all devices
- Interactive hover effects and transitions

🚀 **Functionality**
- Mobile-responsive navigation with hamburger menu
- Event filtering and search
- Image gallery with lightbox modal
- Smooth scroll animations
- Counter animations for statistics
- Newsletter subscription form
- Social media integration
- Scroll-to-top button

## 📁 Project Structure

```
gdg/
├── index.html           # Home page
├── about.html           # About GDG page
├── events.html          # Events listing page
├── event-detail.html    # Event details page
├── team.html            # Team members page
├── gallery.html         # Photo gallery page
├── styles.css           # Main stylesheet with Google theme
├── script.js            # JavaScript for interactivity
└── README.md            # This file
```

## 🎯 Getting Started

### Simple Setup
1. Extract all files to a folder
2. Open `index.html` in your web browser
3. That's it! No build process required.

### Using with VS Code Live Server
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## 🎨 Customization Guide

### Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --google-blue: #4285F4;
    --google-red: #EA4335;
    --google-yellow: #FBBC04;
    --google-green: #34A853;
}
```

### Content
- Replace placeholder images with your actual event photos
- Update team member information in `team.html`
- Add your actual events in `events.html`
- Customize contact information in footer sections

### Logo
Replace the Google Developers logo URL with your chapter's logo:
```html
<img src="YOUR_LOGO_URL" alt="GDG Logo">
```

## 🌟 Key Sections

### Home Page
- Hero section with animated gradient text
- Technology stack cards (Android, Web, Cloud, AI/ML, Flutter, Firebase)
- Featured upcoming events
- Community statistics and benefits
- Member testimonials
- Newsletter subscription

### Events Page
- Filter by event type (All, Upcoming, Workshops, Hackathons, Tech Talks, Past)
- Search functionality
- Event cards with attendee counts
- Past events archive

### Team Page
- Featured core team members
- Department leads showcase
- Team member grid with social links
- Hover effects showing contact options

### Gallery Page
- Masonry grid layout
- Category filtering
- Lightbox modal for full-size images
- Keyboard navigation support (arrow keys, escape)

## 📱 Responsive Breakpoints

- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: Below 768px

## 🚀 Features in Detail

### Interactive Elements
- **Mobile Menu**: Hamburger menu for mobile devices
- **Filter System**: Filter events and gallery items by category
- **Search Bar**: Real-time event search
- **Modal Gallery**: Click images to view in full screen
- **Smooth Scrolling**: Animated page navigation
- **Counter Animation**: Animated statistics on scroll

### Animations
- Fade-in effects on scroll
- Hover transformations
- Gradient color animations
- Floating card animations
- Loading state animations

## 🔧 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📦 External Dependencies

- **Font Awesome 6.4.0** - Icons
- **Google Fonts** - Roboto font family
- **Unsplash Images** - Demo images (replace with actual photos)
- **Pravatar** - Demo profile pictures (replace with actual photos)

## 🎓 Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox and Grid
- **JavaScript (ES6+)** - Interactive functionality
- **Google Material Design** - Design principles

## 📝 To-Do / Future Enhancements

- [ ] Add backend for event registration
- [ ] Integrate with GDG Community API
- [ ] Add blog section
- [ ] Implement dark mode toggle
- [ ] Add PWA support with service workers
- [ ] Create admin panel for content management
- [ ] Add multi-language support
- [ ] Integrate Google Calendar for events

## 🤝 Contributing

To customize this website for your chapter:

1. Update all placeholder content with your chapter information
2. Replace demo images with your actual photos
3. Update social media links in footer
4. Customize color scheme if needed
5. Add your actual events and team members

## 📄 License

This project is created for GDG on Campus - Sharda University. Feel free to use and modify for your GDG chapter.

## 📞 Contact

For questions or support:
- Email: gdg@sharda.ac.in
- Location: Sharda University, Greater Noida

## 🙏 Acknowledgments

- Google Developer Groups program
- Google Material Design team
- Unsplash for demo images
- Font Awesome for icons

---

**Built with ❤️ for the developer community**

Made for GDG on Campus - Sharda University
