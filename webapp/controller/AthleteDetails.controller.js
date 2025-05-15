sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/m/table/columnmenu/MenuBase",
    "sap/m/table/columnmenu/Menu",
    "sap/m/table/columnmenu/QuickSort",
    "sap/m/table/columnmenu/QuickSortItem",
    "sap/m/Menu",
    "sap/m/MenuItem",
    "sap/ui/model/Sorter",
], (Controller, MenuBase, ColumnMenu, QuickSort, QuickSortItem, Menu, MenuItem, Sorter) => {
	"use strict";

	return Controller.extend("ui5.fitnessApp.controller.AthleteDetails", {

        onInit: function () {
            this.createDateSort();
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("athleteDetails").attachPatternMatched(this.onObjectMatched, this);
        },

        onObjectMatched: function(oEvent) {
            this.getView().bindElement({
                path: "/" + window.decodeURIComponent(oEvent.getParameter("arguments").athletePath),
                model: "athleteModel",
                events : {
                    dataRequested: function () {
                        that.getView().setBusy(true);
                },
                    dataReceived: function () {
                        that.getView().setBusy(false);
                    }
                }
            })
        },
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
        },
        createDateSort: function(){
            const oTable = this.getView().byId("sessions_table");
			const aColumns = oTable.getColumns();
            const oDateColumn = aColumns[1];

            oDateColumn.setHeaderMenu(new ColumnMenu({
				quickActions: [
					new QuickSort({
						items: new QuickSortItem({
							key: "Date",
							label: "Date"
						}),
						change: function(oEvent) {
                            const oBinding = oTable.getBinding("items");
							const sSortOrder = oEvent.getParameter("item").getSortOrder();
							if (sSortOrder === "Ascending") {
								oBinding.sort([new Sorter("date", false)]);
								oDateColumn.setSortIndicator("Ascending");
							} else if (sSortOrder === "Descending") {
								oBinding.sort([new Sorter("date", true)]);
								oDateColumn.setSortIndicator("Descending");
							} else if (sSortOrder === "None"){
                                oBinding.sort(null);
								oDateColumn.setSortIndicator("None");
							}
                                
						}
					})
				]
			}));

        },

	});

});