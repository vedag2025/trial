// SeoulVeda Main JavaScript File
// Handles all interactive functionality across the website

// Global Variables
let cart = JSON.parse(localStorage.getItem('seoulveda-cart')) || [];
let currentQuizStep = 0;
let quizAnswers = {};

// Product Database
const products = [
    // Skincare Products
    {
        id: 'ginseng-serum',
        name: 'Ginseng Renewal Serum',
        category: 'skincare',
        ingredients: ['ginseng'],
        price: 89,
        rating: 4.8,
        reviews: 127,
        image: 'resources/product-ginseng-serum.jpg',
        description: 'Revitalizing ginseng extract for youthful glow',
        badge: 'Best Seller'
    },
    {
        id: 'green-tea-oil',
        name: 'Green Tea Cleansing Oil',
        category: 'skincare',
        ingredients: ['green-tea'],
        price: 45,
        rating: 4.7,
        reviews: 89,
        image: 'resources/product-green-tea-oil.jpg',
        description: 'Gentle makeup remover with antioxidant protection'
    },
    {
        id: 'rice-toner',
        name: 'Rice Water Toner',
        category: 'skincare',
        ingredients: ['rice'],
        price: 35,
        rating: 4.6,
        reviews: 56,
        image: 'resources/product-rice-toner.jpg',
        description: 'Brightening toner for even skin tone',
        badge: 'New'
    },
    {
        id: 'snail-cream',
        name: 'Snail Mucin Moisturizer',
        category: 'skincare',
        ingredients: ['snail'],
        price: 65,
        rating: 4.9,
        reviews: 203,
        image: 'resources/product-snail-cream.jpg',
        description: 'Intense hydration and skin repair'
    },
    {
        id: 'matcha-mask',
        name: 'Matcha Face Mask',
        category: 'skincare',
        ingredients: ['matcha'],
        price: 42,
        rating: 4.7,
        reviews: 78,
        image: 'resources/product-matcha-mask.jpg',
        description: 'Detoxifying and antioxidant-rich treatment'
    },
    {
        id: 'propolis-essence',
        name: 'Propolis Essence',
        category: 'skincare',
        ingredients: ['propolis'],
        price: 58,
        rating: 4.8,
        reviews: 94,
        image: 'resources/product-propolis-essence.jpg',
        description: 'Healing and anti-inflammatory essence'
    },
    {
        id: 'centella-cream',
        name: 'Centella Calming Cream',
        category: 'skincare',
        ingredients: ['centella'],
        price: 52,
        rating: 4.6,
        reviews: 112,
        image: 'resources/product-centella-cream.jpg',
        description: 'Soothing cream for sensitive skin'
    },
    {
        id: 'vitamin-c-serum',
        name: 'Vitamin C Brightening Serum',
        category: 'skincare',
        ingredients: ['vitamin-c'],
        price: 72,
        rating: 4.8,
        reviews: 145,
        image: 'resources/product-vitamin-c-serum.jpg',
        description: 'Brightening serum for radiant complexion'
    },
    
    // Supplements
    {
        id: 'ginseng-supplement',
        name: 'Korean Red Ginseng Extract',
        category: 'supplements',
        ingredients: ['ginseng'],
        price: 95,
        rating: 4.7,
        reviews: 67,
        image: 'resources/product-ginseng-supplement.jpg',
        description: 'Pure ginseng extract for energy and vitality'
    },
    {
        id: 'matcha-powder',
        name: 'Premium Matcha Green Tea',
        category: 'supplements',
        ingredients: ['matcha'],
        price: 38,
        rating: 4.8,
        reviews: 89,
        image: 'resources/product-matcha-powder.jpg',
        description: 'Ceremonial grade matcha powder'
    },
    {
        id: 'collagen',
        name: 'Marine Collagen Peptides',
        category: 'supplements',
        ingredients: ['collagen'],
        price: 68,
        rating: 4.6,
        reviews: 134,
        image: 'resources/product-collagen.jpg',
        description: 'Premium collagen for skin and joint health'
    },
    {
        id: 'probiotics',
        name: 'Probiotics for Skin Health',
        category: 'supplements',
        ingredients: ['probiotics'],
        price: 55,
        rating: 4.7,
        reviews: 92,
        image: 'resources/product-probiotics.jpg',
        description: 'Gut-skin connection support'
    },
    
    // Tea & Beverages
    {
        id: 'barley-tea',
        name: 'Traditional Barley Tea',
        category: 'tea',
        ingredients: ['barley'],
        price: 28,
        rating: 4.5,
        reviews: 156,
        image: 'resources/product-barley-tea.jpg',
        description: 'Caffeine-free roasted barley tea'
    },
    {
        id: 'jasmine-tea',
        name: 'Jasmine Green Tea',
        category: 'tea',
        ingredients: ['green-tea'],
        price: 32,
        rating: 4.8,
        reviews: 203,
        image: 'resources/product-jasmine-tea.jpg',
        description: 'Fragrant jasmine-infused green tea'
    },
    {
        id: 'citron-tea',
        name: 'Korean Citron Honey Tea',
        category: 'tea',
        ingredients: ['citron'],
        price: 25,
        rating: 4.7,
        reviews: 178,
        image: 'resources/product-citron-tea.jpg',
        description: 'Vitamin C-rich citrus tea blend'
    },
    
    // Bulcha Products
    {
        id: 'bulcha-mild',
        name: 'Bulcha Creamy Miso Delight',
        category: 'bulcha',
        ingredients: ['miso', 'coconut'],
        price: 89,
        rating: 4.8,
        reviews: 234,
        image: 'resources/bulcha-hero-ramen.jpg',
        description: 'Gentle miso broth with coconut milk, perfect for mild flavor lovers',
        badge: 'Best Seller'
    },
    {
        id: 'bulcha-medium',
        name: 'Bulcha Desi Spice Fusion',
        category: 'bulcha',
        ingredients: ['turmeric', 'cumin', 'coriander'],
        price: 95,
        rating: 4.7,
        reviews: 189,
        image: 'resources/bulcha-spicy-ramen.jpg',
        description: 'Traditional Indian spices meet Japanese ramen'
    },
    {
        id: 'bulcha-hot',
        name: 'Bulcha Fire Dragon Ramen',
        category: 'bulcha',
        ingredients: ['ghost-pepper', 'chili'],
        price: 99,
        rating: 4.6,
        reviews: 156,
        image: 'resources/bulcha-spicy-ramen.jpg',
        description: 'Bold and fiery with ghost pepper and Indian chili blends',
        badge: 'Limited'
    },
    {
        id: 'bulcha-gift-box',
        name: 'Bulcha Gift Collection',
        category: 'bulcha',
        ingredients: [],
        price: 299,
        rating: 4.9,
        reviews: 87,
        image: 'resources/bulcha-gift-box.jpg',
        description: 'All three flavors with premium chopsticks and recipe cards',
        badge: '25% OFF'
    },
    
    // Beauty Tools
    {
        id: 'jade-roller',
        name: 'Jade Roller Set',
        category: 'tools',
        ingredients: [],
        price: 48,
        rating: 4.6,
        reviews: 87,
        image: 'resources/product-jade-roller.jpg',
        description: 'Authentic jade roller for facial massage'
    },
    {
        id: 'gua-sha',
        name: 'Rose Quartz Gua Sha',
        category: 'tools',
        ingredients: [],
        price: 35,
        rating: 4.7,
        reviews: 112,
        image: 'resources/product-gua-sha.jpg',
        description: 'Traditional gua sha stone for lymphatic drainage'
    },
    {
        id: 'cleansing-brush',
        name: 'Silicone Cleansing Brush',
        category: 'tools',
        ingredients: [],
        price: 22,
        rating: 4.5,
        reviews: 145,
        image: 'resources/product-cleansing-brush.jpg',
        description: 'Gentle silicone brush for deep cleansing'
    }
];

// Quiz Questions and Logic
const quizQuestions = [
    {
        question: "What's your primary skin concern?",
        options: [
            { value: 'aging', label: 'Anti-aging & Firmness', description: 'Fine lines, wrinkles, loss of elasticity' },
            { value: 'hydration', label: 'Hydration & Dryness', description: 'Dry, flaky, or dehydrated skin' },
            { value: 'brightness', label: 'Brightness & Tone', description: 'Dullness, dark spots, uneven tone' },
            { value: 'sensitivity', label: 'Sensitivity & Calming', description: 'Redness, irritation, sensitive skin' }
        ]
    },
    {
        question: "What's your skin type?",
        options: [
            { value: 'dry', label: 'Dry', description: 'Feels tight, flaky, or rough' },
            { value: 'oily', label: 'Oily', description: 'Shiny, enlarged pores, prone to breakouts' },
            { value: 'combination', label: 'Combination', description: 'Oily T-zone, dry cheeks' },
            { value: 'sensitive', label: 'Sensitive', description: 'Easily irritated, reactive to products' }
        ]
    },
    {
        question: "How much time do you spend on skincare daily?",
        options: [
            { value: 'minimal', label: '5 minutes or less', description: 'Prefer quick, simple routines' },
            { value: 'moderate', label: '10-15 minutes', description: 'Enjoy a balanced routine' },
            { value: 'extensive', label: '20+ minutes', description: 'Love detailed, multi-step routines' }
        ]
    },
    {
        question: "What's most important to you in skincare products?",
        options: [
            { value: 'natural', label: 'Natural ingredients', description: 'Prefer plant-based, organic formulations' },
            { value: 'effective', label: 'Proven results', description: 'Want scientifically-backed ingredients' },
            { value: 'gentle', label: 'Gentle formulas', description: 'Need hypoallergenic, non-irritating products' },
            { value: 'luxury', label: 'Luxury experience', description: 'Enjoy premium textures and scents' }
        ]
    },
    {
        question: "What's your main wellness goal?",
        options: [
            { value: 'energy', label: 'Boost energy', description: 'Combat fatigue, improve vitality' },
            { value: 'stress', label: 'Reduce stress', description: 'Find calm and balance' },
            { value: 'immunity', label: 'Support immunity', description: 'Strengthen overall health' },
            { value: 'beauty', label: 'Enhance natural beauty', description: 'Glow from the inside out' }
        ]
    },
    {
        question: "How do you prefer to consume wellness supplements?",
        options: [
            { value: 'tea', label: 'Herbal teas', description: 'Enjoy warm, soothing beverages' },
            { value: 'capsules', label: 'Capsules/tablets', description: 'Convenient, no-fuss options' },
            { value: 'powder', label: 'Powder mixes', description: 'Versatile, can add to smoothies' },
            { value: 'liquid', label: 'Liquid extracts', description: 'Fast-absorbing, potent formulas' }
        ]
    }
];

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    updateCartDisplay();
    initializeAnimations();
    initializeEventListeners();
    
    // Page-specific initializations
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case 'index':
            initializeHomePage();
            break;
        case 'products':
            initializeProductsPage();
            break;
        case 'about':
            initializeAboutPage();
            break;
        case 'blogs':
            initializeBlogsPage();
            break;
    }
}

// Get Current Page
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('products.html')) return 'products';
    if (path.includes('about.html')) return 'about';
    if (path.includes('blogs.html')) return 'blogs';
    return 'index';
}

// Initialize Animations
function initializeAnimations() {
    // Initialize Splitting.js for text animations
    if (typeof Splitting !== 'undefined') {
        Splitting();
    }
    
    // Animate hero text on page load
    anime({
        targets: '.hero-text',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 1000,
        easing: 'easeOutQuart',
        delay: 500
    });
    
    // Animate product cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                anime({
                    targets: entry.target,
                    opacity: [0, 1],
                    translateY: [20, 0],
                    duration: 600,
                    easing: 'easeOutQuart'
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe product cards
    document.querySelectorAll('.product-card, .blog-card, .value-card').forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });
}

// Initialize Event Listeners
function initializeEventListeners() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Cart functionality
    const cartBtn = document.getElementById('cart-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');
    
    if (cartBtn) {
        cartBtn.addEventListener('click', openCart);
    }
    
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }
    
    // Add to cart buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = e.target.dataset.product;
            const price = parseFloat(e.target.dataset.price);
            addToCart(productId, price);
        }
    });
    
    // Newsletter forms
    const newsletterForm = document.getElementById('newsletter-form');
    const blogNewsletterForm = document.getElementById('blog-newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
    
    if (blogNewsletterForm) {
        blogNewsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
    
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

// Initialize Home Page
function initializeHomePage() {
    // Initialize typewriter effect
    if (typeof Typed !== 'undefined') {
        new Typed('#typed-text', {
            strings: [
                'Traditional Korean ingredients, modern results',
                'Authentic wellness for radiant skin',
                'Discover the power of natural beauty'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true
        });
    }
    
    // Initialize quiz
    initializeQuiz();
    
    // Initialize testimonial slider
    if (typeof Splide !== 'undefined') {
        new Splide('#testimonial-slider', {
            type: 'loop',
            perPage: 1,
            autoplay: true,
            interval: 5000,
            arrows: false,
            pagination: true
        }).mount();
    }
}

// Initialize Quiz
function initializeQuiz() {
    const quizBtn = document.getElementById('quiz-btn');
    const quizContent = document.getElementById('quiz-content');
    const quizResults = document.getElementById('quiz-results');
    const restartBtn = document.getElementById('restart-quiz');
    
    if (quizBtn) {
        quizBtn.addEventListener('click', startQuiz);
    }
    
    if (restartBtn) {
        restartBtn.addEventListener('click', restartQuiz);
    }
}

// Start Quiz
function startQuiz() {
    currentQuizStep = 0;
    quizAnswers = {};
    displayQuizQuestion();
}

// Display Quiz Question
function displayQuizQuestion() {
    const quizContent = document.getElementById('quiz-content');
    const quizResults = document.getElementById('quiz-results');
    
    if (quizResults) {
        quizResults.classList.add('hidden');
    }
    
    if (quizContent && currentQuizStep < quizQuestions.length) {
        const question = quizQuestions[currentQuizStep];
        let optionsHTML = '';
        
        question.options.forEach(option => {
            optionsHTML += `
                <button class="quiz-option p-4 border-2 border-sage/30 rounded-xl hover:border-sage hover:bg-sage/10 transition-all text-left" data-value="${option.value}">
                    <span class="font-semibold">${option.label}</span>
                    <p class="text-sm text-charcoal/70 mt-1">${option.description}</p>
                </button>
            `;
        });
        
        quizContent.innerHTML = `
            <div class="quiz-question active">
                <div class="flex items-center justify-between mb-6">
                    <h4 class="text-xl font-semibold text-charcoal">${question.question}</h4>
                    <span class="text-sm text-charcoal/60">${currentQuizStep + 1} of ${quizQuestions.length}</span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${optionsHTML}
                </div>
                <div class="mt-8 flex justify-between">
                    <button id="quiz-back" class="text-sage hover:text-deepforest transition-colors ${currentQuizStep === 0 ? 'invisible' : ''}">
                        ← Back
                    </button>
                    <div class="flex-1 mx-4">
                        <div class="w-full bg-sage/20 rounded-full h-2">
                            <div class="bg-sage h-2 rounded-full transition-all duration-300" style="width: ${((currentQuizStep + 1) / quizQuestions.length) * 100}%"></div>
                        </div>
                    </div>
                    <button id="quiz-next" class="text-sage hover:text-deepforest transition-colors invisible">
                        Next →
                    </button>
                </div>
            </div>
        `;
        
        // Add event listeners to options
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const value = e.currentTarget.dataset.value;
                selectQuizAnswer(value);
            });
        });
        
        // Add back button functionality
        const backBtn = document.getElementById('quiz-back');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                currentQuizStep--;
                displayQuizQuestion();
            });
        }
    }
}

// Select Quiz Answer
function selectQuizAnswer(value) {
    quizAnswers[`step${currentQuizStep}`] = value;
    
    // Update UI to show selection
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.classList.remove('border-sage', 'bg-sage/10');
        option.classList.add('border-sage/30');
    });
    
    const selectedOption = document.querySelector(`[data-value="${value}"]`);
    if (selectedOption) {
        selectedOption.classList.remove('border-sage/30');
        selectedOption.classList.add('border-sage', 'bg-sage/10');
    }
    
    // Auto-advance after selection
    setTimeout(() => {
        currentQuizStep++;
        if (currentQuizStep < quizQuestions.length) {
            displayQuizQuestion();
        } else {
            showQuizResults();
        }
    }, 500);
}

// Show Quiz Results
function showQuizResults() {
    const quizContent = document.getElementById('quiz-content');
    const quizResults = document.getElementById('quiz-results');
    const recommendations = document.getElementById('recommendations');
    
    if (quizContent) {
        quizContent.classList.add('hidden');
    }
    
    if (quizResults) {
        quizResults.classList.remove('hidden');
        
        // Generate recommendations based on answers
        const recommendedProducts = generateRecommendations();
        
        let recommendationsHTML = '';
        recommendedProducts.forEach(product => {
            recommendationsHTML += `
                <div class="bg-white rounded-2xl p-6 shadow-lg text-center">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-32 object-cover rounded-xl mb-4">
                    <h5 class="font-semibold text-charcoal mb-2">${product.name}</h5>
                    <p class="text-sm text-charcoal/70 mb-4">${product.description}</p>
                    <div class="flex items-center justify-between">
                        <span class="text-lg font-bold text-sage">$${product.price}</span>
                        <button class="add-to-cart bg-sage text-white px-4 py-2 rounded-full text-sm hover:bg-deepforest transition-colors" data-product="${product.id}" data-price="${product.price}">
                            Add to Cart
                        </button>
                    </div>
                </div>
            `;
        });
        
        recommendations.innerHTML = recommendationsHTML;
    }
}

// Generate Recommendations
function generateRecommendations() {
    const skinConcern = quizAnswers.step0;
    const skinType = quizAnswers.step1;
    const priority = quizAnswers.step3;
    
    let recommended = [];
    
    // Base recommendations on skin concern
    switch(skinConcern) {
        case 'aging':
            recommended.push(products.find(p => p.id === 'ginseng-serum'));
            recommended.push(products.find(p => p.id === 'collagen'));
            break;
        case 'hydration':
            recommended.push(products.find(p => p.id === 'snail-cream'));
            recommended.push(products.find(p => p.id === 'rice-toner'));
            break;
        case 'brightness':
            recommended.push(products.find(p => p.id === 'vitamin-c-serum'));
            recommended.push(products.find(p => p.id === 'rice-toner'));
            break;
        case 'sensitivity':
            recommended.push(products.find(p => p.id === 'centella-cream'));
            recommended.push(products.find(p => p.id === 'propolis-essence'));
            break;
    }
    
    // Add wellness products based on goals
    const wellnessGoal = quizAnswers.step4;
    if (wellnessGoal === 'energy') {
        recommended.push(products.find(p => p.id === 'ginseng-supplement'));
    } else if (wellnessGoal === 'beauty') {
        recommended.push(products.find(p => p.id === 'matcha-powder'));
    }
    
    // Ensure we have 3 recommendations
    while (recommended.length < 3) {
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        if (!recommended.find(p => p.id === randomProduct.id)) {
            recommended.push(randomProduct);
        }
    }
    
    return recommended.slice(0, 3);
}

// Restart Quiz
function restartQuiz() {
    currentQuizStep = 0;
    quizAnswers = {};
    const quizContent = document.getElementById('quiz-content');
    const quizResults = document.getElementById('quiz-results');
    
    if (quizResults) {
        quizResults.classList.add('hidden');
    }
    
    if (quizContent) {
        quizContent.classList.remove('hidden');
        displayQuizQuestion();
    }
}

// Initialize Products Page
function initializeProductsPage() {
    renderProducts();
    initializeFilters();
}

// Render Products
function renderProducts(filteredProducts = products) {
    const productsGrid = document.getElementById('products-grid');
    const productsCount = document.getElementById('products-count');
    
    if (productsGrid) {
        let productsHTML = '';
        
        filteredProducts.forEach(product => {
            const badgeHTML = product.badge ? `<div class="absolute top-4 right-4 bg-gold text-white px-2 py-1 rounded-full text-sm font-semibold">${product.badge}</div>` : '';
            
            productsHTML += `
                <div class="product-card bg-white rounded-2xl overflow-hidden shadow-lg">
                    <div class="relative">
                        <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
                        ${badgeHTML}
                    </div>
                    <div class="p-6">
                        <h4 class="text-xl font-semibold text-charcoal mb-2">${product.name}</h4>
                        <p class="text-charcoal/70 text-sm mb-4">${product.description}</p>
                        <div class="flex items-center mb-4">
                            <div class="flex text-gold">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</div>
                            <span class="text-sm text-charcoal/60 ml-2">(${product.reviews} reviews)</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-2xl font-bold text-sage">$${product.price}</span>
                            <button class="add-to-cart bg-sage text-white px-4 py-2 rounded-full hover:bg-deepforest transition-colors" data-product="${product.id}" data-price="${product.price}">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        productsGrid.innerHTML = productsHTML;
        
        // Animate new products
        anime({
            targets: '.product-card',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 600,
            delay: anime.stagger(100),
            easing: 'easeOutQuart'
        });
    }
    
    if (productsCount) {
        productsCount.textContent = filteredProducts.length;
    }
}

// Initialize Filters
function initializeFilters() {
    // Category filters
    const categoryFilters = document.querySelectorAll('.category-filter');
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
    
    // Ingredient filters
    const ingredientFilters = document.querySelectorAll('.filter-tag');
    ingredientFilters.forEach(filter => {
        filter.addEventListener('click', (e) => {
            e.target.classList.toggle('active');
            applyFilters();
        });
    });
    
    // Price range
    const priceRange = document.getElementById('price-range');
    const priceValue = document.getElementById('price-value');
    
    if (priceRange && priceValue) {
        priceRange.addEventListener('input', (e) => {
            priceValue.textContent = `$${e.target.value}`;
            applyFilters();
        });
    }
    
    // Sort
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilters);
    }
    
    // Search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
    
    // Clear filters
    const clearFiltersBtn = document.getElementById('clear-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
}

// Apply Filters
function applyFilters() {
    let filteredProducts = [...products];
    
    // Category filter
    const selectedCategories = Array.from(document.querySelectorAll('.category-filter:checked'))
        .map(cb => cb.value);
    
    if (selectedCategories.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            selectedCategories.includes(product.category)
        );
    }
    
    // Ingredient filter
    const selectedIngredients = Array.from(document.querySelectorAll('.filter-tag.active'))
        .map(btn => btn.dataset.ingredient);
    
    if (selectedIngredients.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            selectedIngredients.some(ingredient => product.ingredients.includes(ingredient))
        );
    }
    
    // Price filter
    const priceRange = document.getElementById('price-range');
    if (priceRange) {
        const maxPrice = parseFloat(priceRange.value);
        filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);
    }
    
    // Search filter
    const searchInput = document.getElementById('search-input');
    if (searchInput && searchInput.value.trim()) {
        const searchTerm = searchInput.value.toLowerCase();
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm))
        );
    }
    
    // Sort
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        const sortBy = sortSelect.value;
        
        switch(sortBy) {
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                // Simulate newest by reversing array
                filteredProducts.reverse();
                break;
            default:
                // Featured - keep original order
                break;
        }
    }
    
    renderProducts(filteredProducts);
    updateActiveFilters();
}

// Update Active Filters
function updateActiveFilters() {
    const activeFiltersContainer = document.getElementById('active-filters');
    const filterTagsContainer = document.getElementById('filter-tags');
    
    if (!activeFiltersContainer || !filterTagsContainer) return;
    
    let activeFilters = [];
    
    // Check category filters
    document.querySelectorAll('.category-filter:checked').forEach(filter => {
        activeFilters.push({ type: 'category', value: filter.value });
    });
    
    // Check ingredient filters
    document.querySelectorAll('.filter-tag.active').forEach(filter => {
        activeFilters.push({ type: 'ingredient', value: filter.dataset.ingredient });
    });
    
    if (activeFilters.length > 0) {
        activeFiltersContainer.classList.remove('hidden');
        
        let tagsHTML = '';
        activeFilters.forEach(filter => {
            tagsHTML += `
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-sage text-white">
                    ${filter.value}
                    <button class="ml-2 hover:text-white/80" onclick="removeFilter('${filter.type}', '${filter.value}')">×</button>
                </span>
            `;
        });
        
        filterTagsContainer.innerHTML = tagsHTML;
    } else {
        activeFiltersContainer.classList.add('hidden');
    }
}

// Remove Filter
function removeFilter(type, value) {
    if (type === 'category') {
        const checkbox = document.querySelector(`.category-filter[value="${value}"]`);
        if (checkbox) {
            checkbox.checked = false;
        }
    } else if (type === 'ingredient') {
        const button = document.querySelector(`.filter-tag[data-ingredient="${value}"]`);
        if (button) {
            button.classList.remove('active');
        }
    }
    
    applyFilters();
}

// Clear All Filters
function clearAllFilters() {
    // Uncheck category filters
    document.querySelectorAll('.category-filter').forEach(filter => {
        filter.checked = true;
    });
    
    // Remove active ingredient filters
    document.querySelectorAll('.filter-tag.active').forEach(filter => {
        filter.classList.remove('active');
    });
    
    // Reset price range
    const priceRange = document.getElementById('price-range');
    const priceValue = document.getElementById('price-value');
    if (priceRange && priceValue) {
        priceRange.value = priceRange.max;
        priceValue.textContent = `$${priceRange.max}`;
    }
    
    // Clear search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Reset sort
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.value = 'featured';
    }
    
    applyFilters();
}

// Initialize About Page
function initializeAboutPage() {
    // Animate timeline items on scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                anime({
                    targets: entry.target,
                    opacity: [0, 1],
                    translateX: entry.target.querySelector('.w-1\/2:first-child') ? [-50, 0] : [50, 0],
                    duration: 800,
                    easing: 'easeOutQuart'
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        observer.observe(item);
    });
}

// Initialize Blogs Page
function initializeBlogsPage() {
    // Category filters
    const categoryFilters = document.querySelectorAll('.category-filter');
    categoryFilters.forEach(filter => {
        filter.addEventListener('click', (e) => {
            // Remove active class from all filters
            categoryFilters.forEach(f => f.classList.remove('active'));
            // Add active class to clicked filter
            e.target.classList.add('active');
            
            filterArticles(e.target.dataset.category);
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('blog-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchArticles(e.target.value);
        });
    }
    
    // Load more articles
    const loadMoreBtn = document.getElementById('load-more-articles');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreArticles);
    }
}

// Filter Articles
function filterArticles(category) {
    const articles = document.querySelectorAll('[data-category]');
    const articlesCount = document.getElementById('articles-count');
    let visibleCount = 0;
    
    articles.forEach(article => {
        if (category === 'all' || article.dataset.category === category) {
            article.style.display = 'block';
            visibleCount++;
        } else {
            article.style.display = 'none';
        }
    });
    
    if (articlesCount) {
        articlesCount.textContent = visibleCount;
    }
}

// Search Articles
function searchArticles(searchTerm) {
    const articles = document.querySelectorAll('.blog-card');
    const articlesCount = document.getElementById('articles-count');
    let visibleCount = 0;
    
    articles.forEach(article => {
        const title = article.querySelector('h4').textContent.toLowerCase();
        const content = article.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm.toLowerCase()) || content.includes(searchTerm.toLowerCase())) {
            article.style.display = 'block';
            visibleCount++;
        } else {
            article.style.display = 'none';
        }
    });
    
    if (articlesCount) {
        articlesCount.textContent = visibleCount;
    }
}

// Load More Articles
function loadMoreArticles() {
    // Simulate loading more articles
    alert('More articles loaded! In a real implementation, this would fetch additional articles from the server.');
}

// Cart Management
function addToCart(productId, price) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    saveCart();
    showCartNotification();
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    saveCart();
}

// Update Cart Quantity
function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            updateCartDisplay();
            saveCart();
        }
    }
}

// Update Cart Display
function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartFooter = document.getElementById('cart-footer');
    const emptyCart = document.getElementById('empty-cart');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Update cart count
    if (cartCount) {
        cartCount.textContent = totalItems;
        if (totalItems > 0) {
            cartCount.classList.add('cart-counter');
            setTimeout(() => cartCount.classList.remove('cart-counter'), 300);
        }
    }
    
    // Update cart items
    if (cartItems) {
        if (cart.length === 0) {
            if (emptyCart) emptyCart.style.display = 'block';
            if (cartFooter) cartFooter.classList.add('hidden');
        } else {
            if (emptyCart) emptyCart.style.display = 'none';
            if (cartFooter) cartFooter.classList.remove('hidden');
            
            let cartHTML = '';
            cart.forEach(item => {
                cartHTML += `
                    <div class="flex items-center space-x-4 p-4 border-b border-sage/20">
                        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg">
                        <div class="flex-1">
                            <h4 class="font-semibold text-charcoal text-sm">${item.name}</h4>
                            <p class="text-sage font-bold">$${item.price}</p>
                        </div>
                        <div class="flex items-center space-x-2">
                            <button onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})" class="w-8 h-8 rounded-full bg-sage/10 text-sage hover:bg-sage hover:text-white transition-colors">-</button>
                            <span class="w-8 text-center">${item.quantity}</span>
                            <button onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})" class="w-8 h-8 rounded-full bg-sage/10 text-sage hover:bg-sage hover:text-white transition-colors">+</button>
                        </div>
                        <button onclick="removeFromCart('${item.id}')" class="text-dustyrose hover:text-red-600 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </div>
                `;
            });
            
            cartItems.innerHTML = cartHTML;
        }
    }
    
    // Update total
    if (cartTotal) {
        cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
    }
}

// Open Cart
function openCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.remove('translate-x-full');
        cartOverlay.classList.remove('opacity-0', 'invisible');
        document.body.style.overflow = 'hidden';
    }
}

// Close Cart
function closeCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.add('translate-x-full');
        cartOverlay.classList.add('opacity-0', 'invisible');
        document.body.style.overflow = '';
    }
}

// Save Cart to LocalStorage
function saveCart() {
    localStorage.setItem('seoulveda-cart', JSON.stringify(cart));
}

// Show Cart Notification
function showCartNotification() {
    // Create and show a temporary notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-sage text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    notification.textContent = 'Added to cart!';
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Handle Newsletter Submission
function handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    // Simulate newsletter subscription
    alert(`Thank you for subscribing with ${email}! You'll receive our latest wellness tips and product updates.`);
    e.target.reset();
}

// Handle Contact Form Submission
function handleContactSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Simulate form submission
    alert(`Thank you for your message! We'll get back to you soon at ${formData.get('email')}.`);
    e.target.reset();
}

// Utility Functions
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

// Make functions globally available
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.removeFilter = removeFilter;