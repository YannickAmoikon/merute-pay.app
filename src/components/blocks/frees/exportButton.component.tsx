import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FileDown } from "lucide-react";

export default function ExportButton() {
    return (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">
                <FileDown className="mr-2 h-4 w-4" />
                Exporter
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuCheckboxItem>PDF</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Excel</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
    </DropdownMenu>
    )
}