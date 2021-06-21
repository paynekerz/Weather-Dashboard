const searchBtn = $("#search-btn")
let searchBar = $("#search-bar")
let priorSearch = $("#prior-search")
let citysWeather = $("#citys-weather")
let fivedayWeather =$("#five-day")
let searchHist = JSON.parse(localStorage.getItem("priorSearch")) || []

createBtn()

searchBtn.on("click", function (event){
    event.preventDefault()
    //come back here add validation 
    searchHist.unshift(searchBar.val())
    localStorage.setItem("priorSearch", JSON.stringify(searchHist))
    createBtn()
    todaysWeather(searchBar.val())
})

function createBtn(){
    priorSearch.empty()
    searchHist.forEach(function (data){        
        priorSearch.append(`<button type="button" class="btn btn-primary">${data}</button></br>`)
    })
}
//funtion that for the prior search buttons
priorSearch.on("click", "button", function (event){
    event.preventDefault()
    // console.log($(this).text())
    todaysWeather($(this).text())
})

function todaysWeather(cityName){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=ce1c0e89c113fb72c977a8e940970f25`)
        .then(function (res){
            return res.json()
        })
        .then(function(data){
            fiveDay(data.name, data.coord.lat, data.coord.lon)
        })
}

function fiveDay(name, lat, long){
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=imperial&appid=ce1c0e89c113fb72c977a8e940970f25`)
        .then(function (res){
            return res.json()
        })
        .then(function(data){
            let today = new Date ()
            citysWeather.empty()
            citysWeather.append(`
            <section class="card">
            <h3>${name} [${today}]</h3>
            <p>Temp: ${data.current.temp} °F</p>
            <p>Wind: ${data.current.wind_speed} MPH</p>
            <p>Humidity: ${data.current.humidity}%</p>
            <p>UV Index: ${data.current.uvi}</p>
            </section>
            `)
            fivedayWeather.empty()
            
            for(i=1; i <= 6; i++){
                let day = new Date(data.daily[i].dt*1000)
                fivedayWeather.append(`
                <div class ="col bg-dark text-white">
                    <h5>${day}</h5>
                    <p>Temp: ${data.daily[i].temp.day} °F</p>
                    <p>Wind: ${data.daily[i].wind_speed} MPH</p>
                    <p>Humility: ${data.daily[i].humidity}%</p>
                </div>
                `)
            }
            console.log(data)

        })
}

