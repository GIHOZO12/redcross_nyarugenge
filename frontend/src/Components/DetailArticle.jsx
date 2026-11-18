import PropTypes from "prop-types";
import { Link } from "react-router-dom";

/**
 * The shared shape of a public detail page: a back link, a hero image, the
 * title with its date, and the full body text.
 *
 * Fellowships, Red Cross activities and family activities all read the same
 * way and differ only in their field names, so the three pages hand their
 * values here rather than each repeating this markup.
 */
const DetailArticle = ({
  backTo,
  backLabel,
  image,
  title,
  meta,
  body,
  children,
}) => (
  <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 sm:px-6">
    <div className="max-w-4xl mx-auto">
      <Link to={backTo} className="text-sm text-blue-700 underline">
        ← {backLabel}
      </Link>

      <article className="bg-white rounded-lg shadow-lg overflow-hidden mt-4">
        {image && (
          <img
            src={image}
            alt={title}
            className="w-full h-72 sm:h-96 object-cover"
          />
        )}
        <div className="p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {meta && <p className="text-sm text-gray-500 mt-1">{meta}</p>}
          {/* whitespace-pre-line so paragraph breaks in the text survive */}
          <p className="text-gray-700 mt-6 leading-relaxed whitespace-pre-line">
            {body}
          </p>
        </div>
      </article>

      {children}
    </div>
  </div>
);

DetailArticle.propTypes = {
  backTo: PropTypes.string.isRequired,
  backLabel: PropTypes.string.isRequired,
  image: PropTypes.string,
  title: PropTypes.string,
  meta: PropTypes.string,
  body: PropTypes.string,
  /** Anything shown below the article, such as a gallery. */
  children: PropTypes.node,
};

export default DetailArticle;
