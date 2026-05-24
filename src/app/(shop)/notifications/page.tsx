import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Bell, Package, Tag, ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Notifications | Vidi",
};

function getIconForType(type: string) {
  switch (type.toLowerCase()) {
    case "order": return <Package className="w-5 h-5 text-blue-600" />;
    case "promo": return <Tag className="w-5 h-5 text-green-600" />;
    case "alert": return <ShieldAlert className="w-5 h-5 text-red-600" />;
    default: return <Bell className="w-5 h-5 text-maroon-600" />;
  }
}

export default async function NotificationsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    redirect("/login?callbackUrl=/notifications");
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-heading font-bold flex items-center gap-3">
          <Bell className="w-8 h-8 text-maroon-800 dark:text-maroon-400" />
          Notifications
        </h1>
        {notifications.some(n => !n.isRead) && (
          <button className="text-sm font-medium text-maroon-700 hover:underline">
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-700" />
            <p className="text-lg font-medium text-gray-900 dark:text-white">You're all caught up!</p>
            <p className="mt-1">You have no new notifications.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-6 flex gap-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${!notification.isRead ? 'bg-maroon-50/50 dark:bg-maroon-900/10' : ''}`}
            >
              <div className="shrink-0 mt-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${!notification.isRead ? 'bg-white dark:bg-gray-800 shadow-sm' : 'bg-gray-100 dark:bg-gray-800'}`}>
                  {getIconForType(notification.type)}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start gap-4">
                  <h3 className={`font-medium ${!notification.isRead ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-700 dark:text-gray-300'}`}>
                    {notification.title}
                  </h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className={`mt-1 text-sm ${!notification.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500'}`}>
                  {notification.message}
                </p>
                {notification.link && (
                  <a href={notification.link} className="inline-block mt-3 text-sm font-medium text-maroon-700 dark:text-maroon-400 hover:underline">
                    View Details
                  </a>
                )}
              </div>
              {!notification.isRead && (
                <div className="shrink-0 flex items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-maroon-600"></div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
