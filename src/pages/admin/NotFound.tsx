
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function AdminNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Admin page not found</p>
        <p className="text-gray-500 mb-8">
          The admin page you were looking for doesn't exist or you may not have access to it.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to="/admin">Admin Dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">Return to Website</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
