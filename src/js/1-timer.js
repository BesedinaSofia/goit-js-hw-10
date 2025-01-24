// Import necessary libraries
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// HTML Elements
const datetimePicker = document.getElementById('datetime-picker');
const startButton = document.querySelector('[data-start]');
const daysField = document.querySelector('[data-days]');
const hoursField = document.querySelector('[data-hours]');
const minutesField = document.querySelector('[data-minutes]');
const secondsField = document.querySelector('[data-seconds]');

// Variables
let userSelectedDate = null;
let countdownInterval = null;

// Disable start button initially
startButton.disabled = true;

// Flatpickr options
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    if (selectedDate <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight'
      });
      startButton.disabled = true;
    } else {
      userSelectedDate = selectedDate;
      startButton.disabled = false;
    }
  },
};

// Initialize flatpickr
flatpickr(datetimePicker, options);

// Add leading zero to format numbers
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

// Convert milliseconds to time object
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Update timer display
function updateTimerDisplay({ days, hours, minutes, seconds }) {
  daysField.textContent = addLeadingZero(days);
  hoursField.textContent = addLeadingZero(hours);
  minutesField.textContent = addLeadingZero(minutes);
  secondsField.textContent = addLeadingZero(seconds);
}

// Start countdown
function startCountdown() {
  const startTime = new Date().getTime();
  const endTime = userSelectedDate.getTime();

  countdownInterval = setInterval(() => {
    const currentTime = new Date().getTime();
    const timeDifference = endTime - currentTime;

    if (timeDifference <= 0) {
      clearInterval(countdownInterval);
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      datetimePicker.disabled = false;
      startButton.disabled = true;
      iziToast.success({
        title: 'Completed',
        message: 'Countdown has ended!',
        position: 'topRight'
      });
      return;
    }

    const timeLeft = convertMs(timeDifference);
    updateTimerDisplay(timeLeft);
  }, 1000);
}

// Start button click event
startButton.addEventListener('click', () => {
  datetimePicker.disabled = true;
  startButton.disabled = true;
  startCountdown();
});