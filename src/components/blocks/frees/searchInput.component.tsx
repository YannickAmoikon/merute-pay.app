import { Input } from "@/components/ui/input";

export default function SearchInput({ placeholder }: { placeholder: string }) {
	return (
		<>
			<Input placeholder={placeholder} className="max-w-xs h-9" />
		</>
	);
}
