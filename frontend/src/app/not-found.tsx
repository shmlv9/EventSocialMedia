import Link from "next/link";

export default function notFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <Link className='px-6 py-3 text-black' href="/">Return Home</Link>

        </div>
    );
}