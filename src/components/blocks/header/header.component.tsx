import {
	LayoutDashboard,
	Users,
	CreditCard,
	Settings,
	FileText,
	Bell,
	LandPlot,
	BarChart3,
	ShieldCheck,
	Wallet,
	LogOut,
	CircleDashed,
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { toast } from "sonner";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth";


export default function Header() {
	const [showMenu, setShowMenu] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [showLogoutDialog, setShowLogoutDialog] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const pathname = usePathname();
	const router = useRouter();

	const menuItems = [
		{ icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
		{ icon: Users, label: "Utilisateurs", href: "/admin/users" },
		{ icon: CreditCard, label: "Transactions", href: "/admin/transactions" },
		{ icon: FileText, label: "Rapports", href: "/admin/reports" },
		{ icon: LandPlot, label: "Marchands", href: "/admin/sellers" },
		{ icon: BarChart3, label: "Statistiques", href: "/admin/statistics" },
		{ icon: ShieldCheck, label: "Sécurité", href: "/admin/security" },
		{ icon: Wallet, label: "Finance", href: "/admin/finance" },
	];

	const filteredItems = menuItems.filter((item) =>
		item.label.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const checkMobile = useCallback(() => {
		setIsMobile(window.innerWidth < 768);
	}, []);

	useEffect(() => {
		checkMobile();
		let resizeTimer: NodeJS.Timeout;
		const handleResize = () => {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(checkMobile, 100);
		};

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
			clearTimeout(resizeTimer);
		};
	}, [checkMobile]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target as Node) &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target as Node)
			) {
				setShowMenu(false);
				setSearchTerm("");
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		setShowMenu(false);
		setSearchTerm("");
	}, [pathname]);

	const handleLogout = async () => {
		try {
			setIsLoggingOut(true);
			const loadingToast = toast.loading("Déconnexion en cours...");
			
			await logout();
			
			toast.dismiss(loadingToast);
			toast.success("Déconnexion réussie", {
				description: "À bientôt sur Merute Pay !",
				duration: 3000,
			});

			setShowLogoutDialog(false);
			
			// Attendre que le toast soit visible
			await new Promise(resolve => setTimeout(resolve, 500));
			
			router.push("/admin/login");
			router.refresh();
		} catch (error) {
			toast.error("Erreur lors de la déconnexion", {
				description: "Veuillez réessayer",
				duration: 4000,
			});
			console.error("Erreur lors de la déconnexion:", error);
		} finally {
			setIsLoggingOut(false);
		}
	};

	const DesktopMenu = () => (
		<div className="space-y-2">
			<div className="relative">
				<Search
					className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
					size={18}
				/>
				<Input
					autoFocus
					placeholder="Rechercher un module..."
					className="pl-10"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>
			<div className="grid grid-cols-4 gap-2">
				{filteredItems.map((item, index) => (
					<Link
						key={index}
						href={item.href}
						className={`flex flex-col items-center p-2.5 hover:bg-slate-100 rounded-sm transition-colors text-center group ${
							pathname === item.href ? "bg-slate-100" : ""
						}`}
					>
						<item.icon
							className={`${
								pathname === item.href ? "text-slate-900" : "text-slate-700"
							} group-hover:scale-110 transition-transform`}
							size={22}
						/>
						<span
							className={`font-medium mt-1.5 text-xs ${
								pathname === item.href ? "text-slate-900" : ""
							}`}
						>
							{item.label}
						</span>
					</Link>
				))}
			</div>
		</div>
	);

	return (
		<>
			{!isMobile ? (
				<div className="relative">
					<div className="h-14 shadow w-full flex px-10">
						<div className="w-2/12 flex items-center justify-start">
							<button
								ref={buttonRef}
								onClick={() => setShowMenu(!showMenu)}
								className="hover:opacity-70 flex space-x-2 items-center justify-center transition-opacity"
							>
								<LayoutDashboard className="text-neutral-600" size={24} />
								<span className="text-neutral-600 text-xs">
									Menu d'applications
								</span>
							</button>
						</div>
						<div className="flex w-10/12 justify-end items-center space-x-6">
							<button className="hover:opacity-70 flex space-x-2 items-center justify-center transition-opacity">
                                <span className="text-neutral-600 text-xs">Notifications</span>
								<Bell size={20} className="text-neutral-600" />
							</button>
							<button className="hover:opacity-70 flex space-x-2 items-center justify-center transition-opacity">
                            <span className="text-neutral-600 text-xs">Paramètres</span>
								<Settings size={20} className="text-neutral-600" />
							</button>
							<DropdownMenu>
								<DropdownMenuTrigger className="outline-none">
									<Avatar className="h-8 w-8">
										<AvatarImage
											src="https://github.com/shadcn.png"
											alt="@shadcn"
											width={1000}
											height={1000}
											className="size-8"
										/>
										<AvatarFallback>AY</AvatarFallback>
									</Avatar>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-48">
									<DropdownMenuLabel className="font-normal">
										<div className="flex flex-col space-y-1">
											<p className="text-sm font-medium">Admin</p>
											<p className="text-xs text-neutral-500">admin@merute.dev</p>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem 
										className="text-red-600 cursor-pointer"
										onClick={() => setShowLogoutDialog(true)}
									>
										<LogOut className="mr-2 h-4 w-4" />
										<span>Déconnexion</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					{showMenu && (
						<div
							ref={menuRef}
							className="absolute top-14 left-0 w-[480px] bg-white shadow-lg border rounded-br-md transition-all duration-200 ease-in-out z-50"
						>
							<div className="p-4">
								<DesktopMenu />
							</div>
						</div>
					)}
				</div>
			) : (
				<>
					{/* Header Mobile */}
					<div className="fixed top-0 left-0 right-0 bg-white border-b shadow-sm z-50">
						<div className="h-14 flex items-center justify-between px-4">
							<div className="flex items-center space-x-2">
								<Image
									src="/pictures/logo.png"
									alt="Logo"
									width={28}
									height={28}
									className="object-contain"
								/>
								<span className="font-semibold text-sm">MERUTE PAY</span>
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger className="outline-none">
									<Avatar className="h-7 w-7">
										<AvatarImage
											src="https://github.com/shadcn.png"
											alt="@shadcn"
											width={1000}
											height={1000}
											className="size-7"
										/>
										<AvatarFallback>AY</AvatarFallback>
									</Avatar>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-48">
									<DropdownMenuLabel className="font-normal">
										<div className="flex flex-col space-y-1">
											<p className="text-sm font-medium">Admin</p>
											<p className="text-xs text-neutral-500">admin@merute.dev</p>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem 
										className="text-red-600 cursor-pointer"
										onClick={() => setShowLogoutDialog(true)}
									>
										<LogOut className="mr-2 h-4 w-4" />
										<span>Déconnexion</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
					{/* Ajout d'un espace pour compenser le header fixe */}
					<div className="h-14" />

					{/* Navigation Mobile */}
					<div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
						<div className="flex items-center justify-between h-16 px-6 overflow-x-auto no-scrollbar touch-pan-x">
							{menuItems.map((item, index) => (
								<Link
									key={index}
									href={item.href}
									className={`flex items-center justify-center min-w-[48px] h-12 ${
										pathname === item.href ? "bg-slate-100" : ""
									} hover:bg-slate-100 transition-all group`}
								>
									<item.icon
										className={`${
											pathname === item.href
												? "text-slate-900 scale-110"
												: "text-slate-600"
										} group-hover:text-slate-900 group-hover:scale-110 transition-all`}
										size={24}
									/>
								</Link>
							))}
						</div>
					</div>
				</>
			)}

			<Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle className="text-md">Confirmation de déconnexion</DialogTitle>
						<DialogDescription className="text-sm">
							Êtes-vous sûr de vouloir vous déconnecter de votre compte ?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="flex space-x-2 justify-end">
						<Button
							size="sm"
							variant="outline"
							onClick={() => setShowLogoutDialog(false)}
							disabled={isLoggingOut}
						>
							Annuler
						</Button>
						<Button
							size="sm"
							variant="destructive"
							onClick={handleLogout}
							disabled={isLoggingOut}
							className="min-w-[120px]"
						>
							{isLoggingOut ? (
								<>
									<CircleDashed className="mr-2 h-4 w-4 animate-spin" />
									<span>Déconnexion...</span>
								</>
							) : (
								<>
								    <span>Se déconnecter</span>
								</>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<style jsx global>{`
				.no-scrollbar {
					-ms-overflow-style: none;
					scrollbar-width: none;
				}
				.no-scrollbar::-webkit-scrollbar {
					display: none;
				}
			`}</style>
		</>
	);
}
