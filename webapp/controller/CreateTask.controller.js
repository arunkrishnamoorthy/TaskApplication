sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("ui.demo.Tasks.controller.CreateTask", {

		onInit: function () {

			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.attachRoutePatternMatched(this._handleRoutePatternMatched, this);

			var oSection = this.getView().byId("idDetailsSection");
			var oFragment = sap.ui.xmlfragment("idTaskDetails", "ui.demo.Tasks.fragments.CreateTaskDetails", this);
			this.getView().addDependent(oFragment);
			oSection.addBlock(oFragment);

			var oSection = this.getView().byId("idResourceSection");
			var oFragment = sap.ui.xmlfragment("idResourceDetails", "ui.demo.Tasks.fragments.CreateResourceDetails", this);
			this.getView().addDependent(oFragment);
			oSection.addBlock(oFragment);

			var oSection = this.getView().byId("idPredecessorSection");
			var oFragment = sap.ui.xmlfragment("idPredecessorDetails", "ui.demo.Tasks.fragments.CreatePredecessorDetails", this);
			this.getView().addDependent(oFragment);
			oSection.addBlock(oFragment);

			var oSection = this.getView().byId("idCommentsSection");
			var oFragment = sap.ui.xmlfragment("idCommentsDetails", "ui.demo.Tasks.fragments.CreateCommentsDetails", this);
			this.getView().addDependent(oFragment);
			oSection.addBlock(oFragment);

			// var oSection = this.getView().byId("idHistorySection");
			// var oFragment = sap.ui.xmlfragment("idHistoryDetails", "ui.demo.Tasks.fragments.CreateHistoryDetails", this);
			// this.getView().addDependent(oFragment);
			// oSection.addBlock(oFragment);

			// var oSection = this.getView().byId("idSprintsSection");
			// var oFragment = sap.ui.xmlfragment("idSprintsDetails", "ui.demo.Tasks.fragments.CreateSprintsDetails", this);
			// this.getView().addDependent(oFragment);
			// oSection.addBlock(oFragment);

		},

		_handleRoutePatternMatched: function (oEvent) {

			var oModel = this.getView().getModel();
			oModel.setDefaultBindingMode("TwoWay");
			var oContext = oModel.createEntry("/TaskSet");
			this.getView().setBindingContext(oContext);

			//Add the Resources
			var oResourceData = {
				"resources": [{
					"Project": "",
					"Tpmid": "",
					"Resrc": "",
					"Guid": "",
					"UniqueId": ""
				}]
			};
			var oResourceModel = new sap.ui.model.json.JSONModel(oResourceData);
			this.getView().setModel(oResourceModel, "resources");

			// Add the Predecessors 
			var oPredecessorsData = {
				"predecessor": [{
					"Project": "",
					"Tpmid": "",
					"Predid": "",
					"Guid": "",
					"Pguid": "",
					"UniqueId": "",
					"PuniqueId": ""
				}]
			};
			var oPredecessorsModel = new sap.ui.model.json.JSONModel(oPredecessorsData);
			this.getView().setModel(oPredecessorsModel, "predecessor");

			// Add the History
			// var oChangeHistoryData = {
			// 	"history": [{
			// 		"Username": "",
			// 		"Chngind": "",
			// 		"Fname": "",
			// 		"FOld": "",
			// 		"FNew": ""
			// 	}]
			// };
			// var oChangeHistoryModel = new sap.ui.model.json.JSONModel(oChangeHistoryData);
			// this.getView().setModel(oChangeHistoryModel, "history");

			//Add the Comments
			var oCommentsData = {
				"comments": ""
			};
			var oCommentModel = new sap.ui.model.json.JSONModel(oCommentsData);
			this.getView().setModel(oCommentModel, "comments");

		},

		handleCreate: function (oEvent) {

			var oContext = this.getView().getBindingContext();
			var oModel = oContext.getModel();
			var oData = oContext.getObject();
			var oCommentsModel = this.getView().getModel("comments");
			var oCommentData = oCommentsModel.getData();
			var sComments = oCommentData.comments;
			var oController = this;

			delete oData.__metadata;
			oData.TaskResources = [];
			oData.TaskPredecessors = [];

			// Resources 
			var oTable = sap.ui.core.Fragment.byId("idResourceDetails", "idResourcesTable");
			var oResourceModel = oTable.getModel("resources");
			var aResourceData = oResourceModel.getData();
			var aResources = aResourceData.resources;
			$.each(aResources, function (index, oRow) {
				oRow.Project = oData["Project"];
			});
			oData.TaskResources = aResources;

			// Predecessors
			var oTable = sap.ui.core.Fragment.byId("idPredecessorDetails", "idPredecessorTable");
			var oPredecessorModel = oTable.getModel("predecessor");
			var aPredecessorData = oPredecessorModel.getData();
			var aPredecessors = aPredecessorData.predecessor;
			// var aProjLand = [];
			$.each(aPredecessors, function (index, oRow) {
				oRow.Project = oData["Project"];
			});
			oData.TaskPredecessors = aPredecessors;

			oModel.create("/TaskSet", oData, {
				success: function (oData, oResponse) {

					// Update the comments if the comments is entered.
					if (sComments.length > 0) {
						var oPayload = {
							"Project": oData.Project,
							"Tpmid": oData.Tpmid,
							"Cuser": "",
							"Ctstm": new Date(),
							"Cmt": sComments
						};

						oModel.create("/CommentsSet", oPayload, {
							success: function (oData, oResponse) {
							}
						});
					}

					var sMessage = "Task " + oData.Tpmid + " Created Successfully";
					sap.m.MessageBox.success(sMessage, {
						onClose: function (sAction) {
							oController._oRouter.navTo("Project");
						}
					});
				},
				error: function (oResponse) {

				}
			});
		},

		handeCreateDocAddResources: function (oEvent) {

			var oResourceData = {
				"Project": "",
				"Tpmid": "",
				"Resrc": "",
				"Guid": "",
				"UniqueId": ""
			};
			var oModel = this.getView().getModel("resources");
			var aData = oModel.getData();
			aData.resources.push(oResourceData);
			oModel.setData(aData);

		},

		handeCreateDocDelResources: function (oEvent) {

			var oTable = sap.ui.core.Fragment.byId("idResourceDetails", "idResourcesTable");
			var oItem = oTable.getSelectedItem();
			var sBindingPath = oItem.getBindingContextPath();
			var sId = sBindingPath.split("/").reverse()[0];
			var oModel = oTable.getModel("resources");
			var aData = oModel.getData();
			aData.resources.splice(sId, 1);
			oModel.setData(aData);

		},

		handeCreateTaskAddPredecessor: function (oEvent) {

			var oPreData = {
				"Project": "",
				"Tpmid": "",
				"Predid": "",
				"Guid": "",
				"Pguid": "",
				"UniqueId": "",
				"PuniqueId": ""
			};

			var oModel = this.getView().getModel("predecessor");
			var aData = oModel.getData();
			aData.predecessor.push(oPreData);
			oModel.setData(aData);
		},

		handeCreateTaskDelPredecessor: function () {

			var oTable = sap.ui.core.Fragment.byId("idPredecessorDetails", "idPredecessorTable");
			var oItem = oTable.getSelectedItem();
			var sBindingPath = oItem.getBindingContextPath();
			var sId = sBindingPath.split("/").reverse()[0];
			var oPreModel = oTable.getModel("predecessor");
			var aPreData = oPreModel.getData();
			aPreData.predecessor.splice(sId, 1);
			oPreModel.setData(aPreData);
		}

	});

});