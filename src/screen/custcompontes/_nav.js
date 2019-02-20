export default {
  items: [{
    name: "Dashboard",
    url: "/dashboard",
    icon: "icon-speedometer",
    badge: {
      variant: "info",
      text: "NEW"
    }
  }, {
    title: true,
    name: "Admin",
    wrapper: {
      element: "",
      attributes: {}
    }
  }, {
    name: "Model",
    url: "/model",
    icon: "icon-puzzle",
    children: [{
      name: "New Model",
      url: "/model/modelNew",
      icon: "icon-puzzle"
    }, {
      name: "View",
      url: "/model/modelView",
      icon: "icon-puzzle"
    }]
  }, {
    name: "Images",
    url: "/images",
    icon: "icon-cursor",
    children: [{
      name: "New Images",
      url: "/images/imagesnew",
      icon: "icon-cursor"
    }, {
      name: "View",
      url: "/images/imagesView",
      icon: "icon-cursor"
    }]
  }, {
    divider: true
  }, {
    title: true,
    name: "Settings"
  }, {
    name: "Profile",
    url: "/pages",
    icon: "icon-star",
    children: [{
      name: "Temp",
      url: "/login",
      icon: "icon-star"
    }]
  }]
};
