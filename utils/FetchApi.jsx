const callApi = async (route, method, body) => {
  const responce = await fetch(`${`https://tenderapi.nafedtrackandtrace.com`}/${route}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(body),
  });

  const data = await responce.json();
  console.log(data);
  return data;
};

const callApiGet = async (route) => {
  const responce = await fetch(`${`http://localhost:8002`}${route}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await responce.json();
  return data;
};

const callApiPost = async (route, formData) => {
  console.log("Form Data:", formData); // To check if formData is correct

  try {
    const response = await fetch(`http://localhost:8002/${route}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData), // Properly stringified body
    });

    // Check if the response is okay (status code in the range 200-299)
    if (!response.ok) {
      const errorData = await response.json();
      console.log("Error Data:", errorData); // Log server-side errors
      throw new Error(errorData.msg || 'An error occurred while creating the tender');
    }

    const data = await response.json();
    console.log("Response Data:", data); // Log response data for verification
    return data;
  } catch (error) {
    console.error('Error submitting form:', error.message);
    throw error;
  }
};

// api for delete tender

const callApiDelete = async (route) => {
  console.log(`Calling DELETE for route: ${route}`);

  try {
    const response = await fetch(`http://localhost:8002/${route}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log("Error Data:", errorData); // Log server-side errors
      throw new Error(errorData.msg || 'An error occurred while processing the request');
    }

    const data = await response.json();
    console.log("Response Data:", data); // Log response data for verification
    return data;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
};












const uploadDocApi = async (route, formData) => {
  // const responce = await fetch(`${`https://tenderapi.nafedtrackandtrace.com`}/${route}`, {
  const responce = await fetch(`${`https://tender-vessel-module.nafedtrackandtrace.com`}/${route}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: formData,
  });

  const data = await responce.json();
  return data;
};

const vesselCallApi = async (route, method, body) => {
  const responce = await fetch(`${`https://tender-vessel-module.nafedtrackandtrace.com`}/${route}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(body),
  });
  const data = await responce.json();
  console.log(data);
  return data;
}

const vesselGetApi = async (route) => {
  const responce = await fetch(`${`https://tender-vessel-module.nafedtrackandtrace.com`}/${route}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await responce.json();
  console.log(data);
  return data;
};

const commodityGetApi = async (route) => {
  const responce = await fetch(`${`https://tender-vessel-module.nafedtrackandtrace.com`}/${route}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await responce.json();
  console.log(data);
  return data;
};

const commoditySearchGetApi = async (route) => {
  const responce = await fetch(`${`https://tender-vessel-module.nafedtrackandtrace.com`}/${route}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await responce.json();
  console.log(data);
  return data;
}; 
const commoditycallApi = async (route, method, body) => {
  const responce = await fetch(`${`https://tender-vessel-module.nafedtrackandtrace.com`}/${route}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(body),
  });
  const data = await responce.json();
  console.log(data);
  return data;
}


const portGetApi = async (route) => {
  const responce = await fetch(`${`https://tender-vessel-module.nafedtrackandtrace.com`}/${route}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await responce.json();
  console.log(data);
  return data;
};

const viewOfferingGetApi = async (route) => {
  const responce = await fetch(`${`https://tender-vessel-module.nafedtrackandtrace.com`}/${route}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await responce.json();
  console.log(data);
  return data;
};

export { callApi, callApiGet, callApiPost, uploadDocApi, vesselCallApi, vesselGetApi, portGetApi, commodityGetApi, commoditySearchGetApi, commoditycallApi, viewOfferingGetApi , callApiDelete };
