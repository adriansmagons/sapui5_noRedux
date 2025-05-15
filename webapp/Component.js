sap.ui.define([
   "sap/ui/core/UIComponent",
   "sap/ui/model/json/JSONModel",
   "sap/ui/model/resource/ResourceModel",
   "ui5/fitnessApp/utils/DataPreprocessor"
], (UIComponent, JSONModel, ResourceModel, DataPreprocessor) => {
    "use strict";
 
    return UIComponent.extend("ui5.fitnessApp.Component", {

        metadata : {
            "interfaces": ["sap.ui.core.IAsyncContentCreation"],
            "manifest": "json",
         },

        init() {
             // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);
            
            var oAthleteModel = new JSONModel();
            const aUrls = ['/model/data/athletes.json', '/model/data/training_sessions.json'];
            const preprocessor = new DataPreprocessor();
            preprocessor.fetchData(aUrls).then((result)=>{
                oAthleteModel.setData(preprocessor.processAthletes(result));
                this.setModel(oAthleteModel, "athleteModel")
            });
        
            const i18nModel = new ResourceModel({
                bundleName: "ui5.fitnessApp.i18n.i18n"
             });
             this.setModel(i18nModel, "i18n");
             
            this.getRouter().initialize();
		},
    });
 });
 