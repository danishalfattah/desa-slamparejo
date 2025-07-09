type CardProps = {
    title: string;
    description: string;
    contactInfo: string;
    link: string;
    buttonText: string;
};

export function Card({
    title,
    description,
    contactInfo,
    link,
    buttonText,
}: CardProps) {
    return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col justify-between">
        <div>
            <h3 className="font-bold text-lg mb-2 text-[#0B4973]">{title}</h3>
            <p className="text-gray-600 text-sm mb-4">{description}</p>
        </div>
        <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto"
        >
            <button
            type="button"
            className="w-full bg-[#0B4973] text-white rounded px-4 py-2 font-semibold hover:bg-[#09395a] transition"
            >
            {buttonText}
            </button>
        </a>
    </div>
    )
}