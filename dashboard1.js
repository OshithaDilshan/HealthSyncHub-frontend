// Sample user data
const userData = {
    name: "John Doe",
    email: "johndoe@example.com",
    sex: "Male",
    age: 29,
    weight: "70 kg",
    height: "175 cm",
    bmr: "1600",
    bmi: "22.9",
    physicalInjuries: "None",
    allergies: "Pollen",
    medicalConditions: "Asthma",
    image: "User.png" // Add image path here
};

// Function to populate the user data into the HTML
function loadUserData() {
    document.getElementById("name").textContent = userData.name;
    document.getElementById("email").textContent = userData.email;
    document.getElementById("sex").textContent = userData.sex;
    document.getElementById("age").textContent = userData.age;
    document.getElementById("weight").textContent = userData.weight;
    document.getElementById("height").textContent = userData.height;
    document.getElementById("bmr").textContent = userData.bmr;
    document.getElementById("bmi").textContent = userData.bmi;
    document.getElementById("physicalInjuries").textContent = userData.physicalInjuries;
    document.getElementById("allergies").textContent = userData.allergies;
    document.getElementById("medicalConditions").textContent = userData.medicalConditions;
    
    // Access the image element and set the src attribute
    document.getElementById("userImage").src = userData.image;
}

// Run the function when the page loads
window.onload = loadUserData;
