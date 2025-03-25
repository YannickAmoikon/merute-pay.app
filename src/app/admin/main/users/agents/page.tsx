"use client"

import TitleAndDescriptionComponent from "@/components/blocks/titlesAndDescriptions/titleAndDescription.component";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MoreHorizontal,
  Trash2,
  FilePenLine,
  ListCollapse,
  SquareX,
  SquareCheck,
} from "lucide-react";
import CreateUserAgentDialog from "@/components/blocks/users/agent/createUserDialog.component";
import ExportButton from "@/components/blocks/frees/exportButton.component";
import FilterButton from "@/components/blocks/frees/filterButton.component";
import SearchInput from "@/components/blocks/frees/searchInput.component";
import { useState } from "react";
import PaginationForAll from "@/components/blocks/frees/pagination.component";

interface User {
  id: number;
  name: string;
  status: string;
  email: string;
}

const allAgents: User[] = [
  { id: 1, name: "Jean Dupont", status: "Actif", email: "jean.dupont@example.com" },
  { id: 2, name: "Marie Curie", status: "Inactif", email: "marie.curie@example.com" },
  { id: 3, name: "Paul Martin", status: "Actif", email: "paul.martin@example.com" },
  { id: 4, name: "Sophie Durand", status: "Actif", email: "sophie.durand@example.com" },
  { id: 5, name: "Lucie Petit", status: "Inactif", email: "lucie.petit@example.com" },
  { id: 6, name: "Julien Blanc", status: "Actif", email: "julien.blanc@example.com" },
  { id: 7, name: "Émilie Roux", status: "Actif", email: "emilie.roux@example.com" },
  { id: 8, name: "Nicolas Fabre", status: "Inactif", email: "nicolas.fabre@example.com" },
  { id: 9, name: "Camille Moreau", status: "Actif", email: "camille.moreau@example.com" },
  { id: 10, name: "Thomas Leroy", status: "Actif", email: "thomas.leroy@example.com" },
  { id: 11, name: "Laura Morel", status: "Inactif", email: "laura.morel@example.com" },
  { id: 12, name: "Antoine Girard", status: "Actif", email: "antoine.girard@example.com" },
  { id: 13, name: "Sarah Lambert", status: "Actif", email: "sarah.lambert@example.com" },
  { id: 14, name: "David Perrot", status: "Inactif", email: "david.perrot@example.com" },
  { id: 15, name: "Julie Faure", status: "Actif", email: "julie.faure@example.com" },
  { id: 16, name: "Mathieu Roche", status: "Actif", email: "mathieu.roche@example.com" },
  { id: 17, name: "Chloé Meunier", status: "Inactif", email: "chloe.meunier@example.com" },
  { id: 18, name: "Alexandre Colin", status: "Actif", email: "alexandre.colin@example.com" },
  { id: 19, name: "Manon Gauthier", status: "Actif", email: "manon.gauthier@example.com" },
  { id: 20, name: "Romain Leclerc", status: "Inactif", email: "romain.leclerc@example.com" },
  { id: 21, name: "Elodie Marchand", status: "Actif", email: "elodie.marchand@example.com" },
  { id: 22, name: "Benoît Chevalier", status: "Actif", email: "benoit.chevalier@example.com" },
  { id: 23, name: "Caroline Francois", status: "Inactif", email: "caroline.francois@example.com" },
  { id: 24, name: "Guillaume Mercier", status: "Actif", email: "guillaume.mercier@example.com" },
  { id: 25, name: "Aurélie Dufour", status: "Actif", email: "aurelie.dufour@example.com" },
  { id: 26, name: "Vincent Barbier", status: "Inactif", email: "vincent.barbier@example.com" },
  { id: 27, name: "Céline Lemoine", status: "Actif", email: "celine.lemoine@example.com" },
  { id: 28, name: "Sébastien Roussel", status: "Actif", email: "sebastien.roussel@example.com" },
  { id: 29, name: "Valérie Garnier", status: "Inactif", email: "valerie.garnier@example.com" },
  { id: 30, name: "Maxime Schmitt", status: "Actif", email: "maxime.schmitt@example.com" },
  { id: 31, name: "Audrey Noel", status: "Actif", email: "audrey.noel@example.com" },
  { id: 32, name: "Jérémy Perrier", status: "Inactif", email: "jeremy.perrier@example.com" },
  { id: 33, name: "Charlotte Mayer", status: "Actif", email: "charlotte.mayer@example.com" },
  { id: 34, name: "Damien Weber", status: "Actif", email: "damien.weber@example.com" },
  { id: 35, name: "Fanny Muller", status: "Inactif", email: "fanny.muller@example.com" },
  { id: 36, name: "Hugo Schneider", status: "Actif", email: "hugo.schneider@example.com" },
  { id: 37, name: "Léa Fischer", status: "Actif", email: "lea.fischer@example.com" },
  { id: 38, name: "Quentin Keller", status: "Inactif", email: "quentin.keller@example.com" },
  { id: 39, name: "Zoé Wagner", status: "Actif", email: "zoe.wagner@example.com" },
  { id: 40, name: "Rémi Otto", status: "Actif", email: "remi.otto@example.com" },

];

export default function UserAgentManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAgents = allAgents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(allAgents.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <main className="flex flex-col h-full w-full">
      <TitleAndDescriptionComponent
        title="Gestion des agents"
        description="Consultez et gérez les informations de vos agents."
      />

      <div className="flex flex-col space-y-6 py-4 h-full">
        {/* Barre d'outils : Recherche, Filtres, Bouton d'ajout */}
        <div className="flex justify-between items-center">
          <SearchInput placeholder="Rechercher un agent..."/>
          <div className="flex space-x-3">
            <FilterButton/>
            <ExportButton/>
            <CreateUserAgentDialog/>
          </div>
        </div>

        {/* Tableau des agents */}
        <div className="flex-1 overflow-auto">
          <Table className="border-y">
            <TableHeader className="bg-primary/5">
              <TableRow>
                <TableHead className="font-semibold">#</TableHead>
                <TableHead className="font-semibold">Nom complet</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Statut</TableHead>
                <TableHead className="font-semibold text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentAgents.map((agent, index) => (
                <TableRow
                  key={agent.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-medium">{indexOfFirstItem + index + 1}</TableCell>
                  <TableCell className="font-medium">{agent.name}</TableCell>
                  <TableCell className="font-medium">{agent.email}</TableCell>
                  <TableCell>
                    <span
                      className={`px-3 rounded-sm text-sm font-medium flex items-center space-x-2 ${
                        agent.status === "Actif"
                          ? " text-green-600"
                          : "text-destructive"
                      }`}
                    >
                      {agent.status === "Actif" ? (
                        <SquareCheck size={20} />
                      ) : (
                        <SquareX size={20} />
                      )}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer">
                          <ListCollapse size={14} className="mr-2" />
                          <span>Détails</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <FilePenLine size={14} className="mr-2" />
                          <span>Modifier</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-destructive">
                          <Trash2 size={14} className="mr-2" />
                          <span>Supprimer</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <PaginationForAll
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={allAgents.length}
          onPageChange={handlePageChange}
          className="mt-4"
        />
      </div>
    </main>
  );
}