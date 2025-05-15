type Props = {
    loginMethod: 'email' | 'phone_number';
    setLoginMethod: (method: 'email' | 'phone_number') => void;
};

export default function SelectMethod({ loginMethod, setLoginMethod }: Props) {
    return (
        <div className="relative mb-4 w-full bg-black rounded-full p-1 border border-[#A7FC00]">
            <div
                className={`absolute top-1 bottom-1 rounded-full bg-[#A7FC00] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    loginMethod === 'email'
                        ? 'left-1 right-1/2'
                        : 'left-1/2 right-1'
                }`}
            />
            <div className="relative flex z-10">
                <button
                    onClick={() => setLoginMethod('email')}
                    className={`flex-1 py-2 px-4 rounded-full font-semibold transition-colors duration-300 ${
                        loginMethod === 'email'
                            ? 'text-black'
                            : 'text-white hover:text-[#A7FC00]'
                    }`}
                >
                    Почта
                </button>
                <button
                    onClick={() => setLoginMethod('phone_number')}
                    className={`flex-1 py-2 px-4 rounded-full font-semibold transition-colors duration-300 ${
                        loginMethod === 'phone_number'
                            ? 'text-black'
                            : 'text-white hover:text-[#A7FC00]'
                    }`}
                >
                    Телефон
                </button>
            </div>
        </div>
    );
}
