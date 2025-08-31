-- CreateTable
CREATE TABLE "CompanyPriceRange" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "minPrice" INTEGER,
    "maxPrice" INTEGER,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyPriceRange_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyPriceRange_companyId_key" ON "CompanyPriceRange"("companyId");

-- AddForeignKey
ALTER TABLE "CompanyPriceRange" ADD CONSTRAINT "CompanyPriceRange_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
