import { useCallback } from "react";
import { useParams } from "react-router-dom";
import DetailArticle from "../Components/DetailArticle";
import { fellowshipService } from "../api";
import { useFetch } from "../hooks";

/**
 * A fellowship as a visitor sees it: the full description, and the captioned
 * images of what it covered.
 *
 * Read-only by design. Images are added and removed in the admin dashboard
 * (/admin/fellowship/:id); this page only shows what is there, so the public
 * site carries no editing controls at all.
 */
const FellowshipDetail = () => {
  const { id } = useParams();

  const {
    data: fellowship,
    loading,
    error,
  } = useFetch(useCallback(() => fellowshipService.detail(id), [id]), [id]);

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

  if (!fellowship) return null;

  return (
    <DetailArticle
      backTo="/event/fellowership"
      backLabel="All fellowships"
      image={fellowship.fellowship_image}
      title={fellowship.title}
      meta={fellowship.created_at}
      body={fellowship.description}
    >
      {fellowship.gallery.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            What we learned
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {fellowship.gallery.map((item) => (
              <figure
                key={item.id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <img
                  src={item.image}
                  alt={item.caption || fellowship.title}
                  className="w-full h-48 object-cover"
                />
                {item.caption && (
                  <figcaption className="p-3 text-sm text-gray-700">
                    {item.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      )}
    </DetailArticle>
  );
};

export default FellowshipDetail;
