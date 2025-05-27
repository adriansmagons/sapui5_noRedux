sap.ui.define([
	"sap/m/MessageToast",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Sorter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "sap/m/table/columnmenu/Menu",
    "sap/m/table/columnmenu/QuickSort",
    "sap/m/table/columnmenu/QuickSortItem",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/library",
	"sap/m/Input",
	"sap/m/VBox",
	"sap/m/Column",
	"sap/m/Text"
 ], (MessageToast, Controller, Sorter, Filter, FilterOperator, ColumnMenu, QuickSort, QuickSortItem, Dialog, Button, mobileLibrary, Input, VBox, Column, Text) => {
    "use strict";

    // shortcut for sap.m.ButtonType
	var ButtonType = mobileLibrary.ButtonType;

	// shortcut for sap.m.DialogType
	var DialogType = mobileLibrary.DialogType;
 
    return Controller.extend("ui5.fitnessApp.controller.Startpage", {

        onInit: function () {
            this.createSurnameSort();
        },

        onPressProfile: function(){
            const oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("profile");
        },

        onAthletePress: function (oEvent) {
            document.activeElement.blur();

            let oContext = oEvent.getSource().getBindingContext("athleteModel");
            const oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("athleteDetails", {
                athletePath: window.encodeURIComponent(oContext.getPath().substring(1))
            });
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

        createSurnameSort: function(){
            const oTable = this.getView().byId("players_table");
			const aColumns = oTable.getColumns();
            const oSurnameColumn = aColumns[1];

            oSurnameColumn.setHeaderMenu(new ColumnMenu({
				quickActions: [
					new QuickSort({
						items: new QuickSortItem({
							key: "Surname",
							label: "Surname"
						}),
						change: function(oEvent) {
                            const oBinding = oTable.getBinding("items");
							const sSortOrder = oEvent.getParameter("item").getSortOrder();
							if (sSortOrder === "Ascending") {
								oBinding.sort([new Sorter("surname", false)]);
								oSurnameColumn.setSortIndicator("Ascending");
							} else if (sSortOrder === "Descending") {
								oBinding.sort([new Sorter("surname", true)]);
								oSurnameColumn.setSortIndicator("Descending");
							} else if (sSortOrder === "None"){
                                oBinding.sort(null);
								oSurnameColumn.setSortIndicator("None");
							}
                                
						}
					})
				]
			}));
        },

        onSearch: function(oEvent){
            var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new Filter("surname", FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}

			// update list binding
			var oList = this.byId("players_table");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilters, "Application");
        },
        onRefresh: function(){
            const oTable = this.getView().byId("players_table");
            const oBinding = oTable.getBinding("items");
            oBinding.sort(null);
        },

        onAddRow: function () {
			if (!this.oDefaultDialog) {
				this.oNameInput = new Input({description: "Name"});
				this.oSurnameInput = new Input({description: "Surname"});
				this.oPositionInput = new Input({description: "Position"});
				this.oAgeInput = new Input({description: "Age"});
				this.oGenderInput = new Input({description: "Gender"});
				this.oDefaultDialog = new Dialog({
					title: "Edit player list",
					content: new VBox({
						items: [
							this.oNameInput,
							this.oSurnameInput,
							this.oPositionInput,
							this.oAgeInput,
							this.oGenderInput
						]
					}),
					
					beginButton: new Button({
						type: ButtonType.Emphasized,
						text: "Insert",
						press: function (oEvent) {
							let sName = this.oNameInput.getValue();
							let sSurname = this.oSurnameInput.getValue();
							let sPosition = this.oPositionInput.getValue();
							let sAge = this.oAgeInput.getValue();
							let sGender = this.oGenderInput.getValue();
							this.handleRowInsert(sName, sSurname, sPosition, sAge, sGender);

							this.oNameInput.setValue(""); 
							this.oSurnameInput.setValue(""); 
							this.oPositionInput.setValue(""); 
							this.oAgeInput.setValue(""); 
							this.oGenderInput.setValue(""); 
							
							this.oDefaultDialog.close();
						}.bind(this)
					}),
					endButton: new Button({
						type: "Reject",
						text: "Cancel",
						press: function () {
							this.oDefaultDialog.close();
						}.bind(this)
					})
				});

				// to get access to the controller's model
				this.getView().addDependent(this.oDefaultDialog);
			}

			this.oDefaultDialog.open();
		},
		onDeleteRow(oEvent){
			let oContext = oEvent.getSource().getBindingContext("athleteModel");
			debugger
			let sAthleteId = oContext.getProperty("_id");
			let athleteModelData = this.getOwnerComponent().getModel("athleteModel").getData();
			let oFilteredData = athleteModelData.athletes.filter((athlete) => athlete._id !== sAthleteId);
			this.getOwnerComponent().getModel("athleteModel").setData({athletes: oFilteredData})
		},

		toggleDeleteRow(oEvent){  // not implemented yet
			const oTable = this.getView().byId("players_table");

			if(oEvent.getSource().getPressed()){
				this.oSelectColumn = new Column({
					header: new Text ({text: "Select"})
				});
				oTable.addColumn(this.oSelectColumn);
			}else{
				oTable.removeColumn(oTable.getColumns().length - 1);
			}
		},

		handleRowInsert(sName, sSurname, sPosition, sAge, sGender){       // Implement ID
			let athleteModel = this.getOwnerComponent().getModel("athleteModel");
			let oAthletes = athleteModel.getProperty("/athletes");
			let newRow = {
				_id: oAthletes[oAthletes.length-1]._id + 1,
				name: sName,
				surname: sSurname,
				position: sPosition,
				age: sAge,
				gender: sGender
			}

			oAthletes.push(newRow);
			athleteModel.setProperty("/athletes", oAthletes);

			MessageToast.show("Athlete was added successfully!");

		},
		onFetchFromServer: async function(oEvent){
            MessageToast.show("Fetching data");
			let athleteModel = this.getOwnerComponent().getModel("athleteModel");
             try {
				const response = await fetch('http://localhost:3001/api/athletes');
				const data = await response.json();
				athleteModel.setProperty("/athletes", data);

			} catch (error) {
				console.error('Fetching data failed:', error);
			}
		},
    });
 });