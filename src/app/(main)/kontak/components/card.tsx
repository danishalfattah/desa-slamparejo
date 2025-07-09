type CardProps = {
    title: string;
    description: string;
//    contactInfo: string;
//    link: string;
    buttonText: string;
};

export function Card({
    title,
    description,
//    contactInfo,
//    link,
    buttonText,
}: CardProps) {
    return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col justify-between">
        <div>
            <div className="bg-[#094B7296] rounded-lg w-40 mx-auto justify-center">
                <h3 className="font-bold text-lg mb-2 text-center text-white">{title}</h3>
            </div>
            <p className="text-xs mb-4 text-center text-black">{description}</p>
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