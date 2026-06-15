import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth, googleProvider, githubProvider } from './firebase'

export function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider)
}

export function signInWithGitHub() {
  return signInWithPopup(auth, githubProvider)
}

export function signOut() {
  return firebaseSignOut(auth)
}

export function onAuth(callback) {
  return onAuthStateChanged(auth, callback)
}
