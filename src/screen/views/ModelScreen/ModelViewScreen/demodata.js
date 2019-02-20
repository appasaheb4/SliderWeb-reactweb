import * as _ from "lodash";

export const pageSize = 20;

export const events = {
  HANDLE_CELL_CLICK: (cell, reactEvent, id, browserEvent) => {
    console.log("On Cell Click Event");
  },
  HANDLE_CELL_DOUBLE_CLICK: (cell, reactEvent, id, browserEvent) => {
    console.log("On Cell Double Click Event");
  },
  HANDLE_ROW_CLICK: (row, reactEvent, id, browserEvent) => {
    console.log("On Row Click Event");
  },
  HANDLE_ROW_DOUBLE_CLICK: (row, reactEvent, id, browserEvent) => {
    console.log("On Row Double Click Event");
  },
  HANDLE_BEFORE_SELECTION: () => {
    console.log("On Before Selection");
  },
  HANDLE_AFTER_SELECTION: () => {
    console.log("On After Selection");
  },
  HANDLE_AFTER_INLINE_EDITOR_SAVE: () => {
    console.log("On After Save Inline Editor Event");
  },
  HANDLE_BEFORE_BULKACTION_SHOW: () => {
    console.log("On Before Bulk Action Show");
  },
  HANDLE_AFTER_BULKACTION_SHOW: () => {
    console.log("On After Bulk Action Show");
  }
};

// The dataSource points to remote resource which is being served from our server - see the server folder

const serverPath =
  window.location.host.indexOf("heroku") !== -1
    ? "/"
    : "http://localhost:3001/";

export const tableDataSource = serverPath + "getfakeData";
export const bootstrapTableDataSource =
  serverPath + "getFakedPagedDataForBootstrap"; // need to eliminate first row to remove double header
export const treeDataSource = serverPath + "gettreeData";
export const pagingDataSource = serverPath + "getFakedPagedData";

export const plugins = {
  COLUMN_MANAGER: {
    resizable: true,
    moveable: true,
    sortable: {
      enabled: true,
      method: "local",
      sortingSource: pagingDataSource
    }
  },
  EDITOR: {
    type: "inline",
    enabled: true
  },
  PAGER: {
    enabled: true,
    pagingType: "remote",
    pagingSource: pagingDataSource
  },
  LOADER: {
    enabled: true
  },
  SELECTION_MODEL: {
    mode: "checkbox-multi",
    enabled: true,
    allowDeselect: true,
    activeCls: "active",
    selectionEvent: "singleclick"
  },
  ERROR_HANDLER: {
    defaultErrorMessage: "AN ERROR OCURRED",
    enabled: true
  }
};

export const columns = [
  {
    name: "Name",
    width: "10%",
    className: "additional-class",
    dataIndex: "Name",
    HANDLE_CLICK: () => {
      console.log("Header Click");
    }
  },
  {
    name: "Phone Number",
    width: "20%",
    dataIndex: "Phone Number",
    className: "additional-class"
  },
  {
    name: "Email",
    width: "25%",
    dataIndex: "Email",
    className: "additional-class",
    defaultSortDirection: "descend"
  },
  {
    name: "Address",
    dataIndex: "Address",
    width: "35%",
    className: "additional-class"
  }
];

export const data = _.uniq(testData);
