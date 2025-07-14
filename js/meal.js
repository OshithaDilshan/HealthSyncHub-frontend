// Function to fetch and display today's meal plan
async function fetchAndDisplayMealPlan() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login.html';
            return;
        }

        const userId = localStorage.getItem('userId');

        
        if (!userId) {
            throw new Error('User ID not found. Please log in again.');
        }

     
        const loadingElement = document.getElementById('loading');
        if (loadingElement) loadingElement.style.display = 'block';

        const response = await fetch('http://localhost:5000/api/meal/today', {
            method: 'GET',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            
            if (response.status === 400 && errorData.message && errorData.message.includes('complete your profile')) {

                const fallbackPlan = generateFallbackMealPlan();
                displayMealPlan(fallbackPlan);
                
                setTimeout(() => {
                    alert('Using default meal plan. Complete your profile for personalized recommendations.');
                }, 1000);
                
                return;
            }
            
            throw new Error(errorData.message || 'Failed to fetch meal plan');
        }

        const mealPlanData = await response.json();

        
        localStorage.setItem('lastMealPlan', JSON.stringify({
            data: mealPlanData,
            timestamp: new Date().toISOString()
        }));

        displayMealPlan(mealPlanData);

    } catch (error) {

            
        const errorMessage = error.message || 'Failed to load meal plan';
        const errorElement = document.getElementById('error-message');
        
        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.style.display = 'block';
        }
        
        const lastMealPlan = localStorage.getItem('lastMealPlan');
        if (lastMealPlan) {
            try {
                const { data } = JSON.parse(lastMealPlan);
                displayMealPlan(data);

            } catch (parseError) {

                const fallbackPlan = generateFallbackMealPlan();
                displayMealPlan(fallbackPlan);
            }
        } else {
            const fallbackPlan = generateFallbackMealPlan();
            displayMealPlan(fallbackPlan);
        }
    } finally {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) loadingElement.style.display = 'none';
    }
}

function displayMealPlan(data) {

    
    const { dailyCalories, mealPlan } = data;
    
    
    const calorieElement = document.getElementById('calorie-count');
    if (calorieElement) {
        calorieElement.textContent = dailyCalories || '--';
    }
    
    const mealSections = ['breakfast', 'lunch', 'dinner', 'snack'];
    
    mealSections.forEach(mealType => {
        const mealSection = document.getElementById(mealType);
        if (mealSection && mealPlan && mealPlan[mealType]) {
            mealSection.innerHTML = '';
            
            mealPlan[mealType].forEach(item => {
                const mealItem = document.createElement('div');
                mealItem.className = 'meal-item bg-gray-50 p-4 rounded-lg border';
                mealItem.innerHTML = `
                    <h4 class="text-lg font-semibold text-gray-800">${item.name}</h4>
                    <span class="text-blue-600 font-medium">${item.calories} cal</span>
                `;
                mealSection.appendChild(mealItem);
            });
        } else if (mealSection) {
            mealSection.innerHTML = '<p class="text-gray-500">No meals available for this time</p>';
        }
    });
}
async function generateNewMealPlan() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to generate a new meal plan');
            return;
        }

        const refreshButton = document.getElementById('refresh-meal-plan');
        if (refreshButton) {
            refreshButton.disabled = true;
            refreshButton.textContent = 'Generating...';
        }

        await fetchAndDisplayMealPlan();

    } catch (error) {

        alert('Failed to generate meal plan. Please try again.');
    } finally {
        const refreshButton = document.getElementById('refresh-meal-plan');
        if (refreshButton) {
            refreshButton.disabled = false;
            refreshButton.textContent = 'Generate New Meal Plan';
        }
    }
}

function calculateAge(dateOfBirth) {
    if (!dateOfBirth) return 30; 
    
    const birthDate = new Date(dateOfBirth);
    if (isNaN(birthDate.getTime())) return 30; 
    
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age > 0 ? age : 30; 
}

function generateFallbackMealPlan() {
    const defaultUserData = {
        age: 30,
        gender: 'male',
        weight: 70,
        height: 175,
        activityLevel: 'moderate',
        goal: 'maintain'
    };
    
    return generateMealPlan(defaultUserData);
}

// Sample meal database for fallback
// const MEAL_DATABASE = {
//     breakfast: [
//         { name: 'Oatmeal with Banana and Almonds', calories: 320, type: 'vegetarian' },
//         { name: 'Greek Yogurt with Berries and Granola', calories: 280, type: 'vegetarian' },
//         { name: 'Avocado Toast with Poached Eggs', calories: 350, type: 'vegetarian' },
//         { name: 'Scrambled Tofu with Whole Wheat Toast', calories: 300, type: 'vegan' },
//         { name: 'Smoothie Bowl with Spinach and Protein Powder', calories: 340, type: 'vegan' }
//     ],
//     lunch: [
//         { name: 'Quinoa Salad with Chickpeas and Veggies', calories: 450, type: 'vegan' },
//         { name: 'Grilled Chicken with Brown Rice and Steamed Vegetables', calories: 500, type: 'regular' },
//         { name: 'Lentil Soup with Whole Grain Bread', calories: 400, type: 'vegetarian' },
//         { name: 'Tofu Stir-fry with Brown Rice', calories: 480, type: 'vegan' },
//         { name: 'Salmon with Sweet Potato and Asparagus', calories: 520, type: 'regular' }
//     ],
//     dinner: [
//         { name: 'Grilled Fish with Quinoa and Roasted Vegetables', calories: 480, type: 'regular' },
//         { name: 'Vegetable Curry with Brown Rice', calories: 420, type: 'vegetarian' },
//         { name: 'Chicken and Vegetable Stir-fry', calories: 450, type: 'regular' },
//         { name: 'Lentil Dal with Whole Wheat Roti', calories: 400, type: 'vegan' },
//         { name: 'Stuffed Bell Peppers with Quinoa', calories: 380, type: 'vegan' }
//     ],
//     snack: [
//         { name: 'Handful of Mixed Nuts', calories: 160, type: 'vegan' },
//         { name: 'Apple Slices with Peanut Butter', calories: 200, type: 'vegetarian' },
//         { name: 'Greek Yogurt with Honey', calories: 150, type: 'vegetarian' },
//         { name: 'Rice Cakes with Avocado', calories: 180, type: 'vegan' },
//         { name: 'Hard-Boiled Eggs with Carrot Sticks', calories: 170, type: 'regular' }
//     ]
// };

function calculateCaloriesFromUserData(userData) {
    const { age, gender, weight, height, activityLevel, goal } = userData;
    
    let bmr;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    const activityMultipliers = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'active': 1.725,
        'very_active': 1.9
    };
    
    let tdee = bmr * (activityMultipliers[activityLevel] || 1.55);
    
    if (goal === 'lose') {
        tdee -= 500; 
    } else if (goal === 'gain') {
        tdee += 500; 
    }
    
    return Math.round(tdee);
}

function generateMealPlan(userData) {
    const dietType = localStorage.getItem('dietPreference') || 'regular';
    const dailyCalories = calculateCaloriesFromUserData(userData);
    
    const mealCalories = {
        breakfast: Math.round(dailyCalories * 0.25),
        lunch: Math.round(dailyCalories * 0.35),
        dinner: Math.round(dailyCalories * 0.3),
        snack: Math.round(dailyCalories * 0.1)
    };
    
    const filterMeals = (meals) => {
        if (dietType === 'vegan') {
            return meals.filter(meal => meal.type === 'vegan');
        } else if (dietType === 'vegetarian') {
            return meals.filter(meal => meal.type === 'vegetarian' || meal.type === 'vegan');
        }
        return meals; 
    };
    
    const mealPlan = {};
    let totalCalories = 0;
    
    for (const [mealType, targetCalories] of Object.entries(mealCalories)) {
        const filteredMeals = filterMeals(MEAL_DATABASE[mealType]);
        if (filteredMeals.length === 0) continue;
        
        const randomIndex = Math.floor(Math.random() * filteredMeals.length);
        const selectedMeal = { ...filteredMeals[randomIndex] };
        
        const portionMultiplier = targetCalories / selectedMeal.calories;
        selectedMeal.calories = Math.round(selectedMeal.calories * portionMultiplier);
        
        mealPlan[mealType] = [selectedMeal];
        totalCalories += selectedMeal.calories;
    }
    
    return {
        dailyCalories: totalCalories,
        mealPlan
    };
}

document.addEventListener("DOMContentLoaded", function () {
    const bodyId = document.body.id;
    
    if (bodyId === 'dashboard' || bodyId === 'mealoptionpage') {

        fetchAndDisplayMealPlan();
    }

    const refreshButton = document.getElementById('refresh-meal-plan');
    if (refreshButton) {
        refreshButton.addEventListener('click', generateNewMealPlan);
    }



    // Diet Page
    if (bodyId === "dietrestrictions") {
        document.getElementById('nextButton').addEventListener('click', function () {
            const dietOptions = document.getElementsByName('diet');
            let selectedDiet = null;
            for (const option of dietOptions) {
                if (option.checked) {
                    selectedDiet = option.value;
                    break;
                }
            }
            if (selectedDiet) {
                window.location.href = 'alergies.html';
            } else {
                alert('Please select a diet type before proceeding.');
            }
        });
    }

    // Allergies Page
    if (bodyId === "alergiespage") {
        const noneCheckbox = document.querySelector('input[name="allergy"][value="none"]');
        const allergyCheckboxes = document.querySelectorAll('input[name="allergy"]:not([value="none"])');
    
        // Event listener for "None" checkbox
        noneCheckbox.addEventListener("change", function () {
            if (this.checked) {
                // Disable and uncheck all other allergy checkboxes
                allergyCheckboxes.forEach(checkbox => {
                    checkbox.disabled = true;
                    checkbox.checked = false;
                });
            } else {
                // Enable all other allergy checkboxes
                allergyCheckboxes.forEach(checkbox => {
                    checkbox.disabled = false;
                });
            }
        });
    
        // Event listener for the "Next" button
        document.getElementById('nextButton').addEventListener('click', function () {
            const allergyOptions = document.getElementsByName('allergy');
            let selectedAllergy = false;
    
            // Check if at least one checkbox is selected
            for (const option of allergyOptions) {
                if (option.checked) {
                    selectedAllergy = true;
                    break;
                }
            }
    
            if (selectedAllergy) {
                // Proceed to the next page if a checkbox is selected
                window.location.href = 'diseases.html';
            } else {
                // Show an alert if no checkbox is selected
                alert('Please select an allergy before proceeding.');
            }
        });
    }
    

    
 // Diseases Page
if (bodyId === "diseasespage") {
    // Select the "None" checkbox and other disease checkboxes
    const noneCheckbox = document.querySelector('input[name="diseases"][value="none"]');
    const diseaseCheckboxes = document.querySelectorAll('input[name="diseases"]:not([value="none"])');
    const nextButton = document.getElementById('nextButton');

    // Add event listener to "None" checkbox
    noneCheckbox.addEventListener("change", function () {
        if (this.checked) {
            // Disable and uncheck all other checkboxes
            diseaseCheckboxes.forEach(checkbox => {
                checkbox.disabled = true;
                checkbox.checked = false;
            });
        } else {
            // Enable other checkboxes
            diseaseCheckboxes.forEach(checkbox => {
                checkbox.disabled = false;
            });
        }
    });

    // Add event listener to "Next" button
    nextButton.addEventListener('click', function () {
        const diseaseOptions = document.getElementsByName('diseases'); // Corrected here
        let selectedDisease = false;

        // Check if any checkbox is selected
        for (const option of diseaseOptions) {
            if (option.checked) {
                selectedDisease = true;
                break;
            }
        }

        // Navigate to the next page if a selection is made
        if (selectedDisease) {
            window.location.href = 'budget.html';
        } else {
            alert('Please select an option before proceeding.');
        }
    });
}









    // Budget Page
    if (bodyId === "budgetPage") {
        document.getElementById('budgetlow').addEventListener('click', function () {
            window.location.href = 'Meal_option.html';
        });

        document.getElementById('budgethigh').addEventListener('click', function () {
            window.location.href = 'Meal_option.html';
        });
    }

  

    


});






// Select all sidebar items
const sidebarItems = document.querySelectorAll('.icon');

// Add a click event to each sidebar item
// Add refresh button functionality
const refreshButton = document.getElementById('refresh-meal-plan');
if (refreshButton) {
    refreshButton.addEventListener('click', fetchAndDisplayMealPlan);
}

sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove 'active' class from all items
        sidebarItems.forEach(el => el.classList.remove('active'));
        // Add 'active' class to the clicked item
        item.classList.add('active');
    });
});