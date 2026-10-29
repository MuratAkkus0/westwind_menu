import { Suspense } from "react";
import { TableScreen } from "@/components/table/table-screen";

// The table number comes from `?number=` because a static export cannot
// prerender a route for every table number the waiter may enter.
export default function TablePage() {
  return (
    <Suspense>
      <TableScreen />
    </Suspense>
  );
}
