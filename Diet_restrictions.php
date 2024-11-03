<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="Images/tabicon.png" type="image/png">
    <title>Diet Restrictions</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="footer.css">
    <link rel="stylesheet" href="sidebar.css">
    <link rel="stylesheet" href="background.css">

</head>
<body class="flex flex-col h-screen font-josefin">

    <!-- Main Container -->
    <div class="flex flex-grow">
        
         <!-- Sidebar Navigation -->
         <div class="sidebar w-20 md:w-24 flex flex-col items-center py-8">
            <div class="icon-nav flex flex-col items-center space-y-8">
                <div class="icon flex flex-col items-center">
                    <img src="Images/home-icon.png" alt="Home Icon" class="w-8 h-8">
                    <p class="text-xs mt-2">Home</p>
                </div>
                <div class="icon flex flex-col items-center">
                    <img src="Images/meal-icon.png" alt="Meal Icon" class="w-8 h-8">
                    <p class="text-xs mt-2">Meal</p>
                </div>
                <div class="icon flex flex-col items-center">
                    <img src="Images/workout-icon.png" alt="Workout Icon" class="w-8 h-8">
                    <p class="text-xs mt-2">Workout</p>
                </div>
                <div class="icon flex flex-col items-center">
                    <img src="Images/dashboard-icon.png" alt="Dashboard Icon" class="w-8 h-8">
                    <p class="text-xs mt-2">Dashboard</p>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="main-content flex-grow flex flex-col items-center justify-center">
            <h1 class="text-2xl font-semibold mb-8">What is your diet type</h1>
            <ul class="space-y-4">
                <li><label><input type="radio" name="diet" value="no-restriction"> No restriction</label></li>
                <li><label><input type="radio" name="diet" value="pescetarian"> Pescetarianism</label></li>
                <li><label><input type="radio" name="diet" value="vegetarian"> Vegetarian</label></li>
                <li><label><input type="radio" name="diet" value="paleo"> Paleo</label></li>
                <li><label><input type="radio" name="diet" value="keto"> Keto</label></li>
                <li><label><input type="radio" name="diet" value="vegan"> Vegan</label></li>
            </ul>
            <button id="nextButton" class="mt-8 custom-bg text-white py-2 px-4 rounded">Next</button>
        </div>
    </div>

    <!-- Footer -->
    <footer class="footer w-full text-white text-center py-4">
        <div class="container mx-auto">
            <p>&copy; 2024 Health sync hub. All rights reserved.</p>
            <p>Email: support@mealplanningapp.com | Phone: +94 123 456 789</p>
        </div>
    </footer>

    <!-- JavaScript -->
    <script>
        document.getElementById('nextButton').addEventListener('click', function() {
            // Check if a diet option is selected
            const dietOptions = document.getElementsByName('diet');
            let selectedDiet = null;
            for (const option of dietOptions) {
                if (option.checked) {
                    selectedDiet = option.value;
                    break;
                }
            }
            
            // If a diet is selected, navigate to allergies.html
            if (selectedDiet) {
                window.location.href = 'alergies.php';
            } else {
                alert('Please select a diet type before proceeding.');
            }
        });
    </script>

</body>
</html>
