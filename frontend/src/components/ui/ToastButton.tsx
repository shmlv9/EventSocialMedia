'use client'

import React from 'react';
import toast from 'react-hot-toast';

type Props = {
    msg: string
}

export default function ToastButton({msg}: Props) {
    return (
        <button className={'text-white bg-emerald-600 rounded-3xl'} onClick={() => toast.success(msg)}>Тык</button>
    );
};