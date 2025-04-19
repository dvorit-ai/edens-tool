// Store user answers and item name
let userAnswers = [];
let itemName = "";

// Define point values for each section
const sectionPoints = {
    section2: 1,
    section3: 2,
    section4: 2,
    section5: 3,
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





//   SECTION 1: RUN AWAY BUTTON

// Run away button with delayed click handling
document.addEventListener('DOMContentLoaded', function() {
    const runButton = document.getElementById('runAwayButton');
    let moveCount = 0;
    const MAX_MOVES = 8;

    // Function to initialize button position
    function initButtonPosition() {
        const rect = runButton.getBoundingClientRect();
        runButton.style.position = 'absolute';
        runButton.style.left = rect.left + 'px';
        runButton.style.top = rect.top + 'px';
    }

    // Function to move button
    function moveButton() {
        moveCount++;
        if (moveCount <= MAX_MOVES) {
            const x = Math.random() * (window.innerWidth - runButton.offsetWidth);
            const y = Math.random() * (window.innerHeight - runButton.offsetHeight);
            runButton.style.left = x + 'px';
            runButton.style.top = y + 'px';
            return true;
        }
        return false;
    }

    // Override the button's click behavior
    const originalClickHandlers = [];

    // Store original click handlers
    const originalAddEventListener = runButton.addEventListener;
    runButton.addEventListener = function(type, listener, options) {
        if (type === 'click') {
            originalClickHandlers.push({listener, options});
        } else {
            originalAddEventListener.call(this, type, listener, options);
        }
    };

    // Replace with our custom handler
    runButton.onclick = function(e) {
        // Stop the event immediately
        e.preventDefault();
        e.stopPropagation();

        // First time, initialize position
        if (moveCount === 0) {
            initButtonPosition();
        }

        // Move the button if we haven't reached max moves
        if (moveCount < MAX_MOVES) {
            moveButton();
            return false;
        } else {
            // We've reached max moves, proceed with original behavior after a short delay
            setTimeout(function() {
                // Manually trigger the standard handler
                handleAnswer(runButton);
            }, 50);
            return false;
        }
    };

    // Still handle mouseenter for desktop
    runButton.addEventListener('mouseenter', function() {
        if (moveCount === 0) {
            initButtonPosition();
        }
        moveButton();
    });
});









// SECTION 2: POP UP ARE YOU SURE??? 

// Add this at the very end of your JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    // Get our special no button
    const specialNoButton = document.getElementById('special-no-button');
    if (!specialNoButton) return;
    
    // Create a variable to track the user's final choice for section3
    let section3FinalValue = null;
    
    // First, completely block the standard navigation for section3
    // This is a direct override of your showSection function
    const originalShowSection = window.showSection;
    window.showSection = function(index) {
        // If we're trying to show section4 (index 3) but haven't completed popups,
        // prevent this from happening
        if (index === 3 && document.getElementById('popup-container').style.display === 'flex') {
            return; // Stop here - don't advance
        }
        
        // Otherwise, continue with normal behavior
        originalShowSection(index);
    };
    
    // Override the original handleAnswer function to skip section3
    const originalHandleAnswer = window.handleAnswer;
    window.handleAnswer = function(buttonElement) {
        // If this is section3 and the special-no-button, we handle it differently
        if (buttonElement === specialNoButton || 
            (buttonElement.closest && buttonElement.closest('#section3') && buttonElement.value === "1")) {
            // Show the popup sequence instead
            showPopupSequence();
            return; // Don't process through the normal flow
        }
        
        // Otherwise, handle normally
        originalHandleAnswer(buttonElement);
    };
    
    // Function to show the popup sequence
    function showPopupSequence() {
        // Show first popup
        const popupContainer = document.getElementById('popup-container');
        popupContainer.style.display = 'flex';
        document.getElementById('popup-1').style.display = 'block';
        document.getElementById('popup-2').style.display = 'none';
        document.getElementById('popup-3').style.display = 'none';
    }
    
    // Function to finish the popup sequence and move to next section
    function finishPopupSequence(finalValue) {
        // Hide popup container
        document.getElementById('popup-container').style.display = 'none';
        
        // Set the final value
        section3FinalValue = finalValue;
        
        // Process the section answer with appropriate value
        const fakeSectionButton = {
            value: section3FinalValue,
            closest: function() { return document.getElementById('section3'); }
        };
        
        // Process the answer with the standard handler
        originalHandleAnswer(fakeSectionButton);
    }
    
    // Next, handle the button click to show popups
    specialNoButton.onclick = function(e) {
        // Stop any other handlers
        e.stopPropagation();
        e.preventDefault();
        
        // Show the popup sequence
        showPopupSequence();
        
        return false;
    };
    
    // Add handlers for popup1
    document.getElementById('popup1-yes').onclick = function() {
        document.getElementById('popup-1').style.display = 'none';
        document.getElementById('popup-2').style.display = 'block';
    };
    
    document.getElementById('popup1-no').onclick = function() {
        finishPopupSequence("2"); // Finish with "no" (value 2)
    };
    
    // Add handlers for popup2
    document.getElementById('popup2-yes').onclick = function() {
        document.getElementById('popup-2').style.display = 'none';
        document.getElementById('popup-3').style.display = 'block';
    };
    
    document.getElementById('popup2-no').onclick = function() {
        finishPopupSequence("2"); // Finish with "no" (value 2)
    };
    
    // Handle popup3 buttons
    document.getElementById('popup3-yes').onclick = function() {
        finishPopupSequence("1"); // Finish with "yes" (value 1)
    };
    
    document.getElementById('popup3-no').onclick = function() {
        finishPopupSequence("2"); // Finish with "no" (value 2)
    };
});



// SECTION 3: FAKE BUTTON DRAGGABLE!!

// Simple draggable button overlay with mobile alignment fix
document.addEventListener('DOMContentLoaded', function() {
    // Find the yes button in section4
    const section4 = document.getElementById('section4');
    if (!section4) return;
    
    const yesButton = section4.querySelector('button[value="1"]');
    if (!yesButton) return;
    
    // Create a fake button that looks identical
    const fakeButton = document.createElement('button');
    fakeButton.textContent = yesButton.textContent;
    fakeButton.className = yesButton.className;
    fakeButton.style.position = 'absolute';
    fakeButton.style.cursor = 'grab';
    
    // Add it to the document
    document.body.appendChild(fakeButton);
    
    // Position it over the real button with mobile adjustment
    function positionFakeButton() {
        const rect = yesButton.getBoundingClientRect();
        fakeButton.style.left = (rect.left + window.scrollX) + 'px';
        
        // Mobile adjustment - check if we're on a mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Apply a small adjustment for mobile devices
        if (isMobile) {
            // Adjust vertical position to account for mobile differences
            fakeButton.style.top = (rect.top + window.scrollY + 2) + 'px';
        } else {
            fakeButton.style.top = (rect.top + window.scrollY) + 'px';
        }
        
        fakeButton.style.width = rect.width + 'px';
        fakeButton.style.height = rect.height + 'px';
    }
    
    // Position initially and when showing section4
    positionFakeButton();
    
    // Make it draggable
    let isDragging = false;
    
    fakeButton.addEventListener('mousedown', function(e) {
        isDragging = true;
        const startX = e.clientX - fakeButton.offsetLeft;
        const startY = e.clientY - fakeButton.offsetTop;
        
        function moveAt(x, y) {
            fakeButton.style.left = (x - startX) + 'px';
            fakeButton.style.top = (y - startY) + 'px';
        }
        
        function onMouseMove(e) {
            if (isDragging) {
                moveAt(e.clientX, e.clientY);
            }
        }
        
        document.addEventListener('mousemove', onMouseMove);
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
        }, {once: true});
    });
    
    // For mobile
    fakeButton.addEventListener('touchstart', function(e) {
        isDragging = true;
        const touch = e.touches[0];
        const startX = touch.clientX - fakeButton.offsetLeft;
        const startY = touch.clientY - fakeButton.offsetTop;
        
        function moveAt(x, y) {
            fakeButton.style.left = (x - startX) + 'px';
            fakeButton.style.top = (y - startY) + 'px';
        }
        
        function onTouchMove(e) {
            if (isDragging) {
                const touch = e.touches[0];
                moveAt(touch.clientX, touch.clientY);
                e.preventDefault();
            }
        }
        
        document.addEventListener('touchmove', onTouchMove, {passive: false});
        
        document.addEventListener('touchend', function() {
            isDragging = false;
            document.removeEventListener('touchmove', onTouchMove);
        }, {once: true});
        
        e.preventDefault();
    }, {passive: false});
    
    // Hide/show fake button when changing sections
    const originalShowSection = window.showSection;
    window.showSection = function(index) {
        originalShowSection(index);
        
        // Show fake button only on section4
        if (index === 3) { // Assuming section4 is index 3 (0-based)
            fakeButton.style.display = 'block';
            positionFakeButton();
        } else {
            fakeButton.style.display = 'none';
        }
    };
    
    // Handle window resize
    window.addEventListener('resize', positionFakeButton);
});

