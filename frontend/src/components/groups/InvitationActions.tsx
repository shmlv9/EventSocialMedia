'use client'

import {useRouter} from 'next/navigation'
import toast from 'react-hot-toast'
import {FiCheck, FiX} from 'react-icons/fi'
import {acceptInvite} from "@/lib/api/groups/apiInvites";

export default function InvitationActions({groupId, token}: { groupId: number, token: string }) {
    const router = useRouter()

    const handleAccept = async () => {
        try {
            const accept = await acceptInvite(token);
            if (accept) {
                toast.success('Вы успешно присоеденились к группе')
                router.push(`/groups/${groupId}`)
            }
        } catch (e) {
            toast.error('Произошла ошибка. Попробуйте позже')
        }
    }

    const handleDecline = () => {

        router.push('/groups')
    }

    return (
        <div className="flex space-x-4">
            <button
                onClick={handleDecline}
                className="flex-1 flex cursor-pointer items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors font-medium"
            >
                <FiX className="text-lg"/>
                Отклонить
            </button>
            <button
                onClick={handleAccept}
                className="cursor-pointer flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-lime-400 text-gray-900 hover:bg-lime-500 transition-colors font-medium"
            >
                <FiCheck className="text-lg"/>
                Принять
            </button>
        </div>
    )
}