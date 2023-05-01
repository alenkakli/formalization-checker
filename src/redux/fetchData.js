export const fetchData = (route, method, body = undefined) => {
  return async (_, getState) => {
    const config = {
      method: method,
      headers: { "Content-Type": "application/json"}
    }
    if(localStorage.getItem("formalization_checker_token") !== null){
      config.headers["Authorization"] = "Bearer " + localStorage.getItem("formalization_checker_token");
    }
    if (body) {
      config.body = JSON.stringify(body)
    }
  
    const backendUrl = getState().backend.url;
    let response = await fetch(backendUrl + route, config);
  
    if (response.ok) {
      return response.json();
    }
    
    throw new Error(response.status + " " + response.statusText);
  }
}
