import { Alert } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebaseConfig';
import { getDocs, updateDoc, collection, query, where, doc, runTransaction } from 'firebase/firestore';

export default class GamificationManager {
    static instance = null;
    
    constructor() {
        if (GamificationManager.instance) {
            return GamificationManager.instance;
        }
        this.startTime = 0;
        this.goodDrivingTimer = null;
        this.goodDrivingPoints = 0;
        GamificationManager.instance = this;
    }

    async fetchUser() {
        const usersRef = collection(FIREBASE_DB, "users");
        const q = query(usersRef, where("uid", "==", FIREBASE_AUTH.currentUser.uid));

        try {
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                console.log("No matching documents.");
                return null;
            }
            return querySnapshot.docs[0]; // Return the first document that matches
        } catch (error) {
            console.error("Failed to fetch user document.", error);
            return null;
        }
    }

    async updateFirestorePoints(pointsToAdd) {
        const userDoc = await this.fetchUser();
        if (!userDoc) {
            console.error("Failed to fetch user document.");
            Alert.alert("Error", "Failed to fetch user document.");
            return;
        }

        try {
            const newPoints = (userDoc.data().points || 0) + pointsToAdd;
            await updateDoc(userDoc.ref, { points: newPoints });
            console.log(`Firestore updated. New points: ${newPoints}`);
        } catch (error) {
            console.error("Error updating points in Firestore", error);
            Alert.alert("Error updating points", error.message || "An error occurred while updating points.");
        }
    }    

    // startGoodDrivingSession = () => {
    //     if (this.goodDrivingTimer) {
    //         clearInterval(this.goodDrivingTimer);
    //     }
    //     this.startTime = Math.floor(Date.now() / 1000);
    //     this.goodDrivingPoints = 0;  // Reset points at the start of a good driving session
    //     this.goodDrivingTimer = setInterval(this.calculateGoodDrivingPoints, 10000); // 10s interval
    // }

    // stopGoodDrivingSession = async () => {
    //     if (this.goodDrivingTimer) {
    //         clearInterval(this.goodDrivingTimer);
    //         this.goodDrivingTimer = null;
    //     }
    //     console.log(`Good driving session ended. Total points earned: ${this.goodDrivingPoints}`);
    //     this.updateFirestorePoints(this.goodDrivingPoints); // Update Firestore with the good driving points
    //     this.goodDrivingPoints = 0; // Reset points after syncing
    // }

    // calculateGoodDrivingPoints = () => {
    //     let duration = Math.floor(Date.now() / 1000) - this.startTime;
    //     let interval = Math.floor(duration / 10); // Determine the 10s interval
    //     let pointsToAdd = Math.pow(2, interval); // Calculate points as 2^interval
    //     this.goodDrivingPoints += pointsToAdd;
    //     console.log(`Added ${pointsToAdd} points for good driving. Total now: ${this.goodDrivingPoints}`);
    // }

    startGoodDrivingSession = () => {
        this.startTime = Math.floor(Date.now() / 1000);
        this.goodDrivingPoints = 0;  // Reset points at the start of a good driving session
        console.log("Good Driving started at ", this.startTime);
    }

    stopGoodDrivingSession = async () => {
        let stopTime = Math.floor(Date.now() / 1000);
        let duration = stopTime - this.startTime;
        this.goodDrivingPoints = (Math.floor(duration / 10)) * 2;
        console.log(`[${stopTime} - ${this.startTime}] Good driving session ended after ${duration}s. Total points earned: ${this.goodDrivingPoints}`);
        this.updateFirestorePoints(this.goodDrivingPoints); // Update Firestore with the good driving points
        this.goodDrivingPoints = 0; // Reset points after syncing
    }
    
    startOverSpeeding = () => {
        console.log("Gamification manager over speeding handler");
        this.startTime = Math.floor(Date.now() / 1000);
        console.log("Overspeeding started at ", this.startTime);
    }

    stopOverSpeeding = async () => {
        let stopTime = Math.floor(Date.now() / 1000);
        console.log(`Overspeeding stopped at ${stopTime}`);
        let duration = stopTime - this.startTime;
        let deduction = (Math.floor(duration / 30) + 1) * 5;
        console.log(`[${stopTime} - ${this.startTime}] Overspeeding stopped after ${duration}s and reduced ${deduction} pts`);
        if (deduction > 0) {
            this.updateFirestorePoints(-deduction); // Ensure only positive deductions are made
        }
    }
}

