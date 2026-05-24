import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UserCircle, Mail, Phone, MapPin, Shield } from "lucide-react";

export const metadata = {
  title: "My Profile | Vidi",
  description: "Manage your account settings and preferences.",
};

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/login?callbackUrl=/profile");
  }

  const { user } = session;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <h1 className="text-3xl font-heading font-bold mb-8">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 text-center">
            <div className="w-24 h-24 bg-maroon-100 dark:bg-maroon-900/30 text-maroon-800 dark:text-maroon-300 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-gray-500 text-sm mt-1">{user.email}</p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300">
              <Shield className="w-3.5 h-3.5" />
              {user.role}
            </div>
          </div>

          <nav className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800 space-y-1">
            <a href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-maroon-50 dark:bg-maroon-900/20 text-maroon-800 dark:text-maroon-400 font-medium">
              <UserCircle className="w-5 h-5" />
              Personal Info
            </a>
            <a href="/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors">
              <PackageIcon className="w-5 h-5" />
              My Orders
            </a>
            <a href="/wishlist" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors">
              <HeartIcon className="w-5 h-5" />
              Wishlist
            </a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-bold mb-6">Personal Information</h3>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                  <div className="relative">
                    <UserCircle className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      defaultValue={user.name}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                  <div className="relative">
                    <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="email" 
                      defaultValue={user.email}
                      disabled
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="tel" 
                      placeholder="+91"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button type="button" className="px-6 py-2.5 bg-maroon-800 hover:bg-maroon-900 text-white font-medium rounded-lg transition-colors">
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Saved Addresses</h3>
              <button className="text-sm font-medium text-maroon-700 dark:text-maroon-400 hover:underline">
                + Add New
              </button>
            </div>
            
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
              <MapPin className="w-8 h-8 mx-auto mb-3 text-gray-400" />
              <p>No addresses saved yet.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PackageIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
  );
}

function HeartIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
  );
}
