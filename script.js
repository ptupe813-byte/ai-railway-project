// Smart AI Railway Reservation System JavaScript

// Mock data
const trains = [
    { id: 1, name: 'Express 101', from: 'Delhi', to: 'Mumbai', date: '2024-04-20', seats: { '1A': 10, '2A': 15, '3A': 20, 'Sleeper': 50 } },
    { id: 2, name: 'Superfast 202', from: 'Delhi', to: 'Chennai', date: '2024-04-20', seats: { '1A': 5, '2A': 10, '3A': 25, 'Sleeper': 40 } },
    { id: 3, name: 'Rajdhani 303', from: 'Delhi', to: 'Kolkata', date: '2024-04-20', seats: { '1A': 8, '2A': 12, '3A': 18, 'Sleeper': 35 } }
];

let currentUser = null;
let currentBooking = null;

document.addEventListener('DOMContentLoaded', function() {
    
// DOM elements
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const bookingSection = document.getElementById('booking-section');
const confirmationSection = document.getElementById('confirmation-section');

// Login functionality
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple mock login
    if (username && password) {
        currentUser = { username, password };
        showSection('dashboard');
        loadDashboard();
    }
});

document.getElementById('register-btn').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username && password) {
        currentUser = { username, password };
        showSection('dashboard');
        loadDashboard();
    }
});

// Dashboard
function loadDashboard() {
    const trainList = document.getElementById('train-list');
    trainList.innerHTML = '';
    
    trains.forEach(train => {
        const trainItem = document.createElement('div');
        trainItem.className = 'train-item';
        trainItem.innerHTML = `
            <div>
                <strong>${train.name}</strong><br>
                ${train.from} → ${train.to}<br>
                Date: ${train.date}
            </div>
            <button onclick="selectTrain(${train.id})">Book Now</button>
        `;
        trainList.appendChild(trainItem);
    });
}

function selectTrain(trainId) {
    const train = trains.find(t => t.id === trainId);
    currentBooking = { train, preferences: {} };
    showSection('booking');
    loadBookingForm();
}

// Booking
function loadBookingForm() {
    document.getElementById('train-info').innerHTML = `
        <strong>${currentBooking.train.name}</strong><br>
        ${currentBooking.train.from} → ${currentBooking.train.to}<br>
        Date: ${currentBooking.train.date}
    `;
}

document.getElementById('booking-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const preferences = {
        class: document.getElementById('class').value,
        seatType: document.getElementById('seat-type').value,
        passengers: parseInt(document.getElementById('passengers').value),
        age: document.getElementById('age').value,
        specialNeeds: document.getElementById('special-needs').checked
    };
    
    currentBooking.preferences = preferences;
    
    // AI Seat Allocation
    const allocatedSeat = allocateSeat(preferences);
    currentBooking.allocatedSeat = allocatedSeat;
    
    // Smart Waiting List Prediction
    const prediction = predictWaitingList(currentBooking.train, preferences);
    currentBooking.prediction = prediction;
    
    // Auto Seat Upgrade (simulate)
    const upgrade = checkAutoUpgrade(currentBooking.train, preferences);
    currentBooking.upgrade = upgrade;
    
    showConfirmation();
});

// AI Features Simulation
function allocateSeat(preferences) {
    // Simple logic: assign based on preferences
    let seatClass = preferences.class;
    let seatType = preferences.seatType;
    
    // Prioritize special needs
    if (preferences.specialNeeds) {
        seatType = 'Lower';
    }
    
    return `${seatClass} - ${seatType} Berth`;
}

function predictWaitingList(train, preferences) {
    // Mock prediction based on demand
    const demand = Math.random();
    if (demand > 0.7) return 'Low';
    if (demand > 0.4) return 'Medium';
    return 'High';
}

function checkAutoUpgrade(train, preferences) {
    // Simulate upgrade if higher class available
    const classes = ['Sleeper', '3A', '2A', '1A'];
    const currentIndex = classes.indexOf(preferences.class);
    
    if (currentIndex < classes.length - 1 && Math.random() > 0.5) {
        return classes[currentIndex + 1];
    }
    return null;
}

// Voice Booking
document.getElementById('voice-booking').addEventListener('click', function() {
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onstart = function() {
            document.getElementById('voice-status').textContent = 'Listening...';
        };
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('voice-status').textContent = `Heard: ${transcript}`;
            
            // Simple parsing (in real app, use NLP)
            parseVoiceCommand(transcript);
        };
        
        recognition.start();
    } else {
        alert('Voice recognition not supported in this browser.');
    }
});

function parseVoiceCommand(transcript) {
    // Very basic parsing
    const lowerTranscript = transcript.toLowerCase();
    
    if (lowerTranscript.includes('delhi') && lowerTranscript.includes('mumbai')) {
        document.getElementById('from').value = 'Delhi';
        document.getElementById('to').value = 'Mumbai';
    }
    // Add more parsing logic as needed
}

// Face Recognition Simulation
document.getElementById('face-verify').addEventListener('click', function() {
    // Simulate face recognition
    const success = Math.random() > 0.3; // 70% success rate
    
    if (success) {
        alert('Face verification successful!');
        document.getElementById('face-status').textContent = 'Verified';
        document.getElementById('face-status').style.color = 'green';
    } else {
        alert('Face verification failed. Please try again.');
        document.getElementById('face-status').textContent = 'Failed';
        document.getElementById('face-status').style.color = 'red';
    }
});

// Confirmation
function showConfirmation() {
    document.getElementById('confirmation-train').textContent = currentBooking.train.name;
    document.getElementById('confirmation-route').textContent = `${currentBooking.train.from} → ${currentBooking.train.to}`;
    document.getElementById('confirmation-date').textContent = currentBooking.train.date;
    document.getElementById('confirmation-seat').textContent = currentBooking.allocatedSeat;
    document.getElementById('confirmation-prediction').textContent = currentBooking.prediction;
    
    if (currentBooking.upgrade) {
        document.getElementById('upgrade-notification').textContent = `Auto-upgraded to ${currentBooking.upgrade}!`;
        document.getElementById('upgrade-notification').classList.remove('hidden');
    } else {
        document.getElementById('upgrade-notification').classList.add('hidden');
    }
    
    showSection('confirmation');
}

document.getElementById('confirm-booking').addEventListener('click', function() {
    alert('Booking confirmed! Ticket details sent to your email.');
    showSection('dashboard');
});

// Navigation
function showSection(sectionId) {
    [loginSection, dashboardSection, bookingSection, confirmationSection].forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
}

document.getElementById('back-to-dashboard').addEventListener('click', function() {
    showSection('dashboard');
});

document.getElementById('back-to-booking').addEventListener('click', function() {
    showSection('booking');
});

// Initialize
showSection('login-section');

}); // End of DOMContentLoaded