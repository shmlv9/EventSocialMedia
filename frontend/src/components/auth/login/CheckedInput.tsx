type Props = {
    rememberMe: boolean;
    setRememberMe: (rememberMe: boolean) => void;
}


export default function CheckedInput({rememberMe, setRememberMe}: Props) {
    return (
        <div className="flex items-center justify-between">
        <div className="flex items-center">
            <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e): void => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Запомнить меня
            </label>
        </div>
    </div>
    );
}