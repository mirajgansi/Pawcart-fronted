import { handleWhoami } from "@/lib/actions/auth-actions";
import { notFound } from "next/navigation";
import CartPage from "./components/CartDrawer";

export default async function Page() {


  return (
    <div className="bg-gray-100">
     <CartPage/>
    </div>
  );
}
