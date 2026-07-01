import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary text-text-primary p-4">
      <div className="max-w-md w-full glass-card p-8 text-center rounded-3xl">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert size={32} />
        </div>
        <h1 className="text-2xl font-bold font-jakarta mb-2">Access Denied</h1>
        <p className="text-text-muted mb-8">
          You don't have the necessary permissions to access this page. If you believe this is an error, please contact your administrator.
        </p>
        <Link href="/" className="btn-primary w-full block">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
