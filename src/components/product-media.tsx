import Image from "next/image";
import { ProductArt } from "@/components/product-art";
import type { Product } from "@/lib/products";

export function ProductMedia({
  product,
}: {
  product: Product;
}) {
  if (product.image) {
    const contain = product.image_fit === "contain";
    return (
      <div
        className={`flex h-full w-full items-center justify-center ${contain ? "bg-ink p-6" : "bg-paper"}`}
      >
        <Image
          src={product.image}
          alt={product.name}
          width={800}
          height={800}
          className={contain ? "h-full w-full object-contain" : "h-full w-full object-cover"}
        />
      </div>
    );
  }

  return <ProductArt art={product.art} />;
}
