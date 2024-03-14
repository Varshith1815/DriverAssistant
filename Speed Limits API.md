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
|Google Roads API|HTTP request|API Key|Endpoint: https://roads.googleapis.com/v1/speedLimits?parameters&key=YOUR_API_KEY.<br> Input is either path or placeId. Path is array of latitude/longitude pairs. PlaceId is unique identifier for places on Google Maps.<br> Output is array of speed limit at each placeId for the locations in request.| $0.02 per element for 0-100,000 elements per month.<br><br> Pricing is for each speed limit element returned in the response. This will be equal to or less than the number of locations given in request.|1.Simple input of location coordinates.<br>2.Speed limits available in both mph and kph.|No free tier.|

### References
1. https://developers.google.com/maps/documentation/roads/speed-limits#requests
2. https://www.adci.com/blog/accessing-speed-limit-data-on-here-location-services
