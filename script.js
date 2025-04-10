// Store user answers and item name
let userAnswers = [];
let itemName = "";

// Get all sections
const sections = document.querySelectorAll('section');
let currentSectionIndex = 0;

// Function to show current section and hide others
function showSection(index) {
    sections.forEach((section, i) => {
        if (section.id !== 'resultsSection') { // Skip the results section when hiding
            section.style.display = i === index ? 'block' : 'none';
        }
    });
}

// Function to handle the first question with text input
function handleFirstQuestion() {
    const inputField = document.getElementById('itemInput');
    if (inputField && inputField.value.trim() !== '') {
        // Store the item name
        itemName = inputField.value.trim();
        
        // Store the answer
        userAnswers.push({
            question: "What is it?",
            answer: itemName
        });
        
        // Update the results table
        updateResultsTable();
        
        // Update all subsequent questions with the item name
        updateQuestions();
        
        // Move to the next section
        currentSectionIndex++;
        showSection(currentSectionIndex);
    } 
}

// Function to update all questions with the item name
function updateQuestions() {
    // Start from the second section (index 1) since we're already done with the first
    for (let i = 1; i < sections.length; i++) {
        if (sections[i].id !== 'resultsSection') {
            const questionPlaceholder = sections[i].querySelector('.item-placeholder');
            if (questionPlaceholder) {
                questionPlaceholder.textContent = itemName;
            }
        }
    }
}

// Function to handle button clicks for yes/no questions
function handleAnswer(buttonElement) {
    // Get the current question text (with the item name already inserted)
    const questionText = sections[currentSectionIndex].querySelector('h1').textContent;
    
    // Store the answer
    userAnswers.push({
        question: questionText,
        answer: buttonElement.textContent,
        value: buttonElement.value
    });

    // Update the results table
    updateResultsTable();

    // Move to next section
    currentSectionIndex++;
    if (currentSectionIndex < sections.length) {
        showSection(currentSectionIndex);
    } else {
        // Show completion message
        sections.forEach(section => {
            if (section.id !== 'resultsSection') {
                section.style.display = 'none';
            }
        });
        
        const completionMessage = document.getElementById('completionMessage');
        if (completionMessage) {
            completionMessage.style.display = 'block';
        } else {
            const message = document.createElement('div');
            message.id = 'completionMessage';
            message.innerHTML = `<h2>You have completed all questions about "${itemName}"!</h2>`;
            document.getElementById('resultsSection').prepend(message);
        }
    }
}

// Function to update the results table with current answers
function updateResultsTable() {
    const tableBody = document.querySelector('#resultsTable tbody');
    if (!tableBody) return;
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Add a row for each answer
    userAnswers.forEach(answer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${answer.question}</td>
            <td>${answer.answer}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to reset the quiz
function resetQuiz() {
    // Reset variables
    userAnswers = [];
    itemName = "";
    currentSectionIndex = 0;
    
    // Reset the input field
    const inputField = document.getElementById('itemInput');
    if (inputField) {
        inputField.value = '';
    }
    
    // Reset placeholders in questions
    const placeholders = document.querySelectorAll('.item-placeholder');
    placeholders.forEach(placeholder => {
        placeholder.textContent = '_____';
    });
    
    // Hide completion message if it exists
    const completionMessage = document.getElementById('completionMessage');
    if (completionMessage) {
        completionMessage.style.display = 'none';
    }
    
    // Clear the results table
    updateResultsTable();
    
    // Show first section again
    showSection(0);
}

// Function to try closing the browser tab
function closeCurrentTab() {
    window.close();
    
    // Fallback message if window.close() is blocked
    setTimeout(() => {
        alert("Please close this tab manually if it didn't close automatically.");
    }, 300);
}

// Initialize the questionnaire
window.addEventListener('DOMContentLoaded', () => {
    // Initially hide all sections except the first one
    showSection(0);
    
    // Make sure results section is visible throughout
    const resultsSection = document.getElementById('resultsSection');
    if (resultsSection) {
        resultsSection.style.display = 'block';
    }
    
    // Add event listener to the submit button in the first section
    const submitButton = document.getElementById('submitItem');
    if (submitButton) {
        submitButton.addEventListener('click', handleFirstQuestion);
    }
    
    // Add event listener to the input field to allow pressing Enter
    const inputField = document.getElementById('itemInput');
    if (inputField) {
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleFirstQuestion();
            }
        });
    }

    // Add click event listeners to all yes/no buttons in other sections
    for (let i = 1; i < sections.length; i++) {
        if (sections[i].id !== 'resultsSection') {
            const buttons = sections[i].querySelectorAll('button');
            buttons.forEach(button => {
                button.addEventListener('click', () => handleAnswer(button));
            });
        }
    }
    
    // Add event listener to reset button
    const resetButton = document.getElementById('resetButton');
    if (resetButton) {
        resetButton.addEventListener('click', resetQuiz);
    }
    
    // Add event listener to close button
    const closeButton = document.getElementById('closeButton');
    if (closeButton) {
        closeButton.addEventListener('click', closeCurrentTab);
    }
});