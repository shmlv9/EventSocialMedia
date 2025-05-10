import SettingsMenu from "@/components/profile/settings/SettingMenu";
import ProfileButton from "@/components/profile/settings/ProfileButton";

export default function SettingsPage() {


    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Настройки</h1>
                <ProfileButton/>
            </div>

            <div className="rounded-3xl p-6 min-h-96">
                <SettingsMenu/>
            </div>
        </div>
    );
}
