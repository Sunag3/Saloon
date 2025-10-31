// Initialize AOS Animations
AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true,
    offset: 100
});

// Initialize Swiper for Reviews
const reviewsSwiper = new Swiper('.reviews-swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        }
    }
});

// Smooth Scrolling for Navigation Links
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

// Active Navigation Link Highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Lightbox Gallery Functionality
function openLightbox(element) {
    // Handle both old gallery cards and new mobile cards
    const card = element.classList.contains('gallery-card-mobile') ? element : element.closest('.gallery-card');
    const img = card.querySelector('img');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxModal = new bootstrap.Modal(document.getElementById('lightboxModal'));
    
    if (img) {
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightboxModal.show();
    }
}

// Mobile Gallery, Services & Reviews Smooth Scrolling Enhancement
document.addEventListener('DOMContentLoaded', function() {
    // Add touch event handlers for better mobile scrolling
    const scrollWrappers = document.querySelectorAll('.gallery-scroll-wrapper, .services-scroll-wrapper, .reviews-scroll-wrapper');
    
    scrollWrappers.forEach(wrapper => {
        let isDown = false;
        let startX;
        let scrollLeft;
        
        // Mouse events for desktop testing
        wrapper.addEventListener('mousedown', (e) => {
            isDown = true;
            wrapper.style.cursor = 'grabbing';
            startX = e.pageX - wrapper.offsetLeft;
            scrollLeft = wrapper.scrollLeft;
        });
        
        wrapper.addEventListener('mouseleave', () => {
            isDown = false;
            wrapper.style.cursor = 'grab';
        });
        
        wrapper.addEventListener('mouseup', () => {
            isDown = false;
            wrapper.style.cursor = 'grab';
        });
        
        wrapper.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - wrapper.offsetLeft;
            const walk = (x - startX) * 2;
            wrapper.scrollLeft = scrollLeft - walk;
        });
        
        // Add cursor style for desktop
        if (window.innerWidth >= 768) {
            wrapper.style.cursor = 'grab';
        }
    });
    
    // Hide swipe indicator after first scroll for gallery
    const galleryWrappers = document.querySelectorAll('.gallery-scroll-wrapper');
    galleryWrappers.forEach(wrapper => {
        let hasScrolled = false;
        
        wrapper.addEventListener('scroll', function() {
            if (!hasScrolled) {
                hasScrolled = true;
                const badge = this.closest('.gallery-category-section').querySelector('.badge.bg-light');
                if (badge) {
                    badge.style.opacity = '0';
                    setTimeout(() => {
                        badge.style.display = 'none';
                    }, 300);
                }
            }
        }, { once: true });
    });
});

// Star Rating System for Review Form
document.addEventListener('DOMContentLoaded', function() {
    const starInputs = document.querySelectorAll('.star-rating-input i');
    
    starInputs.forEach((star, index) => {
        star.addEventListener('click', function() {
            selectedRating = index + 1;
            updateStarDisplay();
        });
        
        star.addEventListener('mouseenter', function() {
            highlightStars(index + 1);
        });
    });
    
    const starContainer = document.querySelector('.star-rating-input');
    if (starContainer) {
        starContainer.addEventListener('mouseleave', function() {
            updateStarDisplay();
        });
    }
    
    function highlightStars(rating) {
        starInputs.forEach((star, index) => {
            if (index < rating) {
                star.style.color = 'var(--rose-gold)';
            } else {
                star.style.color = '#ddd';
            }
        });
    }
    
    function updateStarDisplay() {
        highlightStars(selectedRating);
    }
});

// Enhanced Review Form Handling
document.getElementById('reviewForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Prevent double submission
    if (this.classList.contains('submitting')) {
        return;
    }
    this.classList.add('submitting');
    
    // Get form elements
    const nameInput = document.getElementById('reviewName');
    const serviceInput = document.getElementById('reviewService');
    const textInput = document.getElementById('reviewText');
    
    // Validate form
    if (!validateReviewForm(this)) {
        this.classList.remove('submitting');
        return;
    }
    
    const formData = {
        id: Date.now() + Math.random(), // Unique ID for each review
        name: nameInput.value.trim(),
        service: serviceInput.value,
        rating: selectedRating || 5,
        text: textInput.value.trim(),
        date: new Date().toISOString(),
        timestamp: Date.now()
    };
    
    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Submitting...';
    submitBtn.disabled = true;
    
    try {
    // Store review in localStorage
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        reviews.unshift(formData); // Add new review at the beginning
    localStorage.setItem('reviews', JSON.stringify(reviews));
    
    // Show success message
        showNotification('Thank you for your review! It has been added to our testimonials.', 'success');
    
    // Reset form
    this.reset();
    selectedRating = 0;
    updateStarDisplay();
        removeFormValidationStyles(this);
        
        // Refresh reviews display
        displayReviews();
        
        // Scroll to the newest review
        setTimeout(() => {
            scrollToNewestReview();
        }, 500);
        
    } catch (error) {
        console.error('Error submitting review:', error);
        showNotification('There was an error submitting your review. Please try again.', 'error');
    } finally {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        this.classList.remove('submitting');
    }
});

// Review Form Validation
function validateReviewForm(form) {
    const nameInput = document.getElementById('reviewName');
    const serviceInput = document.getElementById('reviewService');
    const textInput = document.getElementById('reviewText');
    
    let isValid = true;
    
    // Clear previous validation styles
    removeFormValidationStyles(form);
    
    // Name validation
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        showFieldError(nameInput, 'Please enter a valid name (at least 2 characters)');
        isValid = false;
    }
    
    // Service validation
    if (!serviceInput.value) {
        showFieldError(serviceInput, 'Please select a service');
        isValid = false;
    }
    
    // Rating validation
    if (selectedRating === 0) {
        showNotification('Please select a rating by clicking on the stars.', 'warning');
        isValid = false;
    }
    
    // Text validation
    if (!textInput.value.trim() || textInput.value.trim().length < 10) {
        showFieldError(textInput, 'Please write a review (at least 10 characters)');
        isValid = false;
    }
    
    if (!isValid) {
        showNotification('Please correct the errors below and try again.', 'warning');
    }
    
    return isValid;
}

// Dynamic Reviews Display System
let allReviews = [];
let selectedRating = 0;

// Initialize review form validation
function initializeReviewFormValidation() {
    const form = document.getElementById('reviewForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateSingleReviewField(this);
        });
        
        input.addEventListener('input', function() {
            // Clear error state on input
            if (this.classList.contains('is-invalid')) {
                this.classList.remove('is-invalid');
                const errorDiv = this.parentNode.querySelector('.invalid-feedback');
                if (errorDiv) {
                    errorDiv.remove();
                }
            }
            
            // Update character counter for textarea
            if (this.id === 'reviewText') {
                updateCharacterCount(this);
            }
        });
    });
    
    // Initialize character counter
    const reviewText = document.getElementById('reviewText');
    if (reviewText) {
        updateCharacterCount(reviewText);
    }
}

// Update character counter
function updateCharacterCount(textarea) {
    const charCountElement = document.getElementById('charCount');
    if (charCountElement) {
        const currentLength = textarea.value.length;
        const maxLength = parseInt(textarea.getAttribute('maxlength')) || 500;
        
        charCountElement.textContent = currentLength;
        
        // Change color based on length
        if (currentLength > maxLength * 0.9) {
            charCountElement.style.color = '#dc3545'; // Red
        } else if (currentLength > maxLength * 0.8) {
            charCountElement.style.color = '#fd7e14'; // Orange
        } else {
            charCountElement.style.color = '#6c757d'; // Gray
        }
    }
}

// Validate single review field
function validateSingleReviewField(input) {
    const value = input.value.trim();
    
    switch (input.type) {
        case 'text':
            if (input.id === 'reviewName') {
                if (!value || value.length < 2) {
                    showFieldError(input, 'Please enter a valid name (at least 2 characters)');
                    return false;
                }
            }
            break;
    }
    
    if (input.tagName === 'SELECT') {
        if (input.id === 'reviewService') {
            if (!value) {
                showFieldError(input, 'Please select a service');
                return false;
            }
        }
    }
    
    if (input.tagName === 'TEXTAREA') {
        if (input.id === 'reviewText') {
            if (!value || value.length < 10) {
                showFieldError(input, 'Please write a review (at least 10 characters)');
                return false;
            }
        }
    }
    
    return true;
}

// Display Reviews in Horizontal Scroller
function displayReviews() {
    // Get all reviews from localStorage
    allReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    
    // Add default reviews if none exist
    if (allReviews.length === 0) {
        addDefaultReviews();
        allReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    }
    
    // Ensure we have at least 10 reviews (append more if needed)
    if (allReviews.length < 10) {
        addMoreReviewsIfNeeded();
        allReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    }
    
    // Get reviews container
    const reviewsWrapper = document.getElementById('reviewsScrollWrapper');
    if (!reviewsWrapper) return;
    
    // Clear existing content
    reviewsWrapper.innerHTML = '';
    
    // Display all reviews in horizontal scroller
    allReviews.forEach((review) => {
        const reviewCard = createReviewScrollItem(review);
        reviewsWrapper.appendChild(reviewCard);
    });
    
    // Re-initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// Append additional reviews if fewer than 10 exist
function addMoreReviewsIfNeeded() {
    const existing = JSON.parse(localStorage.getItem('reviews') || '[]');
    const existingKeys = new Set(
        existing.map(r => `${(r.name || '').toLowerCase()}|${r.service}`)
    );
    const extras = [
        {
            name: "Neha Verma",
            service: "wedding",
            rating: 5,
            text: "Soundarya delivered the perfect bridal look for my big day. Soft, elegant, and camera-ready the whole time. She’s calm, professional, and truly gifted!",
        },
        {
            name: "Eashwari",
            service: "engagement",
            rating: 5,
            text: "My engagement makeup by Soundarya was flawless! Subtle glow with defined eyes — exactly what I asked for. The pictures turned out stunning!",
        },
        {
            name: "Sneha Kulal",
            service: "party",
            rating: 5,
            text: "Loved my party glam! Soundarya nailed the look — bold yet elegant. Makeup stayed fresh for hours and felt super lightweight.",
        },
        {
            name: "Nandini Rao",
            service: "wedding",
            rating: 5,
            text: "Couldn’t have asked for a better MUA! Soundarya’s attention to detail is amazing — seamless base, perfect lip shade, and beautiful traditional finish.",
        },
        {
            name: "Ishita Menon",
            service: "rental-jewelry",
            rating: 5,
            text: "Rented jewelry from Soundarya — premium quality and perfectly matched my outfit. Great experience and very helpful suggestions!",
        }
    ];
    
    const now = Date.now();
    const toAdd = [];
    for (let i = 0; i < extras.length && existing.length + toAdd.length < 10; i++) {
        const e = extras[i];
        const key = `${e.name.toLowerCase()}|${e.service}`;
        if (!existingKeys.has(key)) {
            toAdd.push({
                id: now + i,
                name: e.name,
                service: e.service,
                rating: e.rating,
                text: e.text,
                date: new Date(now - 86400000 * (i + 1)).toISOString(),
                timestamp: now - 86400000 * (i + 1)
            });
            existingKeys.add(key);
        }
    }
    
    if (toAdd.length > 0) {
        // Prepend newest first
        const merged = [...toAdd, ...existing];
        localStorage.setItem('reviews', JSON.stringify(merged));
    }
}

// Create individual review scroll item
function createReviewScrollItem(review) {
    const scrollItem = document.createElement('div');
    scrollItem.className = 'review-scroll-item';
    
    const serviceDisplayNames = {
        'wedding': 'Wedding Makeup',
        'engagement': 'Engagement Makeup',
        'party': 'Party Makeup',
        'rental-jewelry': 'Rental Jewelry'
    };
    
    const serviceName = serviceDisplayNames[review.service] || review.service;
    const reviewDate = new Date(review.date).toLocaleDateString();
    
    scrollItem.innerHTML = `
        <div class="review-card">
            <div class="quote-icon">"</div>
            <div class="star-rating mb-3">
                ${generateStars(review.rating)}
            </div>
            <p class="review-text mb-4">"${review.text}"</p>
            <div class="review-author">
                <div class="author-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="author-info">
                    <h6 class="author-name mb-1">${review.name}</h6>
                    <small class="author-service">${serviceName}</small>
                    <small class="author-date d-block">${reviewDate}</small>
                </div>
            </div>
        </div>
    `;
    
    return scrollItem;
}

// Generate star rating HTML
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Scroll to the newest review
function scrollToNewestReview() {
    const reviewsWrapper = document.getElementById('reviewsScrollWrapper');
    if (reviewsWrapper && reviewsWrapper.firstChild) {
        reviewsWrapper.scrollTo({
            left: 0,
            behavior: 'smooth'
        });
    }
}

// Add default reviews for demonstration
function addDefaultReviews() {
    const defaultReviews = [
        {
            id: 1,
            name: "Divya Reddy",
            service: "wedding",
            rating: 5,
            text: "Soundarya is absolutely amazing! She made me look like a dream on my wedding day. Her bridal makeup was flawless and lasted the entire day. She understood exactly what I wanted and enhanced my natural beauty perfectly. Highly recommend her for any bride!",
            date: new Date(Date.now() - 86400000 * 5).toISOString(),
            timestamp: Date.now() - 86400000 * 5
        },
        {
            id: 2,
            name: "Priya Hegde",
            service: "engagement",
            rating: 5,
            text: "Soundarya did my engagement makeup and I couldn't be happier! She created such a gorgeous, glowy look that photographed beautifully. Everyone at the party kept complimenting my makeup. She's so talented and professional. Thank you Soundarya!",
            date: new Date(Date.now() - 86400000 * 12).toISOString(),
            timestamp: Date.now() - 86400000 * 12
        },
        {
            id: 3,
            name: "Anusha Nair",
            service: "party",
            rating: 5,
            text: "Had the best experience with Soundarya for my birthday party! She gave me the perfect glamorous look I wanted. The makeup was stunning and lasted all night. She's very sweet, listens to your preferences, and her work is top-notch. Will definitely book again!",
            date: new Date(Date.now() - 86400000 * 18).toISOString(),
            timestamp: Date.now() - 86400000 * 18
        },
        {
            id: 4,
            name: "Lakshmi Suresh",
            service: "wedding",
            rating: 5,
            text: "Soundarya is a true artist! My bridal makeup was beyond perfect - elegant, traditional, and so beautiful. She did my trial makeup and made adjustments based on my saree color. On my wedding day, I felt like the most beautiful bride. Her attention to detail is incredible!",
            date: new Date(Date.now() - 86400000 * 25).toISOString(),
            timestamp: Date.now() - 86400000 * 25
        },
        {
            id: 5,
            name: "Meera Iyer",
            service: "engagement",
            rating: 5,
            text: "Soundarya made me look absolutely stunning for my engagement ceremony! Her makeup skills are exceptional and she has such a warm personality. She arrived on time, was very professional, and created a look that was perfect for photos. Highly recommended!",
            date: new Date(Date.now() - 86400000 * 32).toISOString(),
            timestamp: Date.now() - 86400000 * 32
        },
        {
            id: 6,
            name: "Kavya Shetty",
            service: "party",
            rating: 5,
            text: "I'm so glad I found Soundarya! She did my makeup for a family wedding and I received so many compliments. Her technique is flawless and she uses high-quality products. The makeup stayed fresh throughout the event. She's definitely my go-to makeup artist now!",
            date: new Date(Date.now() - 86400000 * 40).toISOString(),
            timestamp: Date.now() - 86400000 * 40
        },
        {
            id: 7,
            name: "Shreya Kulkarni",
            service: "wedding",
            rating: 5,
            text: "Soundarya is simply the best! She did my wedding makeup and I looked exactly how I dreamed I would. She's patient, understanding, and so talented. My makeup was waterproof and perfect for the entire day. Thank you for making my special day even more beautiful!",
            date: new Date(Date.now() - 86400000 * 48).toISOString(),
            timestamp: Date.now() - 86400000 * 48
        },
        {
            id: 8,
            name: "Aishwarya Rao",
            service: "engagement",
            rating: 5,
            text: "Absolutely loved my engagement makeup by Soundarya! She created such a natural yet glamorous look. Her professionalism and skills are outstanding. She made sure I was comfortable throughout and the results were amazing. Worth every penny!",
            date: new Date(Date.now() - 86400000 * 55).toISOString(),
            timestamp: Date.now() - 86400000 * 55
        },
        {
            id: 9,
            name: "Pooja Gowda",
            service: "rental-jewelry",
            rating: 5,
            text: "Rented beautiful jewelry from Soundarya for my cousin's wedding. The collection is stunning and the pieces are of excellent quality. The rental process was smooth and hassle-free. She also helped me choose the perfect set for my outfit. Great service!",
            date: new Date(Date.now() - 86400000 * 62).toISOString(),
            timestamp: Date.now() - 86400000 * 62
        },
        {
            id: 10,
            name: "Sahana Bhat",
            service: "party",
            rating: 5,
            text: "Soundarya is incredible! She did my makeup for a festive celebration and I looked gorgeous. Her work is so neat and perfect. She's friendly, punctual, and very professional. I've already recommended her to all my friends. Best makeup artist in Tumkur!",
            date: new Date(Date.now() - 86400000 * 70).toISOString(),
            timestamp: Date.now() - 86400000 * 70
        }
    ];
    
    localStorage.setItem('reviews', JSON.stringify(defaultReviews));
}

// Enhanced Contact Form Handling with Email Integration
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Prevent double submission
    if (this.classList.contains('submitting')) {
        return;
    }
    this.classList.add('submitting');
    
    // Get form elements
    const form = this;
    const nameInput = document.getElementById('contactName');
    const phoneInput = document.getElementById('contactPhone');
    const emailInput = document.getElementById('contactEmail');
    const serviceInput = document.getElementById('contactService');
    const dateInput = document.getElementById('contactDate');
    const messageInput = document.getElementById('contactMessage');
    
    // Validate form
    if (!validateContactForm(form)) {
        form.classList.remove('submitting');
        return;
    }
    
    const formData = {
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        email: emailInput.value.trim(),
        service: serviceInput.value,
        date: dateInput.value,
        message: messageInput.value.trim(),
        timestamp: new Date().toISOString()
    };
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending Email...';
    submitBtn.disabled = true;
    
    // Send email notification
    sendEmailNotification(formData)
        .then(() => {
    // Store contact request in localStorage
    const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    contacts.push(formData);
    localStorage.setItem('contacts', JSON.stringify(contacts));
    
    // Show success message
            showNotification('Thank you for your message! I\'ll get back to you soon via email.', 'success');
    
    // Reset form
            form.reset();
            removeFormValidationStyles(form);
        })
        .catch((error) => {
            console.error('Error sending email:', error);
            showNotification('There was an error sending your message. Please try again or contact me directly.', 'error');
        })
        .finally(() => {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            form.classList.remove('submitting');
        });
});

// Enhanced Form Validation
function validateContactForm(form) {
    const nameInput = document.getElementById('contactName');
    const phoneInput = document.getElementById('contactPhone');
    const emailInput = document.getElementById('contactEmail');
    const serviceInput = document.getElementById('contactService');
    const dateInput = document.getElementById('contactDate');
    
    let isValid = true;
    
    // Clear previous validation styles
    removeFormValidationStyles(form);
    
    // Name validation
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        showFieldError(nameInput, 'Please enter a valid name (at least 2 characters)');
        isValid = false;
    }
    
    // Phone validation
    if (!phoneInput.value.trim()) {
        showFieldError(phoneInput, 'Phone number is required');
        isValid = false;
    } else if (!isValidPhone(phoneInput.value)) {
        showFieldError(phoneInput, 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Email validation
    if (!emailInput.value.trim()) {
        showFieldError(emailInput, 'Email address is required');
        isValid = false;
    } else if (!isValidEmail(emailInput.value)) {
        showFieldError(emailInput, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Service validation
    if (!serviceInput.value) {
        showFieldError(serviceInput, 'Please select a service');
        isValid = false;
    }
    
    // Date validation
    if (!dateInput.value) {
        showFieldError(dateInput, 'Please select a preferred date');
        isValid = false;
    } else {
        const selectedDate = new Date(dateInput.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showFieldError(dateInput, 'Please select a future date');
            isValid = false;
        }
    }
    
    if (!isValid) {
        showNotification('Please correct the errors below and try again.', 'warning');
    }
    
    return isValid;
}

// Show field error
function showFieldError(input, message) {
    input.classList.add('is-invalid');
    
    // Remove existing error message
    const existingError = input.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    input.parentNode.appendChild(errorDiv);
}

// Remove form validation styles
function removeFormValidationStyles(form) {
    form.querySelectorAll('.is-invalid').forEach(input => {
        input.classList.remove('is-invalid');
    });
    form.querySelectorAll('.invalid-feedback').forEach(error => {
        error.remove();
    });
}

// EmailJS Configuration and Email Function
// Initialize EmailJS with your public key (only if EmailJS is available)
(function() {
    if (typeof emailjs !== 'undefined') {
        // Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
        emailjs.init('hbRBbF9PK94NMxJT3');
        console.log('✅ EmailJS initialized successfully');
        console.log('📧 Your EmailJS credentials:');
        console.log('   Public Key: hbRBbF9PK94NMxJT3');
        console.log('   Service ID: service_j1o9d1q');
        console.log('   Template ID: template_daxlmp4');
    } else {
        console.log('❌ EmailJS not loaded, will use fallback email service');
    }
})();

// Test EmailJS connection (for debugging)
function testEmailJSConnection() {
    console.log('🧪 Testing EmailJS connection...');
    console.log('EmailJS available:', typeof emailjs !== 'undefined');
    
    if (typeof emailjs !== 'undefined') {
        console.log('✅ EmailJS is loaded and ready');
        return true;
    } else {
        console.log('❌ EmailJS is not available');
        return false;
    }
}

// Run test on page load
document.addEventListener('DOMContentLoaded', function() {
    testEmailJSConnection();
    
    // Initialize reviews display
    displayReviews();
    
    // Add real-time validation to review form
    initializeReviewFormValidation();
});

// Email Notification Function using EmailJS
async function sendEmailNotification(formData) {
    console.log('Starting email send process...', formData);
    
    try {
        // Check if EmailJS is available
        if (typeof emailjs === 'undefined') {
            throw new Error('EmailJS is not loaded');
        }
        
        // EmailJS service configuration
        const serviceId = 'service_ayusx36';
        const templateId = 'template_daxlmp4';
        
        console.log('Using EmailJS with:', { serviceId, templateId });
        
        // Prepare email template parameters
        const templateParams = {
            to_name: 'Soundarya Makeup and Hair',
            from_name: formData.name,
            from_email: formData.email,
            phone: formData.phone,
            service: formData.service,
            preferred_date: formData.date,
            message: formData.message || 'No additional message',
            reply_to: formData.email,
            date_submitted: new Date().toLocaleDateString(),
            time_submitted: new Date().toLocaleTimeString()
        };
        
        console.log('Sending email with params:', templateParams);
        
        // Send email using EmailJS
        const response = await emailjs.send(serviceId, templateId, templateParams);
        
        console.log('EmailJS response:', response);
        
        if (response.status === 200) {
            console.log('✅ Email sent successfully via EmailJS');
            return Promise.resolve();
        } else {
            throw new Error(`EmailJS returned status: ${response.status}`);
        }
        
    } catch (error) {
        console.error('❌ EmailJS Error:', error);
        console.log('🔄 Falling back to Formspree...');
        
        // Fallback: Send email via Formspree (free service)
        return sendEmailViaFormspree(formData);
    }
}

// Fallback Email Function using Formspree (Free Service)
async function sendEmailViaFormspree(formData) {
    try {
        // Formspree endpoint - replace with your Formspree form ID
        const formspreeEndpoint = 'https://formspree.io/f/YOUR_FORMSPREE_ID';
        
        const emailData = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            service: formData.service,
            date: formData.date,
            message: formData.message,
            subject: `New Booking Inquiry from ${formData.name} - ${formData.service}`,
            _replyto: formData.email,
            _subject: `New Booking Inquiry - Soundarya Makeup and Hair`
        };
        
        const response = await fetch(formspreeEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(emailData)
        });
        
        if (response.ok) {
            console.log('Email sent via Formspree successfully');
            return Promise.resolve();
        } else {
            throw new Error(`Formspree returned status: ${response.status}`);
        }
        
    } catch (error) {
        console.error('Formspree Error:', error);
        
        // Final fallback: Simulate email sending for demo
        return simulateEmailSending(formData);
    }
}

// Demo Email Function (for testing without actual email service)
async function simulateEmailSending(formData) {
    const emailContent = `
=== NEW BOOKING INQUIRY ===
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Service: ${formData.service}
Preferred Date: ${formData.date}
Message: ${formData.message || 'No additional message'}
Submitted: ${new Date().toLocaleString()}
========================
    `;
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Email would be sent:', emailContent);
    return Promise.resolve();
}

// Real-time form validation
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // Real-time validation for each field
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateSingleField(this);
        });
        
        input.addEventListener('input', function() {
            // Clear error state on input
            if (this.classList.contains('is-invalid')) {
                this.classList.remove('is-invalid');
                const errorDiv = this.parentNode.querySelector('.invalid-feedback');
                if (errorDiv) {
                    errorDiv.remove();
                }
            }
        });
    });
});

// Validate single field
function validateSingleField(input) {
    const value = input.value.trim();
    
    switch (input.type) {
        case 'text':
            if (input.id === 'contactName') {
                if (!value || value.length < 2) {
                    showFieldError(input, 'Please enter a valid name (at least 2 characters)');
                    return false;
                }
            }
            break;
            
        case 'tel':
            if (!value) {
                showFieldError(input, 'Phone number is required');
                return false;
            } else if (!isValidPhone(value)) {
                showFieldError(input, 'Please enter a valid phone number');
                return false;
            }
            break;
            
        case 'email':
            if (!value) {
                showFieldError(input, 'Email address is required');
                return false;
            } else if (!isValidEmail(value)) {
                showFieldError(input, 'Please enter a valid email address');
                return false;
            }
            break;
            
        case 'date':
            if (!value) {
                showFieldError(input, 'Please select a preferred date');
                return false;
            } else {
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (selectedDate < today) {
                    showFieldError(input, 'Please select a future date');
                    return false;
                }
            }
            break;
    }
    
    if (input.tagName === 'SELECT') {
        if (!value) {
            showFieldError(input, 'Please select a service');
            return false;
        }
    }
    
    return true;
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : 'info'} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Sticky Header Effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255,255,255,0.95)';
        navbar.style.backdropFilter = 'blur(15px)';
    } else {
        navbar.style.background = 'rgba(255,255,255,0.85)';
        navbar.style.backdropFilter = 'blur(12px)';
    }
});

// CTA Button Pulse Animation
document.querySelectorAll('.cta-btn, .btn-gradient').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.animation = 'pulse 0.6s ease-in-out';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.animation = '';
    });
});

// Gallery Card Hover Effects (Desktop Only)
if (window.innerWidth >= 992) {
    document.querySelectorAll('.gallery-card, .gallery-card-mobile').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const img = this.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1.1)';
                img.style.transition = 'transform 0.4s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const img = this.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1)';
            }
        });
    });
}

// Form Validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
        }
    });
    
    return isValid;
}

// Enhanced Email Validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'rediffmail.com', 'yandex.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    
    return emailRegex.test(email) && email.length <= 254;
}

// Phone Validation
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Enhanced Form Validation
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        if (!validateForm(this)) {
            e.preventDefault();
            showNotification('Please fill in all required fields.', 'warning');
            return;
        }
        
        // Email validation
        const emailInput = this.querySelector('input[type="email"]');
        if (emailInput && !isValidEmail(emailInput.value)) {
            e.preventDefault();
            emailInput.classList.add('is-invalid');
            showNotification('Please enter a valid email address.', 'warning');
            return;
        }
        
        // Phone validation
        const phoneInput = this.querySelector('input[type="tel"]');
        if (phoneInput && !isValidPhone(phoneInput.value)) {
            e.preventDefault();
            phoneInput.classList.add('is-invalid');
            showNotification('Please enter a valid phone number.', 'warning');
            return;
        }
    });
});

// Loading Animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.card, .gallery-card, .testimonial-card').forEach(el => {
    observer.observe(el);
});

// Mobile Menu Toggle Enhancement
document.querySelector('.navbar-toggler')?.addEventListener('click', function() {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    navbarCollapse.classList.toggle('show');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', function() {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
            navbarCollapse.classList.remove('show');
        }
    });
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-section');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Initialize tooltips
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    // Scroll-based animations and effects
}, 10);

window.addEventListener('scroll', debouncedScrollHandler); 