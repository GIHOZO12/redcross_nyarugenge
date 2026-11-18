import { useCallback } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { activitiesService, familyService } from "../api";
import { useFetch } from "../hooks";

/**
 * Full view of a single activity.
 *
 * Red Cross activities and family activities are the same page with different
 * field names behind them, so one component serves both rather than two
 * near-identical files. `variant` picks which service to call and how to read
 * the result.
 */
const ActivityDetail = ({ variant = "redcross" }) => {
  const { id } = useParams();
  const isFamily = variant === "family";

  const {
    data: activity,
    loading,
    error,
  } = useFetch(
    useCallback(
      () =>
        isFamily
          ? familyService.activityDetail(id)
          : activitiesService.detail(id),
      [id, isFamily]
    ),
    [id, isFamily]
  );

  const backTo = isFamily ? "/" : "/event/allactivities";
  const backLabel = isFamily ? "Home" : "All activities";

  if (loading) {
    return <p className="min-h-screen pt-32 text-center text-gray-500">Loading…</p>;
  }
  if (error) {
    return (
      <div className="min-h-screen pt-32 px-6 text-center">
        <p className="text-red-600">{error}</p>
        <Link to={backTo} className="text-blue-700 underline mt-4 inline-block">
          Back to {backLabel.toLowerCase()}
        </Link>
      </div>
    );
  }
  if (!activity) return null;

  // Red Cross activities use description/redcross_activities_image/created_at;
  // family activities use text/activityImage/created.
  const body = isFamily ? activity.text : activity.description;
  const image = isFamily
    ? activity.activityImage
    : activity.redcross_activities_image;
  const when = isFamily ? activity.created : activity.created_at;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <Link to={backTo} className="text-sm text-blue-700 underline">
          ← {backLabel}
        </Link>

        <article className="bg-white rounded-lg shadow-lg overflow-hidden mt-4">
          {image && (
            <img
              src={image}
              alt={activity.title}
              className="w-full h-72 sm:h-96 object-cover"
            />
          )}
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-gray-900">{activity.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {when}
              {isFamily && activity.family ? ` · ${activity.family} family` : ""}
            </p>
            {/* whitespace-pre-line so paragraph breaks survive */}
            <p className="text-gray-700 mt-6 leading-relaxed whitespace-pre-line">
              {body}
            </p>
          </div>
        </article>
      </div>
    </div>
  );
};

ActivityDetail.propTypes = {
  /** Which kind of activity this page is showing. */
  variant: PropTypes.oneOf(["redcross", "family"]),
};

export default ActivityDetail;
