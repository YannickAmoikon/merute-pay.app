export default function TitleAndDescriptionComponent({ title, description }: { title: string; description?: string }) {
    return (
        <div className="flex py-2 flex-col space-y-2">
            <h2 className="text-[17px] font-medium text-gray-800">
                {title}
            </h2>
            {description && (
                <p className="text-gray-600 text-sm">
                    {description}
                </p>
            )}
        </div>
    );
}