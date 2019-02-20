import axios from "axios";

const getAllData = (url: string) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      })
      .then(response => {
        let data = response.data.data;
        data.remove = "hi";
        resolve({ data });
      })
      .catch(function(error) {
        console.log(error);
      });
  });
};

export default (module.exports = {
  getAllData
});
