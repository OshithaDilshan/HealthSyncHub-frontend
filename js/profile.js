// Function to fetch user profile details
async function getProfileDetails() {
    try {
        const res = await fetch("http://localhost:8000/user/6809dc1826023bc4b549636a", {
            method: "GET",
        });
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null; // Return null in case of an error
    }
};

//age calculation function
function calculateAge(dob) {
    try {
      const birthDate = new Date(dob); // dob should be like "2000-04-20"
      const today = new Date();
  
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
  
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
  
      return age;
    } catch (error) {
      console.error("Error calculating age:", error);
      return null;
    }
  }
  

//bmi calculation function
function bmiCalculation(weight, height) {
    try {
        // Extract numeric values from strings like "70kg" or "175cm"
        const weightNum = parseFloat(weight.replace(/[^\d.]/g, ''));
        const heightNum = parseFloat(height.replace(/[^\d.]/g, ''));

        // Validate inputs
        if (!weightNum || !heightNum || heightNum <= 0) {
            return "N/A";
        }

        const heightM = heightNum / 100;
        const bmi = weightNum / (heightM * heightM);
        return bmi.toFixed(2);
    } catch (error) {
        console.error("Error calculating BMI:", error);
        return "N/A";
    }
}

//bmr calculation function
function bmrCalculation(weight, height, age, gender) {
    try {
        const weightNum = parseFloat(weight.replace(/[^\d.]/g, ''));
        const heightNum = parseFloat(height.replace(/[^\d.]/g, ''));
        const ageNum = parseInt(age);

        // Validate inputs
        if (!weightNum || !heightNum || !ageNum || heightNum <= 0 || ageNum <= 0) {
            return "N/A";
        }

        // Calculate BMR
        let bmr;
        if (gender.toLowerCase() === "male") {
            bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
        } else if (gender.toLowerCase() === "female") {
            bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
        } else {
            return "Invalid gender";
        }

        return bmr.toFixed(2);
    } catch (error) {
        console.error("Error calculating BMR:", error);
        return "N/A";
    }
}


// Function to populate the user data into the HTML
async function loadUserData() {
    const userData = await getProfileDetails();
    if (userData) {
        document.getElementById("name").textContent = userData.firstName || "N/A";
        document.getElementById("email").textContent = userData.email || "N/A";
        document.getElementById("sex").textContent = userData.gender || "N/A";
        document.getElementById("age").textContent = calculateAge(userData.dob)  || "N/A";
        document.getElementById("weight").textContent = userData.weight || "N/A";
        document.getElementById("height").textContent = userData.height || "N/A";
        document.getElementById("bmr").textContent = bmrCalculation(userData.weight, userData.height, calculateAge(userData.dob), userData.gender) || "N/A";
        document.getElementById("bmi").textContent = bmiCalculation(userData.weight, userData.height) || "N/A";
        document.getElementById("physicalInjuries").textContent = userData.lastName || "N/A";
        document.getElementById("allergies").textContent = userData.lastName || "N/A";
        document.getElementById("medicalConditions").textContent = userData.lastName || "N/A";

        // Access the image element and set the src attribute
        document.getElementById("userImage").src = userData.image || "default-image.jpg";
    } else {
        console.error("Failed to load user data. Please try again.");
    }
}

// Run the function when the page loads
window.onload = loadUserData;

// Store original values when entering edit mode
let originalValues = {};

// Function to toggle edit mode
function toggleEditMode() {
    const editableFields = ['weight', 'height', 'physicalInjuries', 'allergies', 'medicalConditions'];
    const editButton = document.getElementById('editButton');

    // Enter edit mode
    editableFields.forEach(field => {
        const element = document.getElementById(field);
        originalValues[field] = element.textContent;
        element.contentEditable = true;
        element.classList.add('bg-gray-100', 'px-2');
    });

    document.getElementById('editButtons').classList.remove('hidden');
}

// Add single event listener for edit button
document.getElementById('editButton').addEventListener('click', toggleEditMode);

// Function to cancel editing
function cancelEdit() {
    const editableFields = ['weight', 'height', 'physicalInjuries', 'allergies', 'medicalConditions'];

    editableFields.forEach(field => {
        const element = document.getElementById(field);
        element.contentEditable = false;
        element.classList.remove('bg-gray-100', 'px-2');
        element.textContent = originalValues[field];
    });

    document.getElementById('editButton').textContent = 'Edit Profile';
    document.getElementById('editButtons').classList.add('hidden');
}

// Add event listener for cancel button
document.getElementById('cancelButton').addEventListener('click', cancelEdit);

// Function to save changes
document.getElementById('saveButton').addEventListener('click', async function () {
    try {
        const updatedData = {
            weight: document.getElementById('weight').textContent,
            height: document.getElementById('height').textContent,
            physicalInjuries: document.getElementById('physicalInjuries').textContent,
            allergies: document.getElementById('allergies').textContent,
            medicalConditions: document.getElementById('medicalConditions').textContent
        };

        const response = await fetch('http://localhost:8000/meal/67459f97327a6a12a19518de', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // If successful, exit edit mode
        const editableFields = ['weight', 'height', 'physicalInjuries', 'allergies', 'medicalConditions'];
        editableFields.forEach(field => {
            const element = document.getElementById(field);
            element.contentEditable = false;
            element.classList.remove('bg-gray-100', 'px-2');
        });

        document.getElementById('editButton').textContent = 'Edit Profile';
        document.getElementById('editButtons').classList.add('hidden');

        // Show success message
        alert('Profile updated successfully!');

    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
    }
});