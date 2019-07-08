import React from "react";
import Info from "./components/info";
import Form from "./components/form";
import Weather from "./components/Weather";


const API_KEY_owm="00099c3faac93931449d5a94b2a246da";
const API_KEY_wb="0242c4514aa64b38800512382727d058";

const API_KEY_ocd="3dd28196123549248d288eec1e2057f3";

const time2=7200;

class App extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            option :"option1",
            temp:undefined,
            city:undefined,
            country: undefined,
            pressure: undefined,
            sunset: undefined,
            requests:undefined,
            error: undefined
        };

        this.definitionCity();
    }

//function to determine the city when you first enter the application
definitionCity = async()=> {    

    navigator.geolocation.getCurrentPosition((location)=>{

        var api_url = 'https://api.opencagedata.com/geocode/v1/json';
        var request_url = api_url
        + '?'
        + 'key=' + API_KEY_ocd
        + '&q=' + encodeURIComponent(location.coords.latitude + ',' + location.coords.longitude)
        + '&pretty=1'
        + '&no_annotations=1';

        fetch(request_url)
            .then(response=>response.json())
            .then((result)=>{
                const {results}=result;
                
                this.setState({
                    city:results[0].components.city
                });
            })
            .catch((e)=>{
                console.log(e);
            });
        },
        (error)=>{
            console.log('request location error',error);
        }
    );
}
//function that tracks changes in radio-button
handleRadioChange= async (event)=> {
    this.setState({option: event.target.value});
}

//a function that accesses weather services
gettingWeather= async (e)=>{
    
    e.preventDefault();
    var city=e.target.elements.city.value;
          
    var currTimeInSec=Date.parse(new Date())/1000;

    if(city){
        var data;
        if(this.state.option==="option1"){
            
            if(localStorage.getItem(city+"_option1")){
                var str=localStorage.getItem(city+"_option1");
                var time=str.substr(0,str.indexOf("_"));
                console.log(time);
                if(currTimeInSec-time<time2){
                    data=JSON.parse(str.substr(str.indexOf("_")+1,str.length-1));
                    console.log("option1_true<2");
                }
                else{
                    const api_url=await 
                    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY_owm}&units=metric`);
                    data=await api_url.json();
                    localStorage.setItem(city+"_"+"option1",currTimeInSec+"_"+JSON.stringify(data));
                    console.log("option1_true>2");
                }
            }
            else{

                const api_url=await 
                fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY_owm}&units=metric`);
                data=await api_url.json();
                localStorage.setItem(city+"_"+"option1",currTimeInSec+"_"+JSON.stringify(data));
                console.log("option1_false");
            }

            var sunset=data.sys.sunset;
            var date=new Date();
            date.setTime(sunset);
            var sunset_date=date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();

            this.setState({
                temp:data.main.temp,
                city:data.name,
                country:data.sys.country,
                pressure:data.main.pressure,
                sunset:sunset_date,
                error:undefined
            });
        }
        else{
            if(localStorage.getItem(city+"_option2")){

                var str=localStorage.getItem(city+"_option2");
                var time=str.substr(0,str.indexOf("_"));
                console.log(time);
                if(currTimeInSec-time<time2){
                    data=JSON.parse(str.substr(str.indexOf("_")+1,str.length-1));
                    console.log("option2_true<2");
                }
                else{
                    const api_url=await 
                    fetch(`https://api.weatherbit.io/v2.0/current?city=${city}&key=${API_KEY_wb}`);
                    data=await api_url.json();
                    localStorage.setItem(city+"_"+"option2",currTimeInSec+"_"+JSON.stringify(data));
                    console.log("option2_true>2");
                }
            }
            else{
                const api_url=await 
                fetch(`https://api.weatherbit.io/v2.0/current?city=${city}&key=${API_KEY_wb}`);
                data=await api_url.json();
                localStorage.setItem(city+"_"+"option2",currTimeInSec+"_"+JSON.stringify(data));
                console.log("option2_false");
            }
            
            this.setState({
                temp:data.data[0].temp,
                city:data.data[0].city_name,
                country:data.data[0].country_code,
                pressure:data.data[0].slp,
                sunset:data.data[0].sunset,
                error:undefined
            });
        }
    }else{
        this.setState({
            temp:undefined,
            city:undefined,
            country:undefined,
            pressure:undefined,
            sunset:undefined,
            error:"ВВедите название города"
        })
    }
}

//context rendering
    render(){
        return (
            <div className="wrapper">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-5 info">
                            <Info/>
                        </div>                        
                        <div className="col-sm-7 form">
                            <Form weatherMethod={this.gettingWeather}
                                   handleRadioChange={this.handleRadioChange} 
                                   option={this.state.option}
                                   city={this.state.city} 
                            />
                            <Weather
                                temp={this.state.temp}
                                city={this.state.city}
                                country={this.state.country}
                                pressure={this.state.pressure}
                                sunset={this.state.sunset}
                                error={this.state.error}
                            />
                        </div>
                    </div>
                </div>
                

            </div>
        )
    }
}

export default App; 