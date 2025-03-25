"use client"

import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Dialog } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function CreateUserAgentDialog() {
    const [showDialog, setShowDialog] = useState(false)
	return (
		<>
			<Button onClick={() => setShowDialog(!showDialog)} size="sm">
				<Plus className="mr-2 h-4 w-4" />
				Nouvel agent
			</Button>
			<Dialog modal open={showDialog} onOpenChange={setShowDialog}>
				<DialogContent
					onInteractOutside={(event) => {
						event.preventDefault();
					}}
				>
					<DialogHeader>
						<DialogTitle>Ajouter un agent</DialogTitle>
						<DialogDescription>
							Remplissez les informations pour ajouter un nouvel agent.
						</DialogDescription>
					</DialogHeader>
					{/* Formulaire d'ajout d'agent ici */}
				</DialogContent>
			</Dialog>
		</>
	);
}
