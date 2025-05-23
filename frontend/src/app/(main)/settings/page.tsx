import SettingsMenu from "@/components/profile/settings/SettingMenu";
import ProfileButton from "@/components/profile/settings/ProfileButton";

export default function SettingsPage() {


    return (
        <div className="max-w-5xl mx-auto px-4 py-8 mb-10">
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-white">Настройки</h1>
                    <ProfileButton/>
                </div>

                <div className="rounded-3xl min-h-96">
                    <SettingsMenu/>
                </div>
            </div>
        </div>
    );
}
