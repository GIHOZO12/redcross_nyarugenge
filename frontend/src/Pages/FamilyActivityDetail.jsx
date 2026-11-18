import { useCallback } from "react";
import { useParams } from "react-router-dom";
import DetailArticle from "../Components/DetailArticle";
import { familyService } from "../api";
import { useFetch } from "../hooks";

/** One family activity in full, as a visitor sees it. */
const FamilyActivityDetail = () => {
  const { id } = useParams();

  const {
    data: activity,
    loading,
    error,
  } = useFetch(useCallback(() => familyService.activityDetail(id), [id]), [id]);

  if (loading) {
    return <p className="min-h-screen pt-32 text-center text-gray-500">Loading…</p>;
  }

  if (error) {
    return (
      <div className="min-h-screen pt-32 px-6 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!activity) return null;

  return (
    <DetailArticle
      // Back to the family this activity belongs to, not a generic home link.
      backTo={activity.family ? `/families/${activity.family}` : "/"}
      backLabel={activity.family ? `${activity.family} family` : "Home"}
      image={activity.activityImage}
      title={activity.title}
      meta={
        activity.family
          ? `${activity.created} · ${activity.family} family`
          : activity.created
      }
      body={activity.text}
    />
  );
};

export default FamilyActivityDetail;
