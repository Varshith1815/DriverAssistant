# Metrics and/or Methods which will be useful to test the application's accuracy
## Here are some of the methods which we can use to test some important features:
**1. Speedometer display:**
We can assess the speed shown by the app by comparing it to the car's built-in speedometer [1] while driving on a flat, straight road. To accomplish this, we'll utilize various speed increments (such as 10, 30, 50, and 70 mph) and determine the average variance between the two measurements.

**2. Speed limit alert:**
To evaluate the accuracy of the app's speed limit display, we will compare it with the official speed limit signs and data from mapping services. This involves driving on a variety of roads with known speed limits, ranging from highways to city streets and residential areas, and comparing the speed limit alerts provided by the app with the actual speed limits. This method allows us to assess the app's accuracy in different contexts and environments [2].

**3. Crash Detection:**
In order to evaluate the performance of the app, we will focus on the metrics of false positive and negative rates [3]. This involves simulating a variety of scenarios that represent both crash and non-crash events, such as sudden braking, hitting a pothole, or driving over bumps. We will then record the app's responses to these scenarios. By analyzing this data, we can identify instances of false positives, where the app detects a crash that did not occur, and false negatives, where the app fails to detect an actual crash. This comprehensive approach allows us to assess the app's accuracy and reliability in different driving conditions.

**4. Driver Mode:**
In assessing the performance of the app, we focus on two key metrics: the clarity and accuracy of voice messages [4], and the reaction time to notifications. To evaluate these, we either employ automated testing tools or engage human users to assess the clarity and comprehensibility of the app's voice messages. Additionally, we measure the duration between the app reading out notifications and the users' responses to them. This approach allows us to gauge the app's effectiveness in delivering clear voice messages and prompt notifications.

## Reference:
**[1] Evaluating the effectiveness of a smartphone speed limit advisory application: An on-road study in Port-Harcourt, Nigeria by Anderson Etika et al.**
**[2] Alphin KL, Sisson OM, Hudgins BL, Noonan CD, Bunn JA. Accuracy Assessment of a GPS Device for Maximum Sprint Speed. Int J Exerc Sci. 2020 Feb 1;13(4):273-280. PMID: 32148634; PMCID: PMC7039468.**
**[3] Sharma, Harit & Reddy, Ravi & Karthik, Archana. (2016). S-CarCrash: Real-time crash detection analysis and emergency alert using smartphone. 36-42. 10.1109/ICCVE.2016.7.**
**[4] Garay-Vega, L., Pradhan, A.K., Weinberg, G., Schmidt-Nielsen, B., Harsham, B., Shen, Y., Divekar, G., Romoser, M., Knodler, M., Fisher, D.L., 2010. Evaluation of different speech and touch interfaces to in-vehicle music retrieval systems. Accident Analysis & Prevention 42, 913–920.. https://doi.org/10.1016/j.aap.2009.12.022**