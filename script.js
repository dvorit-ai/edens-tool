// Store user answers and item name
let userAnswers = [];
let itemName = "";

// Define point values for each section
const sectionPoints = {
    section2: 4,
    section3: 1,
    section4: 3,
    section5: 2,
    section6: 4,
    section7: 2,
    section8: 2,
    section9: 4,
    section10: 2,
    section11: 3,
    section12: 4,
    section13: 1
    // Add more sections as needed
};

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
        
        // Update all subsequent questions with the item name
        updateQuestions();
        
        // Initialize the results table with all rows
        initializeResultsTable();
        
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

// Function to initialize the results table with all question rows
function initializeResultsTable() {
    const table = document.getElementById('resultsTable');
    if (!table) return;
    
    // Clear existing table
    table.innerHTML = '';
    
    // Create table header
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>buy it</th>
            <th>don't buy it</th>
            <th></th>
        </tr>
    `;
    table.appendChild(thead);
    
    // Create table body with empty rows for all questions
    const tbody = document.createElement('tbody');
    
    // Create a row for each question (excluding the first input question)
    for (let i = 1; i < sections.length; i++) {
        if (sections[i].id !== 'resultsSection') {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td id="yes-cell-${i}" class="empty-cell"></td>
                <td id="no-cell-${i}" class="empty-cell"></td>
                <td>Q${i}</td>
            `;
            tbody.appendChild(row);
        }
    }
    
    table.appendChild(tbody);
    
    // Create table footer for totals
    const tfoot = document.createElement('tfoot');
    tfoot.innerHTML = `
        <tr>
            <td id="yesTotal">0 points</td>
            <td id="noTotal">0 points</td>
            <td></td>
        </tr>
    `;
    table.appendChild(tfoot);
}

// Function to handle button clicks for yes/no questions
function handleAnswer(buttonElement) {
    const currentSection = sections[currentSectionIndex];
    const sectionId = currentSection.id;
    const buttonValue = buttonElement.value;
    
    // Get point value for this section
    const pointValue = sectionPoints[sectionId] || 0;
    
    // Store the answer with points
    userAnswers.push({
        questionId: sectionId,
        value: buttonValue,
        points: pointValue,
        questionNumber: currentSectionIndex // Store the question number for display
    });

    // Update specific table cell for this question
    updateTableCell(currentSectionIndex, buttonValue, pointValue);
    
    // Update totals
    updateTotals();

    // Move to next section
    currentSectionIndex++;
    
    // Count actual question sections (excluding resultsSection)
    const questionSections = Array.from(sections).filter(section => section.id !== 'resultsSection');
    
    if (currentSectionIndex < questionSections.length) {
        showSection(currentSectionIndex);
    } else {
        // Show completion message
        sections.forEach(section => {
            if (section.id !== 'resultsSection') {
                section.style.display = 'none';
            }
        });

        sections.forEach(section => {
            section.style.display = 'none';
        });

        // Calculate final totals for comparison
        let yesTotal = 0;
        let noTotal = 0;
    
        userAnswers.forEach(answer => {
            if (answer.value === "1") {
                yesTotal += answer.points;
            } else if (answer.value === "2") {
                noTotal += answer.points;
            }
        });
        
        // Create a different message based on which column has more points
        let completionHTML = '';
        if (yesTotal > noTotal) {
            completionHTML = `<h1>Sounds like you’ve really thought this through—go ahead and buy the <span class="item-placeholder">${itemName}</span>!</h1>`;
        } else if (noTotal >= yesTotal) {
            completionHTML = `<h1>We both know you shouldn’t spend this money on the <span class="item-placeholder">${itemName}</span> right now.<br><br> Try again next time babes.</h1>`;
        } 
        
        // Show completion message
        const completionMessage = document.getElementById('completionMessage');
        if (completionMessage) {
            completionMessage.innerHTML = completionHTML;
            completionMessage.style.display = 'block';
        } else {
            const message = document.createElement('div');
            message.id = 'completionMessage';
            message.innerHTML = completionHTML;
            document.body.appendChild(message); // Append to body instead of resultsSection
        }
    }
}

// Function to generate checkmarks or X marks based on points
function generateMarks(points, isYes) {
    if (points === 0) return '';
    
    let marks = '';
    const symbol = isYes ? '✔' : '✘';
    
    for (let i = 0; i < points; i++) {
        marks += symbol;
    }
    
    return marks;
}

// Function to update a specific table cell
function updateTableCell(questionIndex, answerValue, points) {
    // Get the cells for this question
    const yesCell = document.getElementById(`yes-cell-${questionIndex}`);
    const noCell = document.getElementById(`no-cell-${questionIndex}`);
    
    if (!yesCell || !noCell) return;
    
    // Clear both cells first
    yesCell.innerHTML = '';
    yesCell.className = 'empty-cell';
    yesCell.style.backgroundColor = '';
    
    noCell.innerHTML = '';
    noCell.className = 'empty-cell';
    noCell.style.backgroundColor = '';
    
    // Update the appropriate cell based on the answer
    if (answerValue === "1") {
        // Update yes cell
        yesCell.innerHTML = generateMarks(points, true);
        yesCell.className = 'yes-cell';
        
        // Set opacity based on points
        const opacity = Math.min(0.2 + (points * 0.2), 1);
        yesCell.style.backgroundColor = `rgba(132, 159, 232, ${opacity})`;
    } else if (answerValue === "2") {
        // Update no cell
        noCell.innerHTML = generateMarks(points, false);
        noCell.className = 'no-cell';
        
        // Set opacity based on points
        const opacity = Math.min(0.2 + (points * 0.2), 1);
        noCell.style.backgroundColor = `rgba(247, 148, 73, ${opacity})`;
    }
}

// Function to update the point totals
function updateTotals() {
    let yesTotal = 0;
    let noTotal = 0;
    
    userAnswers.forEach(answer => {
        if (answer.value === "1") {
            yesTotal += answer.points;
        } else if (answer.value === "2") {
            noTotal += answer.points;
        }
    });
    
    // Update the totals in the table footer
    const yesTotalElement = document.getElementById('yesTotal');
    const noTotalElement = document.getElementById('noTotal');

    if (yesTotalElement) {
        yesTotalElement.textContent = `${yesTotal} points`;
    }

    if (noTotalElement) {
        noTotalElement.textContent = `${noTotal} points`;
}
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
    
    // Reset the results table
    const resultsTable = document.getElementById('resultsTable');
    if (resultsTable) {
        resultsTable.innerHTML = '';
    }
    
    // Show first section again
    showSection(0);
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
    
    // Add event listeners to reset buttons
    document.getElementById('resetButton')?.addEventListener('click', resetQuiz);
});

// Function to toggle the visibility of the info section
function showInfo() {
    var x = document.getElementById("info-popup");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }