import { BACKEND_URL } from "./config.js";
const mainDivFeedback = document.querySelector('.row1')

//url to get feedback
const BACKEND_URL_FEEDBACK = BACKEND_URL + "/feedback"

//url to get images
const BACKEND_URL_FEEDBACK_IMAGES = BACKEND_URL + "/feedback/pic"

//function to fetch images from backend 
const getImagesBackend = async(url) => {
    try {
        const response = await fetch(url);
        const imagejson = await response.json();

        //function to fetch feedback from backend and assign to another fuction to create card
        const getFeedbackBackend = async(url) => {
            try {
                const response = await fetch(url);
                const json = await response.json();
                for(let i=0; i<json.length; i++){
                    //call function to create card
                    let card = feedbackCard(imagejson[i].image,json[i].fullname,json[i].satisfaction_rating,json[i].feedback_text);
                    mainDivFeedback.appendChild(card);             
                }

            } catch (error) {
                alert("Error retrieving questions: " + error.message);
            }
        }
        //call function to fetch feedback
        getFeedbackBackend(BACKEND_URL_FEEDBACK)

    } catch (error) {
        alert("Error retrieving questions: " + error.message);
    }
}
//call function to fetch images
getImagesBackend(BACKEND_URL_FEEDBACK_IMAGES)





//create feedback card
function feedbackCard(pic,fullname,rating,text){
    //create a div and give class name
    let cardDiv = document.createElement('div')
    cardDiv.classList = 'col container-fluid feedback'

    //create another div and giv class name and append
    let secondDiv = document.createElement('div')
    secondDiv.classList = 'testimonial'
    cardDiv.appendChild(secondDiv)

    //create image element and attach an image
    let image = document.createElement('img')
    image.classList = 'container-fluid'
    image.src = pic
    image.alt = ""
    //attach to card div
    secondDiv.appendChild(image)

    //create name div
    let nameDiv = document.createElement('div')
    nameDiv.classList = 'name'
    nameDiv.innerHTML = fullname
    secondDiv.appendChild(nameDiv)

    //new div for rating
    let ratingDiv = document.createElement('div')
    ratingDiv.classList = 'stars'
    for(let i=0; i<rating; i++){
        let star = document.createElement('i')
        star.classList = 'fas fa-star'
        ratingDiv.appendChild(star)
    }
    secondDiv.appendChild(ratingDiv)

    //add feedback text
    let comment = document.createElement('p')
    comment.innerHTML = text
    secondDiv.appendChild(comment)

    return cardDiv

}