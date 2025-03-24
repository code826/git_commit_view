import { Link } from "react-router-dom";
import "../InfoPage.css";

const InfoPage = () => {
  return (
    <div className="info-container">
      <h2>Invalid URL</h2>
      <p>This app has only one valid URL format:</p>
      <div className="url-box">
        <Link to="/repositories/code826/inventory_management/commits/7599c4f353e6b1b3bb19287eb39f65de58c5cef9">
          http://localhost:5173/repositories/owner/repo/commits/commitId
        </Link>
      </div>
      <p>Click the link above to navigate to a valid commit page.</p>

      <div className="info-details">
        <h3>What do these terms mean?</h3>
        <ul>
          <li>
            <strong>Owner:</strong> The GitHub user or organization that owns the repository.
          </li>
          <li>
            <strong>Repo:</strong> The name of the GitHub repository.
          </li>
          <li>
            <strong>Commit ID:</strong> A unique SHA identifier for a specific commit in the repository.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default InfoPage;
