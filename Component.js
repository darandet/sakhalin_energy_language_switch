sap.ui.define([
	"sap/ui/core/Component",
	"sap/m/Button",
	"sap/m/Bar",
	"sap/m/MessageToast",
	"sap/m/ActionSheet"
], function (Component, Button, Bar, MessageToast, ActionSheet) {

	return Component.extend("ru.sakhalinenergy.flp.langswitch.Component", {

		metadata: {
			"manifest": "json"
		},

		init: function () {
			var rendererPromise = this._getRenderer();
			var that = this;
			rendererPromise.then(function (oRenderer) {
				oRenderer.addHeaderEndItem("sap.m.Button", {
					id: "languageSwitch",
					icon: "sap-icon://world",
					press: that._showLanguageMenu.bind(that)
				}, true);

			});

		},
		_getRenderer: function () {
			var that = this,
				oDeferred = new jQuery.Deferred(),
				oRenderer;

			that._oShellContainer = jQuery.sap.getObject("sap.ushell.Container");
			if (!that._oShellContainer) {
				oDeferred.reject(
					"Illegal state: shell container not available; this component must be executed in a unified shell runtime context.");
			} else {
				oRenderer = that._oShellContainer.getRenderer();
				if (oRenderer) {
					oDeferred.resolve(oRenderer);
				} else {
					// renderer not initialized yet, listen to rendererCreated event
					that._onRendererCreated = function (oEvent) {
						oRenderer = oEvent.getParameter("renderer");
						if (oRenderer) {
							oDeferred.resolve(oRenderer);
						} else {
							oDeferred.reject("Illegal state: shell renderer not available after recieving 'rendererLoaded' event.");
						}
					};
					that._oShellContainer.attachRendererCreatedEvent(that._onRendererCreated);
				}
			}
			return oDeferred.promise();
		},

		_createLanguageMenu: function () {
			var oMenu = new ActionSheet({
				showCancelButton: false,
			});
			return oMenu;
		},

		_showLanguageMenu: function (oEvent) {
			var oButton = oEvent.getSource();
			if (!this._oMenu) {
				this._oMenu = this._createLanguageMenu();
				this._oMenu.setModel(this.getModel("languageChoices"));
				
				this._oMenu.bindAggregation("buttons", {
					path: "/languages",
					factory: function (vId, oBindingContext) {
						return new Button({
							id: vId,
							text: oBindingContext.getProperty("name"),
							press: function(){
								window.location.search = "sap-language=" + oBindingContext.getProperty("key");
							}
						});
					}
				});
			}
			this._oMenu.openBy(oButton);
		}
	});
});