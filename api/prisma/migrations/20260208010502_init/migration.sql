-- CreateTable
CREATE TABLE "public"."Product" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RawMaterial" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stockQuantity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RawMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BillOfMaterials" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "rawMaterialId" INTEGER NOT NULL,
    "requiredQuantity" INTEGER NOT NULL,

    CONSTRAINT "BillOfMaterials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_code_key" ON "public"."Product"("code");

-- CreateIndex
CREATE UNIQUE INDEX "RawMaterial_code_key" ON "public"."RawMaterial"("code");

-- CreateIndex
CREATE UNIQUE INDEX "BillOfMaterials_productId_rawMaterialId_key" ON "public"."BillOfMaterials"("productId", "rawMaterialId");

-- AddForeignKey
ALTER TABLE "public"."BillOfMaterials" ADD CONSTRAINT "BillOfMaterials_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BillOfMaterials" ADD CONSTRAINT "BillOfMaterials_rawMaterialId_fkey" FOREIGN KEY ("rawMaterialId") REFERENCES "public"."RawMaterial"("id") ON DELETE CASCADE ON UPDATE CASCADE;
