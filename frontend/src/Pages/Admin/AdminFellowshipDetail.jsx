import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import AdminLayout from "../../Layout/AdminLayout";
import { fellowshipService, getErrorMessage } from "../../api";
import { useFetch } from "../../hooks";


const AdminFellowshipDetail = () => {
  const { id } = useParams();

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
    return (
      <AdminLayout>
        <p className="p-8 text-gray-500">Loading fellowship…</p>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-8">
          <p className="bg-red-100 text-red-700 p-4 rounded-lg max-w-xl">{error}</p>
          <Link to="/admin/myfelowership" className="text-blue-700 underline mt-4 inline-block">
            Back to fellowships
          </Link>
        </div>
      </AdminLayout>
    );
  }

  if (!fellowship) return null;

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <Link to="/admin/myfelowership" className="text-sm text-blue-700 underline">
          ← All fellowships
        </Link>

        <article className="bg-white rounded-lg shadow mt-4 overflow-hidden">

          {fellowship.fellowship_image && (
            <a href={fellowship.fellowship_image} target="_blank" rel="noreferrer" title="Open full size">
              <img
                src={fellowship.fellowship_image}
                alt={fellowship.title}
                className="w-full max-h-[32rem] object-contain bg-gray-100"
              />
            </a>
          )}
          <div className="p-6">
            <h1 className="text-2xl font-bold text-blue-900">{fellowship.title}</h1>
            <p className="text-sm text-gray-500 mt-1">{fellowship.created_at}</p>

            <p className="text-gray-700 mt-5 leading-relaxed whitespace-pre-line">
              {fellowship.description}
            </p>
            <Link
              to={`/admin/edit_fellowership/${fellowship.id}`}
              className="inline-block mt-5 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
            >
              Edit fellowship
            </Link>
          </div>
        </article>


        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            What we learned
          </h2>

          {fellowship.gallery.length === 0 ? (
            <p className="text-gray-500">
              No images yet — add the first one below.
            </p>
          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {fellowship.gallery.map((item) => (
                <figure
                  key={item.id}
                  className="bg-white rounded-lg shadow overflow-hidden flex flex-col"
                >
                  <a href={item.image} target="_blank" rel="noreferrer" title="Open full size">
                    <img
                      src={item.image}
                      alt={item.caption || fellowship.title}
                      className="w-full max-h-[24rem] min-h-[16rem] object-contain bg-gray-100"
                    />
                  </a>
                  <figcaption className="p-4 text-base text-gray-700 flex-1">
                    {item.caption || <span className="text-gray-400">No caption</span>}
                  </figcaption>
                  <button
                    onClick={() => removeImage(item.id)}
                    className="text-xs text-red-600 hover:text-red-800 px-3 pb-3 text-left"
                  >
                    Remove
                  </button>
                </figure>
              ))}
            </div>
          )}
        </section>


        <section className="mt-8 bg-white rounded-lg shadow p-6 max-w-2xl">
          <h2 className="text-lg font-semibold mb-4">Add an image</h2>
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
              className="bg-blue-700 hover:bg-blue-900 disabled:bg-gray-400 text-white font-semibold px-5 py-2 rounded-md"
            >
              {busy ? "Uploading…" : "Add image"}
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-3">
            Adding or removing images requires a President, Vice President,
            Secretary or staff account.
          </p>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminFellowshipDetail;
