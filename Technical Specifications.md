**Technical Specifications Document**

**Platform:** Intended both for iOS and android.

**Minimum and Target API levels:**

Android : Minimum API level → Android 8 (Oreo) / Android 9 (Pie)

Target API level → API level 33 (Android 13)

Android 8 (Oreo) and Android 9 (Pie) are widely adopted versions, covering a significant portion of the Android user base. Setting the minimum API level to Android 8 ensures compatibility with a large number of devices while still providing access to modern features and optimizations introduced in these versions.

Setting the target API level to API level 33 (Android 13) ensures that the app takes advantage of the latest APIs and optimizations available in Android 13. By targeting a higher API level, we can leverage new features, security enhancements, and performance improvements while maintaining backward compatibility with older Android versions.

iOS : Minimum API level → iOS 12.0/ iOS 13.0

Target API level → iOS 17.0

Same logic as Android.

**APIs integration :**

1. Mapping APIs → The team agreed to use **TomTom Multinet API** for maps

   Provides access to mapping data, including real-time traffic information, road networks, and speed limit data for the Real-time Speed Limit Notification System.

2. Crash Detection APIs

   Provides algorithms or services for detecting crash-like events based on accelerometer data, facilitating the Crash Detection and Automated Emergency Response feature.

3. Notification APIs → Firebase Cloud Messaging

   Facilitates sending notifications to users in real-time, such as crash alerts or speed limit notifications.

4. Voice Recognition APIs → React Native TTS library (or) Expo Speech library Enables voice-controlled notifications and hands-free operation by converting spoken commands into text for processing.

**Sensors used:**

1. GPS (Global Positioning System) and Speedometer:
   1. For accurate navigation aid
   1. Aids emergency services in locating users during emergencies.
1. Accelerometer : Detects sudden changes in acceleration, crucial for crash detection and automated emergency response.
1. Gyroscope: Enhances accelerometer readings for precise motion tracking
1. Microphone: Enables hands-free operation, reducing driver distraction and promoting safer driving habits.

**User Permissions :**

- Location: Required for navigation and real time speed limit notifications
- Microphone access: For recording audio → Required for Hands free operation and notification system
- Notification: Required for displaying notifications to the user.
- Storage:
  - For storing data on user driving behaviors and providing recommendations.
  - For saving settings and may be other preferences for improved user experience.
  - Required For offline Functionality → Future Scope
  - Required if weather, visibility and terrain data are cached or stored locally. Both of these features can be considered for future scope.
- Contacts/ Emergency Contacts: Required for contacting in case of a crash.
- Internet: For accessing Map API’s and for sending out notifications in case of crash

**Data Storage**: Firestore by Firebase

Firestore offers real-time synchronization for instant updates, scalability to accommodate growing data needs, seamless offline support, powerful querying capabilities, and built-in security features to protect sensitive user data.

**Network communication:**

- Access control and Authentication: JWT
- **Encryption (TLS/SSL):** All communication between the app and external servers is encrypted using TLS/SSL (HTTPS) to protect user data during transmission.

**Offline Mode:** Future Scope

**Data privacy and GDPR compliance:**

- User data, such as location information and accelerometer data, is collected and utilized solely to enhance driving safety features, and is never shared with third parties for marketing purposes.
- Explicit user consent is obtained before accessing sensitive data, and transparent information about data usage and privacy rights is provided.
- Robust security measures, including encryption and access controls, are implemented to protect user data against unauthorized access.
- Users retain full control over their personal data, including the ability to access, rectify, or delete it, with a strict data retention policy ensuring data is retained only for as long as necessary.

**Testing:**

1. Cross platform compatibility testing: The goal of this testing is to ensure consistent performance by identifying and resolving issues that might be specific to a device or operating system.
1. Performance testing:
   1. Ensure the app responds promptly to user interactions, minimizing delays in navigation and functionality.
   1. Ensure the app is optimized to minimize resource consumption, avoiding excessive battery drain and device slowdowns
1. Usability Testing
- Identify any UI elements or design choices that may confuse or frustrate users, ensuring a user-friendly interface.
- Ensure the app provides clear error messages and guidance for users
