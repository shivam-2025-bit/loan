// Get references to the form and result elements
const emiForm = document.getElementById('emiForm');
const resultDiv = document.getElementById('result');
const detailsDiv = document.getElementById('details');

// Add event listener for form submission
emiForm.addEventListener('submit', function(event) {
    // Prevent the default form submission behavior (page reload)
    event.preventDefault();

    // Get input values
    const principalInput = document.getElementById('principal');
    const rateInput = document.getElementById('rate');
    const tenureInput = document.getElementById('tenure');
    const resultDisplay = document.getElementById('result'); // Re-select inside handler is fine
    const detailsDisplay = document.getElementById('details'); // Re-select inside handler is fine

    // Clear previous results and errors
    resultDisplay.innerHTML = '';
    detailsDisplay.innerHTML = '';
    principalInput.classList.remove('error-input');
    rateInput.classList.remove('error-input');
    tenureInput.classList.remove('error-input');


    // Convert input values to numbers
    const principal = parseFloat(principalInput.value);
    const annualRate = parseFloat(rateInput.value);
    const tenureYears = parseFloat(tenureInput.value);

    // --- Input Validation ---
    let isValid = true;
    if (isNaN(principal) || principal <= 0) {
         displayError(principalInput, resultDisplay, 'Please enter a valid loan amount.');
         isValid = false;
     }
     if (isNaN(annualRate) || annualRate < 0) { // Allow 0% interest
         displayError(rateInput, resultDisplay,'Please enter a valid annual interest rate.');
         isValid = false;
     }
      if (isNaN(tenureYears) || tenureYears <= 0) {
         displayError(tenureInput, resultDisplay,'Please enter a valid loan tenure in years.');
         isValid = false;
     }

     if (!isValid) {
         detailsDisplay.innerHTML = ''; // Clear details if validation fails
         return; // Stop calculation if validation fails
     }


    // --- Calculation ---
    let emi = 0;
    let totalPayment = 0;
    let totalInterest = 0;

    if (annualRate === 0) {
        // Handle zero interest rate scenario
        emi = principal / (tenureYears * 12);
        totalPayment = principal;
        totalInterest = 0;
    } else {
        // Calculate monthly interest rate
        const monthlyRate = annualRate / 12 / 100;

        // Calculate tenure in months
        const tenureMonths = tenureYears * 12;

        // Calculate EMI using the formula:
        // EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
        const ratePowerN = Math.pow(1 + monthlyRate, tenureMonths);
        emi = (principal * monthlyRate * ratePowerN) / (ratePowerN - 1);

        // Calculate total payment and total interest
        totalPayment = emi * tenureMonths;
        totalInterest = totalPayment - principal;
    }


    // --- Display Results ---
    if (isFinite(emi)) { // Check if EMI is a valid number (not Infinity or NaN)
        resultDisplay.innerHTML = `
            <p>Monthly EMI:</p>
            <p><span class="amount">₹ ${emi.toFixed(2)}</span></p>
        `;

        detailsDisplay.innerHTML = `
            <p>Principal Loan Amount: <span>₹ ${principal.toFixed(2)}</span></p>
            <p>Total Interest Payable: <span>₹ ${totalInterest.toFixed(2)}</span></p>
            <p>Total Payment (Principal + Interest): <span>₹ ${totalPayment.toFixed(2)}</span></p>
        `;
    } else {
        // Handle potential calculation errors (e.g., if inputs lead to invalid math)
        resultDisplay.innerHTML = `<p><span class="error">Could not calculate EMI. Please check your inputs.</span></p>`;
        detailsDisplay.innerHTML = ''; // Clear details on error
    }
});

// --- Helper function to display errors ---
function displayError(inputElement, resultElement, message) {
    // Add visual indication to the input field (optional)
    if(inputElement) { // Check if inputElement exists
        inputElement.classList.add('error-input'); // You might need CSS for .error-input
        // Remove error class after a delay or on input change
        setTimeout(() => {
             inputElement.classList.remove('error-input');
        }, 3000);
    }

    // Display error message in the result area
    resultElement.innerHTML = `<p><span class="error">${message}</span></p>`;
}

// Add simple CSS for error state (add to style.css if you use it)
/*
.error-input {
    border-color: #dc3545 !important;
    box-shadow: 0 0 5px rgba(220, 53, 69, 0.5) !important;
}
*/