import { Settings, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Settings className="w-8 h-8 text-maroon-700" />
            Store Settings
          </h1>
          <p className="text-gray-500 mt-1">Manage your platform configurations and general settings.</p>
        </div>
        <Button className="bg-maroon-700 hover:bg-maroon-800 text-white">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-6">
        <div className="space-y-4 max-w-2xl">
          <div className="space-y-2">
            <Label htmlFor="storeName">Store Name</Label>
            <Input id="storeName" defaultValue="Vidi Sarees" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input id="contactEmail" type="email" defaultValue="support@vidi.store" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhone">Support Phone</Label>
            <Input id="contactPhone" type="tel" defaultValue="+91 98765 43210" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Store Address</Label>
            <Input id="address" defaultValue="123 Silk Board Road, Bangalore, India" />
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-6">
        <h2 className="text-xl font-semibold">Payment Settings</h2>
        <div className="space-y-4 max-w-2xl">
          <div className="space-y-2">
            <Label htmlFor="currency">Default Currency</Label>
            <Input id="currency" defaultValue="INR (₹)" disabled />
          </div>
        </div>
      </div>
    </div>
  );
}
