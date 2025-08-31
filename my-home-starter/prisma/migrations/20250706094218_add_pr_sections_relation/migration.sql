-- CreateTable
CREATE TABLE "PRSection" (
    "id" TEXT NOT NULL,
    "prefecture" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "companyId" TEXT,
    "companyName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "contactInfo" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PRSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PRSection_prefecture_city_isActive_idx" ON "PRSection"("prefecture", "city", "isActive");

-- CreateIndex
CREATE INDEX "PRSection_displayOrder_idx" ON "PRSection"("displayOrder");

-- AddForeignKey
ALTER TABLE "PRSection" ADD CONSTRAINT "PRSection_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
