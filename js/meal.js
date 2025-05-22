document.addEventListener("DOMContentLoaded", function () {
    const bodyId = document.body.id;

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

    if (bodyId === "mealoptionpage") {
        document.getElementById('one').addEventListener('click', function () {
            window.location.href = 'mealplansone.html';
        });

        document.getElementById('two').addEventListener('click', function () {
            window.location.href = 'mealplanstwo.html';
        });
    }

    


});






// Select all sidebar items
const sidebarItems = document.querySelectorAll('.icon');

// Add a click event to each sidebar item
sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove 'active' class from all items
        sidebarItems.forEach(el => el.classList.remove('active'));
        // Add 'active' class to the clicked item
        item.classList.add('active');
    });
});

