import { Alert } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebaseConfig';
import { getDocs, updateDoc, collection, query, where } from 'firebase/firestore';

export default class GamificationManager {
    constructor() {
        // TODO: reset to 0 after debugging
        this.startTime = 1713124264;
    }

    async fetchUser() {
        const usersRef = collection(FIREBASE_DB, "users");
        const q = query(usersRef, where("uid", "==", FIREBASE_AUTH.currentUser.uid));

        try {
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs[0];
            // querySnapshot.forEach((doc) => {
            //     this.userDoc = doc.data();
            // });
        } catch (error) {
            console.error(error);
            Alert.alert("Error fetching user data");
        }
    }

    async startOverSpeeding() {
        console.log("Gamification manager over speeding handler");
        this.startTime = Math.floor(Date.now() / 1000);
        console.log("Overspeeding started at ", this.startTime);
    }

    async stopOverSpeeding() {
        let stopTime = Math.floor(Date.now() / 1000);
        let duration = stopTime - this.startTime;

        let deduction = (Math.floor(duration/30)+1)*5;
        console.log(`Gamification manager overspeeding stopped after ${duration}s and reduced ${deduction} pts`);
        
        // TODO: update points in users collection for current user doc

        // const usersRef = collection(FIREBASE_DB, "users");
        // const q = query(usersRef, where("uid", "==", FIREBASE_AUTH.currentUser.uid));
        // let newPoints = this.points + 10
        // try {
        //     await updateDoc(this.userPath, {
        //         points: newPoints
        //     })
        // } catch(err) {
        //     console.log(err);
        //     console.log(err.backtrace());
        //     Alert.alert("Error updating user points");
        // }

        // try {
        //     const querySnapshot = await getDocs(q);
        //     querySnapshot.forEach(async (doc) => {
        //         const data = doc.data();
        //         console.log("reference");
        //         console.log(doc.ref.path);
        //         console.log("full object");
        //         console.log(data);
        //         // await updateDoc(doc.ref.path, {
        //         //     points: data.points + 10
        //         // })
        //     });
        // } catch (error) {
        //     console.error(error);
        //     Alert.alert("Error fetching user data");
        // }
        
    }
}
