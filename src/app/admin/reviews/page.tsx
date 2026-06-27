import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Server action to toggle verification or delete review
async function deleteReview(id: string) {
  "use server";
  await prisma.review.delete({
    where: { id },
  });
  revalidatePath("/admin/reviews");
}

async function toggleVerification(id: string, isVerified: boolean) {
  "use server";
  await prisma.review.update({
    where: { id },
    data: { isVerified },
  });
  revalidatePath("/admin/reviews");
}

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: {
      user: { select: { name: true, email: true } },
      mysteryBox: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[oklch(0.4_0.1_350)]">Reviews Moderation</h1>
        <p className="text-sm text-[oklch(0.45_0.03_350)] mt-1">
          Approve, flag, or delete customer reviews submitted across products.
        </p>
      </div>

      {/* Reviews Table */}
      <div className="glass border border-[oklch(0.4_0.1_350_/_0.1)] rounded-2xl overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[oklch(0.4_0.1_350_/_0.08)] bg-[oklch(0.92_0.05_15_/_0.3)]">
                <th className="p-4 text-xs font-semibold text-[oklch(0.75_0.15_5)] uppercase tracking-wider">User</th>
                <th className="p-4 text-xs font-semibold text-[oklch(0.75_0.15_5)] uppercase tracking-wider">Mystery Box</th>
                <th className="p-4 text-xs font-semibold text-[oklch(0.75_0.15_5)] uppercase tracking-wider">Rating</th>
                <th className="p-4 text-xs font-semibold text-[oklch(0.75_0.15_5)] uppercase tracking-wider">Review Content</th>
                <th className="p-4 text-xs font-semibold text-[oklch(0.75_0.15_5)] uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-semibold text-[oklch(0.75_0.15_5)] uppercase tracking-wider">Verified Purchase</th>
                <th className="p-4 text-xs font-semibold text-[oklch(0.75_0.15_5)] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-sm text-[oklch(0.45_0.03_350)]">
                    No reviews submitted yet.
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr
                    key={review.id}
                    className="border-b border-[oklch(0.4_0.1_350_/_0.04)] hover:bg-[oklch(0.92_0.05_15_/_0.25)] transition-colors"
                  >
                    <td className="p-4">
                      <p className="font-semibold text-[oklch(0.4_0.1_350)] text-sm">{review.user.name}</p>
                      <p className="text-xs text-[oklch(0.45_0.03_350)]">{review.user.email}</p>
                    </td>
                    <td className="p-4 text-sm text-[oklch(0.25_0.05_350)]">
                      {review.mysteryBox?.name || "N/A"}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-0.5 text-yellow-500 font-semibold text-sm">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </div>
                    </td>
                    <td className="p-4 max-w-xs md:max-w-md">
                      {review.title && <p className="font-semibold text-sm text-[oklch(0.4_0.1_350)]">{review.title}</p>}
                      {review.body && <p className="text-xs text-[oklch(0.25_0.05_350)] mt-1 line-clamp-3">{review.body}</p>}
                      
                      {/* Image review files */}
                      {review.images && Array.isArray(review.images) && review.images.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {review.images.map((img: string, idx) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              key={idx}
                              src={img}
                              alt="Review image upload"
                              className="w-10 h-10 object-cover rounded-lg border border-[oklch(0.4_0.1_350_/_0.1)]"
                            />
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-xs text-[oklch(0.25_0.05_350)]">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm">
                      <form action={toggleVerification.bind(null, review.id, !review.isVerified)}>
                        <button
                          type="submit"
                          className={`text-xs px-2.5 py-1 rounded-full font-semibold border transition ${
                            review.isVerified
                              ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                              : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {review.isVerified ? "Verified ✅" : "Unverified ❌"}
                        </button>
                      </form>
                    </td>
                    <td className="p-4 text-sm text-right space-x-2">
                      <form action={deleteReview.bind(null, review.id)} className="inline-block">
                        <button
                          type="submit"
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
                        >
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
