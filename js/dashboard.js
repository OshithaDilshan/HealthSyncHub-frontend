// DOM elements
const calendarDates = document.getElementById('calendarDates');
const monthYear = document.getElementById('monthYear');
let currentDate = new Date();

// Fetch logged dates from the backend
async function fetchLoggedDates() {
  try {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return;  // If no token, stop further execution
    }

    // Log the token to ensure it's being retrieved correctly
    // console.log('Token in LocalStorage:', token);  

    // Check if the token starts with 'Bearer' (for correct formatting)
    if (!token.startsWith('Bearer ')) {
      console.error('Token format is incorrect');
      return;  // Stop execution if token is malformed
    }

    // Make the request to the server with the Authorization header
    const response = await fetch('http://localhost:5000/api/login-history/logged-dates', {
      method: 'GET',
      headers: {
        'Authorization': token,  // Pass the token as Authorization header
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch logged dates');
    }

    const data = await response.json();
    const loggedDates = data.loggedDates;

    // Render the calendar with highlighted logged days
    renderCalendar(loggedDates);
  } catch (error) {
    console.error('Error fetching logged dates:', error);
  }
}

// Render calendar with logged dates highlighted
function renderCalendar(loggedDates) {
  calendarDates.innerHTML = '';
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  monthYear.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;

  const today = new Date();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const startDay = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;

  // Add empty cells for alignment
  for (let i = 0; i < startDay; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.classList.add('day-cell', 'empty-cell');
    calendarDates.appendChild(emptyCell);
  }

  // Add days to the calendar and highlight logged days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayCell = document.createElement('div');
    dayCell.textContent = day;
    dayCell.classList.add('day-cell');

    // Highlight logged days
    if (loggedDates.includes(date)) {
      dayCell.classList.add('logged-day');
    }

    // Highlight today's date
    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      dayCell.classList.add('today');
    }

    calendarDates.appendChild(dayCell);
  }
}

// Navigate to the previous month
function prevMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  fetchLoggedDates();
}

// Navigate to the next month
function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  fetchLoggedDates();
}

// Initialize calendar and set event listeners
document.addEventListener('DOMContentLoaded', () => {
  fetchLoggedDates();

  // Bind previous/next buttons if they exist
  const prevButton = document.getElementById('prevMonth');
  const nextButton = document.getElementById('nextMonth');

  if (prevButton) {
    prevButton.addEventListener('click', prevMonth);
  }

  if (nextButton) {
    nextButton.addEventListener('click', nextMonth);
  }
});
