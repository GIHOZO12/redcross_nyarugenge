import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { familyService } from "../api";
import { useFetch } from "../hooks";

/**
 * One family activity in full, on the public site.
 *
 * Family activities keep a public detail page because their listing lives on
 * the public family pages, where members read them. Fellowships and Red Cross
 * activities are read in the admin dashboard instead.
 */
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
        <Link to="/" className="text-blue-700 underline mt-4 inline-block">
          Back home
        </Link>
      </div>
    );
  }

  if (!activity) return null;

  // The family page this activity belongs to, e.g. /families/unity
  const familyPath = activity.family ? `/families/${activity.family}` : "/";

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <Link to={familyPath} className="text-sm text-blue-700 underline">
          ← {activity.family ? `${activity.family} family` : "Home"}
        </Link>

        <article className="bg-white rounded-lg shadow-lg overflow-hidden mt-4">
          {activity.activityImage && (
            <img
              src={activity.activityImage}
              alt={activity.title}
              className="w-full h-72 sm:h-96 object-cover"
            />
          )}
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-gray-900">{activity.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {activity.created}
              {activity.family ? ` · ${activity.family} family` : ""}
            </p>
            {/* whitespace-pre-line so paragraph breaks survive */}
            <p className="text-gray-700 mt-6 leading-relaxed whitespace-pre-line">
              {activity.text}
            </p>
          </div>
        </article>
      </div>
    </div>
  );
};

export default FamilyActivityDetail;
