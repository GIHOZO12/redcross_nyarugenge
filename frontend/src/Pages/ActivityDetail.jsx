import { useCallback } from "react";
import { useParams } from "react-router-dom";
import DetailArticle from "../Components/DetailArticle";
import { activitiesService } from "../api";
import { useFetch } from "../hooks";

/**
 * A Red Cross activity as a visitor sees it, with its description in full.
 *
 * Read-only: activities are created and edited in the admin dashboard.
 */
const ActivityDetail = () => {
  const { id } = useParams();

  const {
    data: activity,
    loading,
    error,
  } = useFetch(useCallback(() => activitiesService.detail(id), [id]), [id]);

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
      backTo="/event/allactivities"
      backLabel="All activities"
      image={activity.redcross_activities_image}
      title={activity.title}
      meta={activity.created_at}
      body={activity.description}
    />
  );
};

export default ActivityDetail;
