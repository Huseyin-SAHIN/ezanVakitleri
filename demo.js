const fetchData = async () => {
    try {
      const response = await fetch("https://api.collectapi.com/pray/all?data.city=istanbul", {
        headers: {
          "content-type": "application/json",
          "authorization": "apikey 1qgdQQFJSXBaqMROB1E8mt:2U8tM8MrdYtFsxgrVlvZmQ"
        },
      });
  
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
  
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  
  fetchData();
  