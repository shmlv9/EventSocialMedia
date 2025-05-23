'use client'

type Value = {
    label: string;
    icon?: any;
    tab: string;
}

export default function NavSettings({
                                        values,
                                        activeTab,
                                        setActiveTab
                                    }: {
    values: Value[]
    activeTab: string,
    setActiveTab: (tab: string) => void
}) {
    return (
        <nav className="space-y-2">

            {values.map((value, index) => (
                <button
                    key={index}
                    onClick={() => setActiveTab(value.tab)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-3xl text-left transition-colors cursor-pointer ${
                        activeTab === value.tab
                            ? ' text-black bg-pink-500 font-medium'
                            : 'text-gray-400 hover:text-black'
                    }`}
                >
                    {value.icon ? value.icon : ''}
                    {value.label}
                </button>))}


        </nav>
    );
}