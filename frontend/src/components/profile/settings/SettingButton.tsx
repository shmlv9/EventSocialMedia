'use client'

import Link from 'next/link';
import React, {} from 'react';
import {CiSettings} from 'react-icons/ci';

export default function SettingButton() {

    return (
        <div className={'max-h-10'}>
                <Link href='/settings'
                      className='m-3 p-2 rounded-full active:scale-70 duration-200 hover:text-emerald-900 hover:scale-105'>
                    <CiSettings className='text-3xl text-emerald-700'/>
                </Link>
        </div>
    );
};