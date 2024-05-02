import { BACKEND_URL } from "./config.js";
//catch div element
let carouselDiv = document.querySelector('.carousel-inner')

const BACKEND_URL_CATE = BACKEND_URL + "/carousel"

//fetch categories from backend and assign to another fuction to create dropdown options
const getCategoriesBackend = async(url) => {
    try {
        const response = await fetch(url);
        const json = await response.json();
        for(let i=0; i<json.length; i++){
            let counter =0;
            
            let carouselItemDiv = document.createElement('div')

            //To make visible carousel first div name active
            if(i==0){
                carouselItemDiv.className = 'carousel-item active'
            }
            else{
                carouselItemDiv.className = 'carousel-item'
            }
        
            let cardsWrapperDiv = document.createElement('div')
            cardsWrapperDiv.className = 'cards-wrapper'
            carouselItemDiv.appendChild(cardsWrapperDiv)
            
            //3 category details attach to one card
            while(counter < 3){
                cardsWrapperDiv.appendChild(createCard(json[i].cate_img,json[i].cate_name,json[i].cate_description))                
                counter++;
                i++;
            }
            i--;
        
            carouselDiv.appendChild(carouselItemDiv)          
            
        }

    } catch (error) {
        alert("Error retrieving questions: " + error.message);
    }
}
getCategoriesBackend(BACKEND_URL_CATE)

//function to create card
function createCard(imageSource,cateName,cateDescription){
    let cardDiv = document.createElement('div')
    cardDiv.className = 'card'
    
    let imgDiv = document.createElement('div')
    imgDiv.className = 'image-wrapper'
    cardDiv.appendChild(imgDiv)

    let image = document.createElement('img')
    image.src = imageSource;
    image.alt = 'Card image cap'
    imgDiv.appendChild(image)

    let cardBodyDiv = document.createElement('div')
    cardBodyDiv.className = 'card-body'
    cardDiv.appendChild(cardBodyDiv)

    let heading = document.createElement('h5')
    heading.className = 'card-title'
    heading.innerHTML = cateName
    cardBodyDiv.appendChild(heading)

    let description = document.createElement('p')
    description.className = 'card-text'
    description.innerHTML = cateDescription
    cardBodyDiv.appendChild(description)
    
    let anchor = document.createElement('a')
    anchor.className = 'btn btn-primary'
    anchor.id = 'btn1'
    anchor.href= "../startQuiz.html"
    anchor.innerHTML = 'Join Quiz Here'
    cardBodyDiv.appendChild(anchor) 
    
    return cardDiv
}