import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import AdminLayout from "../../Layout/AdminLayout";
import { activitiesService } from "../../api";
import { useFetch } from "../../hooks";

/**
 * Admin view of one Red Cross activity, with its description in full.
 *
 * The listing only ever shows a truncated card, and the public site does not
 * link to activities individually, so this is where the whole text is read.
 */
const AdminActivityDetail = () => {
  const { id } = useParams();

  const {
    data: activity,
    loading,
    error,
  } = useFetch(useCallback(() => activitiesService.detail(id), [id]), [id]);

  if (loading) {
    return (
      <AdminLayout>
        <p className="p-8 text-gray-500">Loading activity…</p>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-8">
          <p className="bg-red-100 text-red-700 p-4 rounded-lg max-w-xl">{error}</p>
          <Link
            to="/admin/Redscrossactivies"
            className="text-blue-700 underline mt-4 inline-block"
          >
            Back to activities
          </Link>
        </div>
      </AdminLayout>
    );
  }

  if (!activity) return null;

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <Link to="/admin/Redscrossactivies" className="text-sm text-blue-700 underline">
          ← All activities
        </Link>

        <article className="bg-white rounded-lg shadow mt-4 overflow-hidden max-w-4xl">
          {/* object-contain, not cover: cropping a photo of a board or a
              group shot hides the part worth seeing. */}
          {activity.redcross_activities_image && (
            <a href={activity.redcross_activities_image} target="_blank" rel="noreferrer" title="Open full size">
              <img
                src={activity.redcross_activities_image}
                alt={activity.title}
                className="w-full max-h-[32rem] object-contain bg-gray-100"
              />
            </a>
          )}
          <div className="p-6">
            <h1 className="text-2xl font-bold text-blue-900">{activity.title}</h1>
            <p className="text-sm text-gray-500 mt-1">{activity.created_at}</p>
            {/* whitespace-pre-line so paragraph breaks in the description survive */}
            <p className="text-gray-700 mt-5 leading-relaxed whitespace-pre-line">
              {activity.description}
            </p>
            <Link
              to={`/edit_activity/${activity.id}`}
              className="inline-block mt-5 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
            >
              Edit activity
            </Link>
          </div>
        </article>
      </div>
    </AdminLayout>
  );
};

export default AdminActivityDetail;
