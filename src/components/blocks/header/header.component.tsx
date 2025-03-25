"use client";

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
    Layers,
    Menu,
    Search,
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { logout } from "@/app/actions/auth";

// Shadcn UI Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerFooter,
    DrawerTrigger,
} from "@/components/ui/drawer";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Header() {
    const [showMenu, setShowMenu] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);

    const hasSidebar = pathname.includes('/admin/main/users');

    const menuItems = [
        { icon: LayoutDashboard, label: "Accueil", href: "/admin/main" },
        { icon: Users, label: "Utilisateurs", href: "/admin/main/users/general" },
        { icon: CreditCard, label: "Transactions", href: "/admin/main/transactions" },
        { icon: FileText, label: "Rapports", href: "/admin/reports" },
        { icon: LandPlot, label: "Marchands", href: "/admin/sellers" },
        { icon: BarChart3, label: "Statistiques", href: "/admin/statistics" },
        { icon: ShieldCheck, label: "Sécurité", href: "/admin/security" },
        { icon: Wallet, label: "Finance", href: "/admin/finance" },
    ];

    const notifications = [
        { id: 1, title: "Nouvelle transaction", description: "Un utilisateur a effectué un paiement", time: "Il y a 2 minutes", read: false },
        { id: 2, title: "Mise à jour système", description: "Une nouvelle version est disponible", time: "Il y a 1 heure", read: true },
        { id: 3, title: "Demande de vérification", description: "Un marchand a soumis ses documents", time: "Il y a 3 heures", read: false },
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

    const filteredItems = menuItems.filter((item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const checkMobile = useCallback(() => {
        setIsMobile(window.innerWidth < 768);
    }, []);

    useEffect(() => {
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, [checkMobile]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
                menuButtonRef.current && !menuButtonRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
            await new Promise((resolve) => setTimeout(resolve, 500));
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

    const toggleSidebar = () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        if (window.toggleSidebar && typeof window.toggleSidebar === 'function') {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            window.toggleSidebar();
        }
    };

    const DesktopMenu = () => (
        <div
            ref={menuRef}
            className="absolute top-14 left-0 w-[480px] bg-white shadow-lg border rounded-br-md z-50"
        >
            <div className="p-4 space-y-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <Input
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
                            className={`flex flex-col items-center p-2.5 hover:bg-slate-100 rounded-sm transition-colors text-center ${
                                pathname === item.href ? "bg-slate-100" : ""
                            }`}
                            onClick={() => setShowMenu(false)}
                        >
                            <item.icon
                                className={`${
                                    pathname === item.href ? "text-slate-900" : "text-slate-700"
                                } group-hover:scale-110 transition-transform`}
                                size={22}
                            />
                            <span className={`font-medium mt-1.5 text-xs ${
                                pathname === item.href ? "text-slate-900" : ""
                            }`}>
                {item.label}
              </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <TooltipProvider>
            {/* Desktop Header */}
            {!isMobile ? (
                <div className="relative">
                    <div className="h-14 border-b text-white bg-primary w-full flex px-5">
                        <div className="w-3/12 flex items-center justify-start">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        ref={menuButtonRef}
                                        onClick={() => setShowMenu(!showMenu)}
                                        className="hover:opacity-70 flex space-x-2 items-center justify-center transition-opacity"
                                    >
                                        <Layers size={24} />
                                        <span className="text-sm">{"Menu d'applications"}</span>
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Ouvrir le menu</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <div className="flex w-9/12 justify-end items-center space-x-6">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Drawer direction="right">
                                        <DrawerTrigger asChild>
                                            <button className="hover:opacity-70 flex space-x-2 items-center justify-center transition-opacity relative">
                                                <span className="text-sm">Notifications</span>
                                                <Bell size={20} />
                                                {unreadCount > 0 && (
                                                    <Badge className="absolute bg-white text-primary hover:bg-white -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center">
                                                        {unreadCount}
                                                    </Badge>
                                                )}
                                            </button>
                                        </DrawerTrigger>
                                        <DrawerContent className="h-full top-0 right-0 left-auto mt-0 w-[400px] rounded-none">
                                            <div className="flex flex-col h-full">
                                                <DrawerHeader className="border-b px-6 py-4">
                                                    <DrawerTitle className="text-lg flex items-center gap-2">
                                                        <Bell className="h-5 w-5" />
                                                        <span>Notifications</span>
                                                        {unreadCount > 0 && (
                                                            <Badge className="ml-2 bg-primary text-primary-foreground">
                                                                {unreadCount} non lues
                                                            </Badge>
                                                        )}
                                                    </DrawerTitle>
                                                </DrawerHeader>

                                                <ScrollArea className="flex-1 px-4 py-2">
                                                    <div className="space-y-3">
                                                        {notifications.map((notification) => (
                                                            <div
                                                                key={notification.id}
                                                                className={`p-4 rounded-lg transition-all ${
                                                                    !notification.read
                                                                        ? 'bg-primary/5 border border-primary/10 shadow-sm'
                                                                        : 'bg-muted/50 border border-muted'
                                                                }`}
                                                            >
                                                                <div className="flex items-start gap-3">
                                                                    {!notification.read && (
                                                                        <div className="h-2 w-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                                                                    )}
                                                                    <div className="flex-1">
                                                                        <div className="flex justify-between items-start">
                                                                            <h3 className={`font-medium ${
                                                                                !notification.read ? 'text-primary' : 'text-foreground'
                                                                            }`}>
                                                                                {notification.title}
                                                                            </h3>
                                                                            <span className={`text-xs ${
                                                                                !notification.read ? 'text-primary/60' : 'text-muted-foreground'
                                                                            }`}>
                                        {notification.time}
                                      </span>
                                                                        </div>
                                                                        <p className={`mt-1 text-sm ${
                                                                            !notification.read ? 'text-primary/80' : 'text-muted-foreground'
                                                                        }`}>
                                                                            {notification.description}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </ScrollArea>

                                                <DrawerFooter className="border-t px-6 py-4">
                                                    <div className="flex justify-between items-center w-full">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-muted-foreground hover:text-primary"
                                                        >
                                                            Tout effacer
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            className="border-primary/20 hover:bg-primary/5 hover:text-primary"
                                                        >
                                                            Marquer tout comme lu
                                                        </Button>
                                                    </div>
                                                </DrawerFooter>
                                            </div>
                                        </DrawerContent>
                                    </Drawer>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Notifications</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button className="hover:opacity-70 flex space-x-2 items-center justify-center transition-opacity">
                                        <span className="text-sm">Paramètres</span>
                                        <Settings size={20} />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Paramètres</p>
                                </TooltipContent>
                            </Tooltip>

                            <DropdownMenu>
                                <DropdownMenuTrigger className="outline-none">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="/pictures/admin.png" alt="Admin" />
                                        <AvatarFallback>AD</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium">Admin</p>
                                            <p className="text-xs">admin@merute.dev</p>
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

                    {showMenu && <DesktopMenu />}
                </div>
            ) : (
                <>
                    {/* Mobile Header */}
                    <div className="fixed top-0 left-0 right-0 bg-white border-b shadow-sm z-50">
                        <div className="h-14 flex items-center justify-between px-4">
                            <div className="flex items-center space-x-2">
                                {hasSidebar && (
                                    <button
                                        className="mr-2 p-1"
                                        onClick={toggleSidebar}
                                        aria-label="Toggle sidebar"
                                    >
                                        <Menu size={24} className="text-slate-700" />
                                    </button>
                                )}
                                <span className="font-semibold text-sm">MERUTE PAY</span>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="outline-none">
                                    <Avatar className="h-7 w-7">
                                        <AvatarImage src="/pictures/admin.png" alt="Admin" />
                                        <AvatarFallback>AD</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium">Admin</p>
                                            <p className="text-xs">admin@merute.dev</p>
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
                    <div className="h-14" />

                    {/* Mobile Bottom Navigation */}
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
                        <div className="flex items-center justify-between h-16 px-6 overflow-x-auto no-scrollbar touch-pan-x">
                            {menuItems.map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.href}
                                    className={`flex items-center justify-center min-w-[48px] h-12 ${
                                        pathname === item.href ? "bg-slate-100" : ""
                                    } hover:bg-slate-200 transition-all group`}
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

            {/* Logout Dialog */}
            <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <AlertDialogContent className="sm:max-w-[425px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-md">Confirmation de déconnexion</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm">
                            Êtes-vous sûr de vouloir vous déconnecter de votre compte ?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex space-x-2 justify-end">
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
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <style jsx global>{`
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </TooltipProvider>
    );
}