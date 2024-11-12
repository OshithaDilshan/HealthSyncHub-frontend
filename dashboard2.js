const calendarDates = document.getElementById('calendarDates');
const monthYear = document.getElementById('monthYear');
let currentDate = new Date();

// Sample logged dates for demonstration
const loggedMealDates = {
    '2024-11-02': true,
    '2024-11-19': true,
    '2024-11-12': true,
    '2024-11-26': true
};

function renderCalendar() {
    calendarDates.innerHTML = '';
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    monthYear.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;

    const today = new Date();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Adjust start day to align with Monday as the start of the week
    const startDay = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;

    // Add empty cells to align the first day of the month
    for (let i = 0; i < startDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('day-cell', 'empty-cell');
        calendarDates.appendChild(emptyCell);
    }

    // Add actual dates with highlighting for logged days and today
    for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayCell = document.createElement('div');
        dayCell.textContent = day;
        dayCell.classList.add('day-cell');

        // Check if it's a logged day
        if (loggedMealDates[date]) {
            dayCell.classList.add('logged-day');
        }

        // Check if it's today
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

function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

// Initialize calendar
renderCalendar();
