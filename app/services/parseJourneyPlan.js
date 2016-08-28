'use strict'
/**
 * Created by gooba on 27/08/2016.
 */
import moment from 'moment';

exports.parseJourneyPlan = function(journeyPlanResponse, maxTime) {
    return new Promise((resolve, reject) => {
        if (journeyPlanResponse==null || journeyPlanResponse.Status.Severity!=0) {
            console.log("Problem getting journey.");
            reject(new Error("Problem getting journey - journeyplan was null."))
            return;
        }
        console.log("response:" + JSON.stringify(journeyPlanResponse,null,4));
        var journeys = journeyPlanResponse.Journeys;
        var departureTimes = [];
        for (var t=0;t<journeys.length;t++) {
            var journey = journeys[t];
            if (journey.Legs == null) {
                continue;
            }
            for (var i=0; i<journey.Legs.length; i++) {
                var leg = journey.Legs[i];
                var type = leg["__type"];
                if (type==null || !type.startsWith("TripLeg")) {
                    continue;
                }

                //debugger;
                var departTime = moment(leg.DepartTime);
                var description = `${leg.Headsign} service departing from ${leg.OriginLocationDescription}`;

/*
                if (departTime.isAfter(maxTime)) {
                    break;
                }
*/

                console.log(`depart at ${departTime} with message [${description}]`);
                departureTimes.push({
                    headsign : leg.Headsign,
                    originLocation : leg.OriginLocationDescription,
                    destinationLocation : leg.DestinationLocationDescription,
                    duration: leg.DurationMinutes,
                    mode : leg.Mode,
                    changCount: journey.ChangeCount,
                    departTime : departTime,
                    description: description
                });
                break;
            }
        }
        resolve(departureTimes);
    });
};