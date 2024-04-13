import { FIREBASE_AUTH, FIREBASE_DB } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default class GamificationManager {
    constructor(userId) {
        this.userId = userId;
        this.overspeedingStartTime = null;
        this.userDoc = doc(FIREBASE_DB, "users", FIREBASE_AUTH.currentUser.uid);
        console.log(this.userDoc);
    }

    startOverSpeeding() {
        this.overspeedingStartTime = Date.now();
    }

    stopOverSpeeding() {
        let millis = Date.now() - this.overspeedingStartTime;
        let duration = Math.floor(millis/1000);

        let deduction = (Math.floor(duration/30)+1)*5;
        console.log(`Gamification manager overspeeding stopped after ${duration}s and reduced ${deduction} pts`);
    }
}
