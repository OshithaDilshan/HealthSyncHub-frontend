
const API_BASE_URL = 'http://localhost:5000';

const PROFILE_ENDPOINT = `${API_BASE_URL}/api/user`;
const PROFILE_UPDATE_ENDPOINT = `${API_BASE_URL}/api/user`;

function getAuthToken() {
    let token = localStorage.getItem('token');

    if (!token) {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                token = user.token || user.accessToken;
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }
    }

    if (token && token.startsWith('Bearer ')) {
        token = token.substring(7);
    }

    return token;
}

function getCurrentUserId() {
    const userId = localStorage.getItem('userId');
    if (userId) {
        if (userId.startsWith('"') || userId.startsWith('{')) {
            try {
                const parsedData = JSON.parse(userId);
                return parsedData;
            } catch (e) {
                console.log('userId is already a string, using directly:', userId);
                return userId;
            }
        }
        return userId;
    }

    const user = localStorage.getItem('user');
    if (user) {
        try {
            const parsedUser = JSON.parse(user);
            if (parsedUser && parsedUser.id) {
                return parsedUser.id;
            }
        } catch (e) {
            console.error('Error parsing user data from localStorage', e);
        }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const urlUserId = urlParams.get('userId');
    if (urlUserId) {
        return urlUserId;
    }

    return null;
}

async function getProfileDetails() {
    try {
        const userId = getCurrentUserId();
        if (!userId) {
            console.log('No user ID found, trying to use /me endpoint');
            const token = getAuthToken();
            if (!token) {
                console.log('No auth token found, redirecting to login');
                window.location.href = 'login.html';
                return null;
            }

            const response = await fetch(`${PROFILE_ENDPOINT}/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    console.log('Authentication failed, redirecting to login');
                    localStorage.removeItem('token');
                    window.location.href = 'login.html';
                    return null;
                }
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return await response.json();
        }

        console.log('Fetching profile for user ID:', userId);
        const response = await fetch(`${PROFILE_ENDPOINT}/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
}

function calculateAge(dob) {
    try {
        const birthDate = new Date(dob);
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

function calculateDOBFromAge(age) {
    try {
        const today = new Date();
        const ageNum = parseInt(age.replace(' years', ''));
        const birthYear = today.getFullYear() - ageNum;
        const birthDate = new Date(birthYear, today.getMonth(), today.getDate());
        return birthDate.toISOString().split('T')[0];
    } catch (error) {
        console.error("Error calculating DOB from age:", error);
        return null;
    }
}

// function bmiCalculation(weight, height) {
//     try {
//         let weightNum, heightNum;

//         if (typeof weight === 'string') {
//             weightNum = parseFloat(weight.replace(/[^\d.]/g, ''));
//         } else {
//             weightNum = parseFloat(weight);
//         }

//         if (typeof height === 'string') {
//             heightNum = parseFloat(height.replace(/[^\d.]/g, ''));
//         } else {
//             heightNum = parseFloat(height);
//         }

//         if (isNaN(weightNum) || isNaN(heightNum) || heightNum <= 0) {
//             return "N/A";
//         }

//         const heightM = heightNum / 100;
//         const bmi = weightNum / (heightM * heightM);
//         return bmi.toFixed(2);
//     } catch (error) {
//         console.error("Error calculating BMI:", error);
//         return "N/A";
//     }
// }

// function bmrCalculation(weight, height, age, gender) {
//     try {
//         const weightNum = typeof weight === 'string' ?
//             parseFloat(weight.replace(/[^\d.]/g, '')) :
//             Number(weight);

//         const heightNum = typeof height === 'string' ?
//             parseFloat(height.replace(/[^\d.]/g, '')) :
//             Number(height);

//         const ageNum = Number(age);
//         const genderLower = String(gender).toLowerCase();

//         if (isNaN(weightNum) || isNaN(heightNum) || isNaN(ageNum)) {
//             console.error('Invalid input for BMR calculation');
//             return 'N/A';
//         }

//         let bmr;
//         if (genderLower === 'male') {
//             bmr = (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) + 5;
//         } else if (genderLower === 'female') {
//             bmr = (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) - 161;
//         } else {
//             const bmrMale = (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) + 5;
//             const bmrFemale = (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) - 161;
//             bmr = Math.round((bmrMale + bmrFemale) / 2);
//         }

//         return Math.round(bmr);
//     } catch (error) {
//         console.error('Error in BMR calculation:', error);
//         return 'N/A';
//     }
// }
function showLogoutModal() {
    document.getElementById("logoutModal").classList.remove("hidden");
}
function closeLogoutModal() {
    document.getElementById("logoutModal").classList.add("hidden");
}

function confirmLogout() {
    localStorage.removeItem('user'); // Remove user data
    localStorage.removeItem('userId'); // Remove user ID
    localStorage.removeItem('token'); // Remove authentication token
    window.location.href = "index.html";
}
// function collectFormData() {
//     function getTextContent(id) {
//         const el = document.getElementById(id);
//         return el ? el.textContent.trim() : '';
//     }

//     const fullName = getTextContent('name').split(' ').filter(Boolean);
//     const gender = getTextContent('sex').toLowerCase();
//     const weightText = getTextContent('weight').replace(/[^\d.]/g, '');
//     const heightText = getTextContent('height').replace(/[^\d.]/g, '');
//     const ageText = getTextContent('age');

//     const dobElement = document.getElementById('age');
//     let dateOfBirth;

//     if (dobElement && dobElement.dataset.dob) {
//         dateOfBirth = new Date(dobElement.dataset.dob).toISOString();
//     } else if (ageText && !isNaN(ageText)) {
//         const birthYear = new Date().getFullYear() - parseInt(ageText);
//         dateOfBirth = new Date(birthYear, 0, 1).toISOString();
//     }

//     return {
//         firstName: fullName[0] || '',
//         lastName: fullName.length > 1 ? fullName.slice(1).join(' ') : '',
//         email: getTextContent('email'),
//         gender: gender === 'not set' ? '' : gender,
//         dateOfBirth: dateOfBirth,
//         weight: weightText ? parseFloat(weightText) : undefined,
//         height: heightText ? parseFloat(heightText) : undefined,
//         healthGoals: getTextContent('medicalConditions') || '',
//         allergies: getTextContent('allergies').split(',').map(a => a.trim()).filter(a => a),
//         diseases: getTextContent('diseases').split(',').map(d => d.trim()).filter(d => d)
//     };
// }

// // function validateFormData(formData) {
// //     if (!formData.firstName || !formData.lastName || !formData.email || !formData.gender || !formData.dateOfBirth || !formData.weight || !formData.height) {
// //         alert('Please fill in all required fields.');
// //         return false;
// //     }

// //     return true;
// // }

// async function saveChanges() {
//     const formData = collectFormData();

//     try {
//         const token = getAuthToken();
//         if (!token) {
//             alert('Authentication token not found. Please log in again.');
//             window.location.href = 'login.html';
//             return;
//         }

//         const endpoint = `${PROFILE_UPDATE_ENDPOINT}`;
//         const headers = {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//         };

//         const updateData = {
//             gender: formData.gender?.toLowerCase() || undefined,
//             dateOfBirth: formData.dateOfBirth || undefined,
//             weight: formData.weight ? parseFloat(formData.weight) : undefined,
//             height: formData.height ? parseFloat(formData.height) : undefined,
//             healthGoals: formData.healthGoals || undefined,
//             allergies: Array.isArray(formData.allergies) ? formData.allergies.join(', ') : formData.allergies,
//             diseases: Array.isArray(formData.diseases) ? formData.diseases.join(', ') : formData.diseases
//         };

//         Object.keys(updateData).forEach(key => {
//             if (updateData[key] === undefined || updateData[key] === '') {
//                 delete updateData[key];
//             }
//         });

//         console.log('Sending update data:', JSON.stringify(updateData, null, 2));

//         const response = await fetch(endpoint, {
//             method: 'PUT',
//             headers: headers,
//             body: JSON.stringify(updateData)
//         });

//         const responseData = await response.json();

//         if (!response.ok) {
//             console.error('Server response:', responseData);
//             throw new Error(responseData.message || `HTTP error! Status: ${response.status}`);
//         }

//         if (responseData.success) {
//             alert('Profile updated successfully!');

//             document.querySelectorAll('[contenteditable="true"]').forEach(element => {
//                 element.setAttribute('contenteditable', 'false');
//                 element.classList.remove('border-green-500');
//             });

//             document.getElementById('editButtons').classList.add('hidden');
//             document.getElementById('editButton').classList.remove('hidden');

//             await loadUserData();
//         } else {
//             throw new Error(responseData.message || 'Failed to update profile');
//         }
//     } catch (error) {
//         console.error('Error updating profile:', error);
//         alert(`Error updating profile: ${error.message}\n\nPlease check the console for more details.`);
//     }
// }

async function loadUserData() {
    try {
        const response = await getProfileDetails();
        if (!response || !response.data) {
            alert('Failed to load user data. Please log in again.');
            return;
        }

        const userData = response.data.user || {};
        const profileData = response.data.profile || {};

        originalValues = {
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            gender: profileData.gender || '',
            dateOfBirth: profileData.dateOfBirth || '',
            weight: profileData.weight || '',
            height: profileData.height || '',
            healthGoals: profileData.healthGoals || '',
            primaryGoal: profileData.primaryGoal || '',
            activityLevel: profileData.activityLevel || '',
            dietType: profileData.dietType || '',
            allergies: profileData.allergies || [],
            diseases: profileData.diseases || [],
            budget: profileData.budget || ''
        };

        document.getElementById('name').textContent =
            [userData.firstName, userData.lastName].filter(Boolean).join(' ') || 'Not set';

        document.getElementById('email').textContent = userData.email || 'Not set';
        document.getElementById('sex').textContent = profileData.gender ?
            profileData.gender.charAt(0).toUpperCase() + profileData.gender.slice(1) : 'Not set';

        if (profileData.dateOfBirth) {
            const age = calculateAge(profileData.dateOfBirth);
            document.getElementById('age').textContent = age !== null ? age + ' years' : 'Not set';
        } else {
            document.getElementById('age').textContent = 'Not set';
        }

        document.getElementById('weight').textContent = profileData.weight ?
            `${profileData.weight} kg` : 'Not set';

        document.getElementById('height').textContent = profileData.height ?
            `${profileData.height} cm` : 'Not set';
        // document.getElementById('primaryGoal').textContent = profileData.primaryGoal || 'Not set';

        document.getElementById('activityLevel').textContent = profileData.activityLevel || 'Not set';
        document.getElementById('dietType').textContent = profileData.dietType || 'Not set';
        // document.getElementById('budget').textContent = profileData.budget || 'Not set';



        // if (profileData.weight && profileData.height && profileData.dateOfBirth && profileData.gender) {
        //     const age = calculateAge(profileData.dateOfBirth);
        //     if (age) {
        //         const bmr = bmrCalculation(
        //             profileData.weight,
        //             profileData.height,
        //             age,
        //             profileData.gender
        //         );
        //         document.getElementById('bmr').textContent = bmr + ' kcal/day';
        //     } else {
        //         document.getElementById('bmr').textContent = 'Calculate';
        //     }
        // } else {
        //     document.getElementById('bmr').textContent = 'Insufficient data';
        // }


        // if (profileData.bmi) {
        //     document.getElementById('bmi').textContent = profileData.bmi;
        // } else if (profileData.weight && profileData.height) {
        //     const bmi = bmiCalculation(profileData.weight, profileData.height);
        //     document.getElementById('bmi').textContent = bmi;
        // } else {
        //     document.getElementById('bmi').textContent = 'Insufficient data';
        // }

        document.getElementById('diseases').textContent =
            profileData.diseases && profileData.diseases.length > 0 ?
                profileData.diseases.join(', ') : 'None';

        document.getElementById('allergies').textContent =
            profileData.allergies && profileData.allergies.length > 0 ?
                profileData.allergies.join(', ') : 'None';


        document.getElementById('primaryGoal').textContent = profileData.primaryGoal || 'Not set';
        // document.getElementById('medicalConditions').textContent =
        //     profileData.healthGoals || 'None';

        if (userData.profileImage) {
            document.getElementById('userImage').src = userData.profileImage;
        }

    } catch (error) {
        console.error('Error loading user data:', error);
        alert('Failed to load user data. Please try again.');
    }
}

// function cancelEdit() {
//     document.getElementById('name').textContent =
//         [originalValues.firstName, originalValues.lastName].filter(Boolean).join(' ') || 'Not set';
//     document.getElementById('email').textContent = originalValues.email || 'Not set';
//     document.getElementById('sex').textContent = originalValues.gender ?
//         originalValues.gender.charAt(0).toUpperCase() + originalValues.gender.slice(1) : 'Not set';
//     document.getElementById('weight').textContent = originalValues.weight ?
//         `${originalValues.weight} kg` : 'Not set';
//     document.getElementById('height').textContent = originalValues.height ?
//         `${originalValues.height} cm` : 'Not set';
//     document.getElementById('physicalInjuries').textContent =
//         originalValues.diseases && originalValues.diseases.length > 0 ?
//             originalValues.diseases.join(', ') : 'None';
//     document.getElementById('allergies').textContent =
//         originalValues.allergies && originalValues.allergies.length > 0 ?
//             originalValues.allergies.join(', ') : 'None';
//     document.getElementById('medicalConditions').textContent =
//         originalValues.primaryGoal || 'None';

//     document.querySelectorAll('[contenteditable="true"]').forEach(element => {
//         element.setAttribute('contenteditable', 'false');
//         element.classList.remove('border-green-500');
//     });

//     document.getElementById('editButtons').classList.add('hidden');
//     document.getElementById('editButton').classList.remove('hidden');
// }

// function toggleEditMode() {
//     const isEditing = document.getElementById('name').getAttribute('contenteditable') === 'true';

//     if (isEditing) {

//         saveChanges();
//     } else {

//         const editableFields = [
//             'name', 'email', 'sex', 'weight', 'height',
//             'physicalInjuries', 'allergies', 'medicalConditions'
//         ];

//         editableFields.forEach(fieldId => {
//             const element = document.getElementById(fieldId);
//             if (element) {
//                 element.setAttribute('contenteditable', 'true');
//                 element.classList.add('border-green-500');
//             }
//         });

//         document.getElementById('editButtons').classList.remove('hidden');
//         document.getElementById('editButton').classList.add('hidden');
//     }
// }
document.addEventListener('DOMContentLoaded', async () => {
    const userData = localStorage.getItem('userData');
    const token = getCurrentUserId();

    if (!userData && !token) {
        console.log('No authentication found, redirecting to login');
        window.location.href = 'login.html';
        return;
    }

    await loadUserData();

    // document.getElementById('saveButton').addEventListener('click', saveChanges);
    // document.getElementById('editButton').addEventListener('click', toggleEditMode);
    // document.getElementById('cancelButton').addEventListener('click', cancelEdit);
});