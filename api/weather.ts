import axios from "axios"

const apiKey = process.env.EXPO_PUBLIC_API_KEY

console.log("apikey", apiKey)
const forcastEndpoint = (param: weatherForcastProps) => `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${param.city}&days=${param.days}&aqi=no&alerts=no`
const locationEndpoint = (param: string) => `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${param}`

export interface weatherForcastProps {
    city: string;
    days: string;
}

const apiCall = async (endpoint:string) => {
    const options = {
        method: "GET",
        url: endpoint
    }

    try {
        const response = await axios.request(options) 
        return response.data;      
    } catch (error) {
        console.log(`Error : ${error}`)
        return null;
    }
}

export const fetchWeatherForcast = (params: weatherForcastProps) => {
    // return apiCall(forcastEndpoint(params))
    return apiCall(forcastEndpoint(params))
    
}

export const fetchLocationForcast = (params: string) => {
    return apiCall(locationEndpoint(params))
}