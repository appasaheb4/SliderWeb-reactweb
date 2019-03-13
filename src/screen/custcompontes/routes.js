import React from "react";
//import AdminDashboadScreen from "../views/AdminDashboadScreen";
const Dashboard = React.lazy(() => import("../views/Dashboard"));
const ImagesNewScreen = React.lazy(() =>
  import("../views/ImagesScreen/ImagesNewScreen/ImagesNewScreen")
);
const ImagesViewScreen = React.lazy(() =>
  import("../views/ImagesScreen/ImagesViewScreen/ImagesViewScreen")
);
const ModelViewScreen = React.lazy(() =>
  import("../views/ModelScreen/ModelViewScreen/ModelViewScreen")
);

const ModelNewScreen = React.lazy(() =>
  import("../views/ModelScreen/ModelNewScreen/ModelNewScreen")
);
// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard
  },
  {
    path: "/model",
    exact: true,
    name: "Model"
  },
  {
    path: "/model/modelNew",
    name: "Model New",
    component: ModelNewScreen
  },
  {
    path: "/model/modelView",
    name: "Model View",
    component: ModelViewScreen
  },
  {
    path: "/images",
    exact: true,
    name: "Images"
  },
  {
    path: "/images/imagesnew",
    name: "Images New",
    component: ImagesNewScreen
  },
  {
    path: "/images/imagesView",
    name: "View",
    component: ImagesViewScreen
  }
];

export default routes;
