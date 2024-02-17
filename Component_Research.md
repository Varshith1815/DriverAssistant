# Smart Driver Assistant: Research Findings of Components

## Accelerometers and Gyroscope
`--Venkata Sai Mohan Kumar Pallapothu `

## Speedometer Display and Alerts
`--Akshay Reddy Kola`

To incorporate a speedometer display and speed alerts into a React Native app leveraging the GPS sensor, we can utilize the React Native framework's capabilities to access the device's native GPS functionality. This process involves using the `react-native-geolocation-service` or similar libraries that provide access to the device's GPS sensor. Through these libraries, the app can obtain real-time geolocation data, including the speed at which the device (and therefore, the vehicle) is moving. The speed data, typically provided in meters per second, can be converted into the desired unit (e.g., miles per hour or kilometers per hour) and displayed on the user interface as a speedometer reading.

For the speed alert feature, we can implement logic within the app to compare the current speed against predetermined speed limits, which could be statically defined within the app or dynamically fetched from a mapping service API that provides speed limit data for given locations. If the app detects that the driving speed exceeds the speed limit, it can trigger an alert using the device's notification system. This alert can be a visual warning on the screen, an audible alert, or a vibration, designed to catch the driver's attention without causing distraction. Additionally, to enhance user experience and safety, the app can include settings allowing users to customize alert thresholds and types, ensuring that drivers receive notifications in a manner that best suits their preferences and driving habits. By integrating these features, the React Native app becomes a valuable tool for promoting safer driving practices through technology.

## Crash Detection and Driver Mode
`--Varshith Sriram Mandalapu`

## Motion Sensors
`--Harsha Vardhan Mupparaju`

## Bluetooth Low Energy (BLE) Integration
`--Gokul Subramanian`

## Addressing Data Privacy Concerns
`--Hariraj Venkatesan`