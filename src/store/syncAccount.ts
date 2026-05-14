import { useEffect } from "react";
import { useStore } from "./useStore";
import { useAuth } from "./useAuth";

// Bridges useStore (session state) with useAuth (account records).
// - On sign in: hydrate useStore from the account.
// - On sign out: reset useStore.
// - On useStore mutations while signed in: write back to the account.
export function useAccountSync() {
  const currentEmail = useAuth((s) => s.currentEmail);

  // Hydrate / clear on auth change
  useEffect(() => {
    if (currentEmail) {
      const account = useAuth.getState().accounts[currentEmail];
      if (account) {
        useStore.setState({
          isPro: account.isPro,
          profile: account.profile,
          savedSchoolIds: account.savedSchoolIds,
          essays: account.essays,
          applications: account.applications,
          tutorialSeen: account.tutorialSeen ?? false,
        });
      }
    } else {
      useStore.setState({
        isPro: false,
        profile: null,
        savedSchoolIds: [],
        essays: [],
        applications: [],
        tutorialSeen: false,
      });
    }
  }, [currentEmail]);

  // Mirror useStore changes back to the account record
  useEffect(() => {
    return useStore.subscribe((state) => {
      const email = useAuth.getState().currentEmail;
      if (!email) return;
      const updateAccount = useAuth.getState().updateAccount;
      updateAccount({
        isPro: state.isPro,
        profile: state.profile,
        savedSchoolIds: state.savedSchoolIds,
        essays: state.essays,
        applications: state.applications,
        tutorialSeen: state.tutorialSeen,
      });
    });
  }, []);
}
