sap.ui.require(
	['test/ui5/fitnessApp/TestCommon', 'ui5/fitnessApp/controller/Startpage.controller'],
	function (TestCommon, StartpageController) {
		var test = QUnit.test;
		var module = QUnit.module;
		var sinon = TestCommon.sinon;

		module('ui5/fitnessApp/controller/Startpage.controller', function (hooks) {
			var oTestee;

			hooks.beforeEach(function () {
				console.log('beforeEach')
			});
			hooks.afterEach(function () {
				console.log('afterEach')
			});

			module('#handleRowInsert()', function (hooks) {
				hooks.beforeEach(function () {
					console.log('beforeEach');
					oTestee = new StartpageController();

				});
				hooks.afterEach(function () {
					console.log('afterEach');
				});

				test('test case one for handleRowInsert', function (assert) {
					// Arrange
					var oAthleteModel =  {
						oData: {
							athletes: [
								{_id: 1, name: 'John', surname: 'Wilson', age: 32, gender: 'male', position: 'Forward'},
								{_id: 2, name: 'Chris', surname: 'Tupper', age: 21, gender: 'male', position: 'Central midfielder'},
							]
						}
					}

					oAthleteModel.getProperty = sinon.stub().withArgs("/athletes").returns(oAthleteModel.oData.athletes);
					oAthleteModel.setProperty = sinon.stub().callsFake(function(path, data){
							oAthleteModel.oData[path.split("/")[1]] = data
						})

					var oOwnerComponent = {
						getModel: sinon.stub().returns(oAthleteModel)
					}

					sinon.stub(oTestee, 'getOwnerComponent').returns(oOwnerComponent);
					debugger

					// Act
					console.log('act');
					var athleteModel = oTestee.getOwnerComponent().getModel();
					// var oAthletes = athleteModel.getProperty("/athletes");
					oTestee.handleRowInsert("Adam", "Rose", "Centre-back", 22, "male");
					console.log(athleteModel.getProperty("/athletes"))

					// Assert
					assert.deepEqual(athleteModel.getProperty("/athletes"), [
						{_id: 1, name: 'John', surname: 'Wilson', age: 32, gender: 'male', position: 'Forward'},
						{_id: 2, name: 'Chris', surname: 'Tupper', age: 21, gender: 'male', position: 'Central midfielder'},
						{_id: 3, name: 'Adam', surname: 'Rose', age: 22, gender: 'male', position: 'Centre-back'},
					]);
				});
				
			});

			module('#onDeleteRow()', function (hooks) {
				hooks.beforeEach(function () {
					console.log('beforeEach');
					oTestee = new StartpageController();

				});
				hooks.afterEach(function () {
					console.log('afterEach');
				});

				test('test case one for onDeleteRow', function (assert) {
					// Arrange
					var oContext = {
						property: 2,
					}
					oContext.getProperty = sinon.stub().withArgs("_id").returns(oContext.property);

					var oSource = {
						getBindingContext: sinon.stub().withArgs("athleteModel").returns(oContext)
					}
					var oEvent = {
						getSource: sinon.stub().returns(oSource)
					}
					var oAthleteModel =  {
						oData: {
							athletes: [
								{_id: 1, name: 'John', surname: 'Wilson', age: 32, gender: 'male', position: 'Forward'},
								{_id: 2, name: 'Chris', surname: 'Tupper', age: 21, gender: 'male', position: 'Central midfielder'},
								{_id: 3, name: 'Adam', surname: 'Rose', age: 22, gender: 'male', position: 'Centre-back'},
							]
						}
					}
					oAthleteModel.getData = sinon.stub().returns(oAthleteModel.oData);
					oAthleteModel.setData = sinon.stub().callsFake(function(data){
							oAthleteModel.oData.athletes = data.athletes
						})

					var oOwnerComponent = {
						getModel: sinon.stub().returns(oAthleteModel)
					}

					sinon.stub(oTestee, 'getOwnerComponent').returns(oOwnerComponent);

					// Act
					console.log('act');
					oTestee.onDeleteRow(oEvent);
					console.log(oAthleteModel.getData())

					// Assert
					assert.deepEqual(oAthleteModel.getData(), {
						athletes: [
							{_id: 1, name: 'John', surname: 'Wilson', age: 32, gender: 'male', position: 'Forward'},
							{_id: 3, name: 'Adam', surname: 'Rose', age: 22, gender: 'male', position: 'Centre-back'},
						]}
				);
				});
				
			});

		});
	}
);