"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { formatDistanceToNow } from "@/lib/date";
import {
  MoreHorizontal,
  Shield,
  User,
  Trash2,
  BadgeCheck,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Flag,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface UserData {
  id: string;
  email: string;
  username: string;
  name: string | null;
  avatar: string | null;
  role: "ADMIN" | "USER";
  verified: boolean;
  flagged: boolean;
  flaggedAt: string | null;
  flaggedReason: string | null;
  dailyGenerationLimit: number;
  generationCreditsRemaining: number;
  createdAt: string;
  _count: {
    prompts: number;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function UsersTable() {
  const router = useRouter();
  const t = useTranslations("admin.users");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [editCreditsUser, setEditCreditsUser] = useState<UserData | null>(null);
  const [newCreditLimit, setNewCreditLimit] = useState("");
  const [loading, setLoading] = useState(false);

  // Pagination and search state
  const [users, setUsers] = useState<UserData[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userFilter, setUserFilter] = useState("all");

  const fetchUsers = useCallback(async (page: number, search: string, filter: string) => {
    setLoadingUsers(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "15",
        ...(search && { search }),
        ...(filter !== "all" && { filter }),
      });
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch users");
      }

      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to fetch users");
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(currentPage, searchQuery, userFilter);
  }, [currentPage, userFilter, fetchUsers]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers(1, searchQuery, userFilter);
  };

  const handleFilterChange = (value: string) => {
    setUserFilter(value);
    setCurrentPage(1);
  };

  const handleRoleChange = async (userId: string, newRole: "ADMIN" | "USER") => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) throw new Error("Failed to update role");

      toast.success(t("roleUpdated"));
      router.refresh();
    } catch {
      toast.error(t("roleUpdateFailed"));
    }
  };

  const handleVerifyToggle = async (userId: string, verified: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified }),
      });

      if (!res.ok) throw new Error("Failed to update verification");

      toast.success(verified ? t("verified") : t("unverified"));
      fetchUsers(currentPage, searchQuery, userFilter);
      router.refresh();
    } catch {
      toast.error(t("verifyFailed"));
    }
  };

  const handleFlagToggle = async (userId: string, flagged: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flagged, flaggedReason: flagged ? "Unusual activity" : null }),
      });

      if (!res.ok) throw new Error("Failed to update flag status");

      toast.success(flagged ? t("flagged") : t("unflagged"));
      fetchUsers(currentPage, searchQuery, userFilter);
      router.refresh();
    } catch {
      toast.error(t("flagFailed"));
    }
  };

  const handleDelete = async () => {
    if (!deleteUserId) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${deleteUserId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete user");

      toast.success(t("deleted"));
      fetchUsers(currentPage, searchQuery, userFilter);
      router.refresh();
    } catch {
      toast.error(t("deleteFailed"));
    } finally {
      setLoading(false);
      setDeleteUserId(null);
    }
  };

  const handleEditCredits = (user: UserData) => {
    setEditCreditsUser(user);
    setNewCreditLimit(user.dailyGenerationLimit.toString());
  };

  const handleSaveCredits = async () => {
    if (!editCreditsUser) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${editCreditsUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dailyGenerationLimit: newCreditLimit }),
      });

      if (!res.ok) throw new Error("Failed to update credits");

      toast.success(t("creditsUpdated"));
      fetchUsers(currentPage, searchQuery, userFilter);
      router.refresh();
    } catch {
      toast.error(t("creditsUpdateFailed"));
    } finally {
      setLoading(false);
      setEditCreditsUser(null);
    }
  };

  return (
    <>
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">{t("title")}</h3>
          <p className="text-muted-foreground text-sm">{t("description")}</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Select value={userFilter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.all")}</SelectItem>
              <SelectItem value="admin">{t("filters.admin")}</SelectItem>
              <SelectItem value="user">{t("filters.user")}</SelectItem>
              <SelectItem value="verified">{t("filters.verified")}</SelectItem>
              <SelectItem value="unverified">{t("filters.unverified")}</SelectItem>
              <SelectItem value="flagged">{t("filters.flagged")}</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <div className="relative flex-1 sm:flex-none">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-9 sm:w-[200px]"
              />
            </div>
            <Button size="icon" variant="outline" onClick={handleSearch} disabled={loadingUsers}>
              {loadingUsers ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {loadingUsers && users.length === 0 ? (
        <div className="flex items-center justify-center rounded-md border py-12">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-muted-foreground rounded-md border py-12 text-center">
          {t("noUsers")}
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="block space-y-3 sm:hidden">
            {users.map((user) => (
              <div key={user.id} className="bg-card space-y-3 rounded-lg border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar || undefined} />
                      <AvatarFallback>
                        {user.name?.charAt(0) || user.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1 truncate font-medium">
                        {user.name || user.username}
                        {user.verified && (
                          <BadgeCheck className="h-4 w-4 flex-shrink-0 text-blue-500" />
                        )}
                        {user.flagged && (
                          <AlertTriangle className="h-4 w-4 flex-shrink-0 text-amber-500" />
                        )}
                      </div>
                      <div className="text-muted-foreground text-xs">@{user.username}</div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {user.role === "USER" ? (
                        <DropdownMenuItem onClick={() => handleRoleChange(user.id, "ADMIN")}>
                          <Shield className="mr-2 h-4 w-4" />
                          {t("makeAdmin")}
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleRoleChange(user.id, "USER")}>
                          <User className="mr-2 h-4 w-4" />
                          {t("removeAdmin")}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleVerifyToggle(user.id, !user.verified)}>
                        <BadgeCheck className="mr-2 h-4 w-4" />
                        {user.verified ? t("unverify") : t("verify")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleFlagToggle(user.id, !user.flagged)}>
                        <Flag className="mr-2 h-4 w-4" />
                        {user.flagged ? t("unflag") : t("flag")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditCredits(user)}>
                        <Sparkles className="mr-2 h-4 w-4" />
                        {t("editCredits")}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeleteUserId(user.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t("delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground truncate">{user.email}</span>
                  <Badge
                    variant={user.role === "ADMIN" ? "default" : "secondary"}
                    className="flex-shrink-0"
                  >
                    {user.role === "ADMIN" ? (
                      <Shield className="mr-1 h-3 w-3" />
                    ) : (
                      <User className="mr-1 h-3 w-3" />
                    )}
                    {user.role}
                  </Badge>
                </div>
                <div className="text-muted-foreground flex items-center justify-between text-xs">
                  <span>
                    {user._count.prompts} {t("prompts").toLowerCase()}
                  </span>
                  <span>{formatDistanceToNow(new Date(user.createdAt), locale)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden rounded-md border sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("user")}</TableHead>
                  <TableHead>{t("email")}</TableHead>
                  <TableHead>{t("role")}</TableHead>
                  <TableHead className="text-center">{t("prompts")}</TableHead>
                  <TableHead>{t("joined")}</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar || undefined} />
                          <AvatarFallback>
                            {user.name?.charAt(0) || user.username.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-1 font-medium">
                            {user.name || user.username}
                            {user.verified && <BadgeCheck className="h-4 w-4 text-blue-500" />}
                            {user.flagged && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                          </div>
                          <div className="text-muted-foreground text-xs">@{user.username}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                        {user.role === "ADMIN" ? (
                          <Shield className="mr-1 h-3 w-3" />
                        ) : (
                          <User className="mr-1 h-3 w-3" />
                        )}
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{user._count.prompts}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDistanceToNow(new Date(user.createdAt), locale)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {user.role === "USER" ? (
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, "ADMIN")}>
                              <Shield className="mr-2 h-4 w-4" />
                              {t("makeAdmin")}
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, "USER")}>
                              <User className="mr-2 h-4 w-4" />
                              {t("removeAdmin")}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleVerifyToggle(user.id, !user.verified)}
                          >
                            <BadgeCheck className="mr-2 h-4 w-4" />
                            {user.verified ? t("unverify") : t("verify")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleFlagToggle(user.id, !user.flagged)}
                          >
                            <Flag className="mr-2 h-4 w-4" />
                            {user.flagged ? t("unflag") : t("flag")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditCredits(user)}>
                            <Sparkles className="mr-2 h-4 w-4" />
                            {t("editCredits")}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteUserId(user.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t("delete")}
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
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-4 flex flex-col items-center justify-between gap-4 border-t pt-4 sm:flex-row">
              <p className="text-muted-foreground text-sm">
                {t("showing", {
                  from: (pagination.page - 1) * pagination.limit + 1,
                  to: Math.min(pagination.page * pagination.limit, pagination.total),
                  total: pagination.total,
                })}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  disabled={currentPage === 1 || loadingUsers}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="px-2 text-sm tabular-nums">
                  {currentPage} / {pagination.totalPages}
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  disabled={currentPage === pagination.totalPages || loadingUsers}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("deleteConfirmDescription")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Credits Dialog */}
      <AlertDialog open={!!editCreditsUser} onOpenChange={() => setEditCreditsUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("editCreditsTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("editCreditsDescription", { username: editCreditsUser?.username || "" })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("dailyLimit")}</label>
              <Input
                type="number"
                min="0"
                value={newCreditLimit}
                onChange={(e) => setNewCreditLimit(e.target.value)}
                placeholder="10"
              />
              <p className="text-muted-foreground text-xs">
                {t("currentCredits", {
                  remaining: editCreditsUser?.generationCreditsRemaining ?? 0,
                  limit: editCreditsUser?.dailyGenerationLimit ?? 0,
                })}
              </p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveCredits} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {t("save")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
