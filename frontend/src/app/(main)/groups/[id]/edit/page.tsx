'use client'

import SettingsGroupMenu from "@/components/groups/settings/SettingGroupMenu";
import Link from "next/link";
import {use} from "react"

export default function SettingsPage({params}: { params: Promise<{ id: string }> }) {
    const {id: groupId} = use(params)

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 mb-10">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-black">Настройки</h1>
                    <Link
                        href={`/groups/${groupId}`}
                        className="inline-block bg-black text-white text-sm font-medium px-4 py-2 rounded-3xl  hover:border-lime-400 hover:text-lime-400 transition-colors"
                        aria-label="Настройки"
                    >
                        Назад
                    </Link>
                </div>
                <div className="rounded-3xl min-h-96">
                    <SettingsGroupMenu id={groupId}/>
                </div>
        </div>
    );
}
