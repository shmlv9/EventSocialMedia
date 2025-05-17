'use client'

import React from 'react';
import ImageUploader from "@/components/ui/ImageUploader";

export default function MessengerPage() {
    return (
        <div>
            <ImageUploader
                onUpload={(file) => {
                    const formData = new FormData()
                    formData.append('image', file)
                    console.log(formData)
                }}
            />

        </div>
    );
};