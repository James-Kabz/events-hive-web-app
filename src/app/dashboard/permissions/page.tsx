import PermissionList from "@/components/PermissionList";

export default function PermissionsPage() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-semibold mb-6">Permissions Management</h1>
            <PermissionList />
        </div>
    );
}