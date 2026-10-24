import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="section section-canvas">
      <div className="empty-state">
        <h1 className="heading">Page not found.</h1>
        <p>The page you are looking for does not exist or has moved.</p>
        <Link to="/" className="btn btn-filled">
          Go to the home page
        </Link>
      </div>
    </section>
  );
}
