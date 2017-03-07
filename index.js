import Themeparks from 'themeparks';
import requester from 'superagent';

// list all the parks supported by the library
for (var park in Themeparks.Parks) {
    console.log("* " + new Themeparks.Parks[park]().Name + " (DisneyAPI." + park + ")");
}

// access a specific park
const parks = [
  {
    api: new Themeparks.Parks.WaltDisneyWorldMagicKingdom(),
    set: '58be310f7b6cbc00185d5641',
    title: 'Disney World Magic Kingdom'
  },
  {
    api: new Themeparks.Parks.WaltDisneyWorldEpcot(),
    set: '58be31177b6cbc00185d5643',
    title: 'Disney World Epcot'
  },
  {
    api: new Themeparks.Parks.UniversalStudiosFlorida(),
    set: '58be31207b6cbc00185d5645',
    title: 'Universal Studios Florida'
  },
  {
    api: new Themeparks.Parks.UniversalIslandsOfAdventure(),
    set: '58be31287b6cbc00185d5647',
    title: 'Universal Studios Island of Adventure'
  },
  {
    api: new Themeparks.Parks.SixFlagsOverGeorgia(),
    set: '58be31307b6cbc00185d5649',
    title: 'Six Flags Over Georgia'
  }
]

parks.forEach((park) => {
  park.api.GetWaitTimes().then((rides) => {
    console.log(rides);
  })
});
const getWaitTimes = () => {
  parks.forEach((park) => {
    park.api.GetWaitTimes().then((rides) => {
      const items = rides.map((ride) => {
        const obj = {
          title: ride.name,
          rideId: ride.id,
          parkTitle: park.title,
          active: ride.active,
          waitTime: ride.waitTime,
          fastPass: ride.fastPass,
          status: ride.status,
          time: new Date().toString(),
          schedule: (ride.schedule) ? {
            date: ride.schedule.date,
            openingTime: ride.schedule.openingTime,
            closingTime: ride.schedule.closingTime,
            type: ride.schedule.type
          } : undefined
        }
        Object.keys(obj).forEach((key) => {
          if (obj[key] == null) {
            delete obj[key];
          }
        });
        return obj;
      });
      requester.post('https://api.zenow.io/v1/set/' + park.set + '/item?apikey=KEYGOESHERE')
        .send(items)
        .end((err, result) => {
          if (!err) {
            console.log('success: ' + park.title)
          } else {
            console.error(err);
          }
        })
    })
  });
}

getWaitTimes();
setInterval(getWaitTimes, 3.6 * Math.pow(10, 6));
