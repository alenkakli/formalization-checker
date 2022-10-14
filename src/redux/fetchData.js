import { BACKEND_URL } from '../config';


export const fetchData = async (route, method, body = undefined) => {
  const config = {
    method: method,
    headers: { "Content-Type": "application/json"}
  }
  if(localStorage.getItem("token") !== undefined){
    config.headers["Authorization"] = "Bearer " + localStorage.getItem("token");
  }
  if (body) {
    config.body = JSON.stringify(body)
  }

  let response = await fetch(BACKEND_URL + route, config);

  if (response.ok) {
    return response.json();
  }
  
  throw new Error(response.status + " " + response.statusText);
}
