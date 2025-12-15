// --- Configuration ---
const STEP_THRESHOLD = 1.2; // Acceleration change threshold (adjust based on testing)
const TIME_BETWEEN_STEPS = 500; // Minimum time (ms) between steps to prevent double-counting

// --- State Variables ---
let isTracking = false;
let lastStepTime = 0;
let currentStepCount = 0;

// --- DOM Elements ---
const stepCountEl = document.getElementById('step-count');
const toggleButton = document.getElementById('toggle-button');
const weeklyStepsEl = document.getElementById('weekly-steps');
const monthlyStepsEl = document.getElementById('monthly-steps');

// --- Pedometer Logic ---

function handleMotion(event) {
    if (!isTracking) return;

    const acc = event.accelerationIncludingGravity;
    
    // Calculate the total force/magnitude change (Vector length)
    // The '1g' (9.8 m/s^2) of gravity is accounted for by the device, 
    // but the *change* relative to 1g is what indicates movement.
    const accelerationMagnitude = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);

    // This is a very simple step detection algorithm.
    // It detects a significant change in magnitude (a 'shake' or 'jolt').
    if (accelerationMagnitude > 12) { // 9.8 (gravity) + 2.2 (shake)
        const currentTime = Date.now();
        
        if (currentTime - lastStepTime > TIME_BETWEEN_STEPS) {
            currentStepCount++;
            stepCountEl.textContent = currentStepCount;
            lastStepTime = currentTime;
            
            // In a real app, you would save this single step to LocalStorage here
            // saveStepToHistory(currentTime); 
            
            // For this simple example, we just update the daily count.
        }
    }
}

function startTracking() {
    // 1. Request Permission (Crucial for iOS/Safari)
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('devicemotion', handleMotion);
                    isTracking = true;
                    toggleButton.textContent = 'Stop Tracking';
                    toggleButton.classList.add('stop');
                } else {
                    alert('Motion sensor permission denied. Cannot track steps.');
                }
            })
            .catch(err => {
                console.error('Permission request failed:', err);
                alert('Could not start tracking. Ensure your device supports motion sensors.');
            });
    } else {
        // 2. Fallback for Android/Older Browsers
        window.addEventListener('devicemotion', handleMotion);
        isTracking = true;
        toggleButton.textContent = 'Stop Tracking';
        toggleButton.classList.add('stop');
    }
}

function stopTracking() {
    window.removeEventListener('devicemotion', handleMotion);
    isTracking = false;
    toggleButton.textContent = 'Start Tracking';
    toggleButton.classList.remove('stop');
}

// --- Event Listener ---
toggleButton.addEventListener('click', () => {
    if (isTracking) {
        stopTracking();
    } else {
        startTracking();
    }
});

// --- Initial Load ---
// In a full app, you would load the saved steps here
// stepCountEl.textContent = loadDailySteps(); 
// weeklyStepsEl.textContent = loadWeeklySteps(); 
// monthlyStepsEl.textContent = loadMonthlySteps(); 

// A warning if the browser is missing the necessary API
if (!window.DeviceMotionEvent) {
    alert('Warning: Device motion sensors are not supported by this browser.');
}