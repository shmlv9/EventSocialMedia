import Link from 'next/link';
import React from 'react';
import { CiSettings } from 'react-icons/ci';

export default function SettingsGroupButton({groupId}: { groupId: string }) {
    return (
        <div>
            <Link
                href={`/groups/${groupId}/edit`}
                className="m-3 p-2"
                aria-label="Настройки"
            >
                <CiSettings className="text-3xl text-lime-400 hover:text-lime-600" />
            </Link>
        </div>
    );
};