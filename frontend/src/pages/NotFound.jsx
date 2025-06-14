import { Link } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';

export default function NotFound() {
  return (
    <PageWrapper>
      <div className="text-center mt-20">
        <h1 className="text-4xl font-bold text-red-600">404 – Page Not Found</h1>
        <p className="mt-4 text-gray-600">Oops! We couldn’t locate that page.</p>
        <Link to="/" className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Back to Home
        </Link>
      </div>
    </PageWrapper>
  );
}
