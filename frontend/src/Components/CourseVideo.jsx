import PropTypes from "prop-types";

/**
 * Plays a course video from a link rather than an uploaded file.
 *
 * Courses point at wherever the video already lives - YouTube, Google Drive,
 * Vimeo, anywhere. YouTube and Drive are embedded in place because both
 * publish an embed form; anything else gets a button that opens the link,
 * since an arbitrary URL cannot be assumed to be embeddable (many hosts send
 * X-Frame-Options and would simply render a blank box).
 */

/** The YouTube video id, from any of the forms people paste. */
const youtubeId = (url) => {
  const patterns = [
    /youtu\.be\/([A-Za-z0-9_-]{6,})/,
    /youtube\.com\/watch\?v=([A-Za-z0-9_-]{6,})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/,
    /youtube\.com\/live\/([A-Za-z0-9_-]{6,})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
};

/** The Google Drive file id, from a /file/d/<id>/ or ?id=<id> link. */
const driveId = (url) => {
  const m =
    url.match(/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)/) ||
    url.match(/drive\.google\.com\/open\?id=([A-Za-z0-9_-]+)/) ||
    url.match(/drive\.google\.com\/uc\?[^"']*id=([A-Za-z0-9_-]+)/);
  return m ? m[1] : null;
};

/** An embeddable URL for this link, or null if it is not one we can embed. */
const toEmbedUrl = (url) => {
  if (!url) return null;
  const clean = String(url).trim();
  const yt = youtubeId(clean);
  if (yt) return `https://www.youtube.com/embed/${yt}`;
  const drive = driveId(clean);
  if (drive) return `https://drive.google.com/file/d/${drive}/preview`;
  return null;
};

const CourseVideo = ({ url, title }) => {
  if (!url) {
    return (
      <p className="text-center text-xl text-gray-500">No video available</p>
    );
  }

  const embed = toEmbedUrl(url);

  if (embed) {
    return (
      // aspect-video keeps the 16:9 box without a fixed height, so it scales
      // from phone to desktop without letterboxing.
      <div className="w-full aspect-video rounded-lg shadow-md overflow-hidden bg-black">
        <iframe
          src={embed}
          title={title || "Course video"}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
      <p className="text-gray-600 mb-4">
        This course is hosted elsewhere.
      </p>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg"
      >
        Watch the course &rarr;
      </a>
      <p className="text-xs text-gray-400 mt-3 break-all">{url}</p>
    </div>
  );
};

CourseVideo.propTypes = {
  /** Link to the video, e.g. a YouTube or Google Drive URL. */
  url: PropTypes.string,
  title: PropTypes.string,
};

export default CourseVideo;
