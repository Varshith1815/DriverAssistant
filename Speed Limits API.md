# Which API to use for getting real-time speed limits?

Multiple databases and corresponding APIs are available to get the posted speed limit. We will evaluate them based on the following factors:

1. **Method of Access**
Is there an SDK in the same programming language as the applcication? If not, is there an API endpoint accessible?
2. **Authorization**
Is the data openly available with unrestricted access? Or can we get an API key after registration?
3. **Complexity of development**
What are parameters to be provided as input and what is the output format? Is it direct numeric speed limit?
4. **Pricing**
How are requests metered? Is there a free tier of requests beyond which there will be charges?

There are 4 popular choices to retrieve posted speed limits:
1. [Google Roads API](https://developers.google.com/maps/documentation/roads/speed-limits)
2. [HERE Speed Limit Data](https://www.korem.com/product/here-speed-limits/)
3. [OpenStreetMap API](https://wiki.openstreetmap.org/wiki/Default_speed_limits)
4. [TomTom MultiNet](https://download.tomtom.com/open/banners/MultiNet-product-info-sheet.pdf)

| Product Name | Access | Authorization | Complexity | Pricing | Advantages | Disadvantages |
|-|-|-|-|-|-|-|
|Google Roads API|HTTP request|API Key|Endpoint: `https://roads.googleapis.com/v1/speedLimits?parameters&key=YOUR_API_KEY`.<br> Input is either path or placeId. Path is array of latitude/longitude pairs. PlaceId is unique identifier for places on Google Maps.<br> Output is array of speed limit at each placeId for the locations in request.| $0.02 per element for 0-100,000 elements per month.<br><br> Pricing is for each speed limit element returned in the response. This will be equal to or less than the number of locations given in request.|1.Simple input of location coordinates.<br>2.Speed limits available in both mph and kph.|No free tier.|
|HERE Maps|HTTP request|API key|Endpoint: `https://routematching.hereapi.com/v8/match/routelinks?apikey=<apikey>&waypoint0=<lat0,long0>&waypoint1=<lat1,long1>&mode=fastest;car&routeMatch=1&attributes=SPEED_LIMITS_FCn(*)`<br>Input is coordinates passed as query params.<br>Output contains array of waypoint IDs and speed limits at the point in KPH.|Free plan allows 1000 requests every day.|Direct input using coordinates.|Speed limits provided in KPH and not MPH.|
|TomTom Multinet|SDK and API|API key|Endpoint: `https://api.tomtom.com/snap-to-roads/1/snap-to-roads?points={{GPS_COORDINATES}}&timestamps={{TIMESTAMPS}}&vehicleType=Truck&fields=%7BprojectedPoints%7Btype%2Cgeometry%7Btype%2Ccoordinates%7D%2Cproperties%7BrouteIndex%2CsnapResult%7D%7D%2Croute%7Btype%2Cgeometry%7Btype%2Ccoordinates%7D%2Cproperties%7Bid%2ClinearReference%2CspeedLimits%7Bvalue%2Cunit%2Ctype%7D%2Caddress%7BroadName%2CroadNumbers%7D%2Cfrc%2CformOfWay%2CroadUse%2ClaneInfo%7BnumberOfLanes%7D%2CheightInfo%7Bheight%2Cchainage%7D%2CtrafficSigns%7BsignType%2Cchainage%7D%2CtrafficLight%7D%7D%2Cdistances%7Btotal%2Croad%2CoffRoad%7D%7D&key= {{API_KEY}}`<br>Input is coordinate points as query params.<br>Output is speed limit at each point.|Free tier: 2,500 non-tile requests daily|1. Direct coordinate input<br>2. Speed limits provided in MPH|Large JSON response, might be difficult to debug

OpenStreetMap does not have a direct API to provide speed limits.

### References
1. https://www.adci.com/blog/4-speed-limit-databases-you-need-know-about
2. https://developers.google.com/maps/documentation/roads/speed-limits#requests
3. https://www.adci.com/blog/accessing-speed-limit-data-on-here-location-services
4. https://demo.support.here.com/examples/v3/rme_speed_limits
5. https://developer.tomtom.com/blog/build-different/journey-speed-limit-review-tomtom-snap-roads-api/
6. https://developer.tomtom.com/snap-to-roads-api/api-explorer
