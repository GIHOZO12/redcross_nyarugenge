/**
 * Everything the five family pages (Humanity, Unit, Neutrality, Impartiality,
 * Universality) used to repeat: load the family, load its activities, and
 * delete an activity behind a confirmation dialog.
 *
 * Each page now keeps only its own markup:
 *
 *   const { familyData, activities, error, handleDeleteActivity } =
 *     useFamilyPage(FAMILIES.UNITY);
 */

import { useCallback, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { familyService } from "../api/services/family.service";
import { getErrorMessage } from "../api/errors";

/**
 * @param {string} family - a slug from `FAMILIES`, e.g. "Humanity"
 */
export const useFamilyPage = (family) => {
  const [familyData, setFamilyData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * May the signed-in user manage THIS family's activities?
   *
   * The server decides and returns `can_add_activity`. It compares the caller
   * against this family's own father/mother (both OneToOne fields, so a parent
   * belongs to exactly one family) and lets staff through everywhere.
   *
   * Deciding it here from the user's role would be wrong: a role of "Father"
   * is global, so every parent would see the controls on every family's page,
   * and the server would then refuse the request with 403.
   */
  const [canAddActivity, setCanAddActivity] = useState(false);

  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Both lists in parallel instead of one after the other.
      const [familyResponse, activitiesResponse] = await Promise.all([
        familyService.members(family),
        familyService.activities(family),
      ]);

      if (!mounted.current) return;
      setFamilyData(familyResponse?.family ?? familyResponse ?? null);
      setActivities(activitiesResponse?.activities ?? activitiesResponse ?? []);
      // `/family_list/` nests the flag inside `family`; `/family_activities/`
      // returns it at the top level. Take whichever is present.
      setCanAddActivity(
        Boolean(
          familyResponse?.family?.can_add_activity ??
            activitiesResponse?.can_add_activity ??
            false
        )
      );
    } catch (err) {
      if (mounted.current) {
        setError(getErrorMessage(err, "Unable to fetch family data or activities."));
        setCanAddActivity(false);
      }
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [family]);

  useEffect(() => {
    load();
  }, [load]);

  /** Confirm, delete, then drop the activity from the list. */
  const handleDeleteActivity = useCallback(async (id) => {
    if (!id) {
      setError("Invalid activity ID.");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const data = await familyService.deleteActivity(id);

      if (data && data.status === false) {
        setError(data.message || "Error deleting activity");
        return;
      }

      setActivities((current) => current.filter((activity) => activity.id !== id));
      setError("");
      Swal.fire("Deleted", "Deleted successfully", "success");
    } catch (err) {
      setError(getErrorMessage(err, "Error deleting activity"));
    }
  }, []);

  return {
    familyData,
    activities,
    loading,
    error,
    /** True only for this family's own father/mother, or for staff. */
    canAddActivity,
    handleDeleteActivity,
    refetch: load,
    setActivities,
    setError,
  };
};

export default useFamilyPage;
