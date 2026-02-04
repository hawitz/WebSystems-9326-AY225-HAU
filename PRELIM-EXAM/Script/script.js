// Campaign Data
const campaigns = [
    {
        id: 1,
        title: "Typhoon Relief Operation",
        description: "Providing emergency shelter, food, and medical assistance to families affected by recent typhoons in Eastern Visayas.",
        raised: 1250000,
        goal: 2000000,
        icon: "fas fa-umbrella",
        category: "disaster"
    },
    {
        id: 2,
        title: "Blood Donation Drive",
        description: "Ensuring safe and adequate blood supply for hospitals and medical facilities nationwide. Our goal is to collect 50,000 units.",
        raised: 750000,
        goal: 1500000,
        icon: "fas fa-tint",
        category: "blood"
    },
    {
        id: 3,
        title: "Community Health Initiative",
        description: "Bringing free medical check-ups and essential medicines to remote communities in Mindanao and Visayas.",
        raised: 500000,
        goal: 1000000,
        icon: "fas fa-heartbeat",
        category: "health"
    },
    {
        id: 4,
        title: "Youth First Aid Training",
        description: "Training 10,000 students in basic first aid and disaster preparedness across 100 schools nationwide.",
        raised: 300000,
        goal: 800000,
        icon: "fas fa-user-graduate",
        category: "youth"
    },
    {
        id: 5,
        title: "Clean Water Access Project",
        description: "Installing water filtration systems in drought-affected communities in Palawan and Mindoro.",
        raised: 900000,
        goal: 1500000,
        icon: "fas fa-tint",
        category: "health"
    },
    {
        id: 6,
        title: "Emergency Vehicle Fund",
        description: "Purchasing 5 new ambulances and 2 rescue boats to improve emergency response capabilities.",
        raised: 3500000,
        goal: 5000000,
        icon: "fas fa-ambulance",
        category: "disaster"
    }
];

// Calendar Events
const calendarEvents = [
    { date: "2023-11-15", title: "National Blood Donation Day", type: "blood" },
    { date: "2023-11-20", title: "Disaster Response Training", type: "training" },
    { date: "2023-11-21", title: "Disaster Response Training Day 2", type: "training" },
    { date: "2023-11-25", title: "Community Health Fair", type: "health" },
    { date: "2023-12-05", title: "Red Cross Youth Assembly", type: "youth" },
    { date: "2023-12-10", title: "First Aid Instructor Course", type: "training" },
    { date: "2023-12-15", title: "Holiday Gift Giving", type: "community" }
];

// Chapter Data
const chapters = [
    { name: "Metro Manila Chapter", location: "PRC National Headquarters, Mandaluyong City", phone: "(02) 8790-2300", email: "ncr@redcross.org.ph" },
    { name: "Cebu Chapter", location: "Osmeña Blvd, Cebu City", phone: "(032) 253-5151", email: "cebu@redcross.org.ph" },
    { name: "Davao Chapter", location: "J.P. Laurel Avenue, Bajada, Davao City", phone: "(082) 227-9341", email: "davao@redcross.org.ph" },
    { name: "Ilocos Norte Chapter", location: "G. Castro Street, Laoag City", phone: "(077) 772-0370", email: "ilocosnorte@redcross.org.ph" },
    { name: "Iloilo Chapter", location: "Gen. Luna Street, Iloilo City", phone: "(033) 337-2491", email: "iloilo@redcross.org.ph" },
    { name: "Bicol Chapter", location: "Penafrancia Avenue, Naga City", phone: "(054) 811-5081", email: "bicol@redcross.org.ph" },
    { name: "Pampanga Chapter", location: "San Fernando, Pampanga", phone: "(045) 961-3085", email: "pampanga@redcross.org.ph" },
    { name: "Benguet Chapter", location: "Baguio City", phone: "(074) 442-8031", email: "benguet@redcross.org.ph" }
];

// DOM Elements
let campaignContainer, campaignModal, modalClose, modalTitle, modalDescription, modalRaised, modalGoal, modalProgressBar;
let mobileMenuBtn, mainNav;
let currentMonthDisplay, calendarElement, prevMonthBtn, nextMonthBtn;
let filterButtons, campaignsContainerElement;
let chapterSearchInput, searchBtn, chaptersContainerElement;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize elements that exist on the current page
    initCommonElements();
    initPageSpecificElements();
    
    // Setup mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
        
        // Close mobile menu when clicking a link
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    mainNav.classList.remove('active');
                }
            });
        });
    }
    
    // Set active navigation based on current page
    setActiveNav();
    
    // Initialize page-specific functionality
    const currentPage = window.location.pathname.split('/').pop();
    switch(currentPage) {
        case 'home.html':
        case '':
            initHomePage();
            break;
        case 'events.html':
            initEventsPage();
            break;
        case 'volunteer.html':
            initVolunteerPage();
            break;
        case 'contact.html':
            initContactPage();
            break;
    }
});

// Initialize elements common to all pages
function initCommonElements() {
    campaignContainer = document.getElementById('campaignContainer');
    campaignModal = document.getElementById('campaignModal');
    modalClose = document.getElementById('modalClose');
    modalTitle = document.getElementById('modalTitle');
    modalDescription = document.getElementById('modalDescription');
    modalRaised = document.getElementById('modalRaised');
    modalGoal = document.getElementById('modalGoal');
    modalProgressBar = document.getElementById('modalProgressBar');
    mobileMenuBtn = document.getElementById('mobileMenuBtn');
    mainNav = document.getElementById('mainNav');
    
    // Close modal when clicking X or outside modal
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (campaignModal) {
        campaignModal.addEventListener('click', function(e) {
            if (e.target === campaignModal) {
                closeModal();
            }
        });
    }
    
    // Newsletter form submission
    const newsletterForms = document.querySelectorAll('#newsletterForm');
    newsletterForms.forEach(form => {
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = this.querySelector('input[type="email"]').value;
                alert(`Thank you for subscribing with ${email}! You'll receive our newsletter soon.`);
                this.reset();
            });
        }
    });
}

// Initialize page-specific elements
function initPageSpecificElements() {
    currentMonthDisplay = document.getElementById('currentMonth');
    calendarElement = document.getElementById('calendar');
    prevMonthBtn = document.getElementById('prevMonth');
    nextMonthBtn = document.getElementById('nextMonth');
    
    filterButtons = document.querySelectorAll('.filter-btn');
    campaignsContainerElement = document.getElementById('campaignsContainer');
    
    chapterSearchInput = document.getElementById('chapterSearch');
    searchBtn = document.getElementById('searchBtn');
    chaptersContainerElement = document.getElementById('chaptersContainer');
}

// Initialize home page functionality
function initHomePage() {
    // Load campaign cards
    if (campaignContainer) {
        loadCampaigns();
    }
    
    // Animate statistics
    animateStatistics();
}

// Initialize events page functionality
function initEventsPage() {
    // Load campaigns with filter functionality
    if (campaignsContainerElement) {
        loadFilteredCampaigns('all');
        
        // Add event listeners to filter buttons
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                // Load campaigns with selected filter
                const filter = this.getAttribute('data-filter');
                loadFilteredCampaigns(filter);
            });
        });
    }
    
    // Initialize calendar
    if (calendarElement) {
        initCalendar();
        
        // Add event listeners to calendar navigation
        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', showPreviousMonth);
        }
        
        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', showNextMonth);
        }
    }
}

// Initialize volunteer page functionality
function initVolunteerPage() {
    // Add event listeners to donation amount buttons
    document.querySelectorAll('.amount-btn').forEach(button => {
        button.addEventListener('click', function() {
            const amount = this.getAttribute('data-amount');
            showDonationAlert(amount);
        });
    });
    
    // Set volunteer type when clicking apply buttons
    window.setVolunteerType = function(type) {
        const volunteerTypeSelect = document.getElementById('volunteerType');
        if (volunteerTypeSelect) {
            volunteerTypeSelect.value = type;
            // Scroll to form
            document.getElementById('volunteerForm').scrollIntoView({ behavior: 'smooth' });
        }
    };
}

// Initialize contact page functionality
function initContactPage() {
    // Initialize chapter search
    if (searchBtn && chapterSearchInput && chaptersContainerElement) {
        loadChapters();
        
        searchBtn.addEventListener('click', searchChapters);
        chapterSearchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchChapters();
            }
        });
    }
}

// Function to load campaign cards
function loadCampaigns() {
    if (!campaignContainer) return;
    
    campaignContainer.innerHTML = '';
    
    // Show only first 3 campaigns on homepage
    const displayCampaigns = campaigns.slice(0, 3);
    
    displayCampaigns.forEach(campaign => {
        const progressPercent = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100);
        
        const campaignCard = document.createElement('div');
        campaignCard.className = 'campaign-card';
        campaignCard.innerHTML = `
            <div class="campaign-img">
                <i class="${campaign.icon}"></i>
            </div>
            <div class="campaign-content">
                <h3>${campaign.title}</h3>
                <p>${campampaign.description}</p>
                <div class="campaign-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                    <div class="progress-info">
                        <span>Raised: ₱${campaign.raised.toLocaleString()}</span>
                        <span>Goal: ₱${campaign.goal.toLocaleString()}</span>
                    </div>
                </div>
                <button class="btn" onclick="openCampaignModal(${campaign.id})" style="margin-top: 15px; width: 100%;">Learn More</button>
            </div>
        `;
        
        campaignContainer.appendChild(campaignCard);
    });
}

// Function to load filtered campaigns
function loadFilteredCampaigns(filter) {
    if (!campaignsContainerElement) return;
    
    campaignsContainerElement.innerHTML = '';
    
    let filteredCampaigns = campaigns;
    
    if (filter !== 'all') {
        filteredCampaigns = campaigns.filter(campaign => campaign.category === filter);
    }
    
    filteredCampaigns.forEach(campaign => {
        const progressPercent = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100);
        
        const campaignCard = document.createElement('div');
        campaignCard.className = 'campaign-card';
        campaignCard.innerHTML = `
            <div class="campaign-img">
                <i class="${campaign.icon}"></i>
            </div>
            <div class="campaign-content">
                <h3>${campaign.title}</h3>
                <p>${campaign.description}</p>
                <div class="campaign-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                    <div class="progress-info">
                        <span>Raised: ₱${campaign.raised.toLocaleString()}</span>
                        <span>Goal: ₱${campaign.goal.toLocaleString()}</span>
                    </div>
                </div>
                <button class="btn" onclick="openCampaignModal(${campaign.id})" style="margin-top: 15px; width: 100%;">Support This Campaign</button>
            </div>
        `;
        
        campaignsContainerElement.appendChild(campaignCard);
    });
}

// Function to open campaign modal
function openCampaignModal(campaignId) {
    const campaign = campaigns.find(c => c.id === campaignId);
    const progressPercent = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100);
    
    modalTitle.textContent = campaign.title;
    modalDescription.textContent = campaign.description;
    modalRaised.textContent = `₱${campaign.raised.toLocaleString()}`;
    modalGoal.textContent = `₱${campaign.goal.toLocaleString()}`;
    modalProgressBar.style.width = `${progressPercent}%`;
    
    campaignModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// Function to close modal
function closeModal() {
    campaignModal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

// Function to set active navigation link
function setActiveNav() {
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Remove active class from all nav links
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
        
        // Add active class to current page link
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
        
        // Special case for index.html
        if (currentPage === '' && link.getAttribute('href') === 'index.html') {
            link.classList.add('active');
        }
    });
}

// Function to animate statistics on homepage
function animateStatistics() {
    const stat1 = document.getElementById('stat1');
    const stat2 = document.getElementById('stat2');
    const stat3 = document.getElementById('stat3');
    const stat4 = document.getElementById('stat4');
    
    if (stat1 && stat2 && stat3 && stat4) {
        animateValue(stat1, 0, 12500, 2000);
        animateValue(stat2, 0, 5200, 2000);
        animateValue(stat3, 0, 850, 2000);
        animateValue(stat4, 0, 425, 2000);
    }
}

// Function to animate a value from start to end
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString() + (element.id === 'stat4' ? 'K' : '+');
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Volunteer Form Validation
function validateVolunteerForm() {
    const form = document.getElementById('volunteerRegistrationForm');
    if (!form) return false;
    
    const volunteerType = document.getElementById('volunteerType');
    const preferredChapter = document.getElementById('preferredChapter');
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const birthdate = document.getElementById('birthdate');
    const availability = document.getElementById('availability');
    const motivation = document.getElementById('motivation');
    const agreeTerms = document.getElementById('agreeTerms');
    
    const errorMessages = document.querySelectorAll('.error-message');
    let isValid = true;
    
    // Reset error messages
    errorMessages.forEach(error => error.classList.remove('active'));
    
    // Validate volunteer type
    if (!volunteerType.value) {
        document.getElementById('volunteerTypeError').textContent = 'Please select a volunteer type';
        document.getElementById('volunteerTypeError').classList.add('active');
        isValid = false;
    }
    
    // Validate preferred chapter
    if (!preferredChapter.value) {
        document.getElementById('chapterError').textContent = 'Please select a preferred chapter';
        document.getElementById('chapterError').classList.add('active');
        isValid = false;
    }
    
    // Validate name
    if (!firstName.value.trim()) {
        document.getElementById('firstNameError').textContent = 'First name is required';
        document.getElementById('firstNameError').classList.add('active');
        isValid = false;
    }
    
    if (!lastName.value.trim()) {
        document.getElementById('lastNameError').textContent = 'Last name is required';
        document.getElementById('lastNameError').classList.add('active');
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        document.getElementById('emailError').textContent = 'Email is required';
        document.getElementById('emailError').classList.add('active');
        isValid = false;
    } else if (!emailRegex.test(email.value)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address';
        document.getElementById('emailError').classList.add('active');
        isValid = false;
    }
    
    // Validate phone
    const phoneRegex = /^[0-9+\-\s()]{10,}$/;
    if (!phone.value.trim()) {
        document.getElementById('phoneError').textContent = 'Phone number is required';
        document.getElementById('phoneError').classList.add('active');
        isValid = false;
    } else if (!phoneRegex.test(phone.value)) {
        document.getElementById('phoneError').textContent = 'Please enter a valid phone number';
        document.getElementById('phoneError').classList.add('active');
        isValid = false;
    }
    
    // Validate birthdate
    if (!birthdate.value) {
        document.getElementById('birthdateError').textContent = 'Birthdate is required';
        document.getElementById('birthdateError').classList.add('active');
        isValid = false;
    } else {
        const birthDate = new Date(birthdate.value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        if (age < 16) {
            document.getElementById('birthdateError').textContent = 'You must be at least 16 years old to volunteer';
            document.getElementById('birthdateError').classList.add('active');
            isValid = false;
        }
    }
    
    // Validate availability
    if (!availability.value) {
        document.getElementById('availabilityError').textContent = 'Please select your availability';
        document.getElementById('availabilityError').classList.add('active');
        isValid = false;
    }
    
    // Validate motivation
    if (!motivation.value.trim()) {
        document.getElementById('motivationError').textContent = 'Please tell us why you want to volunteer';
        document.getElementById('motivationError').classList.add('active');
        isValid = false;
    } else if (motivation.value.trim().length < 50) {
        document.getElementById('motivationError').textContent = 'Please provide more detail (at least 50 characters)';
        document.getElementById('motivationError').classList.add('active');
        isValid = false;
    }
    
    // Validate terms agreement
    if (!agreeTerms.checked) {
        document.getElementById('termsError').textContent = 'You must agree to the terms and conditions';
        document.getElementById('termsError').classList.add('active');
        isValid = false;
    }
    
    if (isValid) {
        // Show success message
        document.getElementById('formSuccess').classList.add('active');
        form.reset();
        
        // Scroll to success message
        document.getElementById('formSuccess').scrollIntoView({ behavior: 'smooth' });
        
        // Hide success message after 8 seconds (optional)
        setTimeout(() => {
            document.getElementById('formSuccess').classList.remove('active');
        }, 8000);
    }
    
    return false; // Prevent form submission for demo
}

// Contact Form Validation
function validateContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return false;
    
    const contactName = document.getElementById('contactName');
    const contactEmail = document.getElementById('contactEmail');
    const contactSubject = document.getElementById('contactSubject');
    const contactMessage = document.getElementById('contactMessage');
    const contactAgree = document.getElementById('contactAgree');
    
    const errorMessages = document.querySelectorAll('.error-message');
    let isValid = true;
    
    // Reset error messages
    errorMessages.forEach(error => error.classList.remove('active'));
    
    // Validate name
    if (!contactName.value.trim()) {
        document.getElementById('contactNameError').textContent = 'Name is required';
        document.getElementById('contactNameError').classList.add('active');
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!contactEmail.value.trim()) {
        document.getElementById('contactEmailError').textContent = 'Email is required';
        document.getElementById('contactEmailError').classList.add('active');
        isValid = false;
    } else if (!emailRegex.test(contactEmail.value)) {
        document.getElementById('contactEmailError').textContent = 'Please enter a valid email address';
        document.getElementById('contactEmailError').classList.add('active');
        isValid = false;
    }
    
    // Validate subject
    if (!contactSubject.value) {
        document.getElementById('contactSubjectError').textContent = 'Please select a subject';
        document.getElementById('contactSubjectError').classList.add('active');
        isValid = false;
    }
    
    // Validate message
    if (!contactMessage.value.trim()) {
        document.getElementById('contactMessageError').textContent = 'Message is required';
        document.getElementById('contactMessageError').classList.add('active');
        isValid = false;
    } else if (contactMessage.value.trim().length < 20) {
        document.getElementById('contactMessageError').textContent = 'Please provide more detail (at least 20 characters)';
        document.getElementById('contactMessageError').classList.add('active');
        isValid = false;
    }
    
    // Validate agreement
    if (!contactAgree.checked) {
        document.getElementById('contactAgreeError').textContent = 'You must agree to the privacy policy';
        document.getElementById('contactAgreeError').classList.add('active');
        isValid = false;
    }
    
    if (isValid) {
        // Show success message
        document.getElementById('contactFormSuccess').classList.add('active');
        form.reset();
        
        // Scroll to success message
        document.getElementById('contactFormSuccess').scrollIntoView({ behavior: 'smooth' });
        
        // Hide success message after 8 seconds (optional)
        setTimeout(() => {
            document.getElementById('contactFormSuccess').classList.remove('active');
        }, 8000);
    }
    
    return false; // Prevent form submission for demo
}

// Function to show donation alert
function processDonation(type) {
    let amount = 0;
    
    if (type === 'custom') {
        const customAmountInput = document.getElementById('customAmount');
        amount = parseInt(customAmountInput.value) || 0;
        
        if (amount <= 0) {
            alert('Please enter a valid donation amount.');
            return;
        }
    } else if (type === 'monthly') {
        amount = 500; // Default monthly amount
    }
    
    const formattedAmount = amount.toLocaleString();
    const message = type === 'monthly' 
        ? `Thank you for becoming a monthly donor with ₱${formattedAmount}! You'll be redirected to our secure payment gateway to set up your monthly donation.`
        : `Thank you for your generous donation of ₱${formattedAmount}! You'll be redirected to our secure payment gateway to complete your donation.`;
    
    alert(message);
    
    // In a real implementation, this would redirect to a payment page
    // window.location.href = `https://payment.redcross.org.ph/donate?amount=${amount}&type=${type}`;
}

// Function to show donation alert for amount buttons
function showDonationAlert(amount) {
    alert(`Thank you for your generous donation of ₱${amount}! You will be redirected to our secure payment gateway.`);
}

// Calendar functionality
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

function initCalendar() {
    updateCalendar();
}

function updateCalendar() {
    if (!currentMonthDisplay || !calendarElement) return;
    
    // Update month display
    const monthNames = ["January", "February", "March", "April", "May", "June", 
                        "July", "August", "September", "October", "November", "December"];
    currentMonthDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    // Clear calendar
    calendarElement.innerHTML = '';
    
    // Add day headers
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    days.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        calendarElement.appendChild(dayElement);
    });
    
    // Get first day of month
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    // Get days in month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-date empty';
        calendarElement.appendChild(emptyCell);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateCell = document.createElement('div');
        dateCell.className = 'calendar-date';
        dateCell.textContent = day;
        
        // Check if this date has an event
        const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const event = calendarEvents.find(e => e.date === dateString);
        
        if (event) {
            dateCell.classList.add('event');
            dateCell.title = event.title;
        }
        
        // Add click event to show event details
        dateCell.addEventListener('click', function() {
            if (event) {
                alert(`Event on ${monthNames[currentMonth]} ${day}, ${currentYear}: ${event.title}`);
            }
        });
        
        calendarElement.appendChild(dateCell);
    }
}

function showPreviousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    updateCalendar();
}

function showNextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    updateCalendar();
}

// Chapter search functionality
function loadChapters() {
    if (!chaptersContainerElement) return;
    
    chaptersContainerElement.innerHTML = '';
    
    chapters.forEach(chapter => {
        const chapterCard = document.createElement('div');
        chapterCard.className = 'chapter-card';
        chapterCard.innerHTML = `
            <h3>${chapter.name}</h3>
            <p><i class="fas fa-map-marker-alt"></i> ${chapter.location}</p>
            <p><i class="fas fa-phone"></i> ${chapter.phone}</p>
            <p><i class="fas fa-envelope"></i> ${chapter.email}</p>
            <a href="#" class="btn">View Details</a>
        `;
        
        chaptersContainerElement.appendChild(chapterCard);
    });
}

function searchChapters() {
    if (!chaptersContainerElement || !chapterSearchInput) return;
    
    const searchTerm = chapterSearchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        loadChapters();
        return;
    }
    
    const filteredChapters = chapters.filter(chapter => 
        chapter.name.toLowerCase().includes(searchTerm) || 
        chapter.location.toLowerCase().includes(searchTerm)
    );
    
    chaptersContainerElement.innerHTML = '';
    
    if (filteredChapters.length === 0) {
        chaptersContainerElement.innerHTML = '<p class="no-results">No chapters found matching your search.</p>';
        return;
    }
    
    filteredChapters.forEach(chapter => {
        const chapterCard = document.createElement('div');
        chapterCard.className = 'chapter-card';
        chapterCard.innerHTML = `
            <h3>${chapter.name}</h3>
            <p><i class="fas fa-map-marker-alt"></i> ${chapter.location}</p>
            <p><i class="fas fa-phone"></i> ${chapter.phone}</p>
            <p><i class="fas fa-envelope"></i> ${chapter.email}</p>
            <a href="#" class="btn">View Details</a>
        `;
        
        chaptersContainerElement.appendChild(chapterCard);
    });
}