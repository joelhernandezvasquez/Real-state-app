const btnSearch = document.querySelector(".btn-search");
const dataSection = document.querySelector(".inner-data-container");



function getUserInputEncoded()
{
    const searchText = document.querySelector("#search-txt").value;
    return encodeURIComponent(searchText);
}

function getUserSearch()
{
    return document.querySelector("#search-txt").value;
}


async function getProperty(){
    
      const response = await fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=q9Ua8EhW7dI40qBt0UUqQzY9ZL8flZt4&location=${getUserSearch()}`);
      const data = await response.json();
      const stateCode = data.results[0].locations[0].adminArea3;
     
    fetch(`https://realtor.p.rapidapi.com/properties/v2/list-for-rent?city=${getUserInputEncoded()}&state_code=${stateCode}&limit=200&offset=0&sort=relevance`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "a28e09241emshc3367ca6817c8c9p11759bjsn861e18931a20",
            "x-rapidapi-host": "realtor.p.rapidapi.com"
        }
    })
    .then((response)=> response.json())
    .then((data)=>{
      
       
       const properties = data.properties.filter(element => element.community !=undefined);
       dataSection.innerHTML = '';
      
       properties.forEach(property => {
          
          const propertyCard = document.createElement("div");
          propertyCard.classList.add("property-card");
          propertyCard.innerHTML = 
                                ` <div class="head-card">
                                    <img src="${property.photos[0].href}"/>
                                  </div>

                                 <div class="card-name-price">
                                    <h2> ${property.community.name} </h2>
                                    <span id="price"> $ ${property.community.price_min}</span>
                                 </div> 
                            
                                <p>  ${property.address.line} ${property.address.city} ${property.address.country} ${property.address.postal_code}</p>
                            
                                <div class="card-specs">
                                    <span> <i class="fa fa-bed" aria-hidden="true"></i> ${property.community.beds_max} Beds</span>
                                    <span> <i class="fa fa-bath" aria-hidden="true"></i>${property.community.baths_max} Bath  </span>
                                    <span><i class="fa fa-square-o" aria-hidden="true"></i> ${property.community.sqft_max} Sqft </span>
                                </div>
                                
                                `

           dataSection.appendChild(propertyCard);

       }); 
     
       


    }) 
    .catch(err => {
        console.error(err);
    }); 
    
}






btnSearch.addEventListener("click",getProperty);