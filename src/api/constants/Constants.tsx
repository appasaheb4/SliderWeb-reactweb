//Message
var errorMessage = {
  cancel: "CANCEL",
  ok: "OK",
  thanks: "Thanks!!",
  logout_Title: "Logout",
  logout_message: "Are you sure you want to logout?",
  aLERT_Title: "Message",
  aPI_FAILED: "Server not responding, please try after some time.",
  internet_ErrorTitle: "No Internet",
  fAILED_INTERNET: "No internet connection available."
};
//new files
//Colors
var colors = {
  appColor: "#F5951D",
  black: "#000000",
  white: "#ffffff",
  Saving: "#E6A620",
  Secure: "#30A2F3",
  placeholder: "#5F5F5F"
};

//Rest Full Api   
const domain = process.env.REACT_APP_API_DOMIN_PROD;
var apiary = {
  domain: domain,
  getModels: domain + process.env.REACT_APP_API_GETMODELS,
  loginUser: domain + process.env.REACT_APP_API_LOGINUSER,
  getAllImages: domain + process.env.REACT_APP_API_GETALLIMAGES,
  update_ModelData: domain + process.env.REACT_APP_API_UPDATE_MODELDATA,
  delete_ModelData: domain + process.env.REACT_APP_API_DELETE_MODELDATA,
  insertModel: domain + process.env.REACT_APP_API_INSERTMODEL,
  imageUpload: domain + process.env.REACT_APP_API_IMAGEUPLOAD,
  delete_ModelImage: domain + process.env.REACT_APP_API_DELETE_MODELIMAGE,
  imageUploadSessionAdd: domain + process.env.REACT_APP_API_IMAGEUPLOADSESSIONADD,
  update_ModelImage: domain + process.env.REACT_APP_API_UPDATE_MODELIMAGE,
  imageEditUpload: domain + process.env.REACT_APP_API_IMAGEEDITUPLOAD
};

export { errorMessage, apiary, colors };
