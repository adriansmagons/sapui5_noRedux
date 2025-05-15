sap.ui.define(["sap/ui/base/Object"], function(BaseObject) {

   return BaseObject.extend("ui5.fitnessApp.utils.DataPreprocessor", {
    constructor: function () {

    },
    fetchData: async function (aUrls) {
        try{
            let promises = aUrls.map((url) => fetch(url));
            let allResponses = await Promise.all(promises);
            let fetchData = await Promise.all(allResponses.map((res) => res.json()));
            
            return fetchData
            debugger
        }catch (err){
            throw new Error(`Data fetch failed: ${err}`);
        }
    },

    processAthletes: function(oData) {
        const aNewAthletes = []
        for(const athlete of oData[0].athletes){
            const aAthleteSessions = [];
            for(const session of oData[1].training_sessions){
                for(const atendees of session.atendees){
                    if(athlete._id === atendees.id){
                        aAthleteSessions.push(session);
                        break;
                    }
                }
            }
            athlete.trainingSessions = aAthleteSessions;
            athlete.trainingSessionCount = aAthleteSessions.length;
            aNewAthletes.push(athlete);
        }
        const oAthletes = {}
        oAthletes.order = 0;  //sorting
        oAthletes.athletes = aNewAthletes;
        return oAthletes
    }

    




   })
});