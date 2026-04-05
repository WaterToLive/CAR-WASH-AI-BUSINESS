// Simple JavaScript Database using localStorage
class SimpleDB {
    constructor() {
        this.bookings = this.load('bookings') || [];
        this.reviews = this.load('reviews') || [];
        this.services = this.load('services') || defaultServices;
        this.reviewSubmitted = this.load('reviewSubmitted') || false;
    }

    save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    load(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    addBooking(booking) {
        booking.id = Date.now();
        this.bookings.push(booking);
        this.save('bookings', this.bookings);
        return booking.id;
    }

    getBookings() {
        return this.bookings;
    }

    addReview(review) {
        if (this.reviewSubmitted) {
            showCustomPopup('You have already submitted a review from this device.', 'warning');
            return false;
        }
        review.id = Date.now();
        this.reviews.push(review);
        this.save('reviews', this.reviews);
        this.reviewSubmitted = true;
        this.save('reviewSubmitted', true);
        this.displayReviews();
        showCustomPopup('Thank you for your review!', 'success');
        return review.id;
    }

    getReviews() {
        return this.reviews;
    }

    hasSubmittedReview() {
        return this.reviewSubmitted;
    }

    addService(service) {
        service.id = Date.now();
        this.services.push(service);
        this.save('services', this.services);
        this.displayServices();
        return service.id;
    }

    getServices() {
        return this.services;
    }

    displayReviews() {
        const reviewCards = document.querySelector('.review-cards');
        if (!reviewCards) return;

        // Clear existing reviews
        reviewCards.innerHTML = '';


        // Combine default and user reviews
        const allReviews = [...defaultReviews, ...this.reviews];

        allReviews.forEach(review => {
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card';
            reviewCard.innerHTML = `
                <div class="stars">
                    ${'<i class="fas fa-star"></i>'.repeat(review.rating)}
                </div>
                <p>"${review.text}"</p>
                <cite>- ${review.name}</cite>
            `;
            reviewCards.appendChild(reviewCard);
        });
    }

    displayServices() {
        const serviceCards = document.querySelector('.service-cards');
        if (!serviceCards) return;

        // Clear existing services
        serviceCards.innerHTML = '';

        this.services.forEach(service => {
            const serviceCard = document.createElement('div');
            serviceCard.className = 'card';
            if (service.name === 'Rainbow Wash') {
                serviceCard.classList.add('rainbow-card');
            }
            serviceCard.innerHTML = `
                <div class="card-icon">
                    <i class="${service.icon}"></i>
                </div>
                <h3>${service.name}</h3>
                <p>${service.description}</p>
            `;
            serviceCards.appendChild(serviceCard);
        });

        // Also update pricing cards
        const pricingCards = document.querySelector('.pricing-cards');
        if (pricingCards) {
            pricingCards.innerHTML = '';

            this.services.forEach(service => {
                const pricingCard = document.createElement('div');
                pricingCard.className = 'card';
                if (service.name === 'Rainbow Wash') {
                    pricingCard.classList.add('rainbow-card');
                }
                pricingCard.innerHTML = `
                    <h3>${service.name}</h3>
                    <div class="price">$${service.price}</div>
                    <ul>
                        ${this.getServiceFeatures(service.name)}
                    </ul>
                    <a href="#booking" class="btn btn-secondary">Book Now</a>
                `;
                pricingCards.appendChild(pricingCard);
            });
        }
    }

    getServiceFeatures(serviceName) {
        const features = {
            'Basic Wash': ['Exterior wash', 'Soap and rinse', 'Quick service'],
            'Deluxe Wash': ['Exterior wash', 'Interior vacuum', 'Tire shine', 'Dashboard wipe'],
            'Rainbow Wash': ['All Deluxe features', 'Colorful foam', 'Rainbow lighting', 'Water splash effects']
        };
        return features[serviceName] ? features[serviceName].map(feature => `<li>${feature}</li>`).join('') : '';
    }
}

const db = new SimpleDB();

// Custom popup function
function showCustomPopup(message, type = 'info') {
    // Remove existing popup if any
    const existingPopup = document.querySelector('.custom-popup');
    if (existingPopup) {
        existingPopup.remove();
    }

    // Create popup element
    const popup = document.createElement('div');
    popup.className = `custom-popup ${type}`;

    // Set icon based on type
    let icon = 'fas fa-info-circle';
    if (type === 'success') icon = 'fas fa-check-circle';
    if (type === 'warning') icon = 'fas fa-exclamation-triangle';
    if (type === 'error') icon = 'fas fa-times-circle';

    popup.innerHTML = `
        <div class="popup-content">
            <div class="popup-icon">
                <i class="${icon}"></i>
            </div>
            <div class="popup-message">${message}</div>
            <button class="popup-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    document.body.appendChild(popup);

    // Show popup with animation
    setTimeout(() => {
        popup.classList.add('show');
    }, 10);

    // Auto hide after 5 seconds
    setTimeout(() => {
        hideCustomPopup(popup);
    }, 5000);

    // Close on click
    popup.addEventListener('click', () => hideCustomPopup(popup));
}

function hideCustomPopup(popup) {
    popup.classList.remove('show');
    setTimeout(() => {
        if (popup.parentNode) {
            popup.parentNode.removeChild(popup);
        }
    }, 300);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add animation to cards on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Form submission (placeholder)
document.querySelector('.booking-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const booking = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        date: formData.get('date'),
        time: formData.get('time'),
        timestamp: new Date().toISOString()
    };

    const bookingId = db.addBooking(booking);
    showCustomPopup(`Thank you for your booking! Your booking ID is ${bookingId}. We will contact you soon.`, 'success');
    this.reset();
});

// Add water droplet effect to hero
function createDroplet() {
    const droplet = document.createElement('div');
    droplet.className = 'droplet';
    droplet.style.left = Math.random() * 100 + '%';
    droplet.style.animationDuration = Math.random() * 2 + 3 + 's';
    document.querySelector('.hero').appendChild(droplet);

    setTimeout(() => {
        droplet.remove();
    }, 5000);
}

setInterval(createDroplet, 200);

// Add CSS for droplets
const style = document.createElement('style');
style.textContent = `
    .droplet {
        position: absolute;
        top: -10px;
        width: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        animation: fall linear infinite;
    }

    @keyframes fall {
        to {
            transform: translateY(100vh);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Add review form
function addReviewForm() {
    const reviewsSection = document.querySelector('#reviews .container');

    if (db.hasSubmittedReview()) {
        const alreadySubmitted = document.createElement('div');
        alreadySubmitted.className = 'review-submitted';
        alreadySubmitted.innerHTML = `
            <div class="submitted-message">
                <i class="fas fa-check-circle"></i>
                <h3>Review Submitted</h3>
                <p>You have already submitted a review from this device. Thank you!</p>
            </div>
        `;
        reviewsSection.appendChild(alreadySubmitted);
        return;
    }

    const reviewForm = document.createElement('div');
    reviewForm.className = 'review-form';
    reviewForm.innerHTML = `
        <h3>Add Your Review</h3>
        <form class="add-review-form">
            <div class="form-group">
                <label for="review-name">Name</label>
                <input type="text" id="review-name" name="name" required>
            </div>
            <div class="form-group">
                <label for="review-text">Review</label>
                <textarea id="review-text" name="text" rows="4" required></textarea>
            </div>
            <div class="form-group">
                <label for="review-rating">Rating</label>
                <select id="review-rating" name="rating" required>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary">Submit Review</button>
        </form>
    `;
    reviewsSection.appendChild(reviewForm);

    // Handle review form submission
    document.querySelector('.add-review-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const review = {
            name: formData.get('name'),
            text: formData.get('text'),
            rating: parseInt(formData.get('rating'))
        };

        db.addReview(review);
        // Hide the form after successful submission
        reviewForm.style.display = 'none';
        const alreadySubmitted = document.createElement('div');
        alreadySubmitted.className = 'review-submitted';
        alreadySubmitted.innerHTML = `
            <div class="submitted-message">
                <i class="fas fa-check-circle"></i>
                <h3>Review Submitted</h3>
                <p>Thank you for your feedback!</p>
            </div>
        `;
        reviewsSection.appendChild(alreadySubmitted);
        this.reset();
    });
}

// Initialize reviews display and add review form
document.addEventListener('DOMContentLoaded', function() {
    db.displayReviews();
    db.displayServices();
    addReviewForm();

    // Populate service select options
    const serviceSelect = document.getElementById('service');
    if (serviceSelect) {
        serviceSelect.innerHTML = '<option value="">Select Service</option>';
        db.getServices().forEach(service => {
            const option = document.createElement('option');
            option.value = service.name.toLowerCase().replace(' ', '-');
            option.textContent = service.name;
            serviceSelect.appendChild(option);
        });
    }

    // Admin panel functionality
    document.getElementById('show-bookings').addEventListener('click', function() {
        const bookings = db.getBookings();
        const content = document.getElementById('admin-content');
        content.innerHTML = `
            <h3>All Bookings</h3>
            <pre>${JSON.stringify(bookings, null, 2)}</pre>
        `;
        document.getElementById('admin').style.display = 'block';
    });

    document.getElementById('show-reviews').addEventListener('click', function() {
        const reviews = db.getReviews();
        const content = document.getElementById('admin-content');
        content.innerHTML = `
            <h3>All Reviews</h3>
            <pre>${JSON.stringify(reviews, null, 2)}</pre>
        `;
        document.getElementById('admin').style.display = 'block';
    });

    // Add show-services button
    const adminContainer = document.querySelector('#admin .container');
    const showServicesBtn = document.createElement('button');
    showServicesBtn.id = 'show-services';
    showServicesBtn.className = 'btn btn-secondary';
    showServicesBtn.textContent = 'View Services';
    adminContainer.insertBefore(showServicesBtn, document.getElementById('admin-content'));

    showServicesBtn.addEventListener('click', function() {
        const services = db.getServices();
        const content = document.getElementById('admin-content');
        content.innerHTML = `
            <h3>All Services</h3>
            <pre>${JSON.stringify(services, null, 2)}</pre>
            <h4>Add New Service</h4>
            <form id="add-service-form">
                <input type="text" name="name" placeholder="Service Name" required>
                <input type="text" name="description" placeholder="Description" required>
                <input type="number" name="price" placeholder="Price" required>
                <input type="text" name="icon" placeholder="Icon Class (e.g., fas fa-car)" required>
                <button type="submit" class="btn btn-primary">Add Service</button>
            </form>
        `;
        document.getElementById('admin').style.display = 'block';

        // Handle add service form
        document.getElementById('add-service-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const service = {
                name: formData.get('name'),
                description: formData.get('description'),
                price: parseFloat(formData.get('price')),
                icon: formData.get('icon')
            };
            db.addService(service);
            showCustomPopup('Service added successfully!', 'success');
            this.reset();
        });
    });
});

// Rainbow gradient animation for hero text
let hue = 0;
function animateRainbow() {
    hue = (hue + 1) % 360;
    const heroTitle = document.querySelector('.hero-content h2');
    if (heroTitle) {
        heroTitle.style.filter = `hue-rotate(${hue}deg)`;
    }
    requestAnimationFrame(animateRainbow);
}
animateRainbow();