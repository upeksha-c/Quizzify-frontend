import { BACKEND_URL } from "./config.js";
// Create comments for all functions
// Insert categories to dropdown 
let selectedCategory = '';
let selectedOptionId = 0;

let startBtn = document.querySelector('#startbtn');
// Disable start button till select a category
startBtn.disabled = true;
let cateDiv = document.querySelector('.category');
let dropdown = document.createElement('select');
dropdown.className = 'dropdown';
dropdown.id = 'category';
dropdown.name = 'category';
cateDiv.appendChild(dropdown);

// Create a function to create options
function createCategoryOption(value, id) {
    let op = document.createElement('option');
    op.value = value;
    op.innerHTML = value;
    op.id = id;
    return op;
}

const BACKEND_URL_CATEGORY = BACKEND_URL + "/categories";

// Fetch categories from backend and assign to another function to create dropdown options
const getCategoriesBackend = async(url) => {
    try {
        const response = await fetch(url);
        const json = await response.json();
        json.forEach((element) => dropdown.appendChild(createCategoryOption(element.cate_name,element.id_category)));

    } catch (error) {
        alert("Error retrieving questions: " + error.message);
    }
}
getCategoriesBackend(BACKEND_URL_CATEGORY);

// Add an event listener to enable start button
dropdown.addEventListener('change', function() {
    if (dropdown.value) {
        startBtn.disabled = false;
        selectedCategory = dropdown.value;

        // Get the selected option element
        let selectedOption = dropdown.options[dropdown.selectedIndex];
        // Get the ID of the selected option
        selectedOptionId = selectedOption.id;
    }
});

// This function is called when the user clicks on the "Start Quiz" button
function startQuiz() {
    const content = document.querySelector("#content1");
    content.style.display = "none"; // Hide the content

    //attach new content
    const content2 = document.querySelector("#main_content");
    const firstDiv = document.createElement("div");
    content2.appendChild(firstDiv);

    const BACKEND_URL_QUE = BACKEND_URL + "/questions?category=" + selectedCategory;
    let answerArray = [];
    let currentElement = 0;
    let score = 0;
    let usersAnswerArray = [];
    let questionArray = [];

    // This function fetches the questions from the backend and displays questions
    const getQuestionsFromBackend = async(url) => {
        try {
            const response = await fetch(url);
            const json = await response.json();
            answerArray = json.map((element) => element.correct_answer);
            questionArray = json.map((element) => element);
            displayQuestion(questionArray[currentElement]);
        } catch (error) {
            alert("Error retrieving questions: " + error.message);
        }
    };
    // Add a global variable to store the current quiz number
    let currentQuizNumber = 1;

    // This function displays the question and options on the screen
    const displayQuestion = (questionData) => {
    firstDiv.innerHTML = ""; // Clear previous content
    
    // Display the current quiz number
    const quizNumberDiv = document.createElement("div");
    quizNumberDiv.id ="quizNumber"
    quizNumberDiv.textContent = `Quiz ${currentQuizNumber}/10`;
    firstDiv.appendChild(quizNumberDiv)
    
    //display question and options
    const questionDiv = createQuestionElement(questionData);
    const optionsDiv = createOptions(questionData.options);
    firstDiv.appendChild(questionDiv);
    firstDiv.appendChild(optionsDiv);
};

    // This function creates the question element   
    const createQuestionElement = (questionData) => {
        const questionDiv = document.createElement("div");
        questionDiv.className = "questionDiv";
        const question = document.createElement("h3");
        question.innerHTML = questionData.question;
        questionDiv.appendChild(question);
        return questionDiv;
    };

    // This function creates the options element
    const createOptions = (options) => {
        const answersDiv = document.createElement("div");
        options.forEach((option) => {
            const optionButton = createOptionButton(option);
            answersDiv.appendChild(optionButton);
        });
        return answersDiv;
    };

    // This function creates the option button
    const createOptionButton = (option) => {
        const btn = document.createElement("button");
        btn.className = "option";
        btn.innerHTML = option;
        btn.addEventListener("click", function() {
            disableButtons();
            checkAnswerAndUpdateUI(option);
        });
        return btn;
    };

    // This function disables all the buttons after the user selects an option
    const disableButtons = () => {
        const allButtons = document.querySelectorAll(".option");
        allButtons.forEach((button) => {
            button.disabled = true;
        });
    };

    // This function checks the user's answer and updates the UI
    const checkAnswerAndUpdateUI = (selectedAnswer) => {
        const correctAnswer = answerArray[currentElement];
        const resultBox = document.createElement('div');
        const resultStatement = document.createElement('h3');
        resultBox.className = "resultPrompt";
        resultBox.appendChild(resultStatement);

        if (selectedAnswer === correctAnswer) {
            resultStatement.innerHTML = "CORRECT";
            resultStatement.style.color = "#28a745"; // Green color for correct
            score++;
        } else {
            resultStatement.innerHTML = "INCORRECT";
            resultStatement.style.color = "#dc3545"; // Red color for incorrect
        }
        usersAnswerArray.push(selectedAnswer);
        firstDiv.appendChild(resultBox);

        const optionButtons = document.querySelectorAll('.option');
        optionButtons.forEach((button) => {
            if (button.innerHTML === correctAnswer) {
                button.classList.add('correctAnswer');
            } else {
                button.classList.add('incorrectAnswer');
            }
            button.disabled = true;
        });

        firstDiv.appendChild(createNextButtonElement());
    };

// This function creates the next button
const createNextButtonElement = () => {
    const nextButtonContainer = document.createElement('div');
    nextButtonContainer.className = "nextButtonContainer"; // Adding a class for styling
    const nextButton = document.createElement('button');
    nextButton.className = "btn btn-primary nextButton";
    nextButton.innerHTML = "NEXT";
    nextButton.addEventListener("click", function() {
        currentElement++;
        currentQuizNumber++; // Increment the current quiz number
        if (currentElement === answerArray.length) {
            displayScoreBox(score, answerArray.length, selectedOptionId);
        } else {
            displayQuestion(questionArray[currentElement]);
        }
    });
    nextButtonContainer.appendChild(nextButton);
    return nextButtonContainer;
};


    // Function to display the score box
    const displayScoreBox = (score, totalQuestions, category) => {
        // Redirect to score.html with score as query parameter
        window.location.href = `score.html?score=${score}&totalQuestions=${totalQuestions}&categoryId=${category}`;
    };

    // Start the quiz
    getQuestionsFromBackend(BACKEND_URL_QUE);
}
