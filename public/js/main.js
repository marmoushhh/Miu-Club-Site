(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Header carousel
    $(".header-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        items: 1,
        dots: true,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            }
        }
    });


    // Portfolio isotope and filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });
    $('#portfolio-flters li').on('click', function () {
        $("#portfolio-flters li").removeClass('active');
        $(this).addClass('active');

        portfolioIsotope.isotope({filter: $(this).data('filter')});
    });
    

    // =================================================================
    // LOGIN/REGISTER POPUP SCRIPT
    // =================================================================

    // --- Open and Close Popup ---
    // Close popup when 'x' button is clicked
    $('.auth-close-btn').on('click', function() {
        $('.auth-popup-container').fadeOut(300);
    });

    // Close popup when clicking on the overlay background
    $('.auth-popup-container').on('click', function(e) {
        if ($(e.target).is('.auth-popup-container')) {
            $(this).fadeOut(300);
        }
    });

    // --- Switch between Login and Register views ---
    $('.auth-toggle-link').on('click', function(e) {
        e.preventDefault();
        $('#login-view').toggle();
        $('#register-view').toggle();
    });
    
    // --- Handle Login Form Submission ---
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        const username = $('#login-username').val();
        const password = $('#login-password').val();

        if (!username || !password) {
            alert("Please fill in all fields.");
            return;
        }

        console.log("Attempting to log in user:", username);
        // Here you would typically make a fetch request to your login endpoint
        // For example:
        /*
        fetch("http://172.16.16.174:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: username,
                password: md5(password) // Hashing password
            })
        })
        .then(response => response.json())
        .then(result => {
            if (result.status === 'success') {
                alert('Login Successful!');
                $('.auth-popup-container').fadeOut(300);
                // Maybe update the UI to show the user is logged in
            } else {
                alert('Login Failed: ' + result.message);
            }
        })
        .catch(err => {
            console.error("Login error:", err);
            alert("An error occurred during login.");
        });
        */
       alert("Login functionality is not fully implemented yet.");
    });


    // --- Handle Register Form Submission ---
    // (We are attaching the event handler with jQuery instead of the old inline onsubmit)
    $('#registerForm').on('submit', function(e) {
        e.preventDefault();
        registerUser(); // Call your existing registerUser function
    });




})(jQuery);

// Start of register JavaScript
async function registerUser() {
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    const email = document.getElementById("register-email").value;
    const number = document.getElementById("register-number").value;

    if (!email || !username || !password || !number) {
        alert("Please fill in all fields.");
        return;
    }

    const hashedPassword = md5(password);

    try {
        const response = await fetch("http://172.16.16.174:3000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                username,
                password: hashedPassword,
                number
            })
        });

        const result = await response.json();

        if (result.status === "success") {
            alert("Registration successful! Please login."); // Changed alert to a more user-friendly message
            // Switch to the login view after successful registration
            $('#register-view').hide();
            $('#login-view').show();
        } else {
            // Handle registration failure
            alert("Registration failed: " + (result.message || "Unknown error"));
        }
    } catch (error) {
        console.error("Registration fetch error:", error);
        alert("An error occurred during registration. Please check the console.");
    }
}

// Function to load the MD5 library
function loadMD5() {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js";
    script.onload = () => console.log("MD5 library loaded.");
    document.head.appendChild(script);
}

document.addEventListener("DOMContentLoaded", function() {
    // Call loadMD5 to ensure the library is available before any registration attempts
    loadMD5();

    ["register-username", "register-password", "register-email", "register-number"].forEach(id => {
        const element = document.getElementById(id);
        if (element) { // Ensure element exists before adding event listener
            element.addEventListener("keydown", function(event) {
                if (event.key === "Enter") {
                    registerUser();
                }
            });
        }
    });

    // Add event listener for the register button if it exists
    const registerButton = document.getElementById("register-button"); // Assuming you have a button with this ID
    if (registerButton) {
        registerButton.addEventListener("click", registerUser);
    }
});
// End of Register JavaScript

// Start of Login JavaScript

// Function to display messages to the user (replaces alert())
function showMessage(message) {
    console.log("Message:", message);
    // You can implement your custom message box/toast notification here.
}

// Function to dynamically load the MD5 script from a CDN
function loadMD5Script() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.18.0/js/md5.min.js";
        script.onload = () => {
            console.log("MD5 script loaded successfully.");
            resolve();
        };
        script.onerror = () => {
            console.error("Failed to load MD5 script from CDN.");
            reject(new Error('Failed to load MD5 script'));
        };
        document.head.appendChild(script);
    });
}

// Main login function
async function login(event) {
    event.preventDefault(); // Prevent the default form submission (page reload)

    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value;
    const rememberMeCheckbox = document.getElementById("remember-me-checkbox");
    const rememberMe = rememberMeCheckbox ? rememberMeCheckbox.checked : false; // Get the state of the checkbox

    if (!username || !password) {
        showMessage("Please fill in all fields.");
        return;
    }

    // Check if md5 function is available
    if (typeof md5 === 'undefined') {
        showMessage("MD5 hashing library is not loaded. Please try again.");
        console.error("MD5 function not found. Ensure md5.min.js is loaded.");
        return;
    }

    const hashedPassword = md5(password); // Hash the password using MD5

    try {
        const response = await fetch("http://172.16.16.174:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            // Pass the rememberMe status to the server (true/false)
            body: JSON.stringify({ username, password: hashedPassword, rememberMe: rememberMe }) 
        });

        const result = await response.json();

        if (result.status === "success" && result.token) {
            // ALWAYS save token and username to localStorage
            // The token's actual expiration (2d vs 7d) is now controlled by the server.
            localStorage.setItem("token", result.token);
            localStorage.setItem("username", username);
            console.log(`Token and username saved to localStorage. Token expiration determined by server (${rememberMe ? '7d' : '2d'}).`);
            
            // If "Remember Me" was NOT checked, but a username was previously saved to localStorage,
            // we should clear that username so it doesn't pre-fill next time if they didn't want it.
            // However, since you want the token *always* in localStorage, we simplify this.
            // The pre-filling logic below handles showing/not showing the username.
            // If the user *unchecks* remember me, the *new token* will expire in 2 days.
            // The *old* token (if any) would have already expired or will expire according to its own `exp` claim.

            window.location.href = "index.html"; // Redirect to the main page
        } else {
            showMessage(result.message || "Login failed. Please check your credentials.");
        }
    } catch (error) {
        showMessage("Network error: Could not connect to the server.");
        console.error("Fetch error during login:", error);
    }
}

// Event listener for when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", async function() {
    // 1. Load the MD5 script first
    try {
        await loadMD5Script();
    } catch (error) {
        showMessage("Critical error: Could not load the MD5 script. Login will not function.");
        return; // Stop execution if MD5 fails to load
    }

    // 2. Implement "Remember Me" UI Pre-filling based on localStorage
    const usernameInput = document.getElementById("login-username");
    const rememberMeCheckbox = document.getElementById("remember-me-checkbox");

    const rememberedUsername = localStorage.getItem("username");

    // Pre-fill username if found in localStorage
    if (rememberedUsername) {
        if (usernameInput) {
            usernameInput.value = rememberedUsername;
        }
        // If a username is in localStorage, assume the user previously wanted to be remembered
        // and pre-check the "Remember me" box.
        if (rememberMeCheckbox) {
            rememberMeCheckbox.checked = true;
        }
    } else {
        // If no username found in localStorage, ensure the "Remember me" box is unchecked by default.
        if (rememberMeCheckbox) {
            rememberMeCheckbox.checked = false;
        }
    }
    
    // IMPORTANT: If the user unchecks "Remember me" on the UI, and then logs in,
    // the server will issue a 2-day token. But the *username* will still be in localStorage
    // from a *previous* login where "Remember me" was checked.
    // To strictly control the "remembered username" behavior, you might want to:
    // a) Only save username to localStorage IF "Remember me" is checked during login.
    // b) Clear username from localStorage IF "Remember me" is NOT checked during login.
    // Let's refine this to match the UI behavior for remembered username:

    // Add an event listener to the "remember me" checkbox itself to clear localStorage
    // if the user *unchecks* it after the username was already pre-filled.
    if (rememberMeCheckbox) {
        rememberMeCheckbox.addEventListener('change', function() {
            if (!this.checked) {
                // If the user *unchecks* remember me, clear the stored username
                // so it doesn't pre-fill next time, as they explicitly don't want to be remembered.
                localStorage.removeItem("username");
            } else {
                // If they check it, and there's a username in the field, save it for next time.
                // This is a bit redundant with the login flow, but ensures immediate UX.
                const currentUsername = document.getElementById("login-username").value.trim();
                if (currentUsername) {
                    localStorage.setItem("username", currentUsername);
                }
            }
        });
    }

    // 3. Attach login function to form submission
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", login);
    }

    // 4. Add "Enter" key listener for username and password fields
    ["login-username", "login-password"].forEach(id => {
        const inputField = document.getElementById(id);
        if (inputField) {
            inputField.addEventListener("keydown", function(event) {
                if (event.key === "Enter") {
                    login(event); // Call login function, passing the event to prevent default
                }
            });
        }
    });
});
//End of Login JavaScript