sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("ui.demo.Tasks.controller.UpdateTask", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ui.demo.Tasks.view.UpdateTask
		 */
		onInit: function () {
			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.attachRoutePatternMatched(this.handleRoutePatternMatched, this);

			var oSection = this.getView().byId("idDetailsSection");
			var oFragment = sap.ui.xmlfragment("idTaskDetailsUpd", "ui.demo.Tasks.fragments.UpdateTaskDetails", this);
			this.getView().addDependent(oFragment);
			oSection.addBlock(oFragment);

			var oSection = this.getView().byId("idResourceSection");
			var oFragment = sap.ui.xmlfragment("idResourceDetailsUpd", "ui.demo.Tasks.fragments.UpdateResourceDetails", this);
			this.getView().addDependent(oFragment);
			oSection.addBlock(oFragment);

			var oSection = this.getView().byId("idPredecessorSection");
			var oFragment = sap.ui.xmlfragment("idPredecessorDetailsUpd", "ui.demo.Tasks.fragments.UpdatePredecessorDetails", this);
			this.getView().addDependent(oFragment);
			oSection.addBlock(oFragment);

			// var oSection = this.getView().byId("idHistorySection");
			// var oFragment = sap.ui.xmlfragment("idHistoryDetails", "ui.demo.Tasks.fragments.UpdateHistoryDetails", this);
			// this.getView().addDependent(oFragment);
			// oSection.addBlock(oFragment);

			// var oSection = this.getView().byId("idSprintsSection");
			// var oFragment = sap.ui.xmlfragment("idSprintsDetails", "ui.demo.Tasks.fragments.UpdateSprintsDetails", this);
			// this.getView().addDependent(oFragment);
			// oSection.addBlock(oFragment);

			var oSection = this.getView().byId("idCommentsSection");
			var oFragment = sap.ui.xmlfragment("idCommentsDetails", "ui.demo.Tasks.fragments.UpdateCommentsDetails", this);
			this.getView().addDependent(oFragment);
			oSection.addBlock(oFragment);
		},

		handleRoutePatternMatched: function (oEvent) {
			var oArguments = oEvent.getParameter("arguments");
			var sProject = oArguments.Project;
			var sTpmid = oArguments.Tpmid;
			var oModel = this.getView().getModel();
			var sBindingPath = oModel.createKey("/TaskSet", {
				Project: sProject,
				Tpmid: sTpmid
			});
			this.getView().bindElement(sBindingPath);
			var oController = this;
			var oToggleData = {
				Start: true,
				Update: false,
				Finish: false,
				Reopen: false,
			};
			var oToggleModel = new sap.ui.model.json.JSONModel(oToggleData);
			this.getView().setModel(oToggleModel, "toggle");
			oModel.attachEventOnce("requestCompleted", function (oEvent) {
				var oContext = oController.getView().getBindingContext();
				var oData = oContext.getObject();
				oController.updateToggleModel(oData);
			});

		},

		updateToggleModel: function (oData) {

			var oToggleModel = this.getView().getModel("toggle");
			var oToggleData = oToggleModel.getData();

			// If Task is not yet started
			if (!oData.ActualStart) {
				// Task Completed.
				// Only Re-open should be enabled. 
				oToggleData.Start = true;
				oToggleData.Update = false;
				oToggleData.Finish = false;
				oToggleData.Reopen = false;
				oToggleModel.setData(oToggleData);
				return;
			}

			// If Task is finished
			if (oData.ActualFinish) {
				// Task Completed.
				// Only Re-open should be enabled. 
				oToggleData.Start = false;
				oToggleData.Update = false;
				oToggleData.Finish = false;
				oToggleData.Reopen = true;
				oToggleModel.setData(oToggleData);
				return;
			}

			if (oData.ActualStart && !oData.ActualFinish) {
				// Task is started, but not finished. 
				oToggleData.Start = false;
				oToggleData.Update = true;
				oToggleData.Finish = true;
				oToggleData.Reopen = false;
				oToggleModel.setData(oToggleData);
				return;
			}

		},

		handleStartTask: function (oEvent) {
			
			if (!this._oStartTask) {
				this._oStartTask = sap.ui.xmlfragment("idStarttask", "ui.demo.Tasks.fragments.StartTask", this);
				this.getView().addDependent(this._oStartTask);
			}
			this._oStartTask.open();
		},

		handleStartTaskOk: function (oEvent) {
			
			var oModel = this.getView().getModel();
			var oContext = this.getView().getBindingContext();
			var oData = oContext.getObject();
			
			if(oData.ActualStart){
				var sTime = oData.ActualStart.getTime();
				oData.ActualStartT.ms = sTime;
			}
			
			var sPath = oContext.getPath();
			var oController = this;
			oModel.update(sPath, oData, {
				success: function (oData, oResponse) {
					oController.updateToggleModel(oData);
					oController._oStartTask.close();
				}
			});
			
		},

		handleStartTaskCancel: function (oEvent) {
			this._oStartTask.close();
		},
		
		handleUpdateTask: function (oEvent) {
			
			if (!this._oUpdateTask) {
				this._oUpdateTask = sap.ui.xmlfragment("idUpdatetask", "ui.demo.Tasks.fragments.UpdateTask", this);
				this.getView().addDependent(this._oUpdateTask);
			}
			this._oUpdateTask.open();
		},

		handleUpdateTaskOk: function (oEvent) {
			
			var oModel = this.getView().getModel();
			var oContext = this.getView().getBindingContext();
			var oData = oContext.getObject();
			
			if(oData.ActualStart){
				var sTime = oData.ActualStart.getTime();
				oData.ActualStartT.ms = sTime;
			}
			
			if(oData.SchedStart){
				var sTime = oData.SchedStart.getTime();
				oData.SchedStartT.ms = sTime;
			}
			
			var sPath = oContext.getPath();
			var oController = this;
			oModel.update(sPath, oData, {
				success: function (oData, oResponse) {
					oController.updateToggleModel(oData);
					oController._oUpdateTask.close();
				}
			});
			
		},

		handleUpdateTaskCancel: function (oEvent) {
			this._oUpdateTask.close();
		},
		
		handleFinishTask: function (oEvent) {
			
			if (!this._oFinishTask) {
				this._oFinishTask = sap.ui.xmlfragment("idFinishtask", "ui.demo.Tasks.fragments.FinishTask", this);
				this.getView().addDependent(this._oFinishTask);
			}
			this._oFinishTask.open();
		},

		handleFinishTaskOk: function (oEvent) {
			
			var oModel = this.getView().getModel();
			var oContext = this.getView().getBindingContext();
			var oData = oContext.getObject();
			
			if(oData.ActualStart){
				var sTime = oData.ActualStart.getTime();
				oData.ActualStartT.ms = sTime;
			}
			
			if(oData.ActualFinish){
				var sTime = oData.ActualFinish.getTime();
				oData.ActualFinishT.ms = sTime;
			}
			
			var sPath = oContext.getPath();
			var oController = this;
			oModel.update(sPath, oData, {
				success: function (oData, oResponse) {
					oController.updateToggleModel(oData);
					oController._oFinishTask.close();
				}
			});
			
		},

		handleFinishTaskCancel: function (oEvent) {
			this._oFinishTask.close();
		},

		handeUpdateAddResources: function (oEvent) {
			var oModel = this.getView().getModel();
			var oContext = this.getView().getBindingContext();
			var oContextData = oContext.getObject();
			var oData = {
				"Project": oContextData.Project,
				"Tpmid": oContextData.Tpmid,
				"Resrc": "",
				"Guid": "",
				"UniqueId": ""
			};
			var oResourceModel = new sap.ui.model.json.JSONModel(oData);
			this.getView().setModel(oResourceModel, "AddResource");
			if (!this._oCreateResourceDialog) {
				this._oCreateResourceDialog = sap.ui.xmlfragment("idAddResourceUpd", "ui.demo.Tasks.fragments.AddResource", this);
				this.getView().addDependent(this._oCreateResourceDialog);
			}
			this._oCreateResourceDialog.setModel(oResourceModel);
			this._oCreateResourceDialog.open();
		},

		handleAddResourceOk: function () {
			var oModel = this.getView().getModel();
			var oContext = this.getView().getBindingContext();
			var oContextData = oContext.getObject();
			var oData = {
				"Project": oContextData.Project,
				"Tpmid": oContextData.Tpmid,
				"Resrc": "",
				"Guid": "",
				"UniqueId": ""
			};

			var oModel = this.getView().getModel("AddResource");
			var oData = oModel.getData();

			var oModel = this.getView().getModel();
			var oController = this;
			oModel.create("/ResourcesSet", oData, {
				success: function (oData, oResponse) {
					oController._oCreateResourceDialog.close();
					sap.m.MessageToast.show("Item Added Successfully");
				},
				error: function (oResponse) {

				}
			});
		},

		handleAddResourceCancel: function () {
			this._oCreateResourceDialog.close();
		},

		handeUpdateDelResources: function (oEvent) {
			var oTable = sap.ui.core.Fragment.byId("idResourceDetailsUpd", "idResourcesTable");
			var oItem = oTable.getSelectedItem();
			var sBindingPath = oItem.getBindingContextPath();
			var oModel = oTable.getModel();
			oModel.remove(sBindingPath, {
				success: function (oResponse) {
					sap.m.MessageToast.show("Resource deleted successfully");
				}
			});
		},

		handeTaskAddPredecessor: function (oEvent) {
			var oModel = this.getView().getModel();
			var oContext = this.getView().getBindingContext();
			var oContextData = oContext.getObject();
			var oData = {
				"Project": oContextData.Project,
				"Tpmid": oContextData.Tpmid,
				"Predid": "",
				"Guid": "",
				"Pguid": "",
				"UniqueId": "",
				"PuniqueId": ""
			};
			var oPredecessorModel = new sap.ui.model.json.JSONModel(oData);
			this.getView().setModel(oPredecessorModel, "AddPredecessor");
			if (!this._oCreatePredecessorDialog) {
				this._oCreatePredecessorDialog = sap.ui.xmlfragment("idAddPredecessorUpd", "ui.demo.Tasks.fragments.AddPredecessor", this);
				this.getView().addDependent(this._oCreatePredecessorDialog);
			}
			this._oCreatePredecessorDialog.setModel(oPredecessorModel);
			this._oCreatePredecessorDialog.open();
		},

		handleAddPredecessorOk: function () {

			var oModel = this.getView().getModel("AddPredecessor");
			var oData = oModel.getData();

			var oModel = this.getView().getModel();
			var oController = this;
			oModel.create("/PredecessorsSet", oData, {
				success: function (oData, oResponse) {
					oController._oCreatePredecessorDialog.close();
					sap.m.MessageToast.show("Item Added Successfully");
				},
				error: function (oResponse) {

				}
			});
		},

		handleAddPredecessorCancel: function () {
			this._oCreatePredecessorDialog.close();
		},

		handeTaskDelPredecessor: function (oEvent) {
			var oTable = sap.ui.core.Fragment.byId("idPredecessorDetailsUpd", "idPredecessorTable");
			var oItem = oTable.getSelectedItem();
			var sBindingPath = oItem.getBindingContextPath();
			var oModel = oTable.getModel();
			oModel.remove(sBindingPath, {
				success: function (oResponse) {
					sap.m.MessageToast.show("Predecessor deleted successfully");
				}
			});
		},

		handleAddComments: function (oEvent) {
			var oContext = this.getView().getBindingContext();
			var oData = oContext.getObject();
			var oModel = oContext.getModel();
			var sComments = oEvent.getParameter("value");
			var oPayload = {
				"Project": oData.Project,
				"Tpmid": oData.Tpmid,
				"Cuser": "",
				"Ctstm": new Date(),
				"Cmt": sComments
			};

			oModel.create("/CommentsSet", oPayload, {
				success: function (oData, oResponse) {
					sap.m.MessageToast.show("Comments Posted Successfully!");
				}
			});
		},

		handleUpdate: function (oEvent) {
			var oContext = this.getView().getBindingContext();
			var oModel = oContext.getModel();
			var oData = oContext.getObject();
			var oController = this;

			delete oData.__metadata;
			oData.TaskResources = [];
			oData.TaskPredecessors = [];

			// Resources 
			var oTable = sap.ui.core.Fragment.byId("idResourceDetailsUpd", "idResourcesTable");
			var aItems = oTable.getItems();
			var aResourcesData = [];
			$.each(aItems, function (index, oItem) {
				var oContext = oItem.getBindingContext();
				var oData = oContext.getObject();
				delete oData.__metadata;
				aResourcesData.push(oData);
			});
			oData.TaskResources = aResourcesData;

			debugger;
			oModel.create("/TaskSet", oData, {
				success: function (oData, oResponse) {
					var sMessage = "Task " + oData.Tpmid + " Updated Successfully";
					sap.m.MessageBox.success(sMessage, {
						onClose: function (sAction) {
							// oController._oRouter.navTo("Project");
						}
					});
				},
				error: function (oResponse) {

				}
			});
		}

	});

});