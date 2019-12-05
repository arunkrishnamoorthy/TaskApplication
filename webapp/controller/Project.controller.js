sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function (Controller, MessageToast) {
	"use strict";

	return Controller.extend("ui.demo.Tasks.controller.Project", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ui.demo.Tasks.view.Project
		 */
		onInit: function () {
			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		},

		handleSearch: function (oEvent) {

		},

		handleCreateTask: function (oEvent) {
			this._oRouter.navTo("CreateTask");
		},

		handleUpdateTask: function (oEvent) {
			// var oSmartTable = this.getView().byId("SmartTable");
			// var oTable = oSmartTable.getTable();
			// var oSelectedItem = oTable.getSelectedItem();
			// if (!oSelectedItem) {
			// 	MessageToast.show("Select a Document to Proceed");
			// }
			var oContext = oEvent.getSource().getBindingContext();
			var oData = oContext.getObject();
			this._oRouter.navTo("UpdateTask", {
				"Project": oData.Project,
				"Tpmid": oData.Tpmid
			});
		},

		handleDeleteTask: function (oEvent) {
			var oSmartTable = this.getView().byId("SmartTable");
			var oTable = oSmartTable.getTable();
			var oSelectedItem = oTable.getSelectedItem();
			if (!oSelectedItem) {
				MessageToast.show("Select a Document to Proceed");
			}
			var oContext = oSelectedItem.getBindingContext();
			var sPath = oContext.getPath();
			var oModel = oContext.getModel();
			oModel.remove(sPath, {
				success: function (oData, oResponse) {
					MessageToast.show("Document Deleted Successfully");
				},
				error: function (oResponse) {
					MessageToast.show("Document Deletion Failed");
				}
			});

		}
	});

});