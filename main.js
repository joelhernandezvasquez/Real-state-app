
const btnSearch = document.querySelector(".btn-search");
const dataSection = document.querySelector(".inner-data-container");
const minBudgetRange = document.querySelector(".min-budget");
const maxBudgetRange = document.querySelector(".max-budget");
const overlay = document.querySelector(".overlay");
const headline = document.querySelector(".data-section h1");
const scroll = new SmoothScroll('a[href*="#"]', {
    speed: 1000
});



const init = () =>
{
    overlay.classList.add("active"); 
    headline.style.opacity = 0;
}

const getUserInputEncoded = () =>
{
    const searchText = document.querySelector("#search-txt").value;
    return encodeURIComponent(searchText);
}

const getUserSearch = () =>
{
    return document.querySelector("#search-txt").value;
}

function clearOutDataSection()
{
    dataSection.innerHTML = ' ';
}

function removeOverlay()
{
    overlay.classList.remove("active");
}

const getStateCode = () =>{
    return fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=q9Ua8EhW7dI40qBt0UUqQzY9ZL8flZt4&location=${getUserSearch()}`)
           .then((response)=> response.json())
           .then((data) => data.results[0].locations[0].adminArea3)
}

async function getProperty(){
       
        init();
        clearOutDataSection();
        const stateCode = await getStateCode();
       
     
    fetch(`https://realtor.p.rapidapi.com/properties/v2/list-for-rent?city=${getUserInputEncoded()}&state_code=${stateCode}&limit=200&offset=0&sort=relevance`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "a28e09241emshc3367ca6817c8c9p11759bjsn861e18931a20",
            "x-rapidapi-host": "realtor.p.rapidapi.com"
        }
    })
    .then((response)=> response.json())
    .then((data)=>{
      
       const properties = data.properties.filter(element => ((element.community !=undefined) && (element.community.price_min >=minBudgetRange.value && element.community.price_min <=maxBudgetRange.value )))
     
       
       removeOverlay();
       
       properties.forEach(property => {
          
          const propertyCard = document.createElement("div");
          propertyCard.classList.add("property-card");
          propertyCard.innerHTML = 
                                ` <div class="head-card">
                                    <img src="${property.photos[0].href}"/>
                                  </div>

                                 <div class="card-name-price">
                                    <h2> ${property.address.neighborhood_name} </h2>
                                    
                                    <span id="price"> $ ${ getPriceProperty(property.community.price_min)}</span>
                                 </div> 
                            
                                <p>  ${property.address.line} ${property.address.city} ${property.address.country} ${property.address.postal_code}</p>
                            
                                <div class="card-specs">
                                    <span> <i class="fa fa-bed" aria-hidden="true"></i> ${property.community.beds_max} Beds</span>
                                    <span> <i class="fa fa-bath" aria-hidden="true"></i>${property.community.baths_max} Bath  </span>
                                    <span><i class="fa fa-square-o" aria-hidden="true"></i> ${property.community.sqft_max} Sqft </span>
                                </div>
                                
                                `
        
           dataSection.appendChild(propertyCard);
            animation(propertyCard);

       }); 
     

    }) 
    .catch(err => {
        console.error(err);
    });  
    
}

const getPriceProperty =(price) =>{
   
    if(price!=undefined)
     return price;
    
     else
    
         return "undefined"   
        
}

function animation(card)
{
    let timeline = gsap.timeline();
     
    timeline.fromTo(".data-section .container h1", {
        opacity: 0
    },
        {
            opacity: 1,
            duration: 1
        })
        .fromTo(card, {
            opacity: 0,
            y:0

        }, {
                opacity: 1,
            y:-50,
                stagger: 1,
            duration:0.5
    })
}




btnSearch.addEventListener("click",getProperty);