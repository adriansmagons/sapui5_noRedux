sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
 ], (Controller, JSONModel) => {
    "use strict";
 
    return Controller.extend("ui5.fitnessApp.controller.Profile", {

        onSelectTab: function(oEvent){
            const oRouter = this.getOwnerComponent().getRouter();
            const sKey = oEvent.getParameter("key");
            switch(sKey){
                case "home":
                    oRouter.navTo("home");
                    break;
                case "profile":
                    oRouter.navTo("profile");
                    break;
            }
        }
    });
 });