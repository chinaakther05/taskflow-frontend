import { CircleCheckBig,   } from "lucide-react";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="bg-blue-600 p-1.5 rounded-lg">
  <CircleCheckBig className="w-5 h-5 text-white" />
</div>
      <span className="font-bold text-lg">TaskFlow</span>
    </Link>
  );
}