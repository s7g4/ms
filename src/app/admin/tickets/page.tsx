import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Server action to add a reply message
async function replyToTicket(formData: FormData) {
  "use server";

  const ticketId = formData.get("ticketId")?.toString();
  const body = formData.get("body")?.toString().trim();
  const adminId = formData.get("adminId")?.toString(); // Admin user id in session

  if (!ticketId || !body || !adminId) return;

  await prisma.$transaction([
    // Create reply
    prisma.ticketMessage.create({
      data: {
        ticketId,
        userId: adminId,
        body,
        isAdmin: true,
      },
    }),
    // Update status to IN_PROGRESS
    prisma.supportTicket.update({
      where: { id: ticketId },
      data: { status: "RESOLVED" }, // Auto resolved or in progress
    }),
  ]);

  revalidatePath("/admin/tickets");
}

// Server action to update ticket status
async function updateTicketStatus(id: string, status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED") {
  "use server";
  await prisma.supportTicket.update({
    where: { id },
    data: { status },
  });
  revalidatePath("/admin/tickets");
}

export default async function AdminTicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ ticketId?: string }>;
}) {
  const params = await searchParams;
  const activeTicketId = params.ticketId;

  // Retrieve all tickets
  const tickets = await prisma.supportTicket.findMany({
    include: {
      user: { select: { name: true, email: true } },
      order: { select: { id: true, total: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Get current admin user id for message attribution (using seeder admin as fallback)
  const systemAdmin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
    select: { id: true },
  });

  // If a ticket is selected, retrieve its thread
  const activeTicket = activeTicketId
    ? await prisma.supportTicket.findUnique({
        where: { id: activeTicketId },
        include: {
          user: { select: { name: true, email: true } },
          messages: {
            include: { user: { select: { name: true, role: true } } },
            orderBy: { createdAt: "asc" },
          },
        },
      })
    : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
      {/* Sidebar List */}
      <div className="lg:col-span-1 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[oklch(0.4_0.1_350)]">Support Center</h1>
          <p className="text-sm text-[oklch(0.45_0.03_350)] mt-1">
            Resolve customer queries and review active tickets.
          </p>
        </div>

        <div className="glass border border-[oklch(0.4_0.1_350_/_0.1)] rounded-2xl overflow-hidden bg-white max-h-[70vh] overflow-y-auto">
          <div className="p-4 border-b border-[oklch(0.4_0.1_350_/_0.08)] bg-[oklch(0.92_0.05_15_/_0.1)] font-semibold text-sm text-[oklch(0.4_0.1_350)]">
            Tickets Queue ({tickets.length})
          </div>
          <div className="divide-y divide-[oklch(0.4_0.1_350_/_0.05)]">
            {tickets.length === 0 ? (
              <div className="p-8 text-center text-sm text-[oklch(0.45_0.03_350)]">
                No support tickets found.
              </div>
            ) : (
              tickets.map((ticket) => {
                const isActive = ticket.id === activeTicketId;
                return (
                  <a
                    href={`/admin/tickets?ticketId=${ticket.id}`}
                    key={ticket.id}
                    className={`block p-4 transition-colors hover:bg-[oklch(0.92_0.05_15_/_0.2)] ${
                      isActive ? "bg-[oklch(0.92_0.05_15_/_0.4)] border-l-4 border-l-[oklch(0.75_0.15_5)] font-medium" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono font-bold text-[oklch(0.75_0.15_5)]">
                        #{ticket.id.slice(-6)}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          ticket.priority === "HIGH"
                            ? "bg-red-100 text-red-700"
                            : ticket.priority === "MEDIUM"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[oklch(0.4_0.1_350)] truncate">{ticket.subject}</p>
                    <p className="text-xs text-[oklch(0.45_0.03_350)] mt-0.5">{ticket.user.name}</p>
                    <div className="flex items-center justify-between mt-3 text-[10px]">
                      <span className="text-[oklch(0.45_0.03_350)]">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                      <span
                        className={`font-semibold rounded-full px-2 py-0.5 ${
                          ticket.status === "OPEN"
                            ? "bg-yellow-100 text-yellow-700"
                            : ticket.status === "RESOLVED"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </div>
                  </a>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Main Conversation Viewer */}
      <div className="lg:col-span-2 space-y-6">
        {activeTicket ? (
          <div className="glass border border-[oklch(0.4_0.1_350_/_0.1)] rounded-2xl overflow-hidden bg-white flex flex-col h-[75vh]">
            {/* Header info */}
            <div className="p-6 border-b border-[oklch(0.4_0.1_350_/_0.08)] bg-[oklch(0.92_0.05_15_/_0.1)] flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-[oklch(0.75_0.15_5)] block mb-1">
                  Ticket ID: #{activeTicket.id}
                </span>
                <h2 className="text-lg font-bold text-[oklch(0.4_0.1_350)]">{activeTicket.subject}</h2>
                <p className="text-xs text-[oklch(0.45_0.03_350)] mt-1">
                  Requesters: {activeTicket.user.name} ({activeTicket.user.email})
                </p>
              </div>

              {/* Status Controls */}
              <div className="flex gap-2">
                {(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const).map((status) => (
                  <form key={status} action={updateTicketStatus.bind(null, activeTicket.id, status)}>
                    <button
                      type="submit"
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition ${
                        activeTicket.status === status
                          ? "bg-[oklch(0.75_0.15_5)] border-[oklch(0.75_0.15_5)] text-white"
                          : "border-[oklch(0.4_0.1_350_/_0.1)] text-[oklch(0.4_0.1_350)] hover:bg-[oklch(0.92_0.05_15_/_0.2)]"
                      }`}
                    >
                      {status}
                    </button>
                  </form>
                ))}
              </div>
            </div>

            {/* Conversation Thread */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/50">
              {activeTicket.messages.map((message) => {
                const fromAdmin = message.isAdmin;
                return (
                  <div
                    key={message.id}
                    className={`flex flex-col max-w-[80%] rounded-2xl p-4 text-sm ${
                      fromAdmin
                        ? "bg-[oklch(0.4_0.1_350)] text-white ml-auto rounded-tr-none"
                        : "bg-[oklch(0.92_0.05_15_/_0.6)] text-[oklch(0.25_0.05_350)] rounded-tl-none border border-[oklch(0.4_0.1_350_/_0.08)]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-1.5 text-[10px] opacity-75 font-semibold">
                      <span>{message.user.name}</span>
                      <span>{new Date(message.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed">{message.body}</p>
                  </div>
                );
              })}
            </div>

            {/* Reply Input Form */}
            <div className="p-4 border-t border-[oklch(0.4_0.1_350_/_0.08)] bg-white">
              <form action={replyToTicket} className="flex gap-4">
                <input type="hidden" name="ticketId" value={activeTicket.id} />
                <input type="hidden" name="adminId" value={systemAdmin?.id || ""} />
                <textarea
                  name="body"
                  placeholder="Type your support reply here..."
                  required
                  rows={2}
                  className="input-field flex-1 resize-none"
                />
                <button type="submit" className="btn-primary px-6 self-end py-3">
                  Reply
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="glass border border-[oklch(0.4_0.1_350_/_0.1)] rounded-2xl p-12 text-center bg-white flex flex-col items-center justify-center h-[75vh]">
            <span className="text-4xl mb-4">💬</span>
            <h2 className="text-xl font-bold text-[oklch(0.4_0.1_350)]">No Ticket Selected</h2>
            <p className="text-sm text-[oklch(0.45_0.03_350)] mt-1">
              Select a ticket from the sidebar queue to read conversation threads and respond.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
