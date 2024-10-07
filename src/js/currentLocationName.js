export async function currentLocationName (){
    const response = await fetch ('https://get.geojs.io/v1/ip/geo.json');
    const data = await response.json();
    return data;
}