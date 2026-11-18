import { useCallback, useContext, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { AppContext } from "../AppContext/Appcontext";
import {
  canEditFellowshipGallery,
  fellowshipService,
  getErrorMessage,
} from "../api";
import { useFetch } from "../hooks";

/**
 * One fellowship in full: the whole description, plus the captioned gallery of
 * what was covered. Officers and staff get the controls to add and remove
 * images; everyone else sees the same page read-only.
 */
const FellowshipDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AppContext);
  const canEdit = canEditFellowshipGallery(user);

  const {
    data: fellowship,
    loading,
    error,
    refetch,
  } = useFetch(useCallback(() => fellowshipService.detail(id), [id]), [id]);

  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);

  const upload = async (e) => {
    e.preventDefault();
    if (!image) {
      Swal.fire("Choose an image", "Pick a file to upload first.", "info");
      return;
    }
    setBusy(true);
    try {
      await fellowshipService.addImage(id, { image, caption });
      setImage(null);
      setCaption("");
      e.target.reset();
      await refetch();
      Swal.fire("Added", "The image is now on this fellowship.", "success");
    } catch (err) {
      Swal.fire("Error", getErrorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  };

  const removeImage = async (imageId) => {
    const confirmed = await Swal.fire({
      title: "Remove this image?",
      text: "It will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, remove it",
    });
    if (!confirmed.isConfirmed) return;

    try {
      await fellowshipService.deleteImage(imageId);
      await refetch();
    } catch (err) {
      Swal.fire("Error", getErrorMessage(err), "error");
    }
  };

  if (loading) {
    return <p className="min-h-screen pt-32 text-center text-gray-500">Loading…</p>;
  }
  if (error) {
    return (
      <div className="min-h-screen pt-32 px-6 text-center">
        <p className="text-red-600">{error}</p>
        <Link to="/event/fellowership" className="text-blue-700 underline mt-4 inline-block">
          Back to fellowships
        </Link>
      </div>
    );
  }
  if (!fellowship) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/event/fellowership" className="text-sm text-blue-700 underline">
          ← All fellowships
        </Link>

        <article className="bg-white rounded-lg shadow-lg overflow-hidden mt-4">
          {fellowship.fellowship_image && (
            <img
              src={fellowship.fellowship_image}
              alt={fellowship.title}
              className="w-full h-72 sm:h-96 object-cover"
            />
          )}
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-gray-900">{fellowship.title}</h1>
            <p className="text-sm text-gray-500 mt-1">{fellowship.created_at}</p>
            {/* whitespace-pre-line so paragraph breaks in the description survive */}
            <p className="text-gray-700 mt-6 leading-relaxed whitespace-pre-line">
              {fellowship.description}
            </p>
          </div>
        </article>

        {/* What we learned ------------------------------------------------ */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            What we learned
          </h2>

          {fellowship.gallery.length === 0 ? (
            <p className="text-gray-500">
              No images yet{canEdit ? " — add the first one below." : "."}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {fellowship.gallery.map((item) => (
                <figure
                  key={item.id}
                  className="bg-white rounded-lg shadow overflow-hidden flex flex-col"
                >
                  <img
                    src={item.image}
                    alt={item.caption || fellowship.title}
                    className="w-full h-48 object-cover"
                  />
                  <figcaption className="p-3 text-sm text-gray-700 flex-1">
                    {item.caption || (
                      <span className="text-gray-400">No caption</span>
                    )}
                  </figcaption>
                  {canEdit && (
                    <button
                      onClick={() => removeImage(item.id)}
                      className="text-xs text-red-600 hover:text-red-800 px-3 pb-3 text-left"
                    >
                      Remove
                    </button>
                  )}
                </figure>
              ))}
            </div>
          )}
        </section>

        {/* Upload ---------------------------------------------------------- */}
        {canEdit && (
          <section className="mt-10 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Add an image</h2>
            <form onSubmit={upload} className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="block w-full text-sm border rounded-md p-2"
              />
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="What does this picture show? e.g. How to treat a burn"
                maxLength={255}
                className="block w-full border rounded-md p-2"
              />
              <button
                type="submit"
                disabled={busy}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold px-5 py-2 rounded-md"
              >
                {busy ? "Uploading…" : "Add image"}
              </button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
};

export default FellowshipDetail;
