"use server";

import { prisma } from "@/lib/prisma";
import * as xlsx from "xlsx";
import { revalidatePath } from "next/cache";

export async function bulkImportProducts(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Parse Excel workbook
    const workbook = xlsx.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data: any[] = xlsx.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      return { success: false, error: "Excel file is empty" };
    }

    let successCount = 0;
    let errorCount = 0;

    // Process each row
    for (const row of data) {
      try {
        // Find category by name or use a default
        let category = null;
        if (row.Category) {
          category = await prisma.category.findFirst({
            where: { name: { contains: row.Category, mode: "insensitive" } }
          });
        }
        
        // If category not found, skip or create it
        if (!category && row.Category) {
           category = await prisma.category.create({
             data: {
               name: row.Category,
               slug: row.Category.toLowerCase().replace(/\s+/g, '-'),
               description: `Imported category ${row.Category}`
             }
           });
        }

        const basePrice = Number(row.BasePrice || row.Price || 1000);
        const salePrice = row.SalePrice ? Number(row.SalePrice) : null;
        const slug = (row.Slug || row.Name).toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const sku = row.SKU || `IMPORT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        if (!category?.id) {
          throw new Error("Category could not be found or created for row.");
        }

        await prisma.product.upsert({
          where: { slug },
          update: {
            stockQuantity: { increment: Number(row.Stock || 10) }
          },
          create: {
            name: row.Name || "Unnamed Product",
            slug,
            description: row.Description || "No description provided.",
            shortDescription: row.ShortDescription || "No short description.",
            basePrice,
            salePrice,
            sku,
            stockQuantity: Number(row.Stock || 10),
            categoryId: category.id,
            fabric: row.Fabric || "Mixed",
            isActive: true,
            isFeatured: row.IsFeatured === 'Yes' || row.IsFeatured === true,
            images: {
              create: [
                { url: row.ImageURL || "https://images.unsplash.com/photo-1610189013580-0810db303106?q=80&w=800", publicId: `import_${sku}`, isPrimary: true }
              ]
            }
          }
        });
        successCount++;
      } catch (err) {
        console.error("Row import error:", err);
        errorCount++;
      }
    }

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");
    
    return { 
      success: true, 
      message: `Successfully imported ${successCount} products. ${errorCount > 0 ? `Failed to import ${errorCount} products.` : ''}` 
    };
  } catch (error: any) {
    console.error("Bulk import error:", error);
    return { success: false, error: "Failed to parse Excel file. Ensure it is a valid .xlsx or .csv format." };
  }
}
