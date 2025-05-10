import Link from "next/link";
import SettingsMenu from "@/components/profile/SettingMenu";

export default async function SettingsPage() {
    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Настройки</h1>
                <Link
                    href="/home"
                    className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-3xl transition"
                    aria-label="Перейти на главную"
                    title="Домой"
                >
                    Домой
                </Link>
            </div>

            <div className="rounded-3xl p-6 min-h-96">
                <SettingsMenu />
            </div>
        </div>
    );
}
