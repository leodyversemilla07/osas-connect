import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { type BreadcrumbItem, type User } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { DataTable } from '@/components/staff-management/data-table';
import { columns } from '@/components/staff-management/columns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Mail, UserPlus, Users, XCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import InviteStaffDialog from '@/components/staff-management/invite-staff-dialog';
import ErrorBoundary from '@/components/error-boundary';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Invitation {
  id: number;
  email: string;
  role: string;
  status: 'pending' | 'accepted' | 'revoked';
  created_at: string;
  expires_at: string;
  inviter: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

interface Props {
  staff?: {
    data: User[];
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
  invitations?: {
    data: Invitation[];
    links: { label: string; url: string | null; active?: boolean }[];
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
  },
  {
    title: 'Staff Management',
    href: '/admin/staff',
  },
];

export default function Staff({ staff = { data: [], current_page: 1, from: 0, last_page: 1, per_page: 10, to: 0, total: 0 }, invitations = { data: [], links: [] } }: Props) {
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [resendDialogOpen, setResendDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [selectedInvitationId, setSelectedInvitationId] = useState<number | null>(null);

  const handleRevoke = (id: number) => {
    setSelectedInvitationId(id);
    setRevokeDialogOpen(true);
  };

  const handleResend = (id: number) => {
    setSelectedInvitationId(id);
    setResendDialogOpen(true);
  };

  const confirmRevoke = () => {
    if (selectedInvitationId) {
      router.delete(route('admin.invitations.revoke', { invitation: selectedInvitationId }));
      setRevokeDialogOpen(false);
    }
  };

  const confirmResend = () => {
    if (selectedInvitationId) {
      router.post(route('admin.invitations.resend', { invitation: selectedInvitationId }));
      setResendDialogOpen(false);
    }
  };

  const isExpired = (date: string) => new Date(date) < new Date();

  const formatDate = (date: string) => {
    return format(new Date(date), 'MMM d, yyyy h:mm a');
  };

  console.log('Staff:', staff);
  console.log('Invitations:', invitations);

  return (
    <ErrorBoundary>
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head>
          <title>Staff Management - OSAS Connect</title>
          <meta name="description" content="Manage OSAS Connect staff members and invitations" />
        </Head>

        <div className="flex h-full flex-1 flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Staff Management</h2>
              <p className="text-muted-foreground">Manage OSAS staff members, permissions, and invitations</p>
            </div>
            <Button onClick={() => setInviteDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Staff
            </Button>
          </div>

          <Tabs defaultValue="staff" className="w-full">
            <TabsList>
              <TabsTrigger value="staff" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Staff Members
              </TabsTrigger>
              <TabsTrigger value="invitations" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Invitations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="staff" className="mt-4">
              <Card>
                <CardHeader className="space-y-2.5 px-8 py-7 border-b border-border">
                  <div className="space-y-2">
                    <CardTitle>Staff Members</CardTitle>
                    <CardDescription>View and manage current OSAS staff members</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative overflow-x-auto p-6">
                    <DataTable columns={columns} data={staff.data} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invitations" className="mt-4">
              <Card>
                <CardHeader className="space-y-2.5 px-8 py-7 border-b border-border">
                  <div className="space-y-2">
                    <CardTitle>Staff Invitations</CardTitle>
                    <CardDescription>Manage and track invitations sent to new staff members</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {invitations.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                      <UserPlus className="h-14 w-14 text-muted-foreground/40 mb-6" />
                      <h3 className="text-lg font-semibold text-card-foreground mb-2">No invitations yet</h3>
                      <p className="text-sm text-muted-foreground mb-6">Start by inviting new staff members to join your team.</p>
                      <Button
                        onClick={() => setInviteDialogOpen(true)}
                        className="gap-2"
                      >
                        <UserPlus className="h-4 w-4" />
                        Invite Staff
                      </Button>
                    </div>
                  ) : (
                    <div className="relative overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="w-[30%] py-4 px-6">Email</TableHead>
                            <TableHead className="w-[15%] py-4 px-6">Status</TableHead>
                            <TableHead className="w-[20%] py-4 px-6">Invited By</TableHead>
                            <TableHead className="w-[15%] py-4 px-6">Sent</TableHead>
                            <TableHead className="w-[15%] py-4 px-6">Expires</TableHead>
                            <TableHead className="w-[10%] py-4 px-6">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {invitations.data.map((invitation) => {
                            const expired = isExpired(invitation.expires_at);

                            return (
                              <TableRow key={invitation.id} className="hover:bg-muted/50">
                                <TableCell className="py-4 px-6">
                                  <div className="flex flex-col gap-1">
                                    <span className="font-medium">{invitation.email}</span>
                                    <span className="text-sm text-muted-foreground">
                                      {invitation.role.replace('osas_', 'OSAS ').replace('_', ' ')}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="py-4 px-6">
                                  <Badge
                                    variant={invitation.status === 'accepted' ? 'default'
                                      : invitation.status === 'revoked' ? 'destructive'
                                        : expired ? 'secondary' : 'outline'}
                                    className="capitalize"
                                  >
                                    {expired && invitation.status === 'pending' ? 'Expired' : invitation.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="py-4 px-6">
                                  <span className="inline-flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                                      {invitation.inviter.first_name[0]}{invitation.inviter.last_name[0]}
                                    </span>
                                    <span className="text-sm">
                                      {invitation.inviter.first_name} {invitation.inviter.last_name}
                                    </span>
                                  </span>
                                </TableCell>
                                <TableCell className="py-4 px-6">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">
                                      {formatDate(invitation.created_at)}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="py-4 px-6">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">
                                      {formatDate(invitation.expires_at)}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="py-4 px-6">
                                  <TooltipProvider>
                                    <div className="flex items-center gap-1">
                                      {invitation.status === 'pending' && !expired && (
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => handleResend(invitation.id)}
                                              className="h-8 w-8 p-0"
                                            >
                                              <RefreshCw className="h-4 w-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Resend Invitation</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      )}
                                      {invitation.status === 'pending' && (
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => handleRevoke(invitation.id)}
                                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                            >
                                              <XCircle className="h-4 w-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Revoke Invitation</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      )}
                                    </div>
                                  </TooltipProvider>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                          {invitations.data.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={6} className="h-24 text-center">
                                No invitations found.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {/* Pagination */}
                  {invitations?.links?.length > 3 && (
                    <div className="py-6 px-8 border-t border-border">
                      <nav className="flex items-center justify-center gap-2">
                        {invitations?.links?.map((link, i) =>
                          link.url ? (
                            <Link
                              key={i}
                              href={link.url}
                              className={cn(
                                "px-4 py-2 text-sm font-medium rounded-md border transition-colors",
                                link.active
                                  ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                                  : "border-border text-muted-foreground hover:bg-muted"
                              )}
                              dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                          ) : null
                        )}
                      </nav>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Revoke Invitation Dialog */}
        <Dialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Revoke Invitation</DialogTitle>
              <DialogDescription>
                This will permanently revoke the invitation and the recipient will no longer be able to accept it. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setRevokeDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={confirmRevoke}>Revoke Invitation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Resend Invitation Dialog */}
        <Dialog open={resendDialogOpen} onOpenChange={setResendDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Resend Invitation</DialogTitle>
              <DialogDescription>
                This will send a new invitation email to the recipient with a fresh expiration date. The previous invitation link will remain valid until its original expiration date.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setResendDialogOpen(false)}>Cancel</Button>
              <Button onClick={confirmResend}>Resend Invitation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Invite Staff Dialog */}
        <InviteStaffDialog
          open={inviteDialogOpen}
          onOpenChange={setInviteDialogOpen}
        />
      </AppLayout>
    </ErrorBoundary>
  );
}
