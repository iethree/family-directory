//get data from backend

/**
 * send/receive data from backend
 * 
 * @param {string} endpoint 
 * @param {object} data 
 */
export async function getFetch(endpoint) {
  return new Promise((resolve, reject) => {
    fetch(endpoint, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "credentials": "include"
        }
      }).then(r=> r.json()).then(r => resolve(r))
      .catch(console.log);
  });
}

export async function postFetch(endpoint, data) {
  return new Promise((resolve, reject) => {
    fetch(endpoint, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "credentials": "include"
        },
        body: JSON.stringify(data)
      }).then((r) => r.json()).then((r) => resolve(r))
      .catch(console.log);
  });
}